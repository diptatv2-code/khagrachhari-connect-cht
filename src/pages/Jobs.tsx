import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string | null;
  job_type: string | null;
  salary_range: string | null;
  description: string;
  requirements: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  application_deadline: string | null;
  created_at: string;
};

const jobTypes = [
  { id: "all", label: "সব", emoji: "📋" },
  { id: "full-time", label: "ফুল-টাইম", emoji: "💼" },
  { id: "part-time", label: "পার্ট-টাইম", emoji: "⏰" },
  { id: "contract", label: "চুক্তিভিত্তিক", emoji: "📄" },
  { id: "freelance", label: "ফ্রিল্যান্স", emoji: "🌐" },
];

const typeColors: Record<string, string> = {
  "full-time": "bg-green-100 text-green-800",
  "part-time": "bg-blue-100 text-blue-800",
  contract: "bg-purple-100 text-purple-800",
  freelance: "bg-orange-100 text-orange-800",
};

const typeLabels: Record<string, string> = {
  "full-time": "ফুল-টাইম",
  "part-time": "পার্ট-টাইম",
  contract: "চুক্তিভিত্তিক",
  freelance: "ফ্রিল্যান্স",
};

const PAGE_SIZE = 8;

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [active, setActive] = useState<Job | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    salary_range: "",
    contact_phone: "",
    job_type: "full-time" as "full-time" | "part-time" | "contract" | "freelance",
  });

  const loadJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });
    if (!error && data) setJobs(data as Job[]);
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (typeFilter !== "all" && j.job_type !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!j.title.toLowerCase().includes(q) && !j.company.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [jobs, typeFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [typeFilter, search]);

  const submitJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("jobs").insert({
      title: form.title,
      company: form.company,
      description: form.description,
      salary_range: form.salary_range || null,
      contact_phone: form.contact_phone || null,
      job_type: form.job_type,
      status: "active",
      posted_by_phone: form.contact_phone || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("পোস্ট করা যায়নি, আবার চেষ্টা করুন");
      return;
    }
    toast.success("✅ চাকরির বিজ্ঞাপন পোস্ট হয়েছে!");
    setShowPostForm(false);
    setForm({ title: "", company: "", description: "", salary_range: "", contact_phone: "", job_type: "full-time" });
    loadJobs();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-5 px-4 lg:px-10">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4">
          <button onClick={() => navigate("/")} className="text-primary-foreground/80 text-sm font-medium hover:text-primary-foreground">← হোম</button>
          <h1 className="font-bangla text-lg lg:text-2xl text-primary-foreground">💼 চাকরির সুযোগ</h1>
          <button
            onClick={() => setShowPostForm(true)}
            className="bg-secondary text-primary font-bold px-3 py-2 rounded-lg text-sm"
          >
            + পোস্ট করুন
          </button>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 lg:px-10 py-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="চাকরি বা কোম্পানি খুঁজুন..."
          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-4">
          {jobTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTypeFilter(t.id)}
              className={`whitespace-nowrap text-xs font-semibold px-3.5 py-2 rounded-full border transition-all ${
                typeFilter === t.id
                  ? "bg-primary text-primary-foreground border-transparent"
                  : "bg-card text-primary border-border hover:border-primary/30"
              }`}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mb-3">ফলাফল: {filtered.length} টি চাকরি</p>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">লোড হচ্ছে...</div>
        ) : paged.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl">
            <div className="text-4xl mb-3">💼</div>
            <p className="text-sm text-muted-foreground">এই মুহূর্তে কোনো চাকরির বিজ্ঞাপন নেই।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paged.map((j) => (
              <button
                key={j.id}
                onClick={() => setActive(j)}
                className="bg-card rounded-2xl p-4 text-left border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-primary text-base">{j.title}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColors[j.job_type ?? "full-time"]}`}>
                    {typeLabels[j.job_type ?? "full-time"]}
                  </span>
                </div>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <div>🏢 {j.company}</div>
                  <div>📍 {j.location}</div>
                  {j.salary_range && <div>💰 {j.salary_range}</div>}
                </div>
                <p className="text-xs mt-2 text-muted-foreground line-clamp-2">{j.description}</p>
                <div className="text-[10px] text-primary font-semibold mt-3">বিস্তারিত দেখুন →</div>
              </button>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 text-xs rounded-lg bg-card border border-border disabled:opacity-50">← আগে</button>
            <span className="text-xs text-muted-foreground">পেইজ {page} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1.5 text-xs rounded-lg bg-card border border-border disabled:opacity-50">পরে →</button>
          </div>
        )}
      </div>

      {/* Job detail modal */}
      {active && (
        <div className="fixed inset-0 z-[300] bg-black/60 flex items-end lg:items-center justify-center p-0 lg:p-4" onClick={() => setActive(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-card w-full lg:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-t-3xl lg:rounded-2xl">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h2 className="font-bangla text-lg text-primary">{active.title}</h2>
              <button onClick={() => setActive(null)} className="text-muted-foreground text-lg">✕</button>
            </div>
            <div className="p-5 space-y-3 text-sm">
              <div className="flex flex-wrap gap-2">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${typeColors[active.job_type ?? "full-time"]}`}>
                  {typeLabels[active.job_type ?? "full-time"]}
                </span>
              </div>
              <div className="text-muted-foreground space-y-1">
                <div>🏢 <strong className="text-foreground">{active.company}</strong></div>
                <div>📍 {active.location}</div>
                {active.salary_range && <div>💰 {active.salary_range}</div>}
                {active.application_deadline && <div>📅 আবেদনের শেষ তারিখ: {active.application_deadline}</div>}
              </div>

              <div>
                <h3 className="font-bold text-primary mb-1">কাজের বিবরণ</h3>
                <p className="whitespace-pre-line text-muted-foreground">{active.description}</p>
              </div>

              {active.requirements && (
                <div>
                  <h3 className="font-bold text-primary mb-1">যোগ্যতা</h3>
                  <p className="whitespace-pre-line text-muted-foreground">{active.requirements}</p>
                </div>
              )}

              <div className="bg-muted rounded-xl p-3 mt-4">
                <h3 className="font-bold text-primary text-sm mb-2">যোগাযোগ করুন</h3>
                <div className="flex flex-col gap-2">
                  {active.contact_phone && (
                    <a href={`tel:${active.contact_phone.replace(/[^0-9]/g, "")}`}
                      className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-bold text-center">
                      📞 {active.contact_phone}
                    </a>
                  )}
                  {active.contact_email && (
                    <a href={`mailto:${active.contact_email}`}
                      className="bg-card border border-border px-4 py-2.5 rounded-lg text-sm font-bold text-center">
                      ✉️ {active.contact_email}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post job modal */}
      {showPostForm && (
        <div className="fixed inset-0 z-[300] bg-black/60 flex items-end lg:items-center justify-center p-0 lg:p-4" onClick={() => setShowPostForm(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-card w-full lg:max-w-[520px] max-h-[90vh] overflow-y-auto rounded-t-3xl lg:rounded-2xl">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h2 className="font-bangla text-lg text-primary">চাকরির বিজ্ঞাপন পোস্ট</h2>
              <button onClick={() => setShowPostForm(false)} className="text-muted-foreground text-lg">✕</button>
            </div>
            <form onSubmit={submitJob} className="p-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-primary mb-1 block">পদের নাম *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background" />
              </div>
              <div>
                <label className="text-xs font-semibold text-primary mb-1 block">প্রতিষ্ঠানের নাম *</label>
                <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-primary mb-1 block">ধরন</label>
                  <select value={form.job_type} onChange={(e) => setForm({ ...form, job_type: e.target.value as typeof form.job_type })}
                    className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background">
                    <option value="full-time">ফুল-টাইম</option>
                    <option value="part-time">পার্ট-টাইম</option>
                    <option value="contract">চুক্তি</option>
                    <option value="freelance">ফ্রিল্যান্স</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-primary mb-1 block">বেতন</label>
                  <input value={form.salary_range} onChange={(e) => setForm({ ...form, salary_range: e.target.value })}
                    placeholder="৳১৫,০০০-২০,০০০"
                    className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-primary mb-1 block">কাজের বিবরণ *</label>
                <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background resize-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-primary mb-1 block">যোগাযোগ ফোন *</label>
                <input required type="tel" value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
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

export default Jobs;
