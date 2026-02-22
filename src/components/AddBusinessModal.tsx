import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { localCategories, touristCategories } from "@/data/directoryCategories";

interface Props {
  onClose: () => void;
  onAdded: () => void;
}

const allCategoryLabels = [
  ...localCategories.flatMap((c) => c.subcategories?.map((s) => s.label) ?? []),
  ...touristCategories.flatMap((c) => c.subcategories?.map((s) => s.label) ?? []),
];

const AddBusinessModal = ({ onClose, onAdded }: Props) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name_bn: "",
    name_en: "",
    category: "",
    section: "local" as "local" | "tourist",
    address: "",
    phone: "",
    whatsapp: "",
    description: "",
  });

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("businesses").insert({
      name_bn: form.name_bn,
      name_en: form.name_en || null,
      category: form.category,
      section: form.section,
      address: form.address,
      phone: form.phone,
      whatsapp: form.whatsapp || null,
      description: form.description || null,
      is_open: true,
    });
    setLoading(false);
    if (!error) {
      onAdded();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-card rounded-2xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bangla text-xl text-primary">আপনার ব্যবসা যোগ করুন</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-primary text-lg">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-primary mb-1 block">ব্যবসার নাম (বাংলা) *</label>
            <input required value={form.name_bn} onChange={(e) => set("name_bn", e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-forest-light/30" />
          </div>
          <div>
            <label className="text-xs font-semibold text-primary mb-1 block">ব্যবসার নাম (English)</label>
            <input value={form.name_en} onChange={(e) => set("name_en", e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-forest-light/30" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-primary mb-1 block">বিভাগ *</label>
              <select required value={form.section} onChange={(e) => set("section", e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none">
                <option value="local">স্থানীয় সেবা</option>
                <option value="tourist">পর্যটক সেবা</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-primary mb-1 block">ক্যাটাগরি *</label>
              <select required value={form.category} onChange={(e) => set("category", e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none">
                <option value="">নির্বাচন করুন</option>
                {(form.section === "local" ? localCategories : touristCategories).map((cat) =>
                  cat.subcategories?.map((s) => (
                    <option key={s.label} value={s.label}>{s.emoji} {s.label}</option>
                  ))
                )}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-primary mb-1 block">ঠিকানা *</label>
            <input required value={form.address} onChange={(e) => set("address", e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-forest-light/30" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-primary mb-1 block">ফোন নম্বর *</label>
              <input required value={form.phone} onChange={(e) => set("phone", e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-forest-light/30" />
            </div>
            <div>
              <label className="text-xs font-semibold text-primary mb-1 block">WhatsApp নম্বর</label>
              <input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-forest-light/30" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-primary mb-1 block">সংক্ষিপ্ত বিবরণ</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-forest-light/30 resize-none" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "জমা হচ্ছে..." : "জমা দিন"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBusinessModal;
