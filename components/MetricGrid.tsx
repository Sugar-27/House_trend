import { StatCard } from "@/components/StatCard";

type Metric = {
  label: string;
  value: string;
  caption?: string;
  change?: string;
  tone?: "up" | "down" | "neutral";
};

export function MetricGrid({ metrics }: { metrics: readonly Metric[] }) {
  return (
    <section className="metric-grid">
      {metrics.map((metric) => (
        <StatCard key={metric.label} {...metric} />
      ))}
    </section>
  );
}

