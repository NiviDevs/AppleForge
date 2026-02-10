import { DecisionPayload } from "../../types/dashboard";

interface Props {
  latest: DecisionPayload | null;
}

export function VitalsPanel({ latest }: Props): JSX.Element {
  return (
    <section className="panel">
      <h3>Vitals</h3>
      <div className="stat-grid">
        <div><label>SPO2</label><strong>{latest?.input.spo2.toFixed(1) ?? "--"}%</strong></div>
        <div><label>HR</label><strong>{latest?.input.hr.toFixed(0) ?? "--"} bpm</strong></div>
        <div><label>BP</label><strong>{latest?.input.bp.toFixed(0) ?? "--"} mmHg</strong></div>
      </div>
    </section>
  );
}
