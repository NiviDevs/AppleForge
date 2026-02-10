import { describe, expect, it } from "vitest";
import { buildScoreBreakdown } from "../src/domain/scoring";

describe("scoring", () => {
  it("keeps normal case in low priority band", () => {
    const result = buildScoreBreakdown({
      spo2: 98,
      hr: 78,
      bp: 122,
      roomClass: "ER",
      equipmentTier: "T3",
      energy: {
        pgrid: 1,
        batteryLevel: 80,
        fuel: 70
      }
    });

    expect(result.sCrit).toBeLessThan(0.2);
    expect(result.pscore).toBeLessThan(0.6);
  });

  it("raises score for critical ICU/T1 case", () => {
    const result = buildScoreBreakdown({
      spo2: 82,
      hr: 145,
      bp: 78,
      roomClass: "ICU",
      equipmentTier: "T1",
      energy: {
        pgrid: 0,
        batteryLevel: 20,
        fuel: 18
      }
    });

    expect(result.sCrit).toBeGreaterThan(0.7);
    expect(result.pscore).toBeGreaterThan(0.8);
  });
});
