import { Router } from "express";
import { DecisionService } from "../services/decisionService";
import { ScoreInput } from "../types/inputs";

function isValidInput(value: unknown): value is ScoreInput {
  if (!value || typeof value !== "object") return false;
  const body = value as ScoreInput;

  const validRoom = ["ICU", "ER", "Lobby"].includes(body.roomClass);
  const validTier = ["T1", "T2", "T3", "T4"].includes(body.equipmentTier);

  return Number.isFinite(body.spo2)
    && Number.isFinite(body.hr)
    && Number.isFinite(body.bp)
    && validRoom
    && validTier
    && !!body.energy
    && (body.energy.pgrid === 0 || body.energy.pgrid === 1)
    && Number.isFinite(body.energy.batteryLevel)
    && Number.isFinite(body.energy.fuel);
}

export function createScoreRouter(decisionService: DecisionService): Router {
  const router = Router();

  router.post("/score", async (req, res) => {
    if (!isValidInput(req.body)) {
      res.status(400).json({ error: "Invalid score input payload" });
      return;
    }

    const result = await decisionService.resolve(req.body);
    res.json(result);
  });

  return router;
}
