import { useState, useEffect, useCallback } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Brain, Network, BookOpen, Home, X, ChevronDown, Moon, Sun, Menu } from "lucide-react";
import { chapters as months } from "@/features/learning/data/chapters";

function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        document.documentElement.classList.contains("dark") ||
        localStorage.getItem("theme") === "dark"
      );
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return [isDark, setIsDark] as const;
}

type NavItem = {
  to: string;
  label: string;
  icon: React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Trang chủ", icon: <Home className="h-5 w-5" aria-hidden /> },
  { to: "/quiz/", label: "Quiz", icon: <Brain className="h-5 w-5" aria-hidden /> },
  { to: "/mindmap/", label: "Sơ đồ tư duy", icon: <Network className="h-5 w-5" aria-hidden /> },
];

const BOTTOM_NAV: NavItem[] = [
  { to: "/", label: "Trang chủ", icon: <Home className="h-5 w-5" aria-hidden /> },
  { to: "/quiz/", label: "Quiz", icon: <Brain className="h-5 w-5" aria-hidden /> },
  { to: "/mindmap/", label: "Sơ đồ", icon: <Network className="h-5 w-5" aria-hidden /> },
];

type Props = {
  /** Extra items in the right side of the desktop nav (e.g. chapter-specific links) */
  extra?: React.ReactNode;
  /** Whether to show the reading progress bar */
  showProgress?: boolean;
};

