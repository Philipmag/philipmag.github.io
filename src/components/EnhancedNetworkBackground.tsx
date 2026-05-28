import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  brightness: number;
}

export function EnhancedNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create particles with varying brightness
    const particleCount = 40;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        radius: Math.random() * 2 + 1,
        brightness: Math.random() * 0.5 + 0.5,
      });
    }

    let animationFrameId: number;

    const animate = () => {
      // Create gradient background from dark blue to lighter blue (like the reference image)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "rgba(15, 30, 60, 0.95)");
      gradient.addColorStop(0.5, "rgba(20, 50, 100, 0.95)");
      gradient.addColorStop(1, "rgba(30, 80, 150, 0.95)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add subtle particle noise/stars
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      for (let i = 0; i < 100; i++) {
        const x = Math.sin(i * 12.9898 + Date.now() * 0.0001) * canvas.width;
        const y = Math.cos(i * 78.233 + Date.now() * 0.00008) * canvas.height;
        ctx.fillRect(x, y, 1, 1);
      }

      // Update and draw particles
      particles.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges with smooth wrapping
        if (particle.x - particle.radius < 0 || particle.x + particle.radius > canvas.width) {
          particle.vx *= -1;
          particle.x = Math.max(particle.radius, Math.min(canvas.width - particle.radius, particle.x));
        }
        if (particle.y - particle.radius < 0 || particle.y + particle.radius > canvas.height) {
          particle.vy *= -1;
          particle.y = Math.max(particle.radius, Math.min(canvas.height - particle.radius, particle.y));
        }

        // Pulsing brightness effect
        particle.brightness += (Math.random() - 0.5) * 0.1;
        particle.brightness = Math.max(0.3, Math.min(1, particle.brightness));

        // Draw particle with glow (like the reference image)
        const glowGradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 4
        );

        // Bright white core with blue/cyan glow
        glowGradient.addColorStop(0, `rgba(255, 255, 255, ${particle.brightness * 0.8})`);
        glowGradient.addColorStop(0.3, `rgba(100, 200, 255, ${particle.brightness * 0.5})`);
        glowGradient.addColorStop(0.7, `rgba(50, 150, 255, ${particle.brightness * 0.2})`);
        glowGradient.addColorStop(1, `rgba(50, 150, 255, 0)`);

        ctx.fillStyle = glowGradient;
        ctx.fillRect(
          particle.x - particle.radius * 4,
          particle.y - particle.radius * 4,
          particle.radius * 8,
          particle.radius * 8
        );

        // Draw bright core
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.brightness})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections between nearby particles
      const connectionDistance = 250;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particles[i].x;
          const dy = particles[j].y - particles[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.4;
            const avgBrightness = (particles[i].brightness + particles[j].brightness) / 2;

            // Draw connection line with gradient
            const lineGradient = ctx.createLinearGradient(
              particles[i].x,
              particles[i].y,
              particles[j].x,
              particles[j].y
            );

            lineGradient.addColorStop(0, `rgba(100, 200, 255, ${opacity * avgBrightness})`);
            lineGradient.addColorStop(0.5, `rgba(150, 220, 255, ${opacity * avgBrightness * 0.8})`);
            lineGradient.addColorStop(1, `rgba(100, 200, 255, ${opacity * avgBrightness})`);

            ctx.strokeStyle = lineGradient;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-60"
      style={{ pointerEvents: "none" }}
    />
  );
}
