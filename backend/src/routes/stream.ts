import { Router } from "express";
import { DecisionService } from "../services/decisionService";
import { Simulator } from "../simulator/generator";
import { ScoreInput } from "../types/inputs";

export function createStreamRouter(simulator: Simulator, decisionService: DecisionService): Router {
  const router = Router();

  router.get("/stream", async (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const send = async (sample: ScoreInput): Promise<void> => {
      const decision = await decisionService.resolve(sample);
      res.write(`data: ${JSON.stringify(decision)}\n\n`);
    };

    await send(simulator.getLatest());

    const sampleListener = (sample: ScoreInput): void => {
      void send(sample);
    };

    simulator.onSample(sampleListener);

    const heartbeat = setInterval(() => {
      res.write(": ping\n\n");
    }, 15000);

    req.on("close", () => {
      clearInterval(heartbeat);
      simulator.offSample(sampleListener);
    });
  });

  return router;
}
