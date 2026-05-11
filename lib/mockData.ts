export type HouseType = "new" | "second";
export type City = "上海" | "杭州" | "苏州";
export type PresetTimeRange = "近30天" | "近90天" | "近1年";
export type TimeRange = PresetTimeRange | "自定义";

export type MarketFilterState = {
  city: City;
  district: string;
  houseType: HouseType;
  range: TimeRange;
  startDate: string;
  endDate: string;
  warning?: string;
};

export type SearchParams = Record<string, string | string[] | undefined>;

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
  city: "上海" as City,
  cities: ["上海", "杭州", "苏州"] as City[],
  districtsByCity: {
    上海: [
      "全市",
      "黄浦区",
      "徐汇区",
      "长宁区",
      "静安区",
      "普陀区",
      "虹口区",
      "杨浦区",
      "闵行区",
      "宝山区",
      "嘉定区",
      "浦东新区",
      "金山区",
      "松江区",
      "青浦区",
      "奉贤区",
      "崇明县",
    ],
    杭州: ["全市", "西湖", "上城", "拱墅", "滨江", "萧山", "余杭", "临平"],
    苏州: ["全市", "工业园区", "姑苏", "吴中", "相城", "虎丘", "吴江", "昆山"],
  } satisfies Record<City, string[]>,
  houseTypes: [
    { label: "一手房", value: "new" },
    { label: "二手房", value: "second" },
  ],
  ranges: ["近30天", "近90天", "近1年"] as PresetTimeRange[],
};

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function getTodayDate() {
  return formatDate(new Date());
}

export const dateRangeBounds = {
  min: formatDate(addDays(new Date(`${getTodayDate()}T00:00:00`), -365)),
  max: getTodayDate(),
};

export const defaultFilters: MarketFilterState = {
  city: filters.city,
  district: "全市",
  houseType: "new",
  range: "近90天",
  startDate: formatDate(addDays(new Date(`${dateRangeBounds.max}T00:00:00`), -90)),
  endDate: dateRangeBounds.max,
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
  { district: "浦东新区", priceChange: 4.8, volumeChange: 13.1, heat: 96 },
  { district: "闵行区", priceChange: 3.2, volumeChange: 9.6, heat: 82 },
  { district: "徐汇区", priceChange: 2.1, volumeChange: 2.7, heat: 64 },
  { district: "静安区", priceChange: 1.6, volumeChange: 1.9, heat: 57 },
  { district: "宝山区", priceChange: 2.9, volumeChange: 6.8, heat: 74 },
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

const cityFactors: Record<City, { price: number; volume: number; rate: number }> = {
  上海: { price: 1, volume: 1, rate: 1 },
  杭州: { price: 0.68, volume: 0.82, rate: 1.02 },
  苏州: { price: 0.54, volume: 0.72, rate: 0.98 },
};

const districtFactors: Record<string, { price: number; volume: number; heat: number }> = {
  全市: { price: 1, volume: 1, heat: 1 },
  黄浦区: { price: 1.62, volume: 0.28, heat: 0.72 },
  徐汇区: { price: 1.48, volume: 0.42, heat: 0.82 },
  长宁区: { price: 1.36, volume: 0.34, heat: 0.76 },
  静安区: { price: 1.52, volume: 0.36, heat: 0.74 },
  普陀区: { price: 1.02, volume: 0.58, heat: 0.82 },
  虹口区: { price: 1.18, volume: 0.38, heat: 0.74 },
  杨浦区: { price: 1.04, volume: 0.55, heat: 0.86 },
  闵行区: { price: 0.94, volume: 0.78, heat: 0.96 },
  宝山区: { price: 0.78, volume: 0.72, heat: 0.88 },
  嘉定区: { price: 0.72, volume: 0.65, heat: 0.8 },
  浦东新区: { price: 1.08, volume: 0.92, heat: 1.08 },
  金山区: { price: 0.54, volume: 0.44, heat: 0.64 },
  松江区: { price: 0.74, volume: 0.68, heat: 0.82 },
  青浦区: { price: 0.76, volume: 0.62, heat: 0.78 },
  奉贤区: { price: 0.58, volume: 0.56, heat: 0.7 },
  崇明县: { price: 0.46, volume: 0.22, heat: 0.5 },
  西湖: { price: 1.18, volume: 0.58, heat: 0.88 },
  上城: { price: 1.12, volume: 0.62, heat: 0.86 },
  拱墅: { price: 0.94, volume: 0.72, heat: 0.84 },
  滨江: { price: 1.08, volume: 0.66, heat: 0.9 },
  萧山: { price: 0.82, volume: 0.82, heat: 0.92 },
  余杭: { price: 0.78, volume: 0.86, heat: 0.94 },
  临平: { price: 0.72, volume: 0.7, heat: 0.76 },
  工业园区: { price: 1.2, volume: 0.62, heat: 0.9 },
  姑苏: { price: 1.08, volume: 0.52, heat: 0.82 },
  吴中: { price: 0.86, volume: 0.76, heat: 0.86 },
  相城: { price: 0.78, volume: 0.72, heat: 0.8 },
  虎丘: { price: 0.92, volume: 0.58, heat: 0.78 },
  吴江: { price: 0.72, volume: 0.82, heat: 0.84 },
  昆山: { price: 0.76, volume: 0.86, heat: 0.88 },
};

const houseTypeFactors: Record<HouseType, { price: number; volume: number; label: string }> = {
  new: { price: 1, volume: 1, label: "一手房" },
  second: { price: 0.92, volume: 1.24, label: "二手房" },
};

function getPresetDateRanges(): Record<PresetTimeRange, { startDate: string; endDate: string; trendSize: number }> {
  const today = new Date(`${dateRangeBounds.max}T00:00:00`);
  return {
    近30天: { startDate: formatDate(addDays(today, -30)), endDate: dateRangeBounds.max, trendSize: 2 },
    近90天: { startDate: formatDate(addDays(today, -90)), endDate: dateRangeBounds.max, trendSize: 4 },
    近1年: { startDate: formatDate(addDays(today, -365)), endDate: dateRangeBounds.max, trendSize: trendData.length },
  };
}

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isDateLike(value: string | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime());
}

