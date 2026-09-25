import { useEffect, useState } from "react";
import { usePageData } from "rspress/runtime";

export function ScrollToTop() {
  const { page } = usePageData();
  const [visible, setVisible] = useState(false);
  const label = page.lang === "zh" ? "返回顶部" : "Back to top";

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 0);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <button
      type="button"
      className="ql-scroll-to-top"
      hidden={!visible}
      aria-label={label}
      title={label}
      onClick={() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduceMotion ? "instant" : "smooth" });
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 20V4m-7 7 7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
