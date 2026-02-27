export interface SidebarNavItem {
  id: string;
  label: string;
  emoji: string;
  count?: string;
  type: "page" | "service";
}

export interface SidebarGroup {
  label: string;
  items: SidebarNavItem[];
}

export const mainNav: SidebarNavItem[] = [
  { id: "home", label: "হোম", emoji: "🏠", type: "page" },
  { id: "hotels", label: "হোটেল ও আবাসন", emoji: "🏨", count: "১৫", type: "page" },
  { id: "tourist", label: "পর্যটন স্থান", emoji: "🗺️", count: "৬", type: "page" },
  { id: "doctors", label: "ডাক্তার তালিকা", emoji: "👨‍⚕️", count: "২৫", type: "page" },
  { id: "marketplace", label: "ক্রয় ও বিক্রয়", emoji: "🛒", type: "page" },
];

export const sidebarGroups: SidebarGroup[] = [
  {
    label: "স্বাস্থ্য",
    items: [
      { id: "health", label: "হাসপাতাল ও ক্লিনিক", emoji: "🏥", count: "১০", type: "service" },
      { id: "medicine", label: "ওষুধের দোকান", emoji: "💊", count: "৫", type: "service" },
    ],
  },
  {
    label: "খাদ্য ও বাজার",
    items: [
      { id: "restaurant", label: "রেস্তোরাঁ ও খাবার", emoji: "🍽️", count: "৭", type: "service" },
      { id: "grocery", label: "গ্রোসারি ও মুদি দোকান", emoji: "🛒", count: "৫", type: "service" },
    ],
  },
  {
    label: "পরিবহন",
    items: [
      { id: "transport", label: "গাড়ি ভাড়া ও CNG", emoji: "🚗", count: "৮", type: "service" },
      { id: "bus", label: "বাস কাউন্টার", emoji: "🚌", count: "৯", type: "service" },
    ],
  },
  {
    label: "আর্থিক সেবা",
    items: [
      { id: "banks", label: "ব্যাংক শাখা", emoji: "🏦", count: "৯", type: "service" },
      { id: "atm", label: "ATM বুথ", emoji: "💳", count: "৬", type: "service" },
      { id: "mfs", label: "বিকাশ / নগদ / রকেট", emoji: "📲", type: "service" },
    ],
  },
  {
    label: "শিক্ষা",
    items: [
      { id: "school", label: "স্কুল ও মাধ্যমিক", emoji: "🏫", count: "৫", type: "service" },
      { id: "college", label: "কলেজ ও উচ্চশিক্ষা", emoji: "🎓", count: "৩", type: "service" },
      { id: "training", label: "কোচিং ও IT ট্রেনিং", emoji: "💻", count: "৫", type: "service" },
    ],
  },
  {
    label: "সেলুন ও পার্লার",
    items: [
      { id: "gents", label: "জেন্টস সেলুন", emoji: "💈", count: "৪", type: "service" },
      { id: "ladies", label: "লেডিজ বিউটি পার্লার", emoji: "💅", count: "৬", type: "service" },
    ],
  },
  {
    label: "অন্যান্য",
    items: [
      { id: "repair", label: "মোবাইল রিপেয়ার শপ", emoji: "🔧", count: "৫", type: "service" },
      { id: "community", label: "কমিউনিটি সেন্টার", emoji: "🏛️", count: "৩", type: "service" },
      { id: "construction", label: "বাড়ি ও নির্মাণ", emoji: "🔨", type: "service" },
    ],
  },
];

export const categoryGrid = [
  { id: "health", label: "হাসপাতাল ও ক্লিনিক", sub: "১০টি স্থান", emoji: "🏥" },
  { id: "medicine", label: "ওষুধের দোকান", sub: "৫টি ফার্মেসি", emoji: "💊" },
  { id: "doctors", label: "ডাক্তার তালিকা", sub: "বিশেষজ্ঞ ডাক্তার", emoji: "👨‍⚕️", type: "page" as const },
  { id: "restaurant", label: "রেস্তোরাঁ", sub: "৭টি রেস্তোরাঁ", emoji: "🍽️" },
  { id: "grocery", label: "গ্রোসারি", sub: "৫টি দোকান", emoji: "🛒" },
  { id: "transport", label: "গাড়ি ভাড়া ও CNG", sub: "৮টি সার্ভিস", emoji: "🚗" },
  { id: "bus", label: "বাস কাউন্টার", sub: "৫টি কাউন্টার", emoji: "🚌" },
  { id: "banks", label: "ব্যাংক শাখা", sub: "৭টি ব্যাংক", emoji: "🏦" },
  { id: "atm", label: "ATM বুথ", sub: "৬টি ATM", emoji: "💳" },
  { id: "mfs", label: "বিকাশ / নগদ", sub: "MFS এজেন্ট", emoji: "📲" },
  { id: "school", label: "স্কুল", sub: "৫টি স্কুল", emoji: "🏫" },
  { id: "college", label: "কলেজ", sub: "৩টি কলেজ", emoji: "🎓" },
  { id: "training", label: "কোচিং ও IT", sub: "৫টি প্রতিষ্ঠান", emoji: "💻" },
  { id: "gents", label: "জেন্টস সেলুন", sub: "৪টি সেলুন", emoji: "💈" },
  { id: "ladies", label: "লেডিজ পার্লার", sub: "৬টি পার্লার", emoji: "💅" },
  { id: "repair", label: "মোবাইল রিপেয়ার", sub: "৫টি শপ", emoji: "🔧" },
  { id: "community", label: "কমিউনিটি সেন্টার", sub: "৩টি হলরুম", emoji: "🏛️" },
  { id: "marketplace", label: "ক্রয় ও বিক্রয়", sub: "কিনুন ও বেচুন", emoji: "🛒", type: "page" as const },
  { id: "hotels", label: "হোটেল ও আবাসন", sub: "১৫টি হোটেল", emoji: "🏨", type: "page" as const },
  { id: "tourist", label: "পর্যটন স্থান", sub: "আলুটিলা, সাজেক", emoji: "🗺️", type: "page" as const },
];

