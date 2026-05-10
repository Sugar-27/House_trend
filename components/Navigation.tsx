import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/transactions", label: "成交数据" },
  { href: "/reports", label: "趋势报告" },
  { href: "/rates", label: "楼市利率" },
];

export function Navigation() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="上海楼市趋势分析首页">
        <span className="brand-mark">H</span>
        <span>
          <strong>House Trend</strong>
          <small>上海楼市趋势分析</small>
        </span>
      </Link>
      <nav className="nav-links" aria-label="主导航">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <ThemeToggle />
    </header>
  );
}
