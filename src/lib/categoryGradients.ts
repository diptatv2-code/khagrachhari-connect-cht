// Category-based gradients and emojis for business cards
export const getCategoryStyle = (category: string): { gradient: string; emoji: string } => {
  const lower = category.toLowerCase();
  
  if (lower.includes("হাসপাতাল") || lower.includes("ক্লিনিক") || lower.includes("স্বাস্থ্য"))
    return { gradient: "linear-gradient(135deg, #1a3d2b, #2d6a4f)", emoji: "🏥" };
  
  if (lower.includes("ওষুধ") || lower.includes("ফার্মেসি"))
    return { gradient: "linear-gradient(135deg, #0d6e6e, #2ab5b5)", emoji: "💊" };
  
  if (lower.includes("রেস্তোরাঁ") || lower.includes("রেস্তো") || lower.includes("খাবার") || lower.includes("food"))
    return { gradient: "linear-gradient(135deg, #c0392b, #e67e22)", emoji: "🍽️" };
  
  if (lower.includes("গ্রোসারি") || lower.includes("মুদি") || lower.includes("দোকান"))
    return { gradient: "linear-gradient(135deg, #f39c12, #f1c40f)", emoji: "🛒" };
  
  if (lower.includes("পরিবহন") || lower.includes("cng") || lower.includes("গাড়ি") || lower.includes("জীপ") || lower.includes("যানবাহন"))
    return { gradient: "linear-gradient(135deg, #1565c0, #42a5f5)", emoji: "🚗" };
  
  if (lower.includes("বাস"))
    return { gradient: "linear-gradient(135deg, #1565c0, #42a5f5)", emoji: "🚌" };
  
  if (lower.includes("ব্যাংক") || lower.includes("atm") || lower.includes("এটিএম"))
    return { gradient: "linear-gradient(135deg, #4a148c, #9c27b0)", emoji: "🏦" };
  
  if (lower.includes("বিউটি") || lower.includes("সেলুন") || lower.includes("পার্লার") || lower.includes("জেন্টস") || lower.includes("লেডিজ"))
    return { gradient: "linear-gradient(135deg, #880e4f, #e91e63)", emoji: "✂️" };
  
  if (lower.includes("শিক্ষা") || lower.includes("কোচিং") || lower.includes("স্কুল") || lower.includes("কলেজ") || lower.includes("ট্রেনিং"))
    return { gradient: "linear-gradient(135deg, #e65100, #ff9800)", emoji: "📚" };
  
  if (lower.includes("হোটেল") || lower.includes("আবাসন") || lower.includes("রিসোর্ট"))
    return { gradient: "linear-gradient(135deg, #1a3d2b, #2d6a4f)", emoji: "🏨" };
  
  if (lower.includes("মোবাইল") || lower.includes("রিপেয়ার"))
    return { gradient: "linear-gradient(135deg, #37474f, #607d8b)", emoji: "🔧" };
  
  if (lower.includes("কমিউনিটি") || lower.includes("হল"))
    return { gradient: "linear-gradient(135deg, #4e342e, #795548)", emoji: "🏛️" };
  
  if (lower.includes("বিকাশ") || lower.includes("নগদ") || lower.includes("রকেট") || lower.includes("mfs"))
    return { gradient: "linear-gradient(135deg, #e91e63, #f06292)", emoji: "📲" };
  
  if (lower.includes("নির্মাণ") || lower.includes("বাড়ি"))
    return { gradient: "linear-gradient(135deg, #5d4037, #8d6e63)", emoji: "🔨" };
  
  return { gradient: "linear-gradient(135deg, #1a3d2b, #c9a84c)", emoji: "🏪" };
};
