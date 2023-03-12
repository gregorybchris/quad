import { Box, scalePoint } from "../../src/lib/math";
import Color, { colorToHex } from "../../src/lib/color";
import World, { forEachAgent } from "../../src/lib/models/world";
import { useEffect, useRef, useState } from "react";

import Agent from "../../src/lib/models/agent";
import GraphicsConfig from "../lib/configs/graphicsConfig";
import { None } from "../lib/types";
import Tree from "../lib/quad/tree";
import { useAnimationFrame } from "../../src/lib/hooks/animation";

interface GraphicsProps {
  running: boolean;
  onUpdate: (deltaTime: number) => void;
  world: World;
}

const CONFIG: GraphicsConfig = {
  agentRadius: 1.5,
  defaultAgentColor: Color.PURPLE,
  colors: [Color.BLUE, Color.RED, Color.YELLOW, Color.GREEN, Color.PURPLE, Color.PINK],
  treeLineWidth: 1,
  treeLineColor: Color.GREY,
};

export default function Graphics(props: GraphicsProps) {
  const [agentColor, setAgentColor] = useState<Color>(CONFIG.defaultAgentColor);
  const [displayTree, setDisplayTree] = useState(false);
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
    forEachAgent(props.world, (agent: Agent) => renderAgent(agent, context));
    if (displayTree) {
      renderTree(props.world.population.tree, context);
    }
  }

  function renderTree(tree: Tree<Agent>, context: CanvasRenderingContext2D) {
    if (tree.children !== None) {
      context.strokeStyle = colorToHex(CONFIG.treeLineColor);
      context.lineWidth = CONFIG.treeLineWidth;

      const canvasBounds = {
        x: { min: 0, max: canvasSize.width },
        y: { min: 0, max: canvasSize.height },
      };

      const c = tree.box.c;
      const hs = tree.box.hs;
      const p1 = scalePoint({ x: c.x - hs, y: c.y }, props.world.bounds, canvasBounds);
      const p2 = scalePoint({ x: c.x + hs, y: c.y }, props.world.bounds, canvasBounds);
      const p3 = scalePoint({ x: c.x, y: c.y - hs }, props.world.bounds, canvasBounds);
      const p4 = scalePoint({ x: c.x, y: c.y + hs }, props.world.bounds, canvasBounds);

      context.beginPath();
      context.moveTo(p1.x, p1.y);
      context.lineTo(p2.x, p2.y);
      context.moveTo(p3.x, p3.y);
      context.lineTo(p4.x, p4.y);
      context.stroke();
      renderTree(tree.children.ne, context);
      renderTree(tree.children.nw, context);
      renderTree(tree.children.se, context);
      renderTree(tree.children.sw, context);
    }
  }

  function renderAgent(agent: Agent, context: CanvasRenderingContext2D) {
    const agentRadius = CONFIG.agentRadius;
    const canvasBounds = {
      x: { min: 0, max: canvasSize.width },
      y: { min: 0, max: canvasSize.height },
    };
    const position = scalePoint(agent.position, props.world.bounds, canvasBounds);
    context.beginPath();
    context.arc(position.x, position.y, agentRadius, 0, 2 * Math.PI);
    context.fillStyle = colorToHex(agentColor);
    context.fill();
  }

  function onClick() {
    const index = CONFIG.colors.indexOf(agentColor);
    const newAgentColor = CONFIG.colors[(index + 1) % CONFIG.colors.length];
    setAgentColor(newAgentColor);

    setDisplayTree((old) => !old);
  }

  return (
    <div className="mx-8 mb-10 h-96 w-full border-4 border-gray-400 md:mx-0 md:h-96 md:w-1/2">
      <canvas className="block h-full w-full bg-slate-700" ref={canvasRef} onClick={onClick} />
    </div>
  );
}
