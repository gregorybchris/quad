import { Range } from "../math";

export default interface SimulationConfig {
  numAgents: number;
  neighborThreshold: number;
  treeCapacity: number;
  timeMultiplier: number;
  inertia: number;
  velocityRange: Range;
  noiseRange: Range;
}
