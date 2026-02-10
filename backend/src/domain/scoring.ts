import { clamp } from "../utils/clamp";
import { EquipmentTier, EnergyState, RoomClass, ScoreBreakdown, ScoreInput, VitalRisks } from "../types/inputs";

const VITAL_WEIGHTS = {
  spo2: 0.5,
  hr: 0.3,
  bp: 0.2
};

const PRIORITY_WEIGHTS = {
  sCrit: 0.6,
  equipment: 0.25,
  room: 0.15
};

const EQUIPMENT_WEIGHTS: Record<EquipmentTier, number> = {
  T1: 1.0,
  T2: 0.7,
  T3: 0.4,
  T4: 0.1
};

const ROOM_WEIGHTS: Record<RoomClass, number> = {
  ICU: 1.0,
  ER: 0.7,
  Lobby: 0.2
};

export const ROOM_CODES: Record<RoomClass, number> = {
  ICU: 1,
  ER: 2,
  Lobby: 3
};

export const TIER_CODES: Record<EquipmentTier, number> = {
  T1: 1,
  T2: 2,
  T3: 3,
  T4: 4
};

export function computeVitalRisks(input: Pick<ScoreInput, "spo2" | "hr" | "bp">): VitalRisks {
  const spo2Risk = clamp((95 - input.spo2) / 10, 0, 1);

  const hrRisk = input.hr < 60
    ? clamp((60 - input.hr) / 20, 0, 1)
    : input.hr > 110
      ? clamp((input.hr - 110) / 90, 0, 1)
      : 0;

  const bpRisk = input.bp < 90
    ? clamp((90 - input.bp) / 20, 0, 1)
    : input.bp > 140
      ? clamp((input.bp - 140) / 60, 0, 1)
      : 0;

  return { spo2Risk, hrRisk, bpRisk };
}

export function computeSCrit(vitalRisks: VitalRisks): number {
  const raw = (VITAL_WEIGHTS.spo2 * vitalRisks.spo2Risk)
    + (VITAL_WEIGHTS.hr * vitalRisks.hrRisk)
    + (VITAL_WEIGHTS.bp * vitalRisks.bpRisk);

  return clamp(raw, 0, 1);
}

export function computeEnergyState(energy: EnergyState): number {
  const raw = (0.5 * energy.pgrid)
    + (0.3 * (energy.batteryLevel / 100))
    + (0.2 * (energy.fuel / 100));

  return clamp(raw, 0, 1);
}

export function buildScoreBreakdown(input: ScoreInput): ScoreBreakdown {
  const vitalRisks = computeVitalRisks(input);
  const sCrit = computeSCrit(vitalRisks);
  const equipmentWeight = EQUIPMENT_WEIGHTS[input.equipmentTier];
  const roomWeight = ROOM_WEIGHTS[input.roomClass];

  const rawPscore = (PRIORITY_WEIGHTS.sCrit * sCrit)
    + (PRIORITY_WEIGHTS.equipment * equipmentWeight)
    + (PRIORITY_WEIGHTS.room * roomWeight);

  return {
    sCrit,
    pscore: clamp(rawPscore, 0, 1),
    energyState: computeEnergyState(input.energy),
    vitalRisks,
    equipmentWeight,
    roomWeight
  };
}
