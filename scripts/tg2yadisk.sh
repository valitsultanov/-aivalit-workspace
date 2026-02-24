#!/usr/bin/env bash
set -euo pipefail

WORKDIR="/Users/aivalit/.openclaw/workspace"
INBOUND="/Users/aivalit/.openclaw/media/inbound"
BASE="disk:/AiValit_Knowledge_Base"
STATE="$WORKDIR/.openclaw/yadisk-uploaded.txt"

cd "$WORKDIR"
[ -f .env ] && source .env
if [[ -z "${YADISK_TOKEN:-}" ]]; then
  echo "ERR: YADISK_TOKEN missing in $WORKDIR/.env" >&2
  exit 1
fi
mkdir -p "$(dirname "$STATE")"
touch "$STATE"

choose_folder() {
  local name="$1"
  local ext="${name##*.}"
  local low="$(echo "$name" | tr '[:upper:]' '[:lower:]')"
  if [[ "$low" == *onboarding* ]]; then echo "01_Onboarding"; return; fi
  if [[ "$low" == *product* ]]; then echo "02_Products"; return; fi
  if [[ "$low" == *case* ]]; then echo "03_Cases"; return; fi
  if [[ "$low" == *guide* ]]; then echo "04_Guides"; return; fi
  if [[ "$low" == *faq* ]]; then echo "08_FAQ"; return; fi
  if [[ "$low" == *telegram* ]]; then echo "09_Telegram_Assets"; return; fi
  case "$ext" in
    mp4|mov|mkv|avi|webm|ogg|mp3|wav) echo "05_Video" ;;
    ppt|pptx|key) echo "06_Presentations" ;;
    pdf) echo "07_PDF" ;;
    md|txt|doc|docx) echo "09_Telegram_Assets" ;;
    *) echo "09_Telegram_Assets" ;;
  esac
}

normalize_name() {
  local original="$1"
  local folder="$2"
  local ext=""
  [[ "$original" == *.* ]] && ext=".${original##*.}"
  local stem="${original%.*}"
  local low="$(echo "$original" | tr '[:upper:]' '[:lower:]')"
  local date="$(date +%F)"

  # If filename already meaningful, keep it.
  if [[ ! "$stem" =~ ^file_[0-9]+---[a-f0-9-]+$ ]]; then
    echo "$original"
    return
  fi

  case "$folder" in
    01_Onboarding) echo "Onboarding_Inbound__Doc__${date}__v1${ext}" ;;
    02_Products) echo "Products_Inbound__Doc__${date}__v1${ext}" ;;
    03_Cases) echo "Cases_Inbound__Doc__${date}__v1${ext}" ;;
    04_Guides) echo "Guides_Inbound__Doc__${date}__v1${ext}" ;;
    05_Video) echo "Media_Inbound__Video__${date}__v1${ext}" ;;
    06_Presentations) echo "Presentations_Inbound__Doc__${date}__v1${ext}" ;;
    07_PDF) echo "PDF_Inbound__Doc__${date}__v1${ext}" ;;
    08_FAQ) echo "FAQ_Inbound__Doc__${date}__v1${ext}" ;;
    09_Telegram_Assets)
      if [[ "$low" == *.jpg || "$low" == *.jpeg || "$low" == *.png || "$low" == *.webp ]]; then
        echo "Cover_Inbound__Image__${date}__v1${ext}"
      else
        echo "Telegram_Asset__Doc__${date}__v1${ext}"
      fi
      ;;
    *) echo "$original" ;;
  esac
}

ensure_folder() {
  local path="$1"
  curl -s -X PUT -H "Authorization: OAuth $YADISK_TOKEN" \
    "https://cloud-api.yandex.net/v1/disk/resources?path=$(python3 - <<PY
import urllib.parse
print(urllib.parse.quote('$path', safe=':/'))
PY
)" >/dev/null
}

exists_remote() {
  local path="$1"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: OAuth $YADISK_TOKEN" \
    "https://cloud-api.yandex.net/v1/disk/resources?path=$(python3 - <<PY
import urllib.parse
print(urllib.parse.quote('$path', safe=':/'))
PY
)")
  [[ "$code" == "200" ]]
}

upload_one() {
  local file="$1"
  local name="$(basename "$file")"
  local folder
  folder="$(choose_folder "$name")"
  local normalized
  normalized="$(normalize_name "$name" "$folder")"
  local parent="$BASE/$folder"
  ensure_folder "$BASE"
  ensure_folder "$parent"

  local stem="${normalized%.*}"
  local ext=""
  [[ "$normalized" == *.* ]] && ext=".${normalized##*.}"
  local candidate="$parent/$normalized"
  local i=2
  while exists_remote "$candidate"; do
    candidate="$parent/${stem}_v${i}${ext}"
    i=$((i+1))
  done

  local upload_json href
  upload_json=$(curl -s -H "Authorization: OAuth $YADISK_TOKEN" \
    "https://cloud-api.yandex.net/v1/disk/resources/upload?path=$(python3 - <<PY
import urllib.parse
print(urllib.parse.quote('$candidate', safe=':/'))
PY
)&overwrite=false")
  href=$(python3 - <<PY
import json
j=json.loads('''$upload_json''')
print(j.get('href',''))
PY
)
  if [[ -z "$href" ]]; then
    echo "ERR: failed get upload URL for $name"
    return 1
  fi

  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -T "$file" "$href")
  if [[ "$code" != "201" && "$code" != "202" ]]; then
    echo "ERR: upload failed $name (HTTP $code)"
    return 1
  fi

  echo "$name|$candidate"
}

uploaded=0
while IFS= read -r -d '' file; do
  sig="$(basename "$file")|$(stat -f %z "$file")|$(stat -f %m "$file")"
  if grep -Fqx "$sig" "$STATE"; then
    continue
  fi
  if out=$(upload_one "$file"); then
    echo "$sig" >> "$STATE"
    uploaded=$((uploaded+1))
    echo "UPLOADED $out"
  fi
done < <(find "$INBOUND" -maxdepth 1 -type f -print0)

echo "DONE uploaded=$uploaded"