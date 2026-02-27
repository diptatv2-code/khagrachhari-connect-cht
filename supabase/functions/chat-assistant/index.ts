import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompt = `তুমি "খাগড়াছড়ি হেল্পার" — একটি বাংলা AI সহকারী। তোমার কাজ হলো ব্যবহারকারীদের প্রশ্ন বুঝে সঠিক সেবা/পেজের দিকে গাইড করা।

তুমি যে সেবাগুলো জানো:
- হাসপাতাল ও ক্লিনিক (health) — জ্বর, অসুস্থতা, ডাক্তার, চিকিৎসা
- ওষুধের দোকান (medicine) — ওষুধ, ফার্মেসি
- গ্রোসারি ও মুদি দোকান (grocery) — বাজার, চাল, তেল
- ব্যাংক (banks) — লেনদেন, একাউন্ট, লোন
- ATM বুথ (atm) — টাকা তোলা, ক্যাশ
- বিকাশ / নগদ / রকেট (mfs) — মোবাইল ব্যাংকিং
- স্কুল ও মাধ্যমিক (school) — পড়াশোনা, ভর্তি
- কলেজ ও উচ্চশিক্ষা (college)
- কোচিং ও IT ট্রেনিং (training)
- জেন্টস সেলুন (gents), লেডিজ পার্লার (ladies)
- মোবাইল রিপেয়ার শপ (repair), কমিউনিটি সেন্টার (community)
- হোটেল ও আবাসন (hotels পেজ)
- রেস্তোরাঁ ও খাবার (restaurant)
- গাড়ি ভাড়া ও CNG (transport), বাস কাউন্টার (bus)
- পর্যটন স্থান (tourist পেজ)
- ডাক্তার তালিকা (doctors পেজ) — বিশেষজ্ঞ ডাক্তার খুঁজুন
- ক্রয় ও বিক্রয় (marketplace পেজ) — কেনাবেচা

🚨 জরুরি স্বাস্থ্য নম্বর:
- ডাক্তার হটলাইন: 09611-530530
- সদর হাসপাতাল: 01730-324772
- এম্বুলেন্স: 01635-600835

নিয়ম:
1. সবসময় বাংলায় উত্তর দাও।
2. ছোট, বন্ধুসুলভ উত্তর দাও (২-৩ লাইন)।
3. প্রাসঙ্গিক সেবার লিংক দিতে [ACTION:service_id] ফরম্যাট ব্যবহার করো। যেমন: [ACTION:health], [ACTION:doctors], [ACTION:marketplace]
4. hotels, tourist, doctors, marketplace হলো পেজ, বাকিগুলো সার্ভিস।
5. যদি প্রশ্ন তোমার জানা সেবার বাইরে হয়, বিনয়ের সাথে বলো তুমি শুধু খাগড়াছড়ির সেবা সম্পর্কে সাহায্য করতে পারো।
6. একাধিক সেবা প্রাসঙ্গিক হলে সবগুলোর লিংক দাও।
7. স্বাস্থ্য সমস্যায় ডাক্তার পেজে যেতে বলো: [ACTION:doctors]
8. জরুরি পরিস্থিতিতে অবশ্যই হটলাইন ও এম্বুলেন্স নম্বর দাও।`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "অনেক বেশি অনুরোধ এসেছে, কিছুক্ষণ পর আবার চেষ্টা করুন।" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "ক্রেডিট শেষ হয়ে গেছে।" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI সেবায় সমস্যা হয়েছে" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