export const emergencyNumbers = [
  { label: "পুলিশ", num: "999", emoji: "👮", tel: "999", colorClass: "bg-blue-900" },
  { label: "ফায়ার সার্ভিস", num: "02333343966", emoji: "🚒", tel: "02333343966", colorClass: "bg-red-700" },
  { label: "সদর হাসপাতাল", num: "01730-324772", emoji: "🏥", tel: "01730324772", colorClass: "bg-green-800" },
  { label: "অ্যাম্বুলেন্স", num: "01635-600835", emoji: "🚑", tel: "01635600835", colorClass: "bg-purple-700" },
  { label: "বিদ্যুৎ অফিস", num: "02333343874", emoji: "⚡", tel: "02333343874", colorClass: "bg-yellow-700" },
  { label: "ডাক্তার হটলাইন", num: "09611-530530", emoji: "👨‍⚕️", tel: "09611530530", colorClass: "bg-teal-700" },
];

export const notices = [
  { date: "ফেব্রুয়ারি ২০২৬", text: "খাগড়াছড়ি-দীঘিনালা-সাজেক সড়ক সম্প্রসারণ — ৩৫ কোটি টাকার প্রকল্প শুরু হয়েছে" },
  { date: "জানুয়ারি ২০২৬", text: "আলুটিলা পর্যটন কেন্দ্রে অনলাইনে টিকিট কেনার সুবিধা চালু হয়েছে" },
  { date: "ডিসেম্বর ২০২৫", text: "সাজেক — সেনা এস্কর্ট সকাল ১০টা ও বিকাল ৩টা। আগেভাগে বুকিং দিন।" },
];

export const touristSpotsList = [
  { name: "আলুটিলা রহস্যময় গুহা", meta: "৭ কি.মি. • অনলাইন টিকিট", hours: "সকাল ৯–বিকাল ৫", gradient: "bg-gradient-to-br from-green-700 to-green-500", emoji: "🕳️", url: "https://maps.google.com/?q=Alutila+Cave+Khagrachhari" },
  { name: "রিসাং ঝর্ণা", meta: "১০ কি.মি. • পাহাড়ি রাস্তা", hours: "সূর্যোদয়–সূর্যাস্ত", gradient: "bg-gradient-to-br from-blue-800 to-blue-500", emoji: "💧", url: "https://maps.google.com/?q=Risang+Waterfall+Khagrachhari" },
  { name: "সাজেক ভ্যালি", meta: "৭০ কি.মি. • জীপ ৯,৪০০–১৩,২০০ BDT", hours: "এস্কর্ট: ১০AM ও ৩PM", gradient: "bg-gradient-to-br from-purple-700 to-purple-500", emoji: "☁️", url: "https://maps.google.com/?q=Sajek+Valley+Bangladesh" },
  { name: "দীঘিনালা ঝুলন্ত সেতু", meta: "দীঘিনালায় • CNG দিয়ে যাওয়া যায়", hours: "সর্বদা খোলা", gradient: "bg-gradient-to-br from-amber-600 to-yellow-500", emoji: "🌉", url: "https://maps.google.com/?q=Dighinala+Hanging+Bridge" },
  { name: "তারেং পাহাড়", meta: "শহরের কাছে • সূর্যাস্তের দৃশ্য", hours: "সূর্যোদয়–সূর্যাস্ত", gradient: "bg-gradient-to-br from-amber-800 to-pink-400", emoji: "⛰️", url: "https://maps.google.com/?q=Tareng+Hill+Khagrachhari" },
  { name: "শান্তিপুর অরণ্য কুটির", meta: "পঞ্চরী • বৌদ্ধ তীর্থস্থান", hours: "সকাল–বিকাল", gradient: "bg-gradient-to-br from-green-900 to-green-600", emoji: "🛕", url: "https://maps.google.com/?q=Shantipur+Aranya+Kutir" },
];
