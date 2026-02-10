import { EventEmitter } from "events";
import { ScenarioMode, ScoreInput } from "../types/inputs";

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function randomDelta(scale: number): number {
  return (Math.random() - 0.5) * scale;
}

export class Simulator {
  private readonly emitter = new EventEmitter();
  private timer: NodeJS.Timeout | undefined;
  private scenario: ScenarioMode = "normal";
  private latest: ScoreInput = {
    spo2: 98,
    hr: 78,
    bp: 122,
    roomClass: "ER",
    equipmentTier: "T2",
    energy: {
      pgrid: 1,
      batteryLevel: 82,
      fuel: 70
    }
  };

  start(intervalMs: number): void {
    if (this.timer) return;

    this.timer = setInterval(() => {
      this.latest = this.nextSample(this.latest);
      this.emitter.emit("sample", this.latest);
    }, intervalMs);
  }

  stop(): void {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = undefined;
  }

  onSample(listener: (sample: ScoreInput) => void): void {
    this.emitter.on("sample", listener);
  }

  offSample(listener: (sample: ScoreInput) => void): void {
    this.emitter.off("sample", listener);
  }

  getLatest(): ScoreInput {
    return this.latest;
  }

  setScenario(next: ScenarioMode): void {
    this.scenario = next;

    if (next === "normal") {
      this.latest = {
        ...this.latest,
        roomClass: "ER",
        equipmentTier: "T2",
        energy: {
          pgrid: 1,
          batteryLevel: 82,
          fuel: 70
        }
      };
    }

    if (next === "outage") {
      this.latest = {
        ...this.latest,
        roomClass: "ER",
        equipmentTier: "T4",
        energy: {
          ...this.latest.energy,
          pgrid: 0,
          batteryLevel: Math.min(this.latest.energy.batteryLevel, 35)
        }
      };
    }

    if (next === "critical") {
      this.latest = {
        ...this.latest,
        roomClass: "ICU",
        equipmentTier: "T1",
        spo2: Math.min(this.latest.spo2, 89),
        hr: Math.max(this.latest.hr, 120),
        bp: Math.min(this.latest.bp, 88),
        energy: {
          ...this.latest.energy,
          pgrid: 0,
          batteryLevel: Math.min(this.latest.energy.batteryLevel, 20),
          fuel: Math.min(this.latest.energy.fuel, 18)
        }
      };
    }
  }

  getScenario(): ScenarioMode {
    return this.scenario;
  }

  private nextSample(prev: ScoreInput): ScoreInput {
    if (this.scenario === "outage") {
      return {
        ...prev,
        spo2: clamp(prev.spo2 + randomDelta(1.4), 86, 98),
        hr: clamp(prev.hr + randomDelta(6), 72, 130),
        bp: clamp(prev.bp + randomDelta(8), 85, 145),
        energy: {
          pgrid: 0,
          batteryLevel: clamp(prev.energy.batteryLevel - (0.6 + Math.random() * 0.8), 5, 100),
          fuel: clamp(prev.energy.fuel - (0.2 + Math.random() * 0.5), 5, 100)
        }
      };
    }

    if (this.scenario === "critical") {
      return {
        ...prev,
        spo2: clamp(prev.spo2 - (0.3 + Math.random() * 1.1), 72, 92),
        hr: clamp(prev.hr + randomDelta(10) + 1.5, 95, 170),
        bp: clamp(prev.bp + randomDelta(10) - 2, 70, 125),
        energy: {
          pgrid: 0,
          batteryLevel: clamp(prev.energy.batteryLevel - (0.5 + Math.random() * 1), 2, 100),
          fuel: clamp(prev.energy.fuel - (0.3 + Math.random() * 0.7), 2, 100)
        }
      };
    }

    return {
      ...prev,
      spo2: clamp(prev.spo2 + randomDelta(0.8), 95, 100),
      hr: clamp(prev.hr + randomDelta(5), 60, 100),
      bp: clamp(prev.bp + randomDelta(6), 100, 135),
      energy: {
        pgrid: 1,
        batteryLevel: clamp(prev.energy.batteryLevel + randomDelta(0.5), 70, 95),
        fuel: clamp(prev.energy.fuel + randomDelta(0.1), 60, 85)
      }
    };
  }
}
