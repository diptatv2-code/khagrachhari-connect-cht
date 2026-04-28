import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Restaurant = {
  id: string;
  name: string;
  name_bn: string | null;
  description: string | null;
  cuisine: string | null;
  rating: number | null;
  delivery_time: string | null;
  delivery_charge: number | null;
  min_order: number | null;
  phone: string | null;
  address: string | null;
};

type MenuItem = {
  id: string;
  restaurant_id: string | null;
  name: string;
  name_bn: string | null;
  description: string | null;
  price: number;
  category: string | null;
};

type CartItem = MenuItem & { qty: number };

const Food = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [active, setActive] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loadingR, setLoadingR] = useState(true);
  const [loadingM, setLoadingM] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });

  useEffect(() => {
    (async () => {
      setLoadingR(true);
      const { data, error } = await supabase
        .from("food_restaurants")
        .select("*")
        .eq("is_active", true)
        .order("rating", { ascending: false });
      if (error) {
        toast.error("রেস্টুরেন্ট লোড করা যাচ্ছে না");
      } else {
        setRestaurants((data ?? []) as Restaurant[]);
      }
      setLoadingR(false);
    })();
  }, []);

  const openRestaurant = async (r: Restaurant) => {
    setActive(r);
    setLoadingM(true);
    setMenuItems([]);
    const { data, error } = await supabase
      .from("food_menu_items")
      .select("*")
      .eq("restaurant_id", r.id)
      .eq("is_available", true)
      .order("category");
    if (!error && data) setMenuItems(data as MenuItem[]);
    setLoadingM(false);
  };

  const closeRestaurant = () => {
    setActive(null);
    setMenuItems([]);
  };

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { ...item, qty: 1 }];
    });
    toast.success(`${item.name_bn || item.name} যুক্ত হয়েছে`);
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const subtotal = useMemo(() => cart.reduce((sum, c) => sum + c.price * c.qty, 0), [cart]);
  const deliveryCharge = active?.delivery_charge ?? 40;
  const total = subtotal + deliveryCharge;
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!active || cart.length === 0) return;
    if (active.min_order && subtotal < active.min_order) {
      toast.error(`মিনিমাম অর্ডার ৳${active.min_order}`);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("food_orders").insert({
      restaurant_id: active.id,
      customer_name: form.name,
      customer_phone: form.phone,
      delivery_address: form.address,
      items: cart.map((c) => ({ id: c.id, name: c.name_bn || c.name, price: c.price, qty: c.qty })),
      total_amount: total,
      delivery_charge: deliveryCharge,
      notes: form.notes || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("অর্ডার পাঠানো যায়নি, আবার চেষ্টা করুন");
      return;
    }
    toast.success("✅ আপনার অর্ডার সফলভাবে পাঠানো হয়েছে! রেস্টুরেন্ট শীঘ্রই কল করবে।");
    setCart([]);
    setShowCheckout(false);
    setForm({ name: "", phone: "", address: "", notes: "" });
    closeRestaurant();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-5 px-4 lg:px-10">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4">
          <button onClick={() => navigate("/")} className="text-primary-foreground/80 text-sm font-medium hover:text-primary-foreground">← হোম</button>
          <h1 className="font-bangla text-lg lg:text-2xl text-primary-foreground">🍽️ খাবার অর্ডার</h1>
          <button
            onClick={() => cartCount > 0 && setShowCheckout(true)}
            className="relative bg-secondary text-primary font-bold px-3 py-2 rounded-lg text-sm"
          >
            🛒 কার্ট
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 lg:px-10 py-6">
        {!active ? (
          <>
            <h2 className="font-bangla text-xl text-primary mb-4">খাগড়াছড়ির সেরা রেস্টুরেন্ট</h2>
            {loadingR ? (
              <div className="text-center py-12 text-muted-foreground text-sm">লোড হচ্ছে...</div>
            ) : restaurants.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-2xl">
                <div className="text-4xl mb-3">🍽️</div>
                <p className="text-sm text-muted-foreground">এখনো কোনো রেস্টুরেন্ট যুক্ত হয়নি।</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {restaurants.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => openRestaurant(r)}
                    className="bg-card rounded-2xl p-4 text-left border border-border hover:shadow-md hover:-translate-y-1 transition-all"
                  >
                    <div className="h-32 bg-gradient-to-br from-orange-200 to-red-300 rounded-xl mb-3 flex items-center justify-center text-5xl">🍛</div>
                    <h3 className="font-bold text-primary text-base">{r.name_bn || r.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
                    <div className="flex items-center justify-between mt-3 text-xs">
                      <span className="text-amber-600 font-semibold">⭐ {r.rating}</span>
                      <span className="text-muted-foreground">⏱ {r.delivery_time}</span>
                      <span className="text-primary font-semibold">৳{r.delivery_charge} ডেলিভারি</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <button onClick={closeRestaurant} className="text-sm text-primary mb-4">← সব রেস্টুরেন্ট</button>
            <div className="bg-gradient-to-br from-primary to-[hsl(var(--green-mid))] text-primary-foreground rounded-2xl p-5 mb-5">
              <h2 className="font-bangla text-2xl">{active.name_bn || active.name}</h2>
              <p className="text-sm opacity-80 mt-1">{active.description}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mt-3">
                <span>⭐ {active.rating}</span>
                <span>⏱ {active.delivery_time}</span>
                <span>📞 {active.phone}</span>
                <span>📍 {active.address}</span>
                <span>৳{active.delivery_charge} ডেলিভারি · মিনিমাম ৳{active.min_order ?? 100}</span>
              </div>
            </div>

            {loadingM ? (
              <div className="text-center py-12 text-muted-foreground text-sm">মেনু লোড হচ্ছে...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {menuItems.map((m) => (
                  <div key={m.id} className="bg-card rounded-2xl p-4 flex justify-between gap-3 border border-border">
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">{m.category}</div>
                      <h4 className="font-bold text-primary text-sm">{m.name_bn || m.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{m.description}</p>
                      <div className="text-base font-bold text-primary mt-2">৳{m.price}</div>
                    </div>
                    <button
                      onClick={() => addToCart(m)}
                      className="self-start bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90"
                    >
                      + যুক্ত
                    </button>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <button
                onClick={() => setShowCheckout(true)}
                className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3"
              >
                🛒 {cartCount} আইটেম · ৳{subtotal} → চেকআউট
              </button>
            )}
          </>
        )}
      </div>

      {showCheckout && (
        <div className="fixed inset-0 z-[300] bg-black/60 flex items-end lg:items-center justify-center p-0 lg:p-4" onClick={() => setShowCheckout(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-card w-full lg:max-w-[520px] max-h-[90vh] overflow-y-auto rounded-t-3xl lg:rounded-2xl shadow-2xl"
          >
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h2 className="font-bangla text-lg text-primary">আপনার অর্ডার</h2>
              <button onClick={() => setShowCheckout(false)} className="text-muted-foreground text-lg">✕</button>
            </div>
            <div className="p-4 space-y-2">
              {cart.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">আপনার কার্ট খালি।</p>
              ) : (
                cart.map((c) => (
                  <div key={c.id} className="flex items-center justify-between gap-3 text-sm bg-muted rounded-xl p-2 px-3">
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{c.name_bn || c.name}</div>
                      <div className="text-xs text-muted-foreground">৳{c.price} × {c.qty} = ৳{c.price * c.qty}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(c.id, -1)} className="w-7 h-7 rounded-full bg-card border border-border">−</button>
                      <span className="w-6 text-center text-sm font-bold">{c.qty}</span>
                      <button onClick={() => updateQty(c.id, 1)} className="w-7 h-7 rounded-full bg-card border border-border">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <>
                <div className="px-4 py-3 border-t border-border text-sm space-y-1">
                  <div className="flex justify-between"><span className="text-muted-foreground">সাবটোটাল</span><span>৳{subtotal}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">ডেলিভারি চার্জ</span><span>৳{deliveryCharge}</span></div>
                  <div className="flex justify-between font-bold text-base text-primary border-t border-border pt-2 mt-2"><span>মোট</span><span>৳{total}</span></div>
                </div>

                <form onSubmit={placeOrder} className="p-4 space-y-3 border-t border-border">
                  <div>
                    <label className="text-xs font-semibold text-primary mb-1 block">নাম *</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-primary mb-1 block">মোবাইল নম্বর *</label>
                    <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-primary mb-1 block">ডেলিভারি ঠিকানা *</label>
                    <textarea required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2}
                      className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background resize-none" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-primary mb-1 block">অতিরিক্ত নোট</label>
                    <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
                      className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background resize-none" />
                  </div>
                  <button type="submit" disabled={submitting}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold disabled:opacity-50">
                    {submitting ? "অর্ডার পাঠানো হচ্ছে..." : `অর্ডার নিশ্চিত করুন · ৳${total}`}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Food;
