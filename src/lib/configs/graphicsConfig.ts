import Color from "../color";

export default interface GraphicsConfig {
  agentRadius: number;
  defaultAgentColor: Color;
  colors: Color[];
  treeLineWidth: number;
  treeLineColor: Color;
}
