import { useEffect, useState } from "react";
import { streamUrl } from "../lib/api";
import { DecisionPayload } from "../types/dashboard";

export function useSseStream(): {
  latest: DecisionPayload | null;
  history: DecisionPayload[];
  connected: boolean;
} {
  const [latest, setLatest] = useState<DecisionPayload | null>(null);
  const [history, setHistory] = useState<DecisionPayload[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const source = new EventSource(streamUrl());

    source.onopen = () => setConnected(true);

    source.onmessage = (event) => {
      const payload = JSON.parse(event.data) as DecisionPayload;
      setLatest(payload);
      setHistory((prev) => [payload, ...prev].slice(0, 12));
    };

    source.onerror = () => {
      setConnected(false);
    };

    return () => {
      source.close();
      setConnected(false);
    };
  }, []);

  return { latest, history, connected };
}
