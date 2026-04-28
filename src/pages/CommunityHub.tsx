import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Post = {
  id: string;
  title: string;
  content: string;
  category: string | null;
  author_name: string;
  likes_count: number | null;
  comments_count: number | null;
  created_at: string;
};

type Comment = {
  id: string;
  post_id: string | null;
  author_name: string;
  content: string;
  created_at: string;
};

const categories = [
  { id: "সব", emoji: "📋" },
  { id: "সাধারণ", emoji: "💬" },
  { id: "খবর", emoji: "📰" },
  { id: "সমস্যা", emoji: "⚠️" },
  { id: "সাহায্য", emoji: "🙏" },
  { id: "বিজ্ঞপ্তি", emoji: "📢" },
  { id: "আলোচনা", emoji: "🗨️" },
];

const catColor: Record<string, string> = {
  সাধারণ: "bg-gray-100 text-gray-700",
  খবর: "bg-blue-100 text-blue-800",
  সমস্যা: "bg-red-100 text-red-800",
  সাহায্য: "bg-green-100 text-green-800",
  বিজ্ঞপ্তি: "bg-yellow-100 text-yellow-800",
  আলোচনা: "bg-purple-100 text-purple-800",
};

const LIKED_KEY = "kgc_liked_posts";
const getLiked = () => {
  try { return new Set<string>(JSON.parse(localStorage.getItem(LIKED_KEY) || "[]")); }
  catch { return new Set<string>(); }
};
const saveLiked = (s: Set<string>) => localStorage.setItem(LIKED_KEY, JSON.stringify([...s]));

const formatDate = (s: string) => {
  const d = new Date(s);
  return d.toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" });
};

