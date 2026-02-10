import { DecisionPayload } from "../../types/dashboard";

interface Props {
  history: DecisionPayload[];
}

export function AuditLogPanel({ history }: Props): JSX.Element {
  return (
    <section className="panel panel-feed">
      <h3>Audit Log</h3>
      <ul className="audit-list">
        {history.slice(0, 10).map((entry) => (
          <li key={`${entry.decisionHash}-${entry.txHash ?? "none"}`}>
            <code>{entry.decisionHash.slice(0, 12)}...{entry.decisionHash.slice(-8)}</code>
            <span>{entry.txHash ? `tx ${entry.txHash.slice(0, 10)}...` : "not committed"}</span>
          </li>
        ))}
        {!history.length && <li><span>No chain events yet</span></li>}
      </ul>
    </section>
  );
}
