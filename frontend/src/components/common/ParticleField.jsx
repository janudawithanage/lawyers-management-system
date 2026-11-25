import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * ParticleField — Canvas constellation backdrop for the hero.
 *
 * Fixes over the previous implementation, all of which were costing frames:
 *
 *  • `ctx.scale(dpr, dpr)` was called on every resize. scale() multiplies the
 *    existing transform rather than replacing it, so each resize compounded
 *    the device-pixel-ratio and the field drifted off-canvas. Now uses
 *    setTransform, which is absolute.
 *
 *  • The loop called getBoundingClientRect() on the parent every single frame,
 *    forcing a synchronous layout 60×/second. Dimensions are now cached and
 *    only recomputed on resize.
 *
 *  • The rAF loop ran forever, including long after the hero had scrolled out
 *    of view. An IntersectionObserver now parks it when off-screen, and the
 *    Page Visibility API parks it when the tab is hidden — the usual cause of
 *    a laptop fan spinning up on a "static" marketing page.
 *
 *  • It renders nothing under `prefers-reduced-motion`, and thins out on
 *    small screens where the effect is invisible but the cost is not.
 */
export default function ParticleField({
  particleCount = 45,
  connectionDistance = 140,
  className = "",
  style = {},
}) {
  const canvasRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Thin the field on small screens: the constellation reads as texture at
    // phone size, so the extra nodes buy nothing and the O(n²) link pass is
    // the most expensive part of the frame.
    const isSmall = window.innerWidth < 768;
    const count = isSmall ? Math.round(particleCount * 0.5) : particleCount;
    const linkDist = isSmall ? connectionDistance * 0.8 : connectionDistance;

    let width = 0;
    let height = 0;
    let particles = [];
    let frame = null;
    let visible = true;
    const mouse = { x: -1000, y: -1000 };

    const seed = () => {
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.15,
        hue: Math.random() > 0.7 ? 160 : 42 + Math.random() * 10,
        saturation: 50 + Math.random() * 30,
        lightness: 55 + Math.random() * 20,
      }));
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      // Cap the backing store at 2× — beyond that the cost is real and the
      // visual difference on a blurred particle field is not.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      // Absolute, not cumulative.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!particles.length) seed();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        // Gentle repulsion from the cursor.
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mDist = Math.hypot(mdx, mdy);
        if (mDist < 120 && mDist > 0.01) {
          const force = (120 - mDist) / 120;
          p.vx += (mdx / mDist) * force * 0.02;
          p.vy += (mdy / mDist) * force * 0.02;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.999;
        p.vy *= 0.999;

        // Wrap at the edges.
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        const fill = `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, `;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${fill}${p.opacity})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `${fill}${p.opacity * 0.15})`;
        ctx.fill();
      }

      // Proximity links. Squared distances avoid a sqrt per pair.
      const linkSq = linkDist * linkDist;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq >= linkSq) continue;
          const alpha = (1 - Math.sqrt(distSq) / linkDist) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `hsla(42, 60%, 60%, ${alpha})`;
          ctx.stroke();
        }
      }
    };

    const tick = () => {
      draw();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame === null) frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
    };

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onPointerLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };

    resize();
    start();

    // Park the loop once the hero leaves the viewport.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [particleCount, connectionDistance, reduceMotion]);

  if (reduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 ${className}`}
      style={{ ...style, zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
