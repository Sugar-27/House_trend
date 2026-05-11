import { CalendarGrid } from "@/components/CalendarGrid";
import { FilterBar } from "@/components/FilterBar";
import { MetricGrid } from "@/components/MetricGrid";
import { PageHeader } from "@/components/PageHeader";
import { getFilteredMarketData, normalizeFilters, type SearchParams } from "@/lib/mockData";
import { formatArea, formatCurrency, formatNumber } from "@/lib/formatters";

export default function TransactionsPage({ searchParams }: { searchParams?: SearchParams }) {
  const activeFilters = normalizeFilters(searchParams);
  const marketData = getFilteredMarketData(activeFilters);
  const metrics = [
    { label: "月成交套数", value: `${formatNumber(marketData.monthlySummary.volume)} 套`, change: "+8.9%", tone: "up" as const, caption: marketData.rangeLabel },
    { label: "月成交面积", value: formatArea(marketData.monthlySummary.area), change: "+7.1%", tone: "up" as const, caption: "环比" },
    { label: "月成交金额", value: formatCurrency(marketData.monthlySummary.amount), change: "+6.4%", tone: "up" as const, caption: "环比" },
    { label: "月成交均价", value: `${formatNumber(marketData.monthlySummary.avgPrice)} 元/㎡`, change: "+2.2%", tone: "up" as const, caption: "环比" },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Transaction Calendar"
        title={`${activeFilters.city}成交数据日历`}
        description={`按 ${marketData.rangeLabel} 查看${activeFilters.district} ${activeFilters.houseType === "new" ? "一手房" : "二手房"}每日成交套数、成交均价、成交面积和成交金额。`}
      />
      <FilterBar activeFilters={activeFilters} />
      <MetricGrid metrics={metrics} />
      <CalendarGrid days={marketData.calendarDays} activeFilters={activeFilters} />
    </>
  );
}
