"use client";

import React, { useEffect, useRef } from "react";

export const ArabicFontWrapper = ({ children, className = "" }) => {
  return (
    <div className={`font-cairo ${className}`}>
      {children}
    </div>
  );
};

export const ArabicText = ({ children, className = "", ...props }) => {
  return (
    <span className={`font-cairo ${className}`} {...props}>
      {children}
    </span>
  );
};

export const ArabicHeading = ({ children, className = "", as = "h2", ...props }) => {
  const Component = as;
  return (
    <Component className={`font-cairo font-semibold ${className}`} {...props}>
      {children}
    </Component>
  );
};

export const ArabicParagraph = ({ children, className = "", ...props }) => {
  return (
    <p className={`font-cairo leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
};

export const ArabicButton = ({ children, className = "", ...props }) => {
  return (
    <button className={`font-cairo ${className}`} {...props}>
      {children}
    </button>
  );
};

export const ArabicInput = ({ className = "", ...props }) => {
  return (
    <input className={`font-cairo ${className}`} {...props} />
  );
};

// Background components (existing)
export const BackgroundGradient = ({ children, className = "" }) => {
  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 ${className}`}>
      {children}
    </div>
  );
};

export const BackgroundPattern = ({ children, className = "" }) => {
  return (
    <div className={`bg-white dark:bg-gray-900 ${className}`} style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    }}>
      {children}
    </div>
  );
};

export const CustomBackground = ({ className }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    // Create particles
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = `rgba(79, 70, 229, ${Math.random() * 0.5 + 0.1})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Boundary check with bounce effect
        if (this.x < 0 || this.x > canvas.width) {
          this.speedX = -this.speedX;
        }
        if (this.y < 0 || this.y > canvas.height) {
          this.speedY = -this.speedY;
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create wave effect
    const drawWave = (time) => {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "rgba(79, 70, 229, 0.3)");
      gradient.addColorStop(0.5, "rgba(96, 165, 250, 0.1)");
      gradient.addColorStop(1, "rgba(79, 70, 229, 0.3)");

      ctx.fillStyle = gradient;

      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const amplitude = 20 + i * 10;
        const frequency = 0.005 - i * 0.001;
        const timeOffset = i * 1000;

        ctx.moveTo(0, canvas.height / 2);

        for (let x = 0; x < canvas.width; x++) {
          const y = Math.sin(x * frequency + (time + timeOffset) / 1000) * amplitude + canvas.height / 2 + i * 50;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
      }
    };

    // Initialize particles
    const init = () => {
      particles = [];
      const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 20000));

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    // Animation loop
    const animate = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, "rgba(249, 250, 251, 1)");
      bgGradient.addColorStop(1, "rgba(243, 244, 246, 1)");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw waves
      drawWave(timestamp);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate(0);

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}; 