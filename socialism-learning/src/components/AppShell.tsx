import { useState, useEffect, useCallback } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Brain, Network, BookOpen, Home, X, ChevronDown } from "lucide-react";
import { chapters as months } from "@/features/learning/data/chapters";

type NavItem = {
  to: string;
  label: string;
  icon: React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Trang chủ", icon: <Home className="h-5 w-5" aria-hidden /> },
  { to: "/quiz/", label: "Quiz", icon: <Brain className="h-5 w-5" aria-hidden /> },
  { to: "/mindmap/", label: "Sơ đồ", icon: <Network className="h-5 w-5" aria-hidden /> },
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
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <>
      {/* Reading progress bar */}
      {showProgress && (
        <div className="reading-progress" style={{ width: `${progress}%` }} aria-hidden="true" />
      )}

      {/* Sticky navbar */}
      <nav
        className={[
          "sticky top-0 z-50 border-b border-transparent bg-background/95 backdrop-blur transition-all duration-300",
          scrolled && "border-border shadow-sm",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label="Thanh điều hướng"
      >
        <div className="banner-stripes h-1" />
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-foreground transition hover:opacity-80"
            aria-label="Về trang chủ"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
              <BookOpen className="h-4 w-4" aria-hidden />
            </div>
            <span className="hidden font-display text-base font-semibold leading-none sm:block">
              365 ngày cùng Chủ nghĩa Xã hội Khoa học
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
          </div>

          {/* Extra slot (desktop) + hamburger */}
          <div className="flex items-center gap-2">
            {extra && <div className="hidden md:flex items-center gap-2">{extra}</div>}

            {/* Mobile hamburger button */}
            <button
              type="button"
              onClick={() => setDrawerOpen((v) => !v)}
              className={[
                "relative flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-md transition hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring md:hidden",
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

        {/* Home page section sub-nav moved to AppShell */}
        <div className="border-t border-border/50 bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2 md:px-6">
            {/* Chapter sub-nav */}
            <button
              type="button"
              onClick={() => setChapterMenuOpen((isOpen) => !isOpen)}
              className={[
                "inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                chapterMenuOpen && "bg-secondary text-primary",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-expanded={chapterMenuOpen}
              aria-controls="chapter-menu"
            >
              <span className="text-xs uppercase tracking-wider">Chủ đề</span>
              <ChevronDown
                className={["h-3.5 w-3.5 transition-transform", chapterMenuOpen && "rotate-180"]
                  .filter(Boolean)
                  .join(" ")}
                aria-hidden
              />
            </button>
            <Link
              to="/"
              hash="ngay"
              className="shrink-0 py-1.5 px-3 rounded-md text-sm transition hover:bg-secondary hover:text-primary"
            >
              Bài học hôm nay
            </Link>
            <Link
              to="/"
              hash="suyngam"
              className="shrink-0 py-1.5 px-3 rounded-md text-sm transition hover:bg-secondary hover:text-primary"
            >
              Suy ngẫm
            </Link>
            <Link
              to="/"
              hash="vesach"
              className="shrink-0 py-1.5 px-3 rounded-md text-sm transition hover:bg-secondary hover:text-primary"
            >
              Về dự án
            </Link>
            <Link
              to="/quiz/"
              className="inline-flex shrink-0 items-center gap-1.5 py-1.5 px-3 rounded-md text-sm transition hover:bg-secondary hover:text-primary"
            >
              <Brain className="h-3.5 w-3.5" aria-hidden />
              Quiz
            </Link>
            <Link
              to="/mindmap/"
              className="inline-flex shrink-0 items-center gap-1.5 py-1.5 px-3 rounded-md text-sm transition hover:bg-secondary hover:text-primary"
            >
              <Network className="h-3.5 w-3.5" aria-hidden />
              Sơ đồ
            </Link>
          </div>

          {/* Chapter dropdown */}
          <div
            id="chapter-menu"
            className={[
              "chapter-menu-shell border-t border-border bg-card/95 shadow-lg backdrop-blur",
              chapterMenuOpen ? "chapter-menu-open" : "chapter-menu-closed",
            ].join(" ")}
            aria-hidden={!chapterMenuOpen}
          >
            <div className="mx-auto max-w-7xl px-4 py-5 md:px-6">
              <div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
                {months.map((m) => {
                  const menuItemClass =
                    "group/menu flex min-h-28 flex-col items-start bg-background p-4 text-left transition hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card";
                  const menuItemContent = (
                    <>
                      <span className="font-display text-2xl leading-none text-primary transition group-hover/menu:text-primary-foreground group-focus/menu:text-primary-foreground">
                        {String(m.n).padStart(2, "0")}
                      </span>
                      <span className="mt-3 font-display text-lg leading-tight">{m.title}</span>
                      <span className="mt-1 text-xs leading-relaxed text-muted-foreground transition group-hover/menu:text-primary-foreground/75 group-focus/menu:text-primary-foreground/75">
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
                      className={menuItemClass}
                    >
                      {menuItemContent}
                    </Link>
                  ) : (
                    <Link
                      key={`chapter-menu-${m.n}`}
                      to="/"
                      hash={`chuong-${m.n}`}
                      tabIndex={chapterMenuOpen ? 0 : -1}
                      onClick={() => setChapterMenuOpen(false)}
                      className={menuItemClass}
                    >
                      {menuItemContent}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      <div
        className={["mobile-drawer-overlay", drawerOpen && "open"].filter(Boolean).join(" ")}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <div
        id="mobile-drawer"
        className={["mobile-drawer", drawerOpen && "open"].filter(Boolean).join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <Link to="/" className="flex items-center gap-2.5" onClick={() => setDrawerOpen(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <BookOpen className="h-4 w-4" aria-hidden />
            </div>
            <span className="font-display text-base font-semibold">365 ngày cùng Chủ nghĩa Xã hội Khoa học</span>
          </Link>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition"
            aria-label="Đóng menu"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* Drawer nav items */}
        <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobile navigation">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setDrawerOpen(false)}
                  className={[
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                    isActive(item.to)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-secondary",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {item.icon}
                  {item.label}
                  {isActive(item.to) && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Drawer footer */}
        <div className="border-t border-border px-5 py-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            365 Ngày cùng CNXHKH · 2026
          </p>
        </div>
      </div>

      {/* Mobile bottom quick-action bar */}
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
