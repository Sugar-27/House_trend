import { FilterBar } from "@/components/FilterBar";
import { MetricGrid } from "@/components/MetricGrid";
import { PageHeader } from "@/components/PageHeader";
import { SimpleChart } from "@/components/SimpleChart";
import { rateCards, rateTrend } from "@/lib/mockData";

const rateInsights = [
  "当前商贷首套利率处于近半年低位，贷款成本边际下降，有助于改善型需求释放。",
  "公积金贷款利率保持稳定，对刚需客群仍具备明显成本优势。",
  "首付比例维持稳定，短期政策关注点更偏向信贷执行节奏和区域库存去化。",
];

export default function RatesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Mortgage & Rate Monitor"
        title="楼市利率"
        description="聚合商业贷款、公积金贷款、首付比例与 SHIBOR 参考指标，为市场趋势判断补充金融侧视角。"
      />
      <FilterBar />
      <MetricGrid metrics={rateCards.map((item) => ({ ...item, tone: "neutral" as const }))} />
      <section className="dashboard-grid">
        <SimpleChart title="商业贷款利率趋势" data={rateTrend} valueKey="commercial" labelKey="label" unit="%" />
        <SimpleChart title="公积金贷款利率趋势" data={rateTrend} valueKey="provident" labelKey="label" unit="%" />
        <SimpleChart title="SHIBOR 参考趋势" data={rateTrend} valueKey="shibor" labelKey="label" unit="%" />
        <article className="panel insight-panel">
          <div className="panel-heading">
            <h2>利率解读</h2>
            <span>Mock 分析</span>
          </div>
          <div className="insight-list">
            {rateInsights.map((item, index) => (
              <p key={item}><strong>{String(index + 1).padStart(2, "0")}</strong>{item}</p>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

