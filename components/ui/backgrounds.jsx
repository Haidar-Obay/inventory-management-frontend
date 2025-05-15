"use client";

import React, { useEffect, useRef } from "react";

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