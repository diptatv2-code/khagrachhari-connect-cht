export interface DirectoryCategory {
  id: string;
  label: string;
  emoji: string;
  section: "local" | "tourist";
  subcategories?: { label: string; emoji: string }[];
}

export const localCategories: DirectoryCategory[] = [
  {
    id: "health",
    label: "স্বাস্থ্যসেবা",
    emoji: "🏥",
    section: "local",
    subcategories: [
      { label: "ফার্মেসি", emoji: "💊" },
      { label: "ডাক্তার চেম্বার", emoji: "🏥" },
      { label: "দাঁতের ডাক্তার", emoji: "🦷" },
      { label: "চোখের ডাক্তার", emoji: "👁️" },
      { label: "ডায়াগনস্টিক সেন্টার", emoji: "🧪" },
    ],
  },
  {
    id: "electronics",
    label: "ইলেকট্রনিক্স ও মেরামত",
    emoji: "📱",
    section: "local",
    subcategories: [
      { label: "মোবাইল রিপেয়ার", emoji: "📱" },
      { label: "AC রিপেয়ার", emoji: "❄️" },
      { label: "TV রিপেয়ার", emoji: "📺" },
      { label: "ইলেকট্রিশিয়ান", emoji: "💡" },
      { label: "কম্পিউটার সার্ভিস", emoji: "🖥️" },
      { label: "ব্যাটারি ও সোলার", emoji: "🔋" },
    ],
  },
  {
    id: "construction",
    label: "বাড়ি ও নির্মাণ",
    emoji: "🔧",
    section: "local",
    subcategories: [
      { label: "প্লাম্বার", emoji: "🔧" },
      { label: "কাঠমিস্ত্রি ও ফার্নিচার", emoji: "🪚" },
      { label: "রডমিস্ত্রি ও নির্মাণ", emoji: "🏗️" },
      { label: "রং মিস্ত্রি", emoji: "🎨" },
    ],
  },
  {
    id: "transport",
    label: "পরিবহন",
    emoji: "🚗",
    section: "local",
    subcategories: [
      { label: "CNG স্ট্যান্ড", emoji: "🚗" },
      { label: "ট্রাক ও পিকআপ ভাড়া", emoji: "🛻" },
      { label: "মোটরবাইক ভাড়া", emoji: "🏍️" },
    ],
  },
  {
    id: "financial",
    label: "আর্থিক সেবা",
    emoji: "💰",
    section: "local",
    subcategories: [
      { label: "ব্যাংক শাখা ও ATM", emoji: "🏦" },
      { label: "বিকাশ এজেন্ট", emoji: "📲" },
      { label: "নগদ এজেন্ট", emoji: "📲" },
      { label: "রকেট এজেন্ট", emoji: "📲" },
    ],
  },
  {
    id: "education",
    label: "শিক্ষা",
    emoji: "📚",
    section: "local",
    subcategories: [
      { label: "কোচিং সেন্টার", emoji: "📚" },
      { label: "কম্পিউটার ট্রেনিং", emoji: "🖥️" },
    ],
  },
  {
    id: "others",
    label: "অন্যান্য",
    emoji: "✂️",
    section: "local",
    subcategories: [
      { label: "সেলুন ও বার্বার", emoji: "✂️" },
      { label: "বিউটি পার্লার", emoji: "💅" },
      { label: "টেইলার্স", emoji: "👗" },
      { label: "ফটোকপি সার্ভিস", emoji: "🖨️" },
      { label: "আইনজীবী", emoji: "⚖️" },
      { label: "মুদিখানা ও মার্কেট", emoji: "🛒" },
    ],
  },
];

export const touristCategories: DirectoryCategory[] = [
  {
    id: "guide",
    label: "গাইড ও ট্যুর",
    emoji: "🧭",
    section: "tourist",
    subcategories: [
      { label: "লোকাল ট্যুর গাইড", emoji: "🧭" },
      { label: "ফটোগ্রাফি গাইড", emoji: "📸" },
      { label: "ক্যাম্পিং সার্ভিস", emoji: "🏕️" },
    ],
  },
  {
    id: "vehicle",
    label: "যানবাহন",
    emoji: "🚙",
    section: "tourist",
    subcategories: [
      { label: "চাঁদের গাড়ি ভাড়া", emoji: "🚙" },
      { label: "মোটরবাইক ভাড়া", emoji: "🏍️" },
      { label: "মাইক্রোবাস ভাড়া", emoji: "🚗" },
      { label: "বাস কাউন্টার", emoji: "🚌" },
    ],
  },
  {
    id: "trekking",
    label: "ট্রেকিং ও সরঞ্জাম",
    emoji: "🎒",
    section: "tourist",
    subcategories: [
      { label: "টর্চ ও মশাল", emoji: "🔦" },
      { label: "ট্রেকিং সরঞ্জাম ভাড়া", emoji: "🎒" },
      { label: "ট্রেকিং জুতা ও রেইনকোট", emoji: "🥾" },
      { label: "ক্যাম্পিং সরঞ্জাম", emoji: "🏕️" },
      { label: "লাইফ জ্যাকেট", emoji: "🧱" },
    ],
  },
  {
    id: "food",
    label: "খাবার",
    emoji: "🍱",
    section: "tourist",
    subcategories: [
      { label: "ক্যাফে ও চায়ের দোকান", emoji: "☕" },
      { label: "পাহাড়ি রেস্টুরেন্ট", emoji: "🍱" },
      { label: "আদিবাসী খাবার", emoji: "🥘" },
      { label: "ফাস্টফুড ও স্নাকস", emoji: "🍜" },
    ],
  },
  {
    id: "health-tourist",
    label: "স্বাস্থ্য ও জরুরি",
    emoji: "🩺",
    section: "tourist",
    subcategories: [
      { label: "ফার্স্ট এইড কিট", emoji: "🩹" },
      { label: "নিকটতম ফার্মেসি", emoji: "💊" },
      { label: "নিকটতম হাসপাতাল", emoji: "🚑" },
      { label: "সাপে কামড়ালে", emoji: "🐍" },
    ],
  },
  {
    id: "communication",
    label: "যোগাযোগ",
    emoji: "📶",
    section: "tourist",
    subcategories: [
      { label: "সিম কার্ড শপ", emoji: "📶" },
      { label: "WiFi হটস্পট", emoji: "📡" },
      { label: "ফটোকপি ও প্রিন্ট", emoji: "🖨️" },
    ],
  },
  {
    id: "banking",
    label: "ব্যাংকিং",
    emoji: "💸",
    section: "tourist",
    subcategories: [
      { label: "ATM লোকেশন", emoji: "💸" },
      { label: "বিকাশ/নগদ এজেন্ট", emoji: "📲" },
      { label: "ব্যাংক শাখা", emoji: "🏦" },
    ],
  },
];

export const allLocalFilterLabels = ["সব", "ফার্মেসি", "ডাক্তার", "ইলেকট্রনিক্স", "বাড়ি মেরামত", "পরিবহন", "আর্থিক সেবা", "শিক্ষা", "অন্যান্য"];
export const allTouristFilterLabels = ["সব", "গাইড ও ট্যুর", "যানবাহন", "সরঞ্জাম", "খাবার", "স্বাস্থ্য", "যোগাযোগ", "ব্যাংকিং"];
