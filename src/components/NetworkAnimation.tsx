'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function NetworkAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const fadeInRef = useRef(0);

  const initNodes = useCallback((width: number, height: number) => {
    const nodes: Node[] = [];
    const nodeCount = 60; // Slightly fewer nodes for cleaner organic look

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8, // Slower, more organic movement
        vy: (Math.random() - 0.5) * 0.8
      });
    }
    return nodes;
  }, []);

  const updateNodePositions = useCallback((nodes: Node[], width: number, height: number) => {
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      // Gentle bounce with damping
      if (node.x <= 0 || node.x >= width) node.vx *= -1;
      if (node.y <= 0 || node.y >= height) node.vy *= -1;
    });
  }, []);

  const drawNetwork = useCallback((ctx: CanvasRenderingContext2D, nodes: Node[], opacity: number) => {
    // Draw connections
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeA = nodes[i];
        const nodeB = nodes[j];
        
        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Connect any nodes within range for organic mesh
        if (dist < 150) { 
            const lineOpacity = (1 - dist / 150) * 0.5 * opacity;
            ctx.strokeStyle = `rgba(45, 212, 191, ${lineOpacity})`; // Teal
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 130, 246, ${opacity * 0.8})`; // Blue
      ctx.fill();
    });
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (fadeInRef.current < 1) {
      fadeInRef.current += 0.01;
    }

    const opacity = fadeInRef.current;
    const nodes = nodesRef.current;

    updateNodePositions(nodes, canvas.width, canvas.height);
    drawNetwork(ctx, nodes, opacity);

    animationRef.current = requestAnimationFrame(animate);
  }, [updateNodePositions, drawNetwork]);

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
