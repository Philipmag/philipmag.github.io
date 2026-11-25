import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  brightness: number;
  pulseSpeed: number;
  pulseOffset: number;
}

const BG_COLOR = "rgb(6, 18, 68)";
const CONNECTION_DIST = 168;
const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;
const MAX_PARTICLES = 34;

// Mobile receives the same night-sky feeling without a canvas render loop.
function MobileBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        backgroundColor: BG_COLOR,
        backgroundImage:
          "radial-gradient(ellipse 85% 62% at 18% 22%, rgba(59,137,255,0.17) 0%, transparent 60%)," +
          "radial-gradient(ellipse 76% 55% at 86% 76%, rgba(105,120,255,0.13) 0%, transparent 64%)," +
          "radial-gradient(circle at 1px 1px, rgba(186,219,255,0.14) 1px, transparent 1.5px)",
        backgroundSize: "auto, auto, 38px 38px",
      }}
    />
  );
}

function paintBackdrop(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number
) {
  context.fillStyle = BG_COLOR;
  context.fillRect(0, 0, width, height);

  const sweep = Math.sin(time * 0.0025) * 0.04;
  const upperGlow = context.createRadialGradient(
    width * (0.18 + sweep),
    height * 0.20,
    0,
    width * (0.18 + sweep),
    height * 0.20,
    Math.max(width, height) * 0.72
  );
  upperGlow.addColorStop(0, "rgba(42, 112, 242, 0.20)");
  upperGlow.addColorStop(0.52, "rgba(17, 59, 164, 0.08)");
  upperGlow.addColorStop(1, "rgba(6, 18, 68, 0)");
  context.fillStyle = upperGlow;
  context.fillRect(0, 0, width, height);

  const lowerGlow = context.createRadialGradient(
    width * (0.82 - sweep),
    height * 0.78,
    0,
    width * (0.82 - sweep),
    height * 0.78,
    Math.max(width, height) * 0.62
  );
  lowerGlow.addColorStop(0, "rgba(92, 105, 246, 0.15)");
  lowerGlow.addColorStop(0.58, "rgba(25, 54, 150, 0.06)");
  lowerGlow.addColorStop(1, "rgba(6, 18, 68, 0)");
  context.fillStyle = lowerGlow;
  context.fillRect(0, 0, width, height);
}

export function EnhancedNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    if (isMobile) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;
    context.imageSmoothingEnabled = true;

    let resizeTimer: ReturnType<typeof setTimeout>;
    const resizeCanvas = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }, 150);
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener("resize", resizeCanvas, { passive: true });

    if (prefersReducedMotion) {
      paintBackdrop(context, canvas.width, canvas.height, 0);
      return () => {
        window.removeEventListener("resize", resizeCanvas);
        clearTimeout(resizeTimer);
      };
    }

    const particleCount = Math.min(
      MAX_PARTICLES,
      Math.max(16, Math.floor((window.innerWidth * window.innerHeight) / 24000))
    );
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.11,
      vy: (Math.random() - 0.5) * 0.11,
      radius: Math.random() * 1.25 + 0.85,
      brightness: Math.random() * 0.27 + 0.38,
      pulseSpeed: Math.random() * 0.014 + 0.008,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    let animationFrameId = 0;
    let time = 0;
    let paused = false;

    const drawParticle = (particle: Particle) => {
      const pulse = Math.sin(time * particle.pulseSpeed + particle.pulseOffset);
      const brightness = Math.max(0.46, Math.min(1, particle.brightness + pulse * 0.20));
      const glowRadius = particle.radius * 8;
      const glow = context.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        glowRadius
      );
      glow.addColorStop(0, `rgba(187, 225, 255, ${(brightness * 0.52).toFixed(3)})`);
      glow.addColorStop(0.35, `rgba(103, 181, 255, ${(brightness * 0.20).toFixed(3)})`);
      glow.addColorStop(1, "rgba(65, 118, 255, 0)");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2);
      context.fill();

      context.strokeStyle = `rgba(207, 234, 255, ${(brightness * 0.34).toFixed(3)})`;
      context.lineWidth = 0.7;
      context.beginPath();
      context.moveTo(particle.x - particle.radius * 3.1, particle.y);
      context.lineTo(particle.x + particle.radius * 3.1, particle.y);
      context.moveTo(particle.x, particle.y - particle.radius * 3.1);
      context.lineTo(particle.x, particle.y + particle.radius * 3.1);
      context.stroke();

      context.fillStyle = `rgba(223, 242, 255, ${(brightness * 0.78).toFixed(3)})`;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    };

    const animate = () => {
      if (paused) return;
      time += 1;
      const width = canvas.width;
      const height = canvas.height;
      paintBackdrop(context, width, height, time);

      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < -30) particle.x = width + 30;
        else if (particle.x > width + 30) particle.x = -30;
        if (particle.y < -30) particle.y = height + 30;
        else if (particle.y > height + 30) particle.y = -30;
      }

      context.lineCap = "round";
      for (let index = 0; index < particles.length; index += 1) {
        for (let compareIndex = index + 1; compareIndex < particles.length; compareIndex += 1) {
          const first = particles[index];
          const second = particles[compareIndex];
          const dx = second.x - first.x;
          const dy = second.y - first.y;
          const distanceSquared = dx * dx + dy * dy;

          if (distanceSquared >= CONNECTION_DIST_SQ) continue;

          const distance = Math.sqrt(distanceSquared);
          const proximity = 1 - distance / CONNECTION_DIST;
          const opacity = proximity * proximity * 0.26;
          context.strokeStyle = `rgba(124, 192, 255, ${opacity.toFixed(3)})`;
          context.lineWidth = 0.5 + proximity * 0.8;
          context.beginPath();
          context.moveTo(first.x, first.y);
          context.lineTo(second.x, second.y);
          context.stroke();
        }
      }

      for (const particle of particles) drawParticle(particle);
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleVisibility = () => {
      paused = document.hidden;
      if (!paused) animationFrameId = requestAnimationFrame(animate);
    };

    document.addEventListener("visibilitychange", handleVisibility);
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("visibilitychange", handleVisibility);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimer);
    };
  }, [isMobile]);

  if (isMobile) return <MobileBackground />;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 h-full w-full pointer-events-none"
      style={{ zIndex: 1, willChange: "transform" }}
      aria-hidden="true"
    />
  );
}
