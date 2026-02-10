import { ChangeEvent, useEffect, useState } from "react";
import { DecisionPayload } from "../../types/dashboard";

interface Props {
  latest: DecisionPayload | null;
}

export function EnergyPanel({ latest }: Props): JSX.Element {
  const [isManual, setIsManual] = useState(false);
  const [gridPower, setGridPower] = useState<0 | 1>(1);
  const [batteryLevel, setBatteryLevel] = useState(80);
  const [fuel, setFuel] = useState(70);

  useEffect(() => {
    if (!latest || isManual) return;

    setGridPower(latest.input.energy.pgrid);
    setBatteryLevel(latest.input.energy.batteryLevel);
    setFuel(latest.input.energy.fuel);
  }, [latest, isManual]);

  const resetToLive = (): void => {
    setIsManual(false);
  };

  const handleGridPowerChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setIsManual(true);
    setGridPower(event.target.checked ? 1 : 0);
  };

  const handleBatteryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setIsManual(true);
    setBatteryLevel(Number(event.target.value));
  };

  const handleFuelChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setIsManual(true);
    setFuel(Number(event.target.value));
  };

  const liveEnergy = latest?.input.energy;
  const displayGridPower = isManual ? gridPower : (liveEnergy?.pgrid ?? gridPower);
  const displayBatteryLevel = isManual ? batteryLevel : (liveEnergy?.batteryLevel ?? batteryLevel);
  const displayFuel = isManual ? fuel : (liveEnergy?.fuel ?? fuel);

  return (
    <section className="panel">
      <h3>Energy</h3>
      <div className="stat-grid">
        <div><label>Grid</label><strong>{displayGridPower === 1 ? "ON" : "OFF"}</strong></div>
        <div><label>Battery</label><strong>{`${displayBatteryLevel.toFixed(1)}%`}</strong></div>
        <div><label>Fuel</label><strong>{`${displayFuel.toFixed(1)}%`}</strong></div>
      </div>
      <div className="control-grid">
        <div className="control-row">
          <label htmlFor="grid-switch">Grid Power</label>
          <label className="toggle">
            <input
              id="grid-switch"
              type="checkbox"
              checked={displayGridPower === 1}
              onChange={handleGridPowerChange}
            />
            <span>{displayGridPower === 1 ? "ON" : "OFF"}</span>
          </label>
        </div>
        <div className="control-row">
          <label htmlFor="battery-slider">Battery</label>
          <input
            id="battery-slider"
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={displayBatteryLevel}
            onChange={handleBatteryChange}
          />
        </div>
        <div className="control-row">
          <label htmlFor="fuel-slider">Fuel</label>
          <input
            id="fuel-slider"
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={displayFuel}
            onChange={handleFuelChange}
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
