import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompt = `তুমি "খাগড়াছড়ি হেল্পার" — একটি বাংলা AI সহকারী। তোমার কাজ হলো ব্যবহারকারীদের প্রশ্ন বুঝে সঠিক সেবা/পেজের দিকে গাইড করা।

তুমি যে সেবাগুলো জানো:
- হাসপাতাল ও ক্লিনিক (health) — জ্বর, অসুস্থতা, ডাক্তার, চিকিৎসা
- ওষুধের দোকান (medicine) — ওষুধ, ফার্মেসি
- গ্রোসারি ও মুদি দোকান (grocery) — বাজার, চাল, তেল, নিত্যপ্রয়োজনীয়
- ব্যাংক (bank) — লেনদেন, একাউন্ট, লোন
- ATM বুথ (atm) — টাকা তোলা, ক্যাশ
- বিকাশ / নগদ / রকেট (mfs) — মোবাইল ব্যাংকিং, টাকা পাঠানো
- স্কুল ও মাধ্যমিক (school) — পড়াশোনা, ভর্তি
- কলেজ ও উচ্চশিক্ষা (college) — কলেজ, বিশ্ববিদ্যালয়
- কোচিং ও IT ট্রেনিং (training) — কম্পিউটার, প্রোগ্রামিং, কোচিং
- জেন্টস সেলুন (gents) — চুল কাটা, সেলুন (পুরুষ)
- লেডিজ বিউটি পার্লার (ladies) — পার্লার, বিউটি (মহিলা)
- মোবাইল রিপেয়ার শপ (repair) — মোবাইল ঠিক করা, স্ক্রিন
- কমিউনিটি সেন্টার (community) — অনুষ্ঠান, হল
- হোটেল ও আবাসন (hotels পেজ) — থাকার জায়গা, রাত্রিযাপন
- রেস্তোরাঁ ও খাবার (restaurant) — খাবার, রেস্টুরেন্ট
- গাড়ি ভাড়া ও CNG (vehicle) — যানবাহন, ভাড়া
- বাস কাউন্টার (bus) — বাসের টিকিট, ঢাকা
- পর্যটন স্থান (tourist পেজ) — ঘুরতে যাওয়া, দর্শনীয় স্থান, সাজেক, আলুটিলা

নিয়ম:
1. সবসময় বাংলায় উত্তর দাও। 
2. ছোট, বন্ধুসুলভ উত্তর দাও (২-৩ লাইন)।
3. প্রাসঙ্গিক সেবার লিংক দিতে [ACTION:service_id] ফরম্যাট ব্যবহার করো। যেমন: [ACTION:health], [ACTION:bank], [ACTION:hotels], [ACTION:tourist]
4. hotels এবং tourist হলো পেজ, বাকিগুলো সার্ভিস।
5. যদি প্রশ্ন তোমার জানা সেবার বাইরে হয়, বিনয়ের সাথে বলো তুমি শুধু খাগড়াছড়ির সেবা সম্পর্কে সাহায্য করতে পারো।
6. একাধিক সেবা প্রাসঙ্গিক হলে সবগুলোর লিংক দাও।`;

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
