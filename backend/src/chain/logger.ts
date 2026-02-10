import { Contract, JsonRpcProvider, Wallet } from "ethers";
import { env } from "../config/env";

const DECISION_LOG_ABI = [
  "function logDecision(bytes32 decisionHash, uint8 roomClass, uint8 tier, uint16 pscoreBps) external"
];

export interface ChainLogInput {
  decisionHash: string;
  roomClass: number;
  tier: number;
  pscoreBps: number;
}

export interface ChainLogger {
  logDecision(input: ChainLogInput): Promise<string | undefined>;
}

class NoopChainLogger implements ChainLogger {
  async logDecision(): Promise<string | undefined> {
    return undefined;
  }
}

class EvmChainLogger implements ChainLogger {
  constructor(private contract: Contract) {}

  async logDecision(input: ChainLogInput): Promise<string | undefined> {
    const tx = await this.contract.logDecision(
      input.decisionHash,
      input.roomClass,
      input.tier,
      input.pscoreBps
    );

    const receipt = await tx.wait();
    return receipt?.hash;
  }
}

export async function createChainLogger(): Promise<ChainLogger> {
  if (!env.chainRpcUrl || !env.chainPrivateKey || !env.decisionLogAddress) {
    return new NoopChainLogger();
  }

  try {
    const provider = new JsonRpcProvider(env.chainRpcUrl);
    const wallet = new Wallet(env.chainPrivateKey, provider);
    const contract = new Contract(env.decisionLogAddress, DECISION_LOG_ABI, wallet);
    return new EvmChainLogger(contract);
  } catch {
    return new NoopChainLogger();
  }
}
