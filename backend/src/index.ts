import cors from "cors";
import express from "express";
import { createChainLogger } from "./chain/logger";
import { env } from "./config/env";
import { createScoreRouter } from "./routes/score";
import { createSimulatorRouter } from "./routes/simulator";
import { createStreamRouter } from "./routes/stream";
import { DecisionService } from "./services/decisionService";
import { Simulator } from "./simulator/generator";

async function start(): Promise<void> {
  const app = express();
  const simulator = new Simulator();
  simulator.start(env.simulationIntervalMs);

  const chainLogger = await createChainLogger();
  const decisionService = new DecisionService(chainLogger);

  app.use(cors({ origin: env.frontendOrigin }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "appleforge-backend" });
  });

  app.use(createScoreRouter(decisionService));
  app.use(createStreamRouter(simulator, decisionService));
  app.use(createSimulatorRouter(simulator));

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start backend", error);
  process.exit(1);
});
