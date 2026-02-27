export interface TransportEntry {
  name: string;
  type: "বাস" | "চাঁদের গাড়ি" | "সিএনজি" | "মোটরবাইক";
  route: string;
  departures?: string;
  counter?: string;
  fare: string;
  duration?: string;
  busType?: string;
  note?: string;
}

export const transportEntries: TransportEntry[] = [
  {
    name: "শান্তি পরিবহন",
    type: "বাস",
    route: "ঢাকা → খাগড়াছড়ি",
    departures: "রাত ৯:৩০, ১০:০০, ১০:৩০",
    counter: "কলাবাগান, ঢাকা",
    fare: "৳৭৫০–৯০০",
    duration: "৭-৮ ঘণ্টা",
    busType: "AC / Non-AC",
  },
  {
    name: "দেশ ট্রাভেলস",
    type: "বাস",
    route: "ঢাকা → খাগড়াছড়ি",
    departures: "রাত ১০:০০, ১১:০০",
    counter: "ফকিরাপুল, ঢাকা",
    fare: "৳৮০০–১০০০",
    duration: "৭-৮ ঘণ্টা",
  },
  {
    name: "ইকোনো সার্ভিস",
    type: "বাস",
    route: "ঢাকা → খাগড়াছড়ি",
    departures: "রাত ৯:০০, ১০:০০",
    counter: "সায়েদাবাদ, ঢাকা",
    fare: "৳৭০০–৮৫০",
  },
  {
    name: "এস. আলম সার্ভিস",
    type: "বাস",
    route: "ঢাকা → খাগড়াছড়ি",
    departures: "রাত ১০:৩০",
    counter: "কমলাপুর, ঢাকা",
    fare: "৳৮৫০–১১০০",
    busType: "AC",
  },
  {
    name: "শ্যামলী পরিবহন",
    type: "বাস",
    route: "ঢাকা → খাগড়াছড়ি",
    counter: "কল্যাণপুর, ঢাকা",
    fare: "৳৭৫০–৯৫০",
  },
  {
    name: "পূর্বাণী পরিবহন",
    type: "বাস",
    route: "চট্টগ্রাম → খাগড়াছড়ি",
    departures: "সকাল ৬টা - বিকাল ৫টা (প্রতি ঘণ্টায়)",
    counter: "অক্সিজেন মোড়, চট্টগ্রাম",
    fare: "৳১৫০–২০০",
    duration: "৩-৪ ঘণ্টা",
  },
  {
    name: "বিআরটিসি (সরকারি বাস)",
    type: "বাস",
    route: "চট্টগ্রাম → খাগড়াছড়ি",
    fare: "৳১৩০–১৮০",
  },
  {
    name: "চাঁদের গাড়ি (সাজেক ট্যুর)",
    type: "চাঁদের গাড়ি",
    route: "খাগড়াছড়ি → সাজেক ভ্যালি",
    fare: "৳৮,০০০–১২,০০০ (পুরো গাড়ি)",
    duration: "২-৩ ঘণ্টা",
    note: "আগে থেকে বুকিং দিতে হয়",
  },
  {
    name: "সিএনজি অটোরিকশা",
    type: "সিএনজি",
    route: "শহরের মধ্যে যেকোনো জায়গা",
    fare: "৳৩০–১৫০",
  },
  {
    name: "মোটরবাইক ভাড়া",
    type: "মোটরবাইক",
    route: "শহরের আশেপাশে",
    fare: "৳৮০–১০০/ঘণ্টা",
  },
];