const CommunityHub = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [active, setActive] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState("সব");
  const [showNew, setShowNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLikedState] = useState<Set<string>>(getLiked());
  const [form, setForm] = useState({ title: "", content: "", category: "সাধারণ", author_name: "" });
  const [comment, setComment] = useState({ name: "", text: "" });

  const loadPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("community_posts")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false });
    setPosts((data ?? []) as Post[]);
    setLoading(false);
  };

  useEffect(() => { loadPosts(); }, []);

  const filtered = useMemo(() =>
    catFilter === "সব" ? posts : posts.filter((p) => p.category === catFilter),
    [posts, catFilter]
  );

  const openPost = async (p: Post) => {
    setActive(p);
    const { data } = await supabase
      .from("community_comments")
      .select("*")
      .eq("post_id", p.id)
      .order("created_at", { ascending: true });
    setComments((data ?? []) as Comment[]);
  };

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("community_posts").insert({
      title: form.title,
      content: form.content,
      category: form.category,
      author_name: form.author_name,
    });
    setSubmitting(false);
    if (error) { toast.error("পোস্ট করা যায়নি"); return; }
    toast.success("✅ আপনার পোস্ট প্রকাশিত হয়েছে!");
    setForm({ title: "", content: "", category: "সাধারণ", author_name: "" });
    setShowNew(false);
    loadPosts();
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!active) return;
    const { error } = await supabase.from("community_comments").insert({
      post_id: active.id,
      author_name: comment.name,
      content: comment.text,
    });
    if (error) { toast.error("কমেন্ট পাঠানো যায়নি"); return; }
    await supabase
      .from("community_posts")
      .update({ comments_count: (active.comments_count ?? 0) + 1 })
      .eq("id", active.id);
    toast.success("কমেন্ট যুক্ত হয়েছে");
    setComment({ name: "", text: "" });
    openPost(active);
    setPosts((prev) => prev.map((p) => p.id === active.id ? { ...p, comments_count: (p.comments_count ?? 0) + 1 } : p));
  };

  const toggleLike = async (post: Post) => {
    if (liked.has(post.id)) {
      toast("আপনি ইতিমধ্যেই লাইক দিয়েছেন");
      return;
    }
    const newCount = (post.likes_count ?? 0) + 1;
    const next = new Set(liked); next.add(post.id);
    setLikedState(next); saveLiked(next);
    setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, likes_count: newCount } : p));
    if (active?.id === post.id) setActive({ ...post, likes_count: newCount });
    await supabase.from("community_posts").update({ likes_count: newCount }).eq("id", post.id);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-5 px-4 lg:px-10">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4">
          <button onClick={() => navigate("/")} className="text-primary-foreground/80 text-sm font-medium hover:text-primary-foreground">← হোম</button>
          <h1 className="font-bangla text-lg lg:text-2xl text-primary-foreground">💬 কমিউনিটি হাব</h1>
          <button onClick={() => setShowNew(true)} className="bg-secondary text-primary font-bold px-3 py-2 rounded-lg text-sm">
            + নতুন পোস্ট
          </button>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 lg:px-10 py-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-4">
          {categories.map((c) => (
            <button key={c.id} onClick={() => setCatFilter(c.id)}
              className={`whitespace-nowrap text-xs font-semibold px-3.5 py-2 rounded-full border transition-all ${
                catFilter === c.id ? "bg-primary text-primary-foreground border-transparent"
                  : "bg-card text-primary border-border hover:border-primary/30"
              }`}>
              {c.emoji} {c.id}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">লোড হচ্ছে...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-sm text-muted-foreground">এই ক্যাটাগরিতে এখনো কোনো পোস্ট নেই।</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((p) => (
              <div key={p.id} className="bg-card rounded-2xl p-4 border border-border">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catColor[p.category ?? "সাধারণ"] ?? "bg-gray-100"}`}>
                    {p.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{formatDate(p.created_at)}</span>
                </div>
                <button onClick={() => openPost(p)} className="text-left w-full">
                  <h3 className="font-bold text-primary text-base mb-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{p.content}</p>
                </button>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span className="text-[11px] text-muted-foreground">— {p.author_name}</span>
                  <div className="flex gap-3 text-xs">
                    <button onClick={() => toggleLike(p)} className={`flex items-center gap-1 ${liked.has(p.id) ? "text-red-600" : "text-muted-foreground"}`}>
                      ❤️ {p.likes_count ?? 0}
                    </button>
                    <button onClick={() => openPost(p)} className="flex items-center gap-1 text-muted-foreground">
                      💬 {p.comments_count ?? 0}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post detail modal */}
      {active && (
        <div className="fixed inset-0 z-[300] bg-black/60 flex items-end lg:items-center justify-center p-0 lg:p-4" onClick={() => setActive(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-card w-full lg:max-w-[640px] max-h-[90vh] overflow-y-auto rounded-t-3xl lg:rounded-2xl">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h2 className="font-bangla text-lg text-primary truncate">{active.title}</h2>
              <button onClick={() => setActive(null)} className="text-muted-foreground text-lg">✕</button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catColor[active.category ?? "সাধারণ"] ?? "bg-gray-100"}`}>
                  {active.category}
                </span>
                <span className="text-[11px] text-muted-foreground">{formatDate(active.created_at)} • {active.author_name}</span>
              </div>
              <p className="text-sm whitespace-pre-line text-foreground">{active.content}</p>

              <div className="flex gap-3 mt-4 pt-3 border-t border-border">
                <button onClick={() => toggleLike(active)} className={`flex-1 py-2 rounded-lg text-sm font-bold ${liked.has(active.id) ? "bg-red-100 text-red-700" : "bg-muted text-foreground"}`}>
                  ❤️ লাইক ({active.likes_count ?? 0})
                </button>
              </div>

              <div className="mt-5">
                <h3 className="font-bold text-primary text-sm mb-3">কমেন্ট ({comments.length})</h3>
                {comments.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-3">এখনো কোনো কমেন্ট নেই।</p>
                ) : (
                  <div className="space-y-2 mb-3">
                    {comments.map((c) => (
                      <div key={c.id} className="bg-muted rounded-xl p-3 text-sm">
                        <div className="text-xs font-bold text-primary">{c.author_name}</div>
                        <p className="text-foreground mt-1">{c.content}</p>
                        <div className="text-[10px] text-muted-foreground mt-1">{formatDate(c.created_at)}</div>
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={submitComment} className="space-y-2 mt-3">
                  <input required placeholder="আপনার নাম" value={comment.name} onChange={(e) => setComment({ ...comment, name: e.target.value })}
                    className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background" />
                  <textarea required rows={2} placeholder="আপনার কমেন্ট লিখুন..." value={comment.text} onChange={(e) => setComment({ ...comment, text: e.target.value })}
                    className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background resize-none" />
                  <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-xl text-sm font-bold">
                    কমেন্ট করুন
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New post modal */}
      {showNew && (
        <div className="fixed inset-0 z-[300] bg-black/60 flex items-end lg:items-center justify-center p-0 lg:p-4" onClick={() => setShowNew(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-card w-full lg:max-w-[520px] max-h-[90vh] overflow-y-auto rounded-t-3xl lg:rounded-2xl">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h2 className="font-bangla text-lg text-primary">নতুন পোস্ট</h2>
              <button onClick={() => setShowNew(false)} className="text-muted-foreground text-lg">✕</button>
            </div>
            <form onSubmit={submitPost} className="p-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-primary mb-1 block">শিরোনাম *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background" />
              </div>
              <div>
                <label className="text-xs font-semibold text-primary mb-1 block">ক্যাটাগরি</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background">
                  {categories.filter(c => c.id !== "সব").map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.id}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-primary mb-1 block">বিস্তারিত *</label>
                <textarea required rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background resize-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-primary mb-1 block">আপনার নাম *</label>
                <input required value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background" />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold disabled:opacity-50">
                {submitting ? "পোস্ট হচ্ছে..." : "পোস্ট করুন"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityHub;
