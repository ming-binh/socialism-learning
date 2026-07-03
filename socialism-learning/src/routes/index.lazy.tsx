import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Info, Brain, Network, BookOpen, ArrowRight, Star } from "lucide-react";
import { createLazyFileRoute, getRouteApi, Link } from "@tanstack/react-router";
import { MarxLinePortrait } from "@/components/brand/MarxLinePortrait";
import { MonthCalendar } from "@/features/home/components/MonthCalendar";
import { chapters as months } from "@/features/learning/data/chapters";
import type { DailyQuote } from "@/features/learning/data/dailyQuotes";
import { AppShell } from "@/components/AppShell";

const ProjectIntroDialog = lazy(() =>
  import("@/features/home/components/ProjectIntroDialog").then((module) => ({
    default: module.ProjectIntroDialog,
  })),
);

const routeApi = getRouteApi("/");

export const Route = createLazyFileRoute("/")(({
  component: Home,
}));

const monthNames = [
  "tháng 1", "tháng 2", "tháng 3", "tháng 4",
  "tháng 5", "tháng 6", "tháng 7", "tháng 8",
  "tháng 9", "tháng 10", "tháng 11", "tháng 12",
];

const dayLabels = ["Hôm nay", "Ngày mai", "Ngày kế tiếp"];

const groupMembers = [
  "Nguyễn Văn Đông",
  "Trần Trọng Quang",
  "Bùi Trọng Thịnh",
  "Thân Bình Minh",
  "Nguyễn Thị Trà My",
];

function formatQuoteDate(quote: DailyQuote) {
  return `${String(quote.day).padStart(2, "0")} / ${String(quote.month).padStart(2, "0")}`;
}

/** Hook: adds `.visible` to all `.reveal` elements inside a ref when they enter viewport */
function useScrollReveal(containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll<HTMLElement>(".reveal");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [containerRef]);
}

