import { FilterBar } from "@/components/FilterBar";
import { InsightPanel } from "@/components/InsightPanel";
import { MetricGrid } from "@/components/MetricGrid";
import { PageHeader } from "@/components/PageHeader";
import { SimpleChart } from "@/components/SimpleChart";
import { districtTrend, reportInsights, trendData } from "@/lib/mockData";

const reportMetrics = [
  { label: "价格动能", value: "温和上行", caption: "连续3个月", change: "+3.8%", tone: "up" as const },
  { label: "成交动能", value: "显著修复", caption: "4月环比", change: "+14.3%", tone: "up" as const },
  { label: "区域分化", value: "中高", caption: "外环外更活跃", change: "扩大", tone: "neutral" as const },
  { label: "市场判断", value: "稳中偏强", caption: "短期观察", change: "谨慎乐观", tone: "neutral" as const },
];

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Trend Report"
        title="趋势分析报告"
        description="同时观察上海整体市场和不同区域的成交、价格、热度变化，生成可读性强的市场研判。"
      />
      <FilterBar />
      <MetricGrid metrics={reportMetrics} />
      <section className="dashboard-grid">
        <SimpleChart title="城市成交金额趋势" data={trendData} valueKey="amount" labelKey="label" unit="亿" />
        <SimpleChart title="城市成交面积趋势" data={trendData} valueKey="area" labelKey="label" unit="万㎡" />
        <article className="panel district-table-panel">
          <div className="panel-heading">
            <h2>区域趋势对比</h2>
            <span>价格 / 成交 / 热度</span>
          </div>
          <div className="district-table">
            {districtTrend.map((item) => (
              <div className="district-row" key={item.district}>
                <strong>{item.district}</strong>
                <span>价格 +{item.priceChange}%</span>
                <span>成交 +{item.volumeChange}%</span>
                <div className="heat-meter"><em style={{ width: `${item.heat}%` }} /></div>
              </div>
            ))}
          </div>
        </article>
        <InsightPanel title="自动分析报告" items={reportInsights} />
      </section>
    </>
  );
}

