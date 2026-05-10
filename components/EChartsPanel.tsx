"use client";

import { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts/core";
import { BarChart, LineChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
  type GridComponentOption,
  type LegendComponentOption,
  type TooltipComponentOption,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { BarSeriesOption, LineSeriesOption } from "echarts/charts";
import type { ComposeOption, ECharts } from "echarts/core";

echarts.use([BarChart, LineChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

type ChartOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | GridComponentOption
  | LegendComponentOption
  | TooltipComponentOption
>;

type SeriesConfig<T> = {
  name: string;
  valueKey: keyof T;
  unit?: string;
  type?: "line" | "bar";
};

type EChartsPanelProps<T> = {
  title: string;
  data: T[];
  labelKey: keyof T;
  series: SeriesConfig<T>[];
  subtitle?: string;
};

const palette = ["#1c5cff", "#18c5b5", "#f59e0b", "#16a36a"];

function getThemeTokens() {
  const styles = getComputedStyle(document.documentElement);
  return {
    text: styles.getPropertyValue("--text").trim() || "#132033",
    muted: styles.getPropertyValue("--muted").trim() || "#66768c",
    line: styles.getPropertyValue("--line").trim() || "rgba(111, 129, 153, 0.2)",
    card: styles.getPropertyValue("--card-strong").trim() || "#ffffff",
  };
}

export function EChartsPanel<T extends object>({
  title,
  data,
  labelKey,
  series,
  subtitle = "ECharts 交互图表",
}: EChartsPanelProps<T>) {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ECharts | null>(null);

  const labels = useMemo(() => data.map((item) => String(item[labelKey]).replace("2026-", "")), [data, labelKey]);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    const renderChart = () => {
      const theme = getThemeTokens();
      const chart = instanceRef.current ?? echarts.init(chartRef.current);
      instanceRef.current = chart;

      const option: ChartOption = {
        color: palette,
        tooltip: {
          trigger: "axis",
          backgroundColor: theme.card,
          borderColor: theme.line,
          textStyle: { color: theme.text },
          valueFormatter: (value) => {
            const numericValue = Number(value);
            return Number.isFinite(numericValue) ? numericValue.toLocaleString("zh-CN") : String(value);
          },
        },
        legend: {
          top: 0,
          right: 0,
          textStyle: { color: theme.muted },
        },
        grid: {
          top: 42,
          right: 18,
          bottom: 28,
          left: 54,
        },
        xAxis: {
          type: "category",
          data: labels,
          axisLine: { lineStyle: { color: theme.line } },
          axisTick: { show: false },
          axisLabel: { color: theme.muted },
        },
        yAxis: {
          type: "value",
          splitLine: { lineStyle: { color: theme.line } },
          axisLabel: { color: theme.muted },
        },
        series: series.map((item, index) => ({
          name: item.name,
          type: item.type ?? "bar",
          smooth: true,
          barMaxWidth: 34,
          symbolSize: 8,
          emphasis: { focus: "series" },
          areaStyle: (item.type ?? "bar") === "line" ? { opacity: 0.08 } : undefined,
          itemStyle: {
            borderRadius: (item.type ?? "bar") === "bar" ? [10, 10, 4, 4] : undefined,
          },
          data: data.map((point) => Number(point[item.valueKey])),
          tooltip: {
            valueFormatter: (value) => {
              const numericValue = Number(value);
              const formatted = Number.isFinite(numericValue) ? numericValue.toLocaleString("zh-CN") : String(value);
              return `${formatted}${item.unit ?? ""}`;
            },
          },
          color: palette[index % palette.length],
        })),
      };

      chart.setOption(option, true);
      chart.resize();
    };

    renderChart();

    const handleResize = () => instanceRef.current?.resize();
    const handleThemeChange = () => renderChart();
    window.addEventListener("resize", handleResize);
    window.addEventListener("house-trend-theme-change", handleThemeChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("house-trend-theme-change", handleThemeChange);
      instanceRef.current?.dispose();
      instanceRef.current = null;
    };
  }, [data, labels, series]);

  return (
    <article className="panel chart-panel">
      <div className="panel-heading">
        <h2>{title}</h2>
        <span>{subtitle}</span>
      </div>
      <div className="echarts-container" ref={chartRef} role="img" aria-label={title} />
    </article>
  );
}
