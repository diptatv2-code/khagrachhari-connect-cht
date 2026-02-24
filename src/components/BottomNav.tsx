interface Props {
  activePage: string;
  onNavigate: (id: string, type: "page" | "service") => void;
}

const tabs = [
  { id: "home", label: "হোম", emoji: "🏠", type: "page" as const },
  { id: "hotels", label: "হোটেল", emoji: "🏨", type: "page" as const },
  { id: "tourist", label: "পর্যটন", emoji: "🗺️", type: "page" as const },
  { id: "health", label: "সেবা", emoji: "📋", type: "service" as const },
];

const BottomNav = ({ activePage, onNavigate }: Props) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-[0_-3px_14px_rgba(0,0,0,0.08)] z-[200] flex">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onNavigate(tab.id, tab.type)}
          className={`flex-1 flex flex-col items-center justify-center py-[7px] pb-[5px] text-[9.5px] border-none bg-transparent gap-[2px] ${
            activePage === tab.id ? "text-[hsl(var(--green-mid))]" : "text-muted-foreground"
          }`}
        >
          <span className="text-[19px]">{tab.emoji}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
