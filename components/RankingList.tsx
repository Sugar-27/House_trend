type RankingItem = {
  name: string;
  volume: number;
  price: number;
  change: string;
};

export function RankingList({ items }: { items: RankingItem[] }) {
  const max = Math.max(...items.map((item) => item.volume), 1);

  return (
    <article className="panel ranking-panel">
      <div className="panel-heading">
        <h2>区域成交热度</h2>
        <span>按成交套数排序</span>
      </div>
      <div className="ranking-list">
        {items.map((item) => (
          <div className="ranking-item" key={item.name}>
            <div>
              <strong>{item.name}</strong>
              <span>{item.price.toLocaleString("zh-CN")} 元/㎡ · {item.change}</span>
            </div>
            <div className="ranking-bar" aria-hidden="true">
              <span style={{ width: `${(item.volume / max) * 100}%` }} />
            </div>
            <em>{item.volume.toLocaleString("zh-CN")} 套</em>
          </div>
        ))}
      </div>
    </article>
  );
}
