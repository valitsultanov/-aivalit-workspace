"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useJourney } from "@/hooks/useStore";
import { PaywallGate } from "@/components/PaywallGate";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Copy, Check, MessageCircle, ThumbsUp, Mail, Flame } from "lucide-react";

const PLATFORMS = ["Telegram", "LinkedIn", "Instagram", "ВКонтакте", "Facebook", "Twitter/X"];

const DEMAND_THRESHOLD = 10;

function reactionTotal(post: { likes: number; comments: number; dms: number }) {
  return post.likes + post.comments + post.dms;
}

function DemandStatus({ total }: { total: number }) {
  if (total === 0) return (
    <div className="rounded-xl border border-border bg-card p-4 text-center space-y-1">
      <p className="text-sm text-muted-foreground">Опубликуй пост и возвращайся отметить реакции</p>
    </div>
  );
  if (total < 5) return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-1">
      <p className="text-sm font-medium">Тест начат</p>
      <p className="text-xs text-muted-foreground">Нужно ещё {DEMAND_THRESHOLD - total} реакций для подтверждения спроса</p>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-2">
        <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${(total / DEMAND_THRESHOLD) * 100}%` }} />
      </div>
    </div>
  );
  if (total < DEMAND_THRESHOLD) return (
    <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4 space-y-1">
      <p className="text-sm font-medium text-orange-300">Тепло! {total} реакций</p>
      <p className="text-xs text-muted-foreground">Ещё {DEMAND_THRESHOLD - total} — и спрос подтверждён</p>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-2">
        <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${(total / DEMAND_THRESHOLD) * 100}%` }} />
      </div>
    </div>
  );
  return (
    <div className="rounded-xl border border-orange-500/40 bg-orange-500/10 p-5 text-center space-y-2">
      <Flame className="h-8 w-8 text-orange-500 mx-auto" />
      <p className="text-lg font-bold text-orange-400">Спрос подтверждён!</p>
      <p className="text-sm text-muted-foreground">{total} реакций. Люди хотят это. Пора продавать.</p>
    </div>
  );
}

export default function DemandPage() {
  return <PaywallGate feature="Тест спроса"><DemandPageInner /></PaywallGate>;
}

