const ITEMS = [
  "10,000+ sellers",
  "5M+ products",
  "Delivery to 7 countries",
  "Secure payments",
  "Mobile money supported",
  "14-day easy returns",
  "24/7 customer support",
];

const row = [...ITEMS, ...ITEMS];

export function TrustTicker() {
  return (
    <div className="border-y border-border bg-card/50">
      <div className="no-scrollbar overflow-hidden">
        <div className="flex w-max animate-marquee gap-12 py-4 pr-12">
          {row.map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="whitespace-nowrap font-medium">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
