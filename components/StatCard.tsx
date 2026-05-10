type StatCardProps = {
  label: string;
  value: string;
  caption?: string;
  change?: string;
  tone?: "up" | "down" | "neutral";
};

export function StatCard({ label, value, caption, change, tone = "neutral" }: StatCardProps) {
  return (
    <article className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {(caption || change) && (
        <p>
          {caption && <span>{caption}</span>}
          {change && <em className={`tone-${tone}`}>{change}</em>}
        </p>
      )}
    </article>
  );
}

