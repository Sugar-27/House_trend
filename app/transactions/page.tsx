import { CalendarGrid } from "@/components/CalendarGrid";
import { FilterBar } from "@/components/FilterBar";
import { MetricGrid } from "@/components/MetricGrid";
import { PageHeader } from "@/components/PageHeader";
import { monthlySummary } from "@/lib/mockData";
import { formatArea, formatCurrency, formatNumber } from "@/lib/formatters";

const metrics = [
  { label: "月成交套数", value: `${formatNumber(monthlySummary.volume)} 套`, change: "+8.9%", tone: "up" as const, caption: "环比" },
  { label: "月成交面积", value: formatArea(monthlySummary.area), change: "+7.1%", tone: "up" as const, caption: "环比" },
  { label: "月成交金额", value: formatCurrency(monthlySummary.amount), change: "+6.4%", tone: "up" as const, caption: "环比" },
  { label: "月成交均价", value: `${formatNumber(monthlySummary.avgPrice)} 元/㎡`, change: "+2.2%", tone: "up" as const, caption: "环比" },
];

export default function TransactionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Transaction Calendar"
        title="成交数据日历"
        description="按自然月查看每日成交套数、成交均价、成交面积和成交金额，并通过热度底色快速识别活跃日期。"
      />
      <FilterBar />
      <MetricGrid metrics={metrics} />
      <CalendarGrid />
    </>
  );
}

