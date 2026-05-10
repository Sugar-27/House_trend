export type HouseType = "new" | "second";

export type TrendPoint = {
  label: string;
  price: number;
  volume: number;
  area: number;
  amount: number;
};

export type CalendarDay = {
  day: number;
  weekday: string;
  price: number;
  volume: number;
  area: number;
  amount: number;
  heat: "low" | "medium" | "high";
};

export const filters = {
  city: "上海",
  districts: ["全市", "浦东", "闵行", "徐汇", "静安", "杨浦", "宝山", "嘉定"],
  houseTypes: [
    { label: "一手房", value: "new" },
    { label: "二手房", value: "second" },
  ],
  ranges: ["近30天", "近90天", "近1年"],
};

export const dashboardSummary = [
  { label: "成交均价", value: "68,420 元/㎡", change: "+3.8%", tone: "up", caption: "较上月" },
  { label: "本月成交", value: "8,936 套", change: "+11.2%", tone: "up", caption: "环比" },
  { label: "成交面积", value: "96.4 万㎡", change: "+7.5%", tone: "up", caption: "环比" },
  { label: "成交金额", value: "659.5 亿元", change: "-1.6%", tone: "down", caption: "较上周" },
] as const;

export const trendData: TrendPoint[] = [
  { label: "2025-11", price: 64100, volume: 6130, area: 71.2, amount: 456.4 },
  { label: "2025-12", price: 64880, volume: 7060, area: 81.8, amount: 530.8 },
  { label: "2026-01", price: 65220, volume: 5880, area: 67.6, amount: 441.0 },
  { label: "2026-02", price: 65860, volume: 5310, area: 62.1, amount: 409.1 },
  { label: "2026-03", price: 67140, volume: 7820, area: 89.4, amount: 600.2 },
  { label: "2026-04", price: 68420, volume: 8936, area: 96.4, amount: 659.5 },
];

export const districtRanking = [
  { name: "浦东新区", volume: 1640, price: 72400, change: "+13.1%" },
  { name: "闵行区", volume: 1180, price: 64100, change: "+9.6%" },
  { name: "宝山区", volume: 1046, price: 53100, change: "+6.8%" },
  { name: "嘉定区", volume: 936, price: 48700, change: "+5.4%" },
  { name: "徐汇区", volume: 512, price: 103200, change: "+2.7%" },
];

const weekdays = ["一", "二", "三", "四", "五", "六", "日"];

export const calendarDays: CalendarDay[] = Array.from({ length: 31 }, (_, index) => {
  const day = index + 1;
  const weekendBoost = day % 6 === 0 || day % 7 === 0 ? 42 : 0;
  const volume = 160 + ((day * 37) % 210) + weekendBoost;
  const price = 65500 + ((day * 281) % 4600);
  const area = Number((volume * (92 + (day % 8))).toFixed(1));
  const amount = Number(((price * area) / 100000000).toFixed(2));
  return {
    day,
    weekday: weekdays[index % 7],
    price,
    volume,
    area,
    amount,
    heat: volume > 330 ? "high" : volume > 240 ? "medium" : "low",
  };
});

export const monthlySummary = {
  month: "2026年5月",
  volume: calendarDays.reduce((sum, item) => sum + item.volume, 0),
  area: Number((calendarDays.reduce((sum, item) => sum + item.area, 0) / 10000).toFixed(1)),
  amount: Number(calendarDays.reduce((sum, item) => sum + item.amount, 0).toFixed(1)),
  avgPrice: Math.round(calendarDays.reduce((sum, item) => sum + item.price, 0) / calendarDays.length),
};

export const reportInsights = [
  "上海整体成交热度自 3 月以来持续修复，4 月成交套数环比增长 14.3%，改善型需求释放明显。",
  "区域结构上，浦东新区继续贡献最高成交量，闵行、宝山承接刚需与改善需求，中心城区维持高单价、低波动特征。",
  "价格层面，全市均价连续三个月温和上行，但区域分化明显，外环外成交量回升快于核心区。",
];

export const districtTrend = [
  { district: "浦东", priceChange: 4.8, volumeChange: 13.1, heat: 96 },
  { district: "闵行", priceChange: 3.2, volumeChange: 9.6, heat: 82 },
  { district: "徐汇", priceChange: 2.1, volumeChange: 2.7, heat: 64 },
  { district: "静安", priceChange: 1.6, volumeChange: 1.9, heat: 57 },
  { district: "宝山", priceChange: 2.9, volumeChange: 6.8, heat: 74 },
];

export const rateCards = [
  { label: "商业贷款首套", value: "3.45%", caption: "5年期以上 LPR 参考", change: "持平" },
  { label: "商业贷款二套", value: "3.85%", caption: "主流银行执行区间", change: "-10BP" },
  { label: "公积金首套", value: "2.85%", caption: "5年期以上", change: "持平" },
  { label: "首套首付比例", value: "20%", caption: "普通住宅参考", change: "稳定" },
] as const;

export const rateTrend = [
  { label: "2025-11", commercial: 3.75, provident: 3.1, shibor: 1.72 },
  { label: "2025-12", commercial: 3.65, provident: 3.1, shibor: 1.68 },
  { label: "2026-01", commercial: 3.65, provident: 2.95, shibor: 1.66 },
  { label: "2026-02", commercial: 3.55, provident: 2.95, shibor: 1.61 },
  { label: "2026-03", commercial: 3.45, provident: 2.85, shibor: 1.58 },
  { label: "2026-04", commercial: 3.45, provident: 2.85, shibor: 1.54 },
];

