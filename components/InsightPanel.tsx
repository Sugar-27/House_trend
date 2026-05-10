export function InsightPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="panel insight-panel">
      <div className="panel-heading">
        <h2>{title}</h2>
        <span>规则生成摘要</span>
      </div>
      <div className="insight-list">
        {items.map((item, index) => (
          <p key={item}>
            <strong>{String(index + 1).padStart(2, "0")}</strong>
            {item}
          </p>
        ))}
      </div>
    </article>
  );
}

