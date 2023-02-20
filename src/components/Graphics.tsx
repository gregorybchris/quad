import { useEffect, useRef, useState } from "react";
import World, { forEachParticle } from "../../src/lib/models/world";
import { useAnimationFrame } from "../../src/lib/hooks/animation";
import { colorToHex } from "../../src/lib/color";
import Particle from "../../src/lib/models/particle";
import { Box, PointRange, scalePoint } from "../../src/lib/math";

interface GraphicsProps {
  running: boolean;
  onUpdate: (deltaTime: number) => void;
  world: World;
}

export default function Graphics(props: GraphicsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState<Box>({ width: 0, height: 0 });
  useAnimationFrame(props.onUpdate, props.running);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Couldn't get canvas");
      return;
    }

    const observer = new ResizeObserver(() => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      setCanvasSize({
        width: canvas.width,
        height: canvas.height,
      });
    });
    observer.observe(canvas);

    return () => observer.unobserve(canvas);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!context) {
      console.error("Couldn't get graphics context");
      return;
    }

    renderScene(context);
  }, [props.world, canvasSize]);

  function renderScene(context: CanvasRenderingContext2D) {
    context.clearRect(0, 0, canvasSize.width, canvasSize.height);
    forEachParticle(props.world, (particle: Particle) => renderParticle(context, particle));
  }

  function renderParticle(context: CanvasRenderingContext2D, particle: Particle) {
    const particleRadius = 1.5;
    const position = scalePoint(particle.position, props.world.bounds, {
      x: { min: 0, max: canvasSize.width },
      y: { min: 0, max: canvasSize.height },
    });
    context.beginPath();
    context.arc(position.x, position.y, particleRadius, 0, 2 * Math.PI);
    context.fillStyle = colorToHex(particle.color);
    context.fill();
  }

  return (
    <div className="mx-8 mb-10 h-96 w-full md:mx-0 md:h-96 md:w-1/2">
      <canvas className="block h-full w-full bg-slate-700" ref={canvasRef} />
    </div>
  );
}
