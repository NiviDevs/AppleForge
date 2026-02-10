import { keccak256, toUtf8Bytes } from "ethers";
import { ChainLogger } from "../chain/logger";
import { evaluatePolicy } from "../domain/policy";
import { buildScoreBreakdown, ROOM_CODES, TIER_CODES } from "../domain/scoring";
import { DecisionResult, ScoreInput } from "../types/inputs";
import { stableStringify } from "../utils/stableStringify";

export class DecisionService {
  constructor(private chainLogger: ChainLogger) {}

  async resolve(input: ScoreInput): Promise<DecisionResult> {
    const scores = buildScoreBreakdown(input);
    const policy = evaluatePolicy(input, scores);

    const payload = {
      input,
      sCrit: Number(scores.sCrit.toFixed(4)),
      pscore: Number(scores.pscore.toFixed(4)),
      alertLevel: policy.alertLevel,
      powerAction: policy.powerAction,
      reasonCodes: policy.reasonCodes
    };

    const decisionHash = keccak256(toUtf8Bytes(stableStringify(payload)));
    const pscoreBps = Math.round(scores.pscore * 10000);

    let txHash: string | undefined;
    try {
      txHash = await this.chainLogger.logDecision({
        decisionHash,
        roomClass: ROOM_CODES[input.roomClass],
        tier: TIER_CODES[input.equipmentTier],
        pscoreBps
      });
    } catch {
      txHash = undefined;
    }

    return {
      input,
      scores,
      policy,
      decisionHash,
      txHash
    };
  }
}
