type SimpleChartProps<T> = {
  title: string;
  data: T[];
  valueKey: keyof T;
  labelKey: keyof T;
  unit?: string;
  variant?: "line" | "bar";
};

export function SimpleChart<T extends object>({
  title,
  data,
  valueKey,
  labelKey,
  unit = "",
  variant = "bar",
}: SimpleChartProps<T>) {
  const values = data.map((item) => Number(item[valueKey]));
  const max = Math.max(...values);
  const min = Math.min(...values);

  return (
    <article className="panel chart-panel">
      <div className="panel-heading">
        <h2>{title}</h2>
        <span>Mock 数据</span>
      </div>
      <div className={`simple-chart chart-${variant}`}>
        {data.map((item) => {
          const value = Number(item[valueKey]);
          const height = Math.max(12, ((value - min) / Math.max(1, max - min)) * 74 + 18);
          return (
            <div className="chart-item" key={String(item[labelKey])}>
              <div className="chart-value">{value.toLocaleString("zh-CN")}{unit}</div>
              <div className="bar-track">
                <span style={{ height: `${height}%` }} />
              </div>
              <small>{String(item[labelKey]).replace("2026-", "")}</small>
            </div>
          );
        })}
      </div>
    </article>
  );
}