function Home() {
  const { today, todaysQuote, dailyLessons, monthQuotes, remainingLessons } =
    routeApi.useLoaderData();
  const currentMonth = months[today.month - 1];
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [projectDialogMounted, setProjectDialogMounted] = useState(false);

  const pageRef = useRef<HTMLDivElement>(null);
  useScrollReveal(pageRef);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("intro-dialog-shown");
    if (alreadyShown) return;

    const timer = window.setTimeout(() => {
      setProjectDialogMounted(true);
      setProjectDialogOpen(true);
      sessionStorage.setItem("intro-dialog-shown", "1");
    }, 800);
    return () => window.clearTimeout(timer);
  }, []);

  const openProjectDialog = () => {
    setProjectDialogMounted(true);
    setProjectDialogOpen(true);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSectionLink = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    scrollToSection(id);
  };

  return (
    <div className="min-h-screen bg-background text-foreground paper-grain" ref={pageRef}>
      {projectDialogMounted && (
        <Suspense fallback={null}>
          <ProjectIntroDialog
            members={groupMembers}
            open={projectDialogOpen}
            onOpenChange={setProjectDialogOpen}
          />
        </Suspense>
      )}

      {/* ── App Navigation ── */}
      <AppShell
        showProgress
        extra={
          <a
            href="#ngay"
            onClick={(e) => handleSectionLink(e, "ngay")}
            className="btn-primary btn-shimmer text-xs"
          >
            Bắt đầu đọc
          </a>
        }
      />

      {/* ══════════════════════════════════════════
          HERO – Magazine Cover Layout
      ══════════════════════════════════════════ */}
      <section className="hero-shell hero-lines-bg relative isolate overflow-hidden">
        {/* Subtle Marx portrait watermark */}
        <figure className="marx-hero-portrait" aria-hidden>
          <MarxLinePortrait />
        </figure>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 md:py-24 md:px-6">

          {/* Edition header – like a newspaper masthead */}
          <div className="reveal mb-10 flex items-center justify-between border-b-2 border-primary pb-4">
            <div className="flex items-center gap-3">
              <span className="issue-tag">Niên giám 2026</span>
              <span
                className="hidden text-xs text-muted-foreground sm:block"
                style={{ fontFamily: '"Source Serif 4", Georgia, serif', fontStyle: 'italic' }}
              >
                Lý luận soi đường — thực tiễn kiểm chứng
              </span>
            </div>
            <div className="text-right text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              <div>{monthNames[today.month - 1].replace("tháng", "Tháng")} · Ngày {today.day}</div>
            </div>
          </div>

          {/* Main grid */}
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">

            {/* ── Left column: headline ── */}
            <div className="lg:col-span-7">
              <div className="reveal mb-5 flex items-center gap-3">
                <span className="h-[2px] w-8 bg-accent" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent">
                  Chủ nghĩa Xã hội Khoa học
                </span>
              </div>

              <h1
                className="reveal reveal-delay-1 font-display text-[3.25rem] font-black leading-[0.92] md:text-[5rem] lg:text-[5.5rem]"
                style={{ letterSpacing: '-0.03em' }}
              >
                <span className="block text-primary">365</span>
                <span className="block italic text-foreground">ngày cùng</span>
                <span
                  className="block text-primary"
                  style={{ fontSize: '0.58em', letterSpacing: '-0.01em', lineHeight: '1.2', fontStyle: 'normal' }}
                >
                  Chủ nghĩa Xã hội<br />Khoa học
                </span>
              </h1>

              <p
                className="reveal reveal-delay-2 mt-8 max-w-lg text-base leading-relaxed text-muted-foreground"
                style={{ fontFamily: '"Source Serif 4", Georgia, serif' }}
              >
                Mỗi ngày một bài học. Mỗi tháng một chủ đề. Một năm để hiểu thấu tư tưởng
                đã định hình thế kỷ XX — và còn vang vọng đến hôm nay.
              </p>

              {/* CTA row */}
              <div className="reveal reveal-delay-3 mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#thang"
                  onClick={(e) => handleSectionLink(e, "thang")}
                  className="btn-primary btn-shimmer"
                >
                  Khám phá 12 chủ đề
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </a>
                <a
                  href="#ngay"
                  onClick={(e) => handleSectionLink(e, "ngay")}
                  className="btn-outline"
                >
                  Bài học hôm nay
                </a>
              </div>

              {/* Stats row */}
              <div className="reveal reveal-delay-4 mt-10 grid grid-cols-3 gap-4 border-t border-border pt-8">
                {[
                  { number: "12", label: "Chủ đề" },
                  { number: "365", label: "Bài học" },
                  { number: "2026", label: "Niên giám" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div
                      className="font-display text-2xl font-black text-primary"
                      style={{ letterSpacing: '-0.03em' }}
                    >
                      {stat.number}
                    </div>
                    <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right column: calendar widget ── */}
            <aside className="reveal reveal-delay-2 lg:col-span-5">
              {/* Section label */}
              <div className="mb-3 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Lịch tháng {monthNames[today.month - 1].replace('tháng ', '')}
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <MonthCalendar initialQuotes={monthQuotes} today={today} />
            </aside>
          </div>
        </div>
      </section>

      {/* Editorial ornament divider */}
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-6 text-accent star-divider">
        <Star className="h-4 w-4 fill-current" aria-hidden />
      </div>

      {/* ══════════════════════════════════════════
          12 MONTHS GRID – Atlas Style
      ══════════════════════════════════════════ */}
      <section id="thang" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 md:px-6 md:py-24">

        {/* Section header – editorial style */}
        <div className="reveal mb-12">
          <div className="section-rule mb-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                Bản đồ một năm
              </span>
              <span className="text-[10px] text-muted-foreground hidden md:block">
                Mỗi tháng dẫn dắt qua một trụ cột lý luận
              </span>
            </div>
          </div>
          <h2
            className="font-display text-4xl font-black md:text-5xl"
            style={{ letterSpacing: '-0.025em' }}
          >
            12 tháng,{" "}
            <span className="italic text-primary">12 chủ đề</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid overflow-hidden border border-border sm:grid-cols-2 lg:grid-cols-3">
          {months.map((m, i) => {
            const cardContent = (
              <>
                {/* Month number */}
                <div className="flex items-baseline justify-between">
                  <span
                    className="font-display text-5xl font-black leading-none text-primary transition-colors group-hover:text-primary-foreground"
                    style={{ letterSpacing: '-0.04em' }}
                  >
                    {String(m.n).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground transition-colors group-hover:text-primary-foreground/60">
                    Tháng
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-5 font-display text-xl font-bold leading-snug transition-colors group-hover:text-primary-foreground">
                  {m.title}
                </h3>

                {/* Subtitle */}
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground transition-colors group-hover:text-primary-foreground/75">
                  {m.sub}
                </p>

                {/* Read link */}
                <div className="mt-6 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] opacity-0 transition-all duration-200 group-hover:opacity-100">
                  {m.isPublished ? "Đọc chủ đề" : "Sắp có"}
                  {m.isPublished && <ArrowRight className="h-3 w-3" aria-hidden />}
                </div>
              </>
            );

            const baseClass = `reveal reveal-delay-${Math.min(i + 1, 12)} group chapter-card relative flex flex-col scroll-mt-32 transition-colors duration-220 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset`;

            return m.isPublished ? (
              <Link
                key={m.n}
                id={`chuong-${m.n}`}
                to="/chuong/$chapter"
                params={{ chapter: String(m.n) }}
                className={baseClass}
              >
                {cardContent}
              </Link>
            ) : (
              <div
                key={m.n}
                id={`chuong-${m.n}`}
                className={`${baseClass} cursor-default`}
              >
                {cardContent}
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          DAILY SERIES – Navy Section
      ══════════════════════════════════════════ */}
      <section
        id="ngay"
        className="scroll-mt-28"
        style={{ background: 'linear-gradient(180deg, #1B2A4A 0%, #0F1E38 100%)' }}
      >
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">

          {/* Section header */}
          <div className="reveal mb-14">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-6 bg-accent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent">
                Chuỗi {monthNames[today.month - 1]}
              </span>
            </div>
            <h2
              className="font-display text-4xl font-black text-white md:text-5xl"
              style={{ letterSpacing: '-0.025em' }}
            >
              Bài học{" "}
              <span className="italic" style={{ color: '#D4A827' }}>hôm nay</span>
            </h2>
            <p
              className="mt-5 max-w-xl text-base leading-relaxed text-white/60"
              style={{ fontFamily: '"Source Serif 4", Georgia, serif' }}
            >
              {currentMonth.title}: {currentMonth.sub}. Mỗi ngày một trích đoạn ngắn
              để giữ mạch học tập đi đều qua cả năm.
            </p>
          </div>

          {/* 3-column cards */}
          <div className="grid gap-0 border border-white/10 sm:grid-cols-1 md:grid-cols-3">
            {dailyLessons.map((quote: DailyQuote, index: number) => (
              <article
                key={`${quote.month}-${quote.day}`}
                className={`reveal reveal-delay-${index + 1} daily-card relative flex flex-col`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="daily-card-number">{formatQuoteDate(quote)}</div>
                  <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                    {dayLabels[index] ?? "Tiếp nối"}
                  </span>
                </div>

                {/* Separator */}
                <div className="my-5 h-px bg-white/10" />

                {/* Quote */}
                <div className="flex-1">
                  <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.25em] text-accent/80">
                    Nội dung
                  </div>
                  <blockquote
                    className="font-display text-lg font-semibold leading-snug text-white/90"
                    style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                  >
                    "{quote.quote}"
                  </blockquote>
                </div>

                {/* Source */}
                <div className="mt-6 border-t border-white/08 pt-5">
                  <div className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.25em] text-accent/80">
                    Nguồn
                  </div>
                  <p className="text-xs leading-relaxed text-white/55">
                    {quote.author} · {quote.context}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Footer row */}
          <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-8 text-sm text-white/40">
            <span>Còn {remainingLessons} nội dung đang chờ bạn trong năm nay.</span>
            <a
              href="#thang"
              onClick={(e) => handleSectionLink(e, "thang")}
              className="text-accent underline-offset-4 hover:underline transition-opacity hover:opacity-80"
            >
              Xem toàn bộ chuỗi →
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PULL QUOTE – Today's Reflection
      ══════════════════════════════════════════ */}
      <section
        id="suyngam"
        className="mx-auto max-w-5xl scroll-mt-28 px-4 py-28 text-center md:px-6"
      >
        <div className="reveal">
          {/* Ornament */}
          <div className="mb-8 flex items-center gap-5 text-accent star-divider">
            <Star className="h-5 w-5 fill-current shrink-0" aria-hidden />
          </div>

          {todaysQuote ? (
            <>
              {/* Large pull-quote mark */}
              <div className="pull-quote-mark mb-2 leading-none">"</div>
              <blockquote
                className="font-display text-3xl font-bold italic leading-tight md:text-[2.625rem]"
                style={{ letterSpacing: '-0.02em', color: 'var(--color-foreground)' }}
              >
                {todaysQuote.quote}
              </blockquote>
              <div className="pull-quote-mark mt-2 rotate-180 leading-none">"</div>
              <div
                className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
              >
                {todaysQuote.author} · {todaysQuote.context}
              </div>
            </>
          ) : (
            <p
              className="mt-8 text-lg text-muted-foreground"
              style={{ fontFamily: '"Source Serif 4", Georgia, serif', fontStyle: 'italic' }}
            >
              Nội dung hôm nay đang được cập nhật.
            </p>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ABOUT SECTION – Editorial 2-column
      ══════════════════════════════════════════ */}
      <section id="vesach" className="scroll-mt-28 border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">

          {/* Section rule header */}
          <div className="reveal mb-12 section-rule">
            <div className="flex items-center justify-between py-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                Về dự án
              </span>
              <span className="text-[10px] text-muted-foreground hidden md:block">
                Nhóm chủ đề 2 · 2026
              </span>
            </div>
          </div>

          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            {/* Left col */}
            <div className="reveal">
              <h2
                className="font-display text-4xl font-black md:text-5xl"
                style={{ letterSpacing: '-0.025em' }}
              >
                Một năm.
                <br />
                <span className="italic text-primary">Một tư tưởng.</span>
                <br />
                Một thói quen mới mỗi sáng.
              </h2>

              {/* Feature list */}
              <ul className="mt-10 space-y-4">
                {[
                  { icon: BookOpen, text: "3 phút đọc mỗi ngày, 365 ngày liên tục" },
                  { icon: Brain, text: "Quiz kiểm tra sau mỗi chủ đề" },
                  { icon: Network, text: "Sơ đồ tư duy hệ thống lý luận" },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-primary/10">
                      <Icon className="h-3.5 w-3.5 text-primary" aria-hidden />
                    </div>
                    <span className="text-sm leading-relaxed text-muted-foreground">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right col */}
            <div className="reveal reveal-delay-2 space-y-6">
              <p
                className="text-base leading-[1.75] text-muted-foreground"
                style={{ fontFamily: '"Source Serif 4", Georgia, serif' }}
              >
                <strong className="text-foreground font-semibold">365 Ngày</strong> là dự án đọc &amp; suy ngẫm về
                Chủ nghĩa Xã hội Khoa học, được biên soạn cho độc giả Việt Nam đương đại — sinh viên,
                người lao động, người làm chính sách, và bất kỳ ai quan tâm tới câu hỏi:{" "}
                <em>xã hội này đang đi về đâu?</em>
              </p>
              <p
                className="text-base leading-[1.75] text-muted-foreground"
                style={{ fontFamily: '"Source Serif 4", Georgia, serif' }}
              >
                Không giáo điều, không khẩu hiệu — chỉ là lý luận gặp đời sống, được trình bày
                bằng ngôn ngữ của thế kỷ XXI.
              </p>

              {/* Team */}
              <div className="border-l-[3px] border-accent pl-5 py-1">
                <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  Nhóm chủ đề 2
                </div>
                <ul className="grid gap-1 text-sm sm:grid-cols-2">
                  {groupMembers.map((member) => (
                    <li key={member} className="flex items-center gap-2 text-muted-foreground">
                      <span className="h-1 w-2 bg-accent/60 rounded-full shrink-0" />
                      {member}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={openProjectDialog}
                  className="btn-outline inline-flex items-center gap-2"
                >
                  <Info className="h-3.5 w-3.5" aria-hidden />
                  Giới thiệu dự án
                </button>
                <a
                  href="#ngay"
                  onClick={(e) => handleSectionLink(e, "ngay")}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Bắt đầu từ Ngày 01
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="border-t border-border pb-20 md:pb-0" style={{ background: 'var(--color-background)' }}>
        <div
          className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6"
        >
          {/* Left */}
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-sm border border-primary/30 bg-primary/8">
              <BookOpen className="h-3.5 w-3.5 text-primary" aria-hidden />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              365 Ngày cùng Chủ nghĩa Xã hội Khoa học
            </span>
          </div>

          {/* Center */}
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 text-center">
            © 2026 · Khoa học hóa tư tưởng xã hội chủ nghĩa
          </div>

          {/* Right – nav links */}
          <div className="flex items-center gap-4">
            <Link to="/quiz/" className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground hover:text-primary transition-colors">
              Quiz
            </Link>
            <Link to="/mindmap/" className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground hover:text-primary transition-colors">
              Sơ đồ
            </Link>
          </div>
        </div>

        {/* Bottom double rule – editorial style */}
        <div className="h-[3px]" style={{ background: 'linear-gradient(90deg, var(--color-primary) 0%, #2A4A7A 40%, var(--color-accent) 70%, var(--color-primary) 100%)' }} />
      </footer>
    </div>
  );
}
