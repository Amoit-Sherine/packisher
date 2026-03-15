"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Magnifying glass radius (px) and peak scale at cursor centre
const RADIUS = 80;
const MAX_SCALE = 1.55;
const SELECTOR = "h1, h2, h3";

type CharEntry = { span: HTMLSpanElement; cx: number; cy: number };

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

export default function TextMagnifier() {
  const pathname = usePathname();

  useEffect(() => {
    const chars: CharEntry[] = [];
    // Map from element → its innerHTML before we touched it
    const originals = new Map<HTMLElement, string>();

    // ── Wrap text nodes: each WORD is a no-break container ──
    // so the browser can only break lines between whole words,
    // not inside a word between individual character spans.
    function wrapTextNodes(el: HTMLElement) {
      const walker = document.createTreeWalker(
        el,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (n) =>
            (n.textContent ?? "").trim()
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_SKIP,
        }
      );

      const textNodes: Text[] = [];
      let node: Node | null;
      while ((node = walker.nextNode())) textNodes.push(node as Text);

      for (const textNode of textNodes) {
        const text = textNode.textContent ?? "";
        const frag = document.createDocumentFragment();

        // Split on whitespace runs, preserving the whitespace tokens
        const tokens = text.split(/(\s+)/);
        for (const token of tokens) {
          if (/^\s+$/.test(token)) {
            // Pure whitespace — plain text node allows natural line-breaks between words
            frag.appendChild(document.createTextNode(token));
          } else if (token.length > 0) {
            // Word — a no-break wrapper prevents mid-word breaks
            const wordSpan = document.createElement("span");
            wordSpan.className = "mc-word";
            for (const char of token) {
              const span = document.createElement("span");
              span.className = "mc";
              span.textContent = char;
              wordSpan.appendChild(span);
              chars.push({ span, cx: 0, cy: 0 });
            }
            frag.appendChild(wordSpan);
          }
        }
        textNode.parentNode?.replaceChild(frag, textNode);
      }
    }

    function updateRects() {
      for (const c of chars) {
        const r = c.span.getBoundingClientRect();
        c.cx = r.left + r.width * 0.5;
        c.cy = r.top + r.height * 0.5;
      }
    }

    // Delay slightly so React has flushed its render
    const initTimer = setTimeout(() => {
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        // Skip text inside frosted glass hero panels — they stay undistorted
        if (el.closest(".hero-glass")) return;
        originals.set(el, el.innerHTML);
        wrapTextNodes(el);
      });
      updateRects();
    }, 80);

    // ── RAF cursor loop ──
    let rafId = 0;
    let mouseX = -9999;
    let mouseY = -9999;

    function update() {
      const vh = window.innerHeight;
      for (const c of chars) {
        // Skip offscreen chars for performance
        if (c.cy < -200 || c.cy > vh + 200) {
          if (c.span.style.transform) c.span.style.transform = "";
          continue;
        }
        const dx = c.cx - mouseX;
        const dy = c.cy - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, 1 - dist / RADIUS);
        const scale = 1 + (MAX_SCALE - 1) * smoothstep(proximity);
        if (scale > 1.005) {
          c.span.style.transform = `scale(${scale.toFixed(3)})`;
        } else if (c.span.style.transform) {
          c.span.style.transform = "";
        }
      }
    }

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    }

    function onMouseLeave() {
      mouseX = -9999;
      mouseY = -9999;
      chars.forEach((c) => {
        if (c.span.style.transform) c.span.style.transform = "";
      });
    }

    let scrollDebounce = 0;
    function onScroll() {
      if (scrollDebounce) cancelAnimationFrame(scrollDebounce);
      scrollDebounce = requestAnimationFrame(() => {
        updateRects();
        update();
      });
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateRects);

    return () => {
      clearTimeout(initTimer);
      if (rafId) cancelAnimationFrame(rafId);
      if (scrollDebounce) cancelAnimationFrame(scrollDebounce);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateRects);

      // Restore original DOM
      originals.forEach((html, el) => {
        el.innerHTML = html;
      });
      chars.length = 0;
      originals.clear();
    };
  }, [pathname]);

  return (
    <style>{`
      /* Word container — prevents mid-word line breaks */
      .mc-word {
        display: inline-block;
        white-space: nowrap;
      }
      /* Individual character spans */
      .mc {
        display: inline-block;
        transition: transform 0.1s ease;
        will-change: transform;
      }
    `}</style>
  );
}
