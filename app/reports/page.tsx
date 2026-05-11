import { EChartsPanel } from "@/components/EChartsPanel";
import { FilterBar } from "@/components/FilterBar";
import { InsightPanel } from "@/components/InsightPanel";
import { MetricGrid } from "@/components/MetricGrid";
import { PageHeader } from "@/components/PageHeader";
import { getFilteredMarketData, normalizeFilters, type SearchParams } from "@/lib/mockData";

export default function ReportsPage({ searchParams }: { searchParams?: SearchParams }) {
  const activeFilters = normalizeFilters(searchParams);
  const marketData = getFilteredMarketData(activeFilters);
  const latest = marketData.trendData[marketData.trendData.length - 1];
  const reportMetrics = [
    { label: "价格动能", value: latest.price >= 60000 ? "高位运行" : "温和运行", caption: marketData.rangeLabel, change: marketData.dashboardSummary[0].change, tone: marketData.dashboardSummary[0].tone },
    { label: "成交动能", value: latest.volume >= 7000 ? "显著修复" : "结构修复", caption: "最新周期", change: marketData.dashboardSummary[1].change, tone: marketData.dashboardSummary[1].tone },
    { label: "区域分化", value: activeFilters.district === "全市" ? "中高" : "聚焦单区", caption: activeFilters.district, change: "联动", tone: "neutral" as const },
    { label: "市场判断", value: latest.volume >= 6000 ? "稳中偏强" : "谨慎观察", caption: "筛选后", change: "动态", tone: "neutral" as const },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Trend Report"
        title={`${activeFilters.city}趋势分析报告`}
        description={`同时观察${activeFilters.district} ${activeFilters.houseType === "new" ? "一手房" : "二手房"}在${marketData.rangeLabel}内的成交、价格、热度变化，生成可读性强的市场研判。`}
      />
      <FilterBar activeFilters={activeFilters} />
      <MetricGrid metrics={reportMetrics} />
      <section className="dashboard-grid">
        <EChartsPanel
          title="城市成交金额趋势"
          data={marketData.trendData}
          labelKey="label"
          series={[{ name: "成交金额", valueKey: "amount", unit: " 亿元", type: "bar" }]}
        />
        <EChartsPanel
          title="城市成交面积趋势"
          data={marketData.trendData}
          labelKey="label"
          series={[{ name: "成交面积", valueKey: "area", unit: " 万㎡", type: "line" }]}
        />
        <article className="panel district-table-panel">
          <div className="panel-heading">
            <h2>区域趋势对比</h2>
            <span>价格 / 成交 / 热度</span>
          </div>
          <div className="district-table">
            {marketData.districtTrend.map((item) => (
              <div className="district-row" key={item.district}>
                <strong>{item.district}</strong>
                <span>价格 +{item.priceChange}%</span>
                <span>成交 +{item.volumeChange}%</span>
                <div className="heat-meter"><em style={{ width: `${item.heat}%` }} /></div>
              </div>
            ))}
          </div>
        </article>
        <InsightPanel title="自动分析报告" items={marketData.reportInsights} />
      </section>
    </>
  );
}
