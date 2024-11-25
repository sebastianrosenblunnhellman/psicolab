'use client';

import { useEffect, useRef, useState } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
}

export default function NetworkAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const fadeInRef = useRef(0);

  const initNodes = (width: number, height: number) => {
    const nodes: Node[] = [];
    const nodeCount = 30; 

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1, 
        vy: (Math.random() - 0.5) * 1,
        connections: []
      });
    }

    // Create connections
    nodes.forEach((node, i) => {
      const connectionCount = 3 + Math.floor(Math.random() * 3); 
      for (let j = 0; j < connectionCount; j++) {
        const target = Math.floor(Math.random() * nodeCount);
        if (target !== i && !node.connections.includes(target)) {
          node.connections.push(target);
        }
      }
    });

    return nodes;
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isHovering) {
      fadeInRef.current = Math.min(fadeInRef.current + 0.05, 1); 
    } else {
      fadeInRef.current = Math.max(fadeInRef.current - 0.03, 0);
    }

    // Siempre visible con opacidad mínima
    const opacity = 0.2 + (fadeInRef.current * 0.8);

    // Update and draw nodes
    const nodes = nodesRef.current;
    nodes.forEach(node => {
      // Update position
      node.x += node.vx;
      node.y += node.vy;

      // Bounce off walls
      if (node.x <= 0 || node.x >= canvas.width) node.vx *= -1;
      if (node.y <= 0 || node.y >= canvas.height) node.vy *= -1;

      // Draw connections
      ctx.beginPath();
      node.connections.forEach(targetIndex => {
        const target = nodes[targetIndex];
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(target.x, target.y);
      });
      ctx.strokeStyle = `rgba(45, 212, 191, ${0.2 * opacity})`; 
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw node
      ctx.beginPath();
      ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`; 
      ctx.fill();
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const handleResize = () => {
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        nodesRef.current = initNodes(canvas.width, canvas.height);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
}
