import { Box, scalePoint } from "../../src/lib/math";
import World, { forEachAgent } from "../../src/lib/models/world";
import { useEffect, useRef, useState } from "react";

import Agent from "../../src/lib/models/agent";
import { colorToHex } from "../../src/lib/color";
import { useAnimationFrame } from "../../src/lib/hooks/animation";

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
    forEachAgent(props.world, (agent: Agent) => renderAgent(context, agent));
  }

  function renderAgent(context: CanvasRenderingContext2D, agent: Agent) {
    const agentRadius = 1.5;
    const position = scalePoint(agent.position, props.world.bounds, {
      x: { min: 0, max: canvasSize.width },
      y: { min: 0, max: canvasSize.height },
    });
    context.beginPath();
    context.arc(position.x, position.y, agentRadius, 0, 2 * Math.PI);
    context.fillStyle = colorToHex(agent.color);
    context.fill();
  }

  return (
    <div className="mx-8 mb-10 h-96 w-full md:mx-0 md:h-96 md:w-1/2">
      <canvas className="block h-full w-full bg-slate-700" ref={canvasRef} />
    </div>
  );
}
