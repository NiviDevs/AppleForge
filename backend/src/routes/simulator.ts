import { Router } from "express";
import { Simulator } from "../simulator/generator";
import { ScenarioMode } from "../types/inputs";

function isScenario(value: unknown): value is ScenarioMode {
  return value === "normal" || value === "outage" || value === "critical";
}

export function createSimulatorRouter(simulator: Simulator): Router {
  const router = Router();

  router.get("/scenario", (_req, res) => {
    res.json({ scenario: simulator.getScenario() });
  });

  router.post("/scenario", (req, res) => {
    const scenario = req.body?.scenario;

    if (!isScenario(scenario)) {
      res.status(400).json({ error: "Scenario must be one of normal|outage|critical" });
      return;
    }

    simulator.setScenario(scenario);
    res.json({ scenario });
  });

  return router;
}