function DemandPageInner() {
  const router = useRouter();
  const { journey, patch } = useJourney();
  const [copied, setCopied] = useState(false);
  const [editingPost, setEditingPost] = useState(false);
  const [postText, setPostText] = useState("");

  if (!journey.chosenIdea) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <p className="text-muted-foreground">Сначала выбери продукт.</p>
        <Button onClick={() => router.push("/idea")}>Найти идею</Button>
      </div>
    );
  }

  const post = journey.demandPost;
  const content = postText || post?.content || "";
  const total = post ? reactionTotal(post) : 0;
  const demandConfirmed = total >= DEMAND_THRESHOLD;

  function copyPost() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function markPosted(platform: string) {
    if (!post) return;
    patch({
      demandPost: { ...post, platform, postedAt: new Date().toISOString() },
      stage: "demand",
    });
  }

  function addReaction(field: "likes" | "comments" | "dms", delta: number) {
    if (!post) return;
    const updated = { ...post, [field]: Math.max(0, post[field] + delta) };
    const newTotal = reactionTotal(updated);
    patch({
      demandPost: updated,
      stage: newTotal >= DEMAND_THRESHOLD ? "sale" : "demand",
    });
  }

  function goToSale() {
    router.push("/sale");
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0 max-w-lg">
      <div>
        <p className="text-sm text-muted-foreground mb-1">Проверяем спрос</p>
        <h1 className="text-2xl font-bold">Тест спроса</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Опубликуй пост → отметь реакции → узнай, хотят ли люди купить
        </p>
      </div>

      {/* How it works */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Как это работает</p>
        <div className="space-y-1.5 text-sm text-muted-foreground">
          <p>1. Скопируй пост ниже</p>
          <p>2. Опубликуй в любой соцсети</p>
          <p>3. Вернись и отметь реакции</p>
          <p>4. <span className="text-orange-400">10+ реакций</span> = спрос подтверждён → первая продажа</p>
        </div>
      </div>

      {/* Generated post */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Готовый пост</p>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => { setPostText(content); setEditingPost(!editingPost); }}>
              {editingPost ? "Готово" : "Редактировать"}
            </Button>
            <Button size="sm" variant="outline" onClick={copyPost} className="gap-1">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Скопировано" : "Скопировать"}
            </Button>
          </div>
        </div>

        {editingPost ? (
          <textarea
            className="w-full bg-input border border-border rounded-lg p-3 text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            rows={10}
            value={postText}
            onChange={e => setPostText(e.target.value)}
          />
        ) : (
          <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed bg-muted/30 rounded-lg p-3">
            {content}
          </pre>
        )}
      </div>

      {/* Choose platform */}
      {!post?.postedAt && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <p className="text-sm font-semibold">Где публикуешь?</p>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map(p => (
              <button
                key={p}
                onClick={() => markPosted(p)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs border transition-colors",
                  post?.platform === p
                    ? "border-orange-500 bg-orange-500/10 text-orange-400"
                    : "border-border text-muted-foreground hover:border-muted-foreground"
                )}
              >
                {p}
              </button>
            ))}
          </div>
          {post?.platform && !post?.postedAt && (
            <p className="text-xs text-muted-foreground">Нажми на платформу, чтобы отметить как опубликовано</p>
          )}
        </div>
      )}

      {/* Posted confirmation */}
      {post?.postedAt && (
        <div className="rounded-lg border border-border px-4 py-2 flex items-center gap-2 text-sm">
          <Check className="h-4 w-4 text-orange-500" />
          <span className="text-muted-foreground">Опубликовано в <strong className="text-foreground">{post.platform}</strong> · {new Date(post.postedAt).toLocaleDateString("ru")}</span>
        </div>
      )}

      {/* Reaction tracker */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <p className="text-sm font-semibold">Отмечай реакции</p>
        <div className="grid grid-cols-3 gap-3">
          <ReactionCounter icon={<ThumbsUp className="h-4 w-4" />} label="Лайки" value={post?.likes ?? 0} onAdd={() => addReaction("likes", 1)} onRemove={() => addReaction("likes", -1)} />
          <ReactionCounter icon={<MessageCircle className="h-4 w-4" />} label="Комментарии" value={post?.comments ?? 0} onAdd={() => addReaction("comments", 1)} onRemove={() => addReaction("comments", -1)} />
          <ReactionCounter icon={<Mail className="h-4 w-4" />} label="Личные сообщения" value={post?.dms ?? 0} onAdd={() => addReaction("dms", 1)} onRemove={() => addReaction("dms", -1)} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Всего реакций</span>
          <span className={cn("font-bold text-xl hero-number", total >= DEMAND_THRESHOLD ? "text-orange-500" : "text-foreground")}>
            {total}
          </span>
        </div>
      </div>

      {/* Status */}
      <DemandStatus total={total} />

      {/* CTA to sale */}
      {demandConfirmed && (
        <Button className="w-full" size="lg" onClick={goToSale}>
          Получить первую оплату <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      )}
    </div>
  );
}

function ReactionCounter({ icon, label, value, onAdd, onRemove }: {
  icon: React.ReactNode; label: string; value: number;
  onAdd: () => void; onRemove: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border bg-muted/20">
      <div className="text-muted-foreground">{icon}</div>
      <span className="hero-number text-2xl font-bold">{value}</span>
      <p className="text-xs text-muted-foreground text-center leading-tight">{label}</p>
      <div className="flex gap-1">
        <button onClick={onRemove} className="h-6 w-6 rounded border border-border text-muted-foreground hover:bg-muted text-xs font-bold">−</button>
        <button onClick={onAdd} className="h-6 w-6 rounded bg-orange-500 text-white hover:bg-orange-600 text-xs font-bold">+</button>
      </div>
    </div>
  );
}
