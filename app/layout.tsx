import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "House Trend · 上海楼市趋势分析",
  description: "面向上海楼市的一手房、二手房成交趋势、区域报告与楼市利率分析看板。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="app-shell">
          <Navigation />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}

