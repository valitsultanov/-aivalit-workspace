#!/usr/bin/env python3
import argparse
import hashlib
import json
import os
import sys
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen
from urllib.error import HTTPError

BASE_DEFAULT = "disk:/AiValit_Knowledge_Base"
STATE_DEFAULT = Path("/Users/aivalit/.openclaw/workspace/.openclaw/yadisk-uploaded.json")

EXT_MAP = {
    ".mp4": "05_Video", ".mov": "05_Video", ".mkv": "05_Video", ".avi": "05_Video", ".webm": "05_Video", ".ogg": "05_Video", ".mp3": "05_Video", ".wav": "05_Video",
    ".ppt": "06_Presentations", ".pptx": "06_Presentations", ".key": "06_Presentations",
    ".pdf": "07_PDF",
    ".md": "09_Telegram_Assets", ".txt": "09_Telegram_Assets", ".doc": "09_Telegram_Assets", ".docx": "09_Telegram_Assets",
}

KEYWORD_MAP = [
    ("onboarding", "01_Onboarding"),
    ("product", "02_Products"),
    ("products", "02_Products"),
    ("case", "03_Cases"),
    ("cases", "03_Cases"),
    ("guide", "04_Guides"),
    ("video", "05_Video"),
    ("present", "06_Presentations"),
    ("pdf", "07_PDF"),
    ("faq", "08_FAQ"),
    ("telegram", "09_Telegram_Assets"),
]


def api_call(token, method, url, data=None, headers=None):
    req = Request(url, method=method)
    req.add_header("Authorization", f"OAuth {token}")
    if headers:
        for k, v in headers.items():
            req.add_header(k, v)
    payload = None
    if data is not None:
        if isinstance(data, (bytes, bytearray)):
            payload = data
        else:
            payload = json.dumps(data).encode("utf-8")
            req.add_header("Content-Type", "application/json")
    try:
        with urlopen(req, payload) as r:
            body = r.read().decode("utf-8") if r.readable() else ""
            return r.status, body
    except HTTPError as e:
        body = e.read().decode("utf-8", "ignore")
        return e.code, body


def ensure_folder(token, disk_path):
    url = "https://cloud-api.yandex.net/v1/disk/resources?path=" + quote(disk_path, safe=":/")
    status, body = api_call(token, "PUT", url)
    return status in (201, 409)


def exists(token, disk_path):
    url = "https://cloud-api.yandex.net/v1/disk/resources?path=" + quote(disk_path, safe=":/")
    status, body = api_call(token, "GET", url)
    return status == 200


def upload_file(token, local_path: Path, disk_path: str):
    get_url = "https://cloud-api.yandex.net/v1/disk/resources/upload?path=" + quote(disk_path, safe=":/") + "&overwrite=false"
    status, body = api_call(token, "GET", get_url)
    if status != 200:
        raise RuntimeError(f"upload URL error {status}: {body[:200]}")
    href = json.loads(body)["href"]
    data = local_path.read_bytes()
    req = Request(href, method="PUT", data=data)
    try:
        with urlopen(req) as r:
            if r.status not in (201, 202):
                raise RuntimeError(f"upload failed: {r.status}")
    except HTTPError as e:
        raise RuntimeError(f"upload failed {e.code}: {e.read().decode('utf-8', 'ignore')[:200]}")


def choose_folder(name: str, ext: str):
    n = name.lower()
    for k, folder in KEYWORD_MAP:
        if k in n:
            return folder
    return EXT_MAP.get(ext.lower(), "09_Telegram_Assets")


def unique_disk_path(token, parent: str, file_name: str):
    stem = Path(file_name).stem
    suffix = Path(file_name).suffix
    candidate = f"{parent}/{file_name}"
    i = 2
    while exists(token, candidate):
        candidate = f"{parent}/{stem}_v{i}{suffix}"
        i += 1
    return candidate


def sha1(path: Path):
    h = hashlib.sha1()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def load_state(path: Path):
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text())
    except Exception:
        return {}


def save_state(path: Path, state):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(state, ensure_ascii=False, indent=2))


def cmd_upload(args):
    token = os.getenv("YADISK_TOKEN")
    if not token:
        print("ERR: YADISK_TOKEN is not set", file=sys.stderr)
        return 2
    local = Path(args.file)
    if not local.exists():
        print(f"ERR: file not found: {local}", file=sys.stderr)
        return 2

    base = args.base
    folder = args.folder or choose_folder(local.name, local.suffix)
    parent = f"{base}/{folder}"
    ensure_folder(token, base)
    ensure_folder(token, parent)
    disk_path = unique_disk_path(token, parent, local.name)
    upload_file(token, local, disk_path)
    print(f"UPLOADED {local} -> {disk_path}")
    return 0


def cmd_scan(args):
    token = os.getenv("YADISK_TOKEN")
    if not token:
        print("ERR: YADISK_TOKEN is not set", file=sys.stderr)
        return 2
    inbound = Path(args.inbound)
    if not inbound.exists():
        print(f"ERR: inbound not found: {inbound}", file=sys.stderr)
        return 2

    state_path = Path(args.state)
    state = load_state(state_path)
    uploaded = 0

    files = [p for p in inbound.iterdir() if p.is_file()]
    files.sort(key=lambda p: p.stat().st_mtime)
    for p in files:
        key = f"{p.name}:{p.stat().st_size}:{int(p.stat().st_mtime)}"
        digest = sha1(p)
        if state.get(key) == digest:
            continue
        folder = choose_folder(p.name, p.suffix)
        parent = f"{args.base}/{folder}"
        ensure_folder(token, args.base)
        ensure_folder(token, parent)
        disk_path = unique_disk_path(token, parent, p.name)
        upload_file(token, p, disk_path)
        state[key] = digest
        uploaded += 1
        print(f"UPLOADED {p.name} -> {disk_path}")

    save_state(state_path, state)
    print(f"DONE uploaded={uploaded}")
    return 0


def main():
    ap = argparse.ArgumentParser(description="Upload Telegram files to Yandex Disk")
    sub = ap.add_subparsers(dest="cmd", required=True)

    up = sub.add_parser("upload", help="Upload single file")
    up.add_argument("file")
    up.add_argument("--base", default=BASE_DEFAULT)
    up.add_argument("--folder", help="Target folder under base")
    up.set_defaults(func=cmd_upload)

    sc = sub.add_parser("scan", help="Scan inbound folder and upload new files")
    sc.add_argument("--inbound", default="/Users/aivalit/.openclaw/media/inbound")
    sc.add_argument("--base", default=BASE_DEFAULT)
    sc.add_argument("--state", default=str(STATE_DEFAULT))
    sc.set_defaults(func=cmd_scan)

    args = ap.parse_args()
    raise SystemExit(args.func(args))


if __name__ == "__main__":
    main()
