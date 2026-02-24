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
    label: "হাসপাতাল ও ক্লিনিক",
    emoji: "🏥",
    section: "local",
  },
  {
    id: "medicine",
    label: "ওষুধের দোকান",
    emoji: "💊",
    section: "local",
  },
  {
    id: "grocery",
    label: "গ্রোসারি ও মুদি দোকান",
    emoji: "🛒",
    section: "local",
  },
  {
    id: "bank",
    label: "ব্যাংক",
    emoji: "🏦",
    section: "local",
  },
  {
    id: "atm",
    label: "ATM বুথ",
    emoji: "💳",
    section: "local",
  },
  {
    id: "mfs",
    label: "বিকাশ / নগদ / রকেট",
    emoji: "📲",
    section: "local",
  },
  {
    id: "school",
    label: "স্কুল ও মাধ্যমিক",
    emoji: "🏫",
    section: "local",
  },
  {
    id: "college",
    label: "কলেজ ও উচ্চশিক্ষা",
    emoji: "🎓",
    section: "local",
  },
  {
    id: "training",
    label: "কোচিং ও IT ট্রেনিং",
    emoji: "💻",
    section: "local",
  },
  {
    id: "gents",
    label: "জেন্টস সেলুন",
    emoji: "💈",
    section: "local",
  },
  {
    id: "ladies",
    label: "লেডিজ বিউটি পার্লার",
    emoji: "💅",
    section: "local",
  },
  {
    id: "repair",
    label: "মোবাইল রিপেয়ার শপ",
    emoji: "🔧",
    section: "local",
  },
  {
    id: "community",
    label: "কমিউনিটি সেন্টার",
    emoji: "🏛️",
    section: "local",
  },
];

export const touristCategories: DirectoryCategory[] = [
  {
    id: "hotel",
    label: "হোটেল ও আবাসন",
    emoji: "🏨",
    section: "tourist",
  },
  {
    id: "restaurant",
    label: "রেস্তোরাঁ ও খাবার",
    emoji: "🍽️",
    section: "tourist",
  },
  {
    id: "vehicle",
    label: "গাড়ি ভাড়া ও CNG",
    emoji: "🚗",
    section: "tourist",
  },
  {
    id: "bus",
    label: "বাস কাউন্টার",
    emoji: "🚌",
    section: "tourist",
  },
];

export const allLocalFilterLabels = [
  "সব",
  "হাসপাতাল ও ক্লিনিক",
  "ওষুধের দোকান",
  "গ্রোসারি",
  "ব্যাংক",
  "ATM বুথ",
  "বিকাশ / নগদ",
  "স্কুল",
  "কলেজ",
  "কোচিং ও IT",
  "জেন্টস সেলুন",
  "লেডিজ পার্লার",
  "মোবাইল রিপেয়ার",
  "কমিউনিটি সেন্টার",
];

export const allTouristFilterLabels = [
  "সব",
  "হোটেল ও আবাসন",
  "রেস্তোরাঁ ও খাবার",
  "গাড়ি ভাড়া ও CNG",
  "বাস কাউন্টার",
];