export function AppShell({ extra, showProgress = false }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [chapterMenuOpen, setChapterMenuOpen] = useState(false);
  const [isDark, setIsDark] = useDarkMode();

  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const isActive = useCallback(
    (to: string) => {
      if (to === "/") return pathname === "/";
      return pathname.startsWith(to);
    },
    [pathname],
  );

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
    setChapterMenuOpen(false);
  }, [pathname]);

  // Scroll shadow + reading progress
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);

      if (showProgress) {
        const scrolled = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(total > 0 ? (scrolled / total) * 100 : 0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showProgress]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      {/* Reading progress bar */}
      {showProgress && (
        <div className="reading-progress" style={{ width: `${progress}%` }} aria-hidden="true" />
      )}

      {/* ── Sticky Navbar ── */}
      <nav
        className={[
          "sticky top-0 z-50 transition-all duration-300",
          "bg-background/97 backdrop-blur-md",
          scrolled && "shadow-[0_1px_0_0_var(--color-border)]",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label="Thanh điều hướng"
      >
        {/* Top accent rule */}
        <div className="nav-accent-rule" />

        {/* Main nav row */}
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">

          {/* ── Logo / Wordmark ── */}
          <Link
            to="/"
            className="group flex items-center gap-3 text-foreground transition-opacity hover:opacity-80"
            aria-label="Về trang chủ"
          >
            {/* Icon badge */}
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border-2 border-primary bg-primary text-primary-foreground transition-all group-hover:bg-primary/90">
              <BookOpen className="h-4 w-4" aria-hidden />
            </div>

            {/* Text wordmark */}
            <div className="hidden sm:block">
              <div
                className="nav-wordmark text-[13px] font-bold uppercase tracking-[0.14em] text-primary leading-none"
              >
                365 Ngày
              </div>
              <div
                className="mt-0.5 font-serif text-[11px] tracking-[0.03em] text-muted-foreground leading-none"
                style={{ fontFamily: '"Source Serif 4", Georgia, serif' }}
              >
                Chủ nghĩa Xã hội Khoa học
              </div>
            </div>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden items-center gap-6 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={[
                  "nav-link",
                  isActive(item.to) && "active",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* ── Right controls ── */}
          <div className="flex items-center gap-2">
            {/* Extra slot */}
            {extra && (
              <div className="hidden items-center gap-2 md:flex">{extra}</div>
            )}

            {/* Dark mode toggle */}
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              className="flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              aria-label="Chuyển đổi chế độ tối"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setDrawerOpen((v) => !v)}
              className={[
                "relative flex h-8 w-8 flex-col items-center justify-center gap-[5px] rounded-sm transition hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring md:hidden",
                drawerOpen && "hamburger-open",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-label={drawerOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
          </div>
        </div>

        {/* ── Sub-navigation bar (Navy) ── */}
        <div className="subnav-bar border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-1 gap-y-1 px-4 py-1 md:px-6">

            {/* Chapter dropdown trigger */}
            <button
              type="button"
              onClick={() => setChapterMenuOpen((isOpen) => !isOpen)}
              className={[
                "subnav-link inline-flex items-center gap-1.5 transition focus:outline-none",
                chapterMenuOpen && "!text-white bg-white/10",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-expanded={chapterMenuOpen}
              aria-controls="chapter-menu"
            >
              Chủ đề
              <ChevronDown
                className={["h-3 w-3 transition-transform", chapterMenuOpen && "rotate-180"]
                  .filter(Boolean)
                  .join(" ")}
                aria-hidden
              />
            </button>

            <span className="text-white/20 select-none px-1">·</span>

            <Link to="/" hash="ngay" className="subnav-link">
              Bài học hôm nay
            </Link>
            <Link to="/" hash="suyngam" className="subnav-link">
              Suy ngẫm
            </Link>
            <Link to="/" hash="vesach" className="subnav-link">
              Về dự án
            </Link>

            <span className="text-white/20 select-none px-1">·</span>

            <Link to="/quiz/" className="subnav-link inline-flex items-center gap-1.5">
              <Brain className="h-3 w-3" aria-hidden />
              Quiz
            </Link>
            <Link to="/mindmap/" className="subnav-link inline-flex items-center gap-1.5">
              <Network className="h-3 w-3" aria-hidden />
              Sơ đồ
            </Link>
          </div>

          {/* ── Chapter dropdown ── */}
          <div
            id="chapter-menu"
            className={[
              "chapter-menu-shell border-t border-white/10 bg-background shadow-xl",
              chapterMenuOpen ? "chapter-menu-open" : "chapter-menu-closed",
            ].join(" ")}
            aria-hidden={!chapterMenuOpen}
          >
            <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
              {/* Header */}
              <div className="mb-5 flex items-center gap-4">
                <div className="section-rule flex-1" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  12 Chủ đề · Niên giám 2026
                </span>
                <div className="section-rule flex-1" />
              </div>

              <div className="grid gap-0 overflow-hidden rounded-sm border border-border sm:grid-cols-2 lg:grid-cols-4">
                {months.map((m) => {
                  const cardClass =
                    "group/menu chapter-card flex min-h-[7.5rem] flex-col items-start text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
                  const cardContent = (
                    <>
                      <span className="font-display text-3xl font-bold leading-none text-primary transition group-hover/menu:text-primary-foreground">
                        {String(m.n).padStart(2, "0")}
                      </span>
                      <span className="mt-3 font-display text-[15px] font-semibold leading-tight group-hover/menu:text-primary-foreground">
                        {m.title}
                      </span>
                      <span className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground transition group-hover/menu:text-primary-foreground/70">
                        {m.sub}
                      </span>
                    </>
                  );

                  return m.isPublished ? (
                    <Link
                      key={`chapter-menu-${m.n}`}
                      to="/chuong/$chapter"
                      params={{ chapter: String(m.n) }}
                      tabIndex={chapterMenuOpen ? 0 : -1}
                      onClick={() => setChapterMenuOpen(false)}
                      className={cardClass}
                    >
                      {cardContent}
                    </Link>
                  ) : (
                    <Link
                      key={`chapter-menu-${m.n}`}
                      to="/"
                      hash={`chuong-${m.n}`}
                      tabIndex={chapterMenuOpen ? 0 : -1}
                      onClick={() => setChapterMenuOpen(false)}
                      className={cardClass}
                    >
                      {cardContent}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer overlay ── */}
      <div
        className={["mobile-drawer-overlay", drawerOpen && "open"].filter(Boolean).join(" ")}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile drawer ── */}
      <div
        id="mobile-drawer"
        className={["mobile-drawer", drawerOpen && "open"].filter(Boolean).join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng"
      >
        {/* Drawer header with 3px accent on top */}
        <div className="nav-accent-rule" />
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <Link
            to="/"
            className="flex items-center gap-2.5"
            onClick={() => setDrawerOpen(false)}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border-2 border-primary bg-primary text-primary-foreground">
              <BookOpen className="h-4 w-4" aria-hidden />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.12em] text-primary">
                365 Ngày
              </div>
              <div className="text-[10px] text-muted-foreground">
                Chủ nghĩa Xã hội Khoa học
              </div>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition"
            aria-label="Đóng menu"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {/* Edition label */}
        <div className="border-b border-border bg-secondary/50 px-5 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Niên giám 2026
          </span>
        </div>

        {/* Drawer nav items */}
        <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobile navigation">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground px-2">
            Điều hướng
          </p>
          <ul className="space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setDrawerOpen(false)}
                  className={[
                    "flex items-center gap-3 rounded-sm px-3 py-3 text-sm font-medium transition-all",
                    isActive(item.to)
                      ? "bg-primary/8 text-primary border-l-2 border-primary pl-[10px]"
                      : "text-foreground hover:bg-secondary hover:text-primary",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {item.icon}
                  {item.label}
                  {isActive(item.to) && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Quick links section */}
          <div className="mt-6 border-t border-border pt-5">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground px-2">
              Trên trang chủ
            </p>
            <ul className="space-y-0.5">
              {[
                { hash: "ngay", label: "Bài học hôm nay" },
                { hash: "thang", label: "12 chủ đề" },
                { hash: "suyngam", label: "Suy ngẫm" },
                { hash: "vesach", label: "Về dự án" },
              ].map((item) => (
                <li key={item.hash}>
                  <Link
                    to="/"
                    hash={item.hash}
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                  >
                    <span className="h-1 w-3 bg-accent/60 rounded-full shrink-0" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Drawer footer */}
        <div className="border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {isDark ? "Chế độ sáng" : "Chế độ tối"}
          </button>
          <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
            365 Ngày · 2026
          </p>
        </div>
      </div>

      {/* ── Mobile bottom quick-action bar ── */}
      <div className="mobile-bottom-bar md:hidden" role="navigation" aria-label="Điều hướng nhanh">
        {BOTTOM_NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={["mobile-bottom-bar-item", isActive(item.to) && "active"]
              .filter(Boolean)
              .join(" ")}
            aria-current={isActive(item.to) ? "page" : undefined}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
