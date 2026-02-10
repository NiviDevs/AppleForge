export type RoomClass = "ICU" | "ER" | "Lobby";
export type EquipmentTier = "T1" | "T2" | "T3" | "T4";

export interface EnergyState {
  pgrid: 0 | 1;
  batteryLevel: number;
  fuel: number;
}

export interface ScoreInput {
  spo2: number;
  hr: number;
  bp: number;
  roomClass: RoomClass;
  equipmentTier: EquipmentTier;
  energy: EnergyState;
}

export interface ScoreBreakdown {
  sCrit: number;
  pscore: number;
  energyState: number;
  vitalRisks: {
    spo2Risk: number;
    hrRisk: number;
    bpRisk: number;
  };
  equipmentWeight: number;
  roomWeight: number;
}

export interface DecisionPayload {
  input: ScoreInput;
  scores: ScoreBreakdown;
  policy: {
    alertLevel: "NORMAL" | "MONITOR" | "CRITICAL";
    powerAction: "MAINTAIN" | "SHED_T4" | "T1_ONLY";
    reasonCodes: string[];
    message: string;
  };
  decisionHash: string;
  txHash?: string;
}
