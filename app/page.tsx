import Link from "next/link";
import { EChartsPanel } from "@/components/EChartsPanel";
import { FilterBar } from "@/components/FilterBar";
import { InsightPanel } from "@/components/InsightPanel";
import { MetricGrid } from "@/components/MetricGrid";
import { PageHeader } from "@/components/PageHeader";
import { RankingList } from "@/components/RankingList";
import { dashboardSummary, reportInsights, trendData } from "@/lib/mockData";

const featureCards = [
  { href: "/transactions", title: "成交数据", text: "按日历查看每日成交套数、面积、均价和金额。" },
  { href: "/reports", title: "趋势分析报告", text: "从城市整体和区域维度理解楼市趋势变化。" },
  { href: "/rates", title: "楼市利率", text: "跟踪商贷、公积金、首付比例与 SHIBOR 变化。" },
];

export default function HomePage() {
  return (
    <>
      <PageHeader
        eyebrow="Shanghai Housing Market Intelligence"
        title="上海房屋市场趋势分析看板"
        description="以 Mock 数据先打通产品闭环，聚合成交、价格、区域热度和利率指标，后续可平滑接入 Go 后端与 MySQL 历史数据。"
      />
      <FilterBar />
      <MetricGrid metrics={dashboardSummary} />

      <section className="dashboard-grid">
        <EChartsPanel
          title="成交均价趋势"
          data={trendData}
          labelKey="label"
          series={[{ name: "成交均价", valueKey: "price", unit: " 元/㎡", type: "line" }]}
        />
        <EChartsPanel
          title="成交量趋势"
          data={trendData}
          labelKey="label"
          series={[{ name: "成交套数", valueKey: "volume", unit: " 套", type: "bar" }]}
        />
        <RankingList />
        <InsightPanel title="市场核心摘要" items={reportInsights} />
      </section>

      <section className="feature-grid">
        {featureCards.map((card) => (
          <Link className="feature-card" href={card.href} key={card.href}>
            <span>进入</span>
            <h2>{card.title}</h2>
            <p>{card.text}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
