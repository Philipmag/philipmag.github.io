import { useEffect, useRef } from "react";

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

export function EnhancedNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to full viewport
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create particles spread across the full viewport
    const particleCount = 55;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        radius: Math.random() * 2.0 + 1.5,
        brightness: Math.random() * 0.4 + 0.6,
        pulseSpeed: Math.random() * 0.015 + 0.008,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      time++;

      // Fill with the site's dark background color (so canvas IS the background)
      ctx.fillStyle = 'oklch(0.13 0.03 270)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < -30) particle.x = canvas.width + 30;
        if (particle.x > canvas.width + 30) particle.x = -30;
        if (particle.y < -30) particle.y = canvas.height + 30;
        if (particle.y > canvas.height + 30) particle.y = -30;

        // Smooth pulsing brightness
        const pulse = Math.sin(time * particle.pulseSpeed + particle.pulseOffset);
        const currentBrightness = particle.brightness + pulse * 0.2;
        const b = Math.max(0.5, Math.min(1, currentBrightness));

        // Draw large outer glow (bright cyan)
        const glowRadius = particle.radius * 8;
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowRadius
        );
        glowGradient.addColorStop(0, `rgba(100, 240, 255, ${b * 0.9})`);
        glowGradient.addColorStop(0.3, `rgba(60, 200, 255, ${b * 0.5})`);
        glowGradient.addColorStop(0.6, `rgba(40, 160, 255, ${b * 0.2})`);
        glowGradient.addColorStop(1, `rgba(40, 120, 255, 0)`);

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw bright cyan core dot
        ctx.fillStyle = `rgba(160, 240, 255, ${b * 0.95})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();

        // Bright white center highlight
        ctx.fillStyle = `rgba(255, 255, 255, ${b})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 0.45, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections between nearby particles
      const connectionDistance = 200;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particles[i].x;
          const dy = particles[j].y - particles[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const proximity = 1 - distance / connectionDistance;
            const opacity = proximity * proximity * 0.55;
            const avgB = (particles[i].brightness + particles[j].brightness) / 2;

            ctx.strokeStyle = `rgba(80, 220, 255, ${opacity * avgB})`;
            ctx.lineWidth = proximity * 1.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Draw initial frame synchronously so background is visible immediately on mount
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1, opacity: 1.0 }}
      aria-hidden="true"
    />
  );
}
