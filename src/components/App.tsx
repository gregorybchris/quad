import { useEffect, useState } from "react";

import Simulation from "./Simulation";

export default function App() {
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setRunning(true);
    return () => setRunning(false);
  }, []);

  return (
    <div className="min-w-screen font-main min-h-screen bg-slate-900 font-sen text-gray-400">
      <div className="select-none py-10 text-center text-3xl font-bold">QuadTree</div>
      <Simulation running={running} setRunning={setRunning} />
    </div>
  );
}
