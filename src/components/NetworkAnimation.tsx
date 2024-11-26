'use client';

import { useEffect, useRef, useCallback } from 'react';

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
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const fadeInRef = useRef(0);

  const initNodes = useCallback((width: number, height: number) => {
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

    // Establecer conexiones
    nodes.forEach((node, i) => {
      const connections = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < connections; j++) {
        const targetIndex = Math.floor(Math.random() * nodeCount);
        if (targetIndex !== i && !node.connections.includes(targetIndex)) {
          node.connections.push(targetIndex);
        }
      }
    });

    return nodes;
  }, []);

  const updateNodePositions = useCallback((nodes: Node[], width: number, height: number) => {
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x <= 0 || node.x >= width) node.vx *= -1;
      if (node.y <= 0 || node.y >= height) node.vy *= -1;
    });
  }, []);

  const drawConnections = useCallback((ctx: CanvasRenderingContext2D, nodes: Node[], opacity: number) => {
    nodes.forEach(node => {
      ctx.beginPath();
      node.connections.forEach(targetIndex => {
        const target = nodes[targetIndex];
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(target.x, target.y);
      });
      ctx.strokeStyle = `rgba(45, 212, 191, ${0.2 * opacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }, []);

  const drawNodes = useCallback((ctx: CanvasRenderingContext2D, nodes: Node[], opacity: number) => {
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`;
      ctx.fill();
    });
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (fadeInRef.current < 1) {
      fadeInRef.current += 0.02;
    }

    const opacity = fadeInRef.current;
    const nodes = nodesRef.current;

    updateNodePositions(nodes, canvas.width, canvas.height);
    drawConnections(ctx, nodes, opacity);
    drawNodes(ctx, nodes, opacity);

    animationRef.current = requestAnimationFrame(animate);
  }, [updateNodePositions, drawConnections, drawNodes]);

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
  }, [animate, initNodes]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
}
