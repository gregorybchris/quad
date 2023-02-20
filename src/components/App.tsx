import { useEffect, useState } from "react";
import Simulation from "./Simulation";

export default function App() {
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setRunning(true);
    return () => setRunning(false);
  }, []);

  return (
    <div className="min-w-screen font-main min-h-screen  bg-slate-900 font-sen text-lg text-slate-200">
      <div className="py-10 text-center">QuadTree</div>
      <Simulation running={running} setRunning={setRunning} />
    </div>
  );
}
