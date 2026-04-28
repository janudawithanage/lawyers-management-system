import { useEffect, useRef } from "react";

/**
 * FloatingScale3D — A pure CSS/Canvas 3D animated "Scales of Justice"
 * that floats and rotates gently. Perfectly themed for a legal platform.
 *
 * Uses a single canvas to draw a stylized, glowing scale illustration
 * that slowly rotates and bobs in 3D space.
 */
export default function FloatingScale3D({ className = "" }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const SIZE = 400;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    canvas.style.width = `${SIZE}px`;
    canvas.style.height = `${SIZE}px`;
    ctx.scale(dpr, dpr);

    const cx = SIZE / 2;
    const cy = SIZE / 2;

    let time = 0;

    const drawScale = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      time += 0.008;

      const tilt = Math.sin(time) * 0.12;
      const bob = Math.sin(time * 1.3) * 4;
      const sway = Math.sin(time * 0.7) * 3;

      ctx.save();
      ctx.translate(cx + sway, cy + bob);

      // ── Outer glow ring ──
      const glowGrad = ctx.createRadialGradient(0, 0, 60, 0, 0, 180);
      glowGrad.addColorStop(0, "rgba(198, 167, 94, 0.06)");
      glowGrad.addColorStop(0.5, "rgba(198, 167, 94, 0.02)");
      glowGrad.addColorStop(1, "rgba(198, 167, 94, 0)");
      ctx.beginPath();
      ctx.arc(0, 0, 180, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // ── Center pillar ──
      const pillarGrad = ctx.createLinearGradient(0, -80, 0, 80);
      pillarGrad.addColorStop(0, "rgba(198, 167, 94, 0.6)");
      pillarGrad.addColorStop(0.5, "rgba(198, 167, 94, 0.35)");
      pillarGrad.addColorStop(1, "rgba(198, 167, 94, 0.15)");

      ctx.beginPath();
      ctx.roundRect(-3, -80, 6, 160, 3);
      ctx.fillStyle = pillarGrad;
      ctx.fill();

      // ── Top crown / ornament ──
      ctx.beginPath();
      ctx.arc(0, -85, 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(198, 167, 94, 0.5)";
      ctx.fill();

      // Inner crown
      ctx.beginPath();
      ctx.arc(0, -85, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(232, 193, 92, 0.7)";
      ctx.fill();

      // ── Beam (tilts) ──
      ctx.save();
      ctx.rotate(tilt);

      const beamGrad = ctx.createLinearGradient(-100, 0, 100, 0);
      beamGrad.addColorStop(0, "rgba(198, 167, 94, 0.5)");
      beamGrad.addColorStop(0.5, "rgba(232, 193, 92, 0.6)");
      beamGrad.addColorStop(1, "rgba(198, 167, 94, 0.5)");

      ctx.beginPath();
      ctx.roundRect(-100, -42, 200, 4, 2);
      ctx.fillStyle = beamGrad;
      ctx.fill();

      // ── Left chain & bowl ──
      const leftAngle = -tilt * 0.5;
      const leftChainY = 40;

      // Chain links (left)
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.moveTo(-90, -40);
      ctx.lineTo(-90 + Math.sin(leftAngle) * 5, leftChainY);
      ctx.strokeStyle = "rgba(198, 167, 94, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);

      // Left bowl
      ctx.save();
      ctx.translate(-90 + Math.sin(leftAngle) * 5, leftChainY + 5);

      // Bowl glow
      const bowlGlowL = ctx.createRadialGradient(0, 0, 10, 0, 0, 45);
      bowlGlowL.addColorStop(0, "rgba(198, 167, 94, 0.12)");
      bowlGlowL.addColorStop(1, "rgba(198, 167, 94, 0)");
      ctx.beginPath();
      ctx.arc(0, 5, 45, 0, Math.PI * 2);
      ctx.fillStyle = bowlGlowL;
      ctx.fill();

      // Bowl shape
      ctx.beginPath();
      ctx.ellipse(0, 0, 35, 12, 0, 0, Math.PI);
      ctx.fillStyle = "rgba(198, 167, 94, 0.2)";
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(0, 0, 35, 8, 0, 0, Math.PI * 2);
      const bowlStrokeL = ctx.createLinearGradient(-35, 0, 35, 0);
      bowlStrokeL.addColorStop(0, "rgba(198, 167, 94, 0.15)");
      bowlStrokeL.addColorStop(0.5, "rgba(232, 193, 92, 0.5)");
      bowlStrokeL.addColorStop(1, "rgba(198, 167, 94, 0.15)");
      ctx.strokeStyle = bowlStrokeL;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      // ── Right chain & bowl ──
      const rightAngle = tilt * 0.5;
      const rightChainY = 40;

      // Chain links (right)
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.moveTo(90, -40);
      ctx.lineTo(90 + Math.sin(rightAngle) * 5, rightChainY);
      ctx.strokeStyle = "rgba(198, 167, 94, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);

      // Right bowl
      ctx.save();
      ctx.translate(90 + Math.sin(rightAngle) * 5, rightChainY + 5);

      // Bowl glow
      const bowlGlowR = ctx.createRadialGradient(0, 0, 10, 0, 0, 45);
      bowlGlowR.addColorStop(0, "rgba(52, 211, 153, 0.1)");
      bowlGlowR.addColorStop(1, "rgba(52, 211, 153, 0)");
      ctx.beginPath();
      ctx.arc(0, 5, 45, 0, Math.PI * 2);
      ctx.fillStyle = bowlGlowR;
      ctx.fill();

      // Bowl shape
      ctx.beginPath();
      ctx.ellipse(0, 0, 35, 12, 0, 0, Math.PI);
      ctx.fillStyle = "rgba(52, 211, 153, 0.12)";
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(0, 0, 35, 8, 0, 0, Math.PI * 2);
      const bowlStrokeR = ctx.createLinearGradient(-35, 0, 35, 0);
      bowlStrokeR.addColorStop(0, "rgba(52, 211, 153, 0.1)");
      bowlStrokeR.addColorStop(0.5, "rgba(52, 211, 153, 0.4)");
      bowlStrokeR.addColorStop(1, "rgba(52, 211, 153, 0.1)");
      ctx.strokeStyle = bowlStrokeR;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
      ctx.restore(); // tilt

      // ── Base pedestal ──
      ctx.beginPath();
      ctx.ellipse(0, 80, 40, 10, 0, 0, Math.PI * 2);
      const baseGrad = ctx.createRadialGradient(0, 80, 5, 0, 80, 40);
      baseGrad.addColorStop(0, "rgba(198, 167, 94, 0.3)");
      baseGrad.addColorStop(1, "rgba(198, 167, 94, 0.05)");
      ctx.fillStyle = baseGrad;
      ctx.fill();

      // Base outline
      ctx.beginPath();
      ctx.ellipse(0, 80, 40, 10, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(198, 167, 94, 0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // ── Rotating orbit ring ──
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.beginPath();
      ctx.ellipse(0, 0, 130, 50, time * 0.3, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(198, 167, 94, 1)";
      ctx.lineWidth = 0.5;
      ctx.setLineDash([3, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // ── Floating dots on orbit ──
      for (let i = 0; i < 4; i++) {
        const angle = time * 0.5 + (Math.PI * 2 * i) / 4;
        const ox = Math.cos(angle + time * 0.3) * 130;
        const oy = Math.sin(angle + time * 0.3) * 50;
        ctx.beginPath();
        ctx.arc(ox, oy, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(198, 167, 94, ${0.2 + Math.sin(time + i) * 0.1})`;
        ctx.fill();
      }

      ctx.restore(); // main translate

      animRef.current = requestAnimationFrame(drawScale);
    };

    animRef.current = requestAnimationFrame(drawScale);

    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: 400,
        height: 400,
        perspective: "800px",
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          animation: "scale3d-float 8s ease-in-out infinite",
        }}
      />
    </div>
  );
}
