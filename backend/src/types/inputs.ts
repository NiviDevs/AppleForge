export type RoomClass = "ICU" | "ER" | "Lobby";
export type EquipmentTier = "T1" | "T2" | "T3" | "T4";
export type ScenarioMode = "normal" | "outage" | "critical";

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

export interface VitalRisks {
  spo2Risk: number;
  hrRisk: number;
  bpRisk: number;
}

export interface ScoreBreakdown {
  sCrit: number;
  pscore: number;
  energyState: number;
  vitalRisks: VitalRisks;
  equipmentWeight: number;
  roomWeight: number;
}

export type AlertLevel = "NORMAL" | "MONITOR" | "CRITICAL";
export type PowerAction = "MAINTAIN" | "SHED_T4" | "T1_ONLY";

export interface PolicyDecision {
  alertLevel: AlertLevel;
  powerAction: PowerAction;
  reasonCodes: string[];
  message: string;
}

export interface DecisionResult {
  input: ScoreInput;
  scores: ScoreBreakdown;
  policy: PolicyDecision;
  decisionHash: string;
  txHash?: string;
}