function normalizeDate(value: string, today: string) {
  if (value > today) {
    return today;
  }
  if (value < dateRangeBounds.min) {
    return dateRangeBounds.min;
  }
  return value;
}

function getDayDiff(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T00:00:00`).getTime();
  const end = new Date(`${endDate}T00:00:00`).getTime();
  return Math.max(1, Math.round((end - start) / 86400000) + 1);
}

function getRangeLabel(activeFilters: MarketFilterState) {
  return activeFilters.range === "自定义"
    ? `${activeFilters.startDate} 至 ${activeFilters.endDate}`
    : activeFilters.range;
}

function getTrendSize(activeFilters: MarketFilterState) {
  if (activeFilters.range !== "自定义") {
    return getPresetDateRanges()[activeFilters.range].trendSize;
  }

  const days = getDayDiff(activeFilters.startDate, activeFilters.endDate);
  if (days <= 31) {
    return 2;
  }
  if (days <= 92) {
    return 4;
  }
  return trendData.length;
}

export function normalizeFilters(searchParams: SearchParams = {}): MarketFilterState {
  const today = getTodayDate();
  const presetDateRanges = getPresetDateRanges();
  const cityParam = getSingleParam(searchParams.city);
  const city = filters.cities.includes(cityParam as City) ? (cityParam as City) : defaultFilters.city;
  const districts = filters.districtsByCity[city];
  const districtParam = getSingleParam(searchParams.district);
  const district = districtParam && districts.includes(districtParam) ? districtParam : "全市";
  const houseTypeParam = getSingleParam(searchParams.houseType);
  const houseType = filters.houseTypes.some((item) => item.value === houseTypeParam)
    ? (houseTypeParam as HouseType)
    : defaultFilters.houseType;
  const rangeParam = getSingleParam(searchParams.range);
  const presetRange = filters.ranges.includes(rangeParam as PresetTimeRange) ? (rangeParam as PresetTimeRange) : undefined;
  const rawStartDate = getSingleParam(searchParams.startDate);
  const rawEndDate = getSingleParam(searchParams.endDate);

  if (presetRange) {
    return { city, district, houseType, range: presetRange, ...presetDateRanges[presetRange] };
  }

  const hasCustomDates = isDateLike(rawStartDate) && isDateLike(rawEndDate);
  const hasFutureDate = (isDateLike(rawStartDate) && (rawStartDate as string) > today)
    || (isDateLike(rawEndDate) && (rawEndDate as string) > today);
  const warning = hasFutureDate ? `时间选错了：结束日期最多只能选择到今天（${today}），已按今天重新计算。` : undefined;

  if (hasCustomDates) {
    const startDate = normalizeDate(rawStartDate as string, today);
    const endDate = normalizeDate(rawEndDate as string, today);
    return startDate <= endDate
      ? { city, district, houseType, range: "自定义", startDate, endDate, warning }
      : { city, district, houseType, range: "自定义", startDate: endDate, endDate: startDate, warning };
  }

  return { city, district, houseType, range: defaultFilters.range, ...presetDateRanges[defaultFilters.range as PresetTimeRange] };
}

function getCompositeFactor(activeFilters: MarketFilterState) {
  const city = cityFactors[activeFilters.city];
  const district = districtFactors[activeFilters.district] ?? districtFactors["全市"];
  const houseType = houseTypeFactors[activeFilters.houseType];

  return {
    price: city.price * district.price * houseType.price,
    volume: city.volume * district.volume * houseType.volume,
    heat: district.heat,
    rate: city.rate,
  };
}

function toTrendChange(current: number, previous: number) {
  const value = ((current - previous) / previous) * 100;
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function getHeat(volume: number): CalendarDay["heat"] {
  if (volume > 330) {
    return "high";
  }
  if (volume > 240) {
    return "medium";
  }
  return "low";
}

function formatDistrictName(district: string) {
  if (district === "全市" || district.endsWith("区") || district.endsWith("县")) {
    return district;
  }
  return `${district}区`;
}

export function getFilteredMarketData(activeFilters: MarketFilterState) {
  const factor = getCompositeFactor(activeFilters);
  const rangeLabel = getRangeLabel(activeFilters);
  const filteredTrendData = trendData.slice(-getTrendSize(activeFilters)).map((item) => {
    const price = Math.round(item.price * factor.price);
    const volume = Math.max(80, Math.round(item.volume * factor.volume));
    const area = Number((item.area * factor.volume).toFixed(1));
    const amount = Number(((price * area) / 10000).toFixed(1));

    return { ...item, price, volume, area, amount };
  });
  const current = filteredTrendData[filteredTrendData.length - 1];
  const previous = filteredTrendData[Math.max(0, filteredTrendData.length - 2)];
  const filteredCalendarDays = calendarDays.filter((item) => {
    const date = `2026-05-${String(item.day).padStart(2, "0")}`;
    return date >= activeFilters.startDate && date <= activeFilters.endDate;
  }).map((item) => {
    const price = Math.round(item.price * factor.price);
    const volume = Math.max(18, Math.round(item.volume * factor.volume));
    const area = Number((item.area * factor.volume).toFixed(1));
    const amount = Number(((price * area) / 100000000).toFixed(2));

    return {
      ...item,
      price,
      volume,
      area,
      amount,
      heat: getHeat(volume),
    };
  });
  const filteredMonthlySummary = {
    ...monthlySummary,
    volume: filteredCalendarDays.reduce((sum, item) => sum + item.volume, 0),
    area: Number((filteredCalendarDays.reduce((sum, item) => sum + item.area, 0) / 10000).toFixed(1)),
    amount: Number(filteredCalendarDays.reduce((sum, item) => sum + item.amount, 0).toFixed(1)),
    avgPrice: filteredCalendarDays.length > 0
      ? Math.round(filteredCalendarDays.reduce((sum, item) => sum + item.price, 0) / filteredCalendarDays.length)
      : current.price,
  };
  const filteredDashboardSummary = [
    { label: "成交均价", value: `${current.price.toLocaleString("zh-CN")} 元/㎡`, change: toTrendChange(current.price, previous.price), tone: current.price >= previous.price ? "up" : "down", caption: "较上期" },
    { label: "本期成交", value: `${current.volume.toLocaleString("zh-CN")} 套`, change: toTrendChange(current.volume, previous.volume), tone: current.volume >= previous.volume ? "up" : "down", caption: rangeLabel },
    { label: "成交面积", value: `${current.area.toLocaleString("zh-CN")} 万㎡`, change: toTrendChange(current.area, previous.area), tone: current.area >= previous.area ? "up" : "down", caption: "较上期" },
    { label: "成交金额", value: `${current.amount.toLocaleString("zh-CN")} 亿元`, change: toTrendChange(current.amount, previous.amount), tone: current.amount >= previous.amount ? "up" : "down", caption: "较上期" },
  ] as const;
  const districtOptions = filters.districtsByCity[activeFilters.city].filter((item) => item !== "全市");
  const rankingSource = activeFilters.district === "全市" ? districtOptions : [activeFilters.district];
  const filteredDistrictRanking = rankingSource.map((district, index) => {
    const districtFactor = districtFactors[district] ?? districtFactors["全市"];
    const price = Math.round(68420 * cityFactors[activeFilters.city].price * districtFactor.price * houseTypeFactors[activeFilters.houseType].price);
    const volume = Math.max(
      60,
      Math.round((1640 - index * 78) * cityFactors[activeFilters.city].volume * districtFactor.volume * houseTypeFactors[activeFilters.houseType].volume),
    );

    return {
      name: formatDistrictName(district),
      volume,
      price,
      change: toTrendChange(volume, Math.max(1, Math.round(volume / (1 + 0.04 + index * 0.012)))),
    };
  });
  const filteredDistrictTrend = rankingSource.map((district, index) => {
    const districtFactor = districtFactors[district] ?? districtFactors["全市"];
    return {
      district,
      priceChange: Number((2.1 + districtFactor.price * 1.4 + index * 0.2).toFixed(1)),
      volumeChange: Number((3.2 + districtFactor.volume * 7.6 + index * 0.4).toFixed(1)),
      heat: Math.min(98, Math.round(62 * districtFactor.heat + index * 5)),
    };
  });
  const filteredRateCards = rateCards.map((item) => {
    if (!item.value.endsWith("%")) {
      return item;
    }
    const numericValue = Number(item.value.replace("%", ""));
    if (!Number.isFinite(numericValue)) {
      return item;
    }
    return { ...item, value: `${(numericValue * factor.rate).toFixed(2)}%` };
  });
  const filteredRateTrend = rateTrend.map((item) => ({
    ...item,
    commercial: Number((item.commercial * factor.rate).toFixed(2)),
    provident: Number((item.provident * factor.rate).toFixed(2)),
    shibor: Number((item.shibor * factor.rate).toFixed(2)),
  }));
  const filterLabel = `${activeFilters.city} · ${activeFilters.district} · ${houseTypeFactors[activeFilters.houseType].label} · ${rangeLabel}`;
  const filteredReportInsights = [
    `${filterLabel} 当前成交均价为 ${current.price.toLocaleString("zh-CN")} 元/㎡，较上期 ${toTrendChange(current.price, previous.price)}。`,
    `${activeFilters.district === "全市" ? activeFilters.city : activeFilters.district}成交套数为 ${current.volume.toLocaleString("zh-CN")} 套，筛选条件变化会同步刷新指标卡、图表、日历和区域对比。`,
    `${houseTypeFactors[activeFilters.houseType].label}在${rangeLabel}维度下呈现${current.volume >= previous.volume ? "修复" : "回落"}态势，后续可替换为真实接口数据。`,
  ];

  return {
    dashboardSummary: filteredDashboardSummary,
    trendData: filteredTrendData,
    districtRanking: filteredDistrictRanking,
    calendarDays: filteredCalendarDays,
    monthlySummary: filteredMonthlySummary,
    reportInsights: filteredReportInsights,
    districtTrend: filteredDistrictTrend,
    rateCards: filteredRateCards,
    rateTrend: filteredRateTrend,
    rangeLabel,
  };
}
