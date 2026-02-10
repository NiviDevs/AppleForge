import { useEffect, useState } from "react";
import { AuditLogPanel } from "../components/dashboard/AuditLogPanel";
import { DecisionFeed } from "../components/dashboard/DecisionFeed";
import { EnergyPanel } from "../components/dashboard/EnergyPanel";
import { PriorityPanel } from "../components/dashboard/PriorityPanel";
import { VitalsPanel } from "../components/dashboard/VitalsPanel";
import { useSseStream } from "../hooks/useSseStream";
import { setScenario } from "../lib/api";

export function App(): JSX.Element {
  const { latest, history, connected } = useSseStream();
  const [activeScenario, setActiveScenario] = useState<"normal" | "outage" | "critical">("normal");
  const alertLevel = latest?.policy.alertLevel ?? "NORMAL";

  useEffect(() => {
    document.body.classList.remove("alert-monitor", "alert-critical");

    if (alertLevel === "MONITOR") {
      document.body.classList.add("alert-monitor");
      return;
    }

    if (alertLevel === "CRITICAL") {
      document.body.classList.add("alert-critical");
    }
  }, [alertLevel]);

  const triggerScenario = async (scenario: "normal" | "outage" | "critical"): Promise<void> => {
    await setScenario(scenario);
    setActiveScenario(scenario);
  };

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <h1>AppleForge Command Dashboard</h1>
          <p>Energy-aware triage and verifiable decision monitoring</p>
        </div>
        <div className={`status ${connected ? "online" : "offline"}`}>
          {connected ? "STREAM ONLINE" : "STREAM OFFLINE"}
        </div>
      </header>

      <section className="scenario-bar">
        <button className={activeScenario === "normal" ? "active" : ""} onClick={() => void triggerScenario("normal")}>Normal</button>
        <button className={activeScenario === "outage" ? "active" : ""} onClick={() => void triggerScenario("outage")}>Outage</button>
        <button className={activeScenario === "critical" ? "active" : ""} onClick={() => void triggerScenario("critical")}>Critical</button>
      </section>

      <section className="grid-3">
        <VitalsPanel latest={latest} />
        <EnergyPanel latest={latest} />
        <PriorityPanel latest={latest} />
      </section>

      <section className="grid-2">
        <DecisionFeed history={history} />
        <AuditLogPanel history={history} />
      </section>
    </main>
  );
}
