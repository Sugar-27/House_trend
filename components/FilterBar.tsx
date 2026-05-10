import { filters } from "@/lib/mockData";

export function FilterBar() {
  return (
    <section className="filter-bar" aria-label="全局筛选条件">
      <div>
        <span>城市</span>
        <strong>{filters.city}</strong>
      </div>
      <div>
        <span>房屋类型</span>
        <strong>一手房</strong>
      </div>
      <div>
        <span>区域</span>
        <strong>全市</strong>
      </div>
      <div>
        <span>时间范围</span>
        <strong>近90天</strong>
      </div>
    </section>
  );
}

