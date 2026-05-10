import { calendarDays } from "@/lib/mockData";

export function CalendarGrid() {
  return (
    <article className="panel calendar-panel">
      <div className="panel-heading">
        <h2>2026年5月成交日历</h2>
        <span>上海 · 一手房</span>
      </div>
      <div className="calendar-weekdays">
        {['一', '二', '三', '四', '五', '六', '日'].map((day) => <span key={day}>周{day}</span>)}
      </div>
      <div className="calendar-grid">
        {calendarDays.map((item) => (
          <div className={`calendar-cell heat-${item.heat}`} key={item.day}>
            <div className="calendar-day">
              <strong>{item.day}</strong>
              <span>周{item.weekday}</span>
            </div>
            <p>{item.volume} 套</p>
            <small>{item.price.toLocaleString("zh-CN")} 元/㎡</small>
            <small>{(item.area / 10000).toFixed(1)} 万㎡</small>
          </div>
        ))}
      </div>
    </article>
  );
}

