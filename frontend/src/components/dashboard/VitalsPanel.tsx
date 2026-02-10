import { ChangeEvent, useEffect, useState } from "react";
import { DecisionPayload } from "../../types/dashboard";

interface Props {
  latest: DecisionPayload | null;
}

export function VitalsPanel({ latest }: Props): JSX.Element {
  const [isManual, setIsManual] = useState(false);
  const [spo2, setSpo2] = useState(95);
  const [hr, setHr] = useState(80);
  const [bp, setBp] = useState(120);

  useEffect(() => {
    if (!latest || isManual) return;
    setSpo2(latest.input.spo2);
    setHr(latest.input.hr);
    setBp(latest.input.bp);
  }, [latest, isManual]);

  const handleSpo2Change = (event: ChangeEvent<HTMLInputElement>): void => {
    setIsManual(true);
    setSpo2(Number(event.target.value));
  };

  const handleHrChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setIsManual(true);
    setHr(Number(event.target.value));
  };

  const handleBpChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setIsManual(true);
    setBp(Number(event.target.value));
  };

  const resetToLive = (): void => {
    setIsManual(false);
  };

  const displaySpo2 = isManual ? spo2 : (latest?.input.spo2 ?? spo2);
  const displayHr = isManual ? hr : (latest?.input.hr ?? hr);
  const displayBp = isManual ? bp : (latest?.input.bp ?? bp);

  return (
    <section className="panel">
      <h3>Vitals</h3>
      <div className="stat-grid">
        <div><label>SPO2</label><strong>{displaySpo2.toFixed(1)}%</strong></div>
        <div><label>HR</label><strong>{displayHr.toFixed(0)} bpm</strong></div>
        <div><label>BP</label><strong>{displayBp.toFixed(0)} mmHg</strong></div>
      </div>
      <div className="control-grid">
        <div className="control-row">
          <label htmlFor="spo2-slider">SPO2</label>
          <input
            id="spo2-slider"
            type="range"
            min={70}
            max={100}
            step={0.1}
            value={displaySpo2}
            onChange={handleSpo2Change}
          />
        </div>
        <div className="control-row">
          <label htmlFor="hr-slider">HR</label>
          <input
            id="hr-slider"
            type="range"
            min={40}
            max={200}
            step={1}
            value={displayHr}
            onChange={handleHrChange}
          />
        </div>
        <div className="control-row">
          <label htmlFor="bp-slider">BP</label>
          <input
            id="bp-slider"
            type="range"
            min={70}
            max={200}
            step={1}
            value={displayBp}
            onChange={handleBpChange}
          />
        </div>
        {isManual && (
          <button type="button" className="control-reset" onClick={resetToLive}>
            Use live values
          </button>
        )}
      </div>
    </section>
  );
}
