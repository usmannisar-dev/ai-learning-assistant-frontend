import { useEffect, useRef } from "react";

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    // ============================================================
    // DESKTOP ONLY
    // ============================================================

    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    // ============================================================
    // HIDE DEFAULT CURSOR
    // ============================================================

    const style = document.createElement("style");

    style.innerHTML = `
      html.custom-cursor-active,
      html.custom-cursor-active body,
      html.custom-cursor-active * {
        cursor: none !important;
      }
    `;

    document.head.appendChild(style);
    document.documentElement.classList.add("custom-cursor-active");

    // ============================================================
    // MOUSE POSITION
    // ============================================================

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let dotX = mouseX;
    let dotY = mouseY;

    let ringX = mouseX;
    let ringY = mouseY;

    let glowX = mouseX;
    let glowY = mouseY;

    // ============================================================
    // MOUSE MOVE
    // ============================================================

    const handleMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    // ============================================================
    // HOVER DETECTION
    // ============================================================

    const handleMouseOver = (event) => {
      const target = event.target;

      const interactive = target.closest(
        "a, button, input, textarea, select, [role='button']",
      );

      if (interactive) {
        dotRef.current?.classList.add("cursor-hover");
        ringRef.current?.classList.add("ring-hover");
        glowRef.current?.classList.add("glow-hover");
      } else {
        dotRef.current?.classList.remove("cursor-hover");
        ringRef.current?.classList.remove("ring-hover");
        glowRef.current?.classList.remove("glow-hover");
      }
    };

    // ============================================================
    // CLICK ANIMATION
    // ============================================================

    const handleMouseDown = () => {
      dotRef.current?.classList.add("cursor-click");
      ringRef.current?.classList.add("ring-click");
      glowRef.current?.classList.add("glow-click");
    };

    const handleMouseUp = () => {
      dotRef.current?.classList.remove("cursor-click");
      ringRef.current?.classList.remove("ring-click");
      glowRef.current?.classList.remove("glow-click");
    };

    // ============================================================
    // SMOOTH ANIMATION
    // ============================================================

    let animationFrame;

    const animate = () => {
      // ----------------------------------------------------------
      // CENTER DOT
      // ----------------------------------------------------------

      dotX += (mouseX - dotX) * 0.4;
      dotY += (mouseY - dotY) * 0.4;

      // ----------------------------------------------------------
      // OUTER RING
      // ----------------------------------------------------------

      ringX += (mouseX - ringX) * 0.17;
      ringY += (mouseY - ringY) * 0.17;

      // ----------------------------------------------------------
      // GLOW
      // ----------------------------------------------------------

      glowX += (mouseX - glowX) * 0.09;
      glowY += (mouseY - glowY) * 0.09;

      // ----------------------------------------------------------
      // APPLY POSITION
      // ----------------------------------------------------------

      if (dotRef.current) {
        dotRef.current.style.left = `${dotX}px`;
        dotRef.current.style.top = `${dotY}px`;
      }

      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`;
        ringRef.current.style.top = `${ringY}px`;
      }

      if (glowRef.current) {
        glowRef.current.style.left = `${glowX}px`;
        glowRef.current.style.top = `${glowY}px`;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    // ============================================================
    // EVENTS
    // ============================================================

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    animationFrame = requestAnimationFrame(animate);

    // ============================================================
    // CLEANUP
    // ============================================================

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);

      document.documentElement.classList.remove("custom-cursor-active");

      style.remove();
    };
  }, []);

  return (
    <>
      {/* ==========================================================
          LARGE SOFT EMERALD GLOW
      =========================================================== */}

      <div ref={glowRef} className="ai-cursor-glow" />

      {/* ==========================================================
          LARGE OUTER RING
      =========================================================== */}

      <div ref={ringRef} className="ai-cursor-ring">
        <div className="ai-cursor-inner" />
        <div className="ai-cursor-highlight" />
      </div>

      {/* ==========================================================
          CENTER DOT
      =========================================================== */}

      <div ref={dotRef} className="ai-cursor-dot" />

      {/* ==========================================================
          ALL CURSOR STYLES
      =========================================================== */}

      <style>{`

        /* ========================================================
           LARGE SOFT EMERALD GLOW
        ======================================================== */

        .ai-cursor-glow {
          position: fixed;

          width: 100px;
          height: 100px;

          left: 50%;
          top: 50%;

          transform: translate(-50%, -50%);

          pointer-events: none;

          z-index: 999997;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(16, 185, 129, 0.16) 0%,
              rgba(16, 185, 129, 0.10) 24%,
              rgba(52, 211, 153, 0.065) 42%,
              rgba(5, 150, 105, 0.035) 58%,
              transparent 76%
            );

          filter: blur(7px);

          opacity: 0.78;

          transition:
            width 0.38s cubic-bezier(.22,1,.36,1),
            height 0.38s cubic-bezier(.22,1,.36,1),
            opacity 0.35s ease;

          will-change: left, top;
        }


        /* ========================================================
           LARGE OUTER RING
        ======================================================== */

        .ai-cursor-ring {
          position: fixed;

          width: 46px;
          height: 46px;

          left: 50%;
          top: 50%;

          transform: translate(-50%, -50%);

          pointer-events: none;

          z-index: 999998;

          border-radius: 50%;

          border: 3px solid rgba(16, 185, 129, 0.62);

          background:
            radial-gradient(
              circle,
              rgba(16, 185, 129, 0.035) 0%,
              rgba(16, 185, 129, 0.018) 45%,
              transparent 72%
            );

          box-shadow:

            /* OUTER EMERALD AURA */
            0 0 6px rgba(16, 185, 129, 0.40),

            0 0 12px rgba(16, 185, 129, 0.30),

            0 0 20px rgba(16, 185, 129, 0.24),

            0 0 32px rgba(16, 185, 129, 0.18),

            0 0 48px rgba(16, 185, 129, 0.12),

            0 0 70px rgba(5, 150, 105, 0.08),

            /* INNER EMERALD SHADOW */
            inset 0 0 7px rgba(16, 185, 129, 0.14),

            inset 0 0 15px rgba(16, 185, 129, 0.08),

            inset 0 0 25px rgba(5, 150, 105, 0.045);

          opacity: 0.94;

          transition:
            width 0.34s cubic-bezier(.22,1,.36,1),
            height 0.34s cubic-bezier(.22,1,.36,1),
            border-color 0.3s ease,
            box-shadow 0.38s ease,
            opacity 0.3s ease,
            transform 0.22s ease;

          will-change: left, top, transform;
        }


        /* ========================================================
           INNER RING
        ======================================================== */

        .ai-cursor-inner {
          position: absolute;

          left: 50%;
          top: 50%;

          width: 17px;
          height: 17px;

          transform: translate(-50%, -50%);

          border-radius: 50%;

          border: 1px solid rgba(16, 185, 129, 0.25);

          box-shadow:

            0 0 5px rgba(16, 185, 129, 0.18),

            0 0 11px rgba(16, 185, 129, 0.10),

            inset 0 0 6px rgba(16, 185, 129, 0.08);

          transition:
            width 0.32s ease,
            height 0.32s ease,
            border-color 0.32s ease,
            box-shadow 0.32s ease;
        }


        /* ========================================================
           SMALL LIGHT REFLECTION
        ======================================================== */

        .ai-cursor-highlight {
          position: absolute;

          width: 7px;
          height: 7px;

          top: 9px;
          left: 11px;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(255, 255, 255, 0.72),
              rgba(255, 255, 255, 0.16) 45%,
              transparent 75%
            );

          filter: blur(0.5px);

          opacity: 0.55;

          transition:
            opacity 0.3s ease,
            transform 0.3s ease;
        }


        /* ========================================================
           CENTER EMERALD DOT
        ======================================================== */

        .ai-cursor-dot {
          position: fixed;

          width: 9px;
          height: 9px;

          left: 50%;
          top: 50%;

          transform: translate(-50%, -50%);

          pointer-events: none;

          z-index: 999999;

          border-radius: 50%;

          background:
            radial-gradient(
              circle at 35% 30%,
              #a7f3d0 0%,
              #34d399 22%,
              #10b981 55%,
              #059669 100%
            );

          box-shadow:

            /* WHITE EDGE */
            0 0 0 2px rgba(255, 255, 255, 0.88),

            /* CLOSE GLOW */
            0 0 5px rgba(16, 185, 129, 0.95),

            0 0 10px rgba(16, 185, 129, 0.82),

            /* MEDIUM GLOW */
            0 0 17px rgba(16, 185, 129, 0.62),

            0 0 27px rgba(16, 185, 129, 0.44),

            /* LARGE GLOW */
            0 0 40px rgba(16, 185, 129, 0.26),

            0 0 60px rgba(5, 150, 105, 0.16);

          transition:
            width 0.25s ease,
            height 0.25s ease,
            transform 0.18s ease,
            box-shadow 0.28s ease;

          will-change: left, top, transform;
        }


        /* ========================================================
           HOVER STATE
        ======================================================== */

        .ai-cursor-ring.ring-hover {
          width: 72px;
          height: 72px;

          border-color: rgba(16, 185, 129, 0.88);

          box-shadow:

            /* STRONGER OUTER SHADOW */
            0 0 8px rgba(16, 185, 129, 0.48),

            0 0 16px rgba(16, 185, 129, 0.38),

            0 0 28px rgba(16, 185, 129, 0.30),

            0 0 44px rgba(16, 185, 129, 0.22),

            0 0 65px rgba(16, 185, 129, 0.15),

            0 0 90px rgba(5, 150, 105, 0.08),

            /* INNER SHADOW */
            inset 0 0 9px rgba(16, 185, 129, 0.18),

            inset 0 0 18px rgba(16, 185, 129, 0.10),

            inset 0 0 30px rgba(5, 150, 105, 0.06);
        }


        /* ========================================================
           INNER RING HOVER
        ======================================================== */

        .ai-cursor-ring.ring-hover .ai-cursor-inner {
          width: 23px;
          height: 23px;

          border-color: rgba(52, 211, 153, 0.40);

          box-shadow:

            0 0 7px rgba(16, 185, 129, 0.26),

            0 0 15px rgba(16, 185, 129, 0.16),

            inset 0 0 8px rgba(16, 185, 129, 0.12);
        }


        /* ========================================================
           DOT HOVER
        ======================================================== */

        .ai-cursor-dot.cursor-hover {
          width: 7px;
          height: 7px;

          box-shadow:

            0 0 0 2px rgba(255, 255, 255, 0.94),

            0 0 6px rgba(16, 185, 129, 1),

            0 0 13px rgba(16, 185, 129, 0.90),

            0 0 22px rgba(16, 185, 129, 0.70),

            0 0 34px rgba(16, 185, 129, 0.52),

            0 0 50px rgba(16, 185, 129, 0.32),

            0 0 72px rgba(5, 150, 105, 0.18);
        }


        /* ========================================================
           GLOW HOVER
        ======================================================== */

        .ai-cursor-glow.glow-hover {
          width: 125px;
          height: 125px;

          opacity: 1;

          background:
            radial-gradient(
              circle,
              rgba(16, 185, 129, 0.20) 0%,
              rgba(16, 185, 129, 0.12) 24%,
              rgba(52, 211, 153, 0.075) 42%,
              rgba(5, 150, 105, 0.04) 58%,
              transparent 78%
            );

          filter: blur(8px);
        }


        /* ========================================================
           HOVER HIGHLIGHT
        ======================================================== */

        .ring-hover .ai-cursor-highlight {
          opacity: 0.82;

          transform: scale(1.15);
        }


        /* ========================================================
           CLICK ANIMATION
        ======================================================== */

        .ai-cursor-dot.cursor-click {
          transform:
            translate(-50%, -50%)
            scale(0.60);

          box-shadow:

            0 0 0 3px rgba(255, 255, 255, 0.95),

            0 0 8px rgba(16, 185, 129, 1),

            0 0 18px rgba(16, 185, 129, 0.95),

            0 0 32px rgba(16, 185, 129, 0.70),

            0 0 55px rgba(16, 185, 129, 0.42);
        }


        .ai-cursor-ring.ring-click {
          transform:
            translate(-50%, -50%)
            scale(1.20);

          opacity: 0.42;

          box-shadow:

            0 0 10px rgba(16, 185, 129, 0.55),

            0 0 24px rgba(16, 185, 129, 0.42),

            0 0 44px rgba(16, 185, 129, 0.28),

            0 0 75px rgba(16, 185, 129, 0.16),

            inset 0 0 15px rgba(16, 185, 129, 0.12);

          transition:
            transform 0.12s ease,
            opacity 0.18s ease,
            box-shadow 0.18s ease;
        }


        .ai-cursor-glow.glow-click {
          transform:
            translate(-50%, -50%)
            scale(1.18);

          opacity: 1;

          transition:
            transform 0.12s ease,
            opacity 0.12s ease;
        }


        /* ========================================================
           DESKTOP
        ======================================================== */

        @media (min-width: 769px) {

          .ai-cursor-dot,
          .ai-cursor-ring,
          .ai-cursor-glow {
            display: block;
          }

        }


        /* ========================================================
           MOBILE
        ======================================================== */

        @media (max-width: 768px) {

          .ai-cursor-dot,
          .ai-cursor-ring,
          .ai-cursor-glow {
            display: none !important;
          }

        }

      `}</style>
    </>
  );
};

export default CustomCursor;
