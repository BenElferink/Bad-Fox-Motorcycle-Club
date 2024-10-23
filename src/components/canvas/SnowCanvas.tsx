import { useEffect, useRef } from 'react';
import useScreenSize from '../../hooks/useScreenSize';

const SnowCanvas = () => {
  const { screenWidth, screenHeight } = useScreenSize();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef(0);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;

    cvs.width = screenWidth;
    cvs.height = screenHeight;

    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    const particlesOnScreen = screenWidth / 10;
    const particlesArray: {
      x: number
      y: number
      opacity: number
      speedX: number
      speedY: number
      radius: number
    }[] = [];

    const random = (min: number, max: number): number => min + Math.random() * (max - min + 1);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      if (!particlesArray.length) {
        // initial snow flakes
        for (var i = 0; i < particlesOnScreen; i++) {
          particlesArray.push({
            x: Math.random() * w,
            y: Math.random() * h,
            opacity: Math.random(),
            speedX: random(-1.5, 1.5),
            speedY: random(0.5, 4),
            radius: random(0.5, 3.5),
          });
        }
      }

      for (let i = 0; i < particlesArray.length; i++) {
        const { x, y, radius, opacity, speedX, speedY } = particlesArray[i];

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`); // white
        gradient.addColorStop(0.8, `rgba(210, 236, 242, ${opacity})`); // bluish
        gradient.addColorStop(1, `rgba(237, 247, 249, ${opacity})`); // lighter bluish

        // draw this snow flake
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, false);
        ctx.fillStyle = gradient;
        ctx.fill();

        // move this snow flake
        particlesArray[i].x += speedX;
        particlesArray[i].y += speedY;
        if (particlesArray[i].y > h) {
          particlesArray[i].x = Math.random() * w * 1.5;
          particlesArray[i].y = -50;
        }
      }

      animationFrameId.current = window.requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.cancelAnimationFrame(animationFrameId.current);
    };
  }, [screenWidth, screenHeight]);

  return <canvas ref={canvasRef} className='fixed top-0 left-0 z-50 pointer-events-none' />;
};

export default SnowCanvas;
