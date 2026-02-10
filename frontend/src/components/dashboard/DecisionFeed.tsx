import { DecisionPayload } from "../../types/dashboard";

interface Props {
  history: DecisionPayload[];
}

export function DecisionFeed({ history }: Props): JSX.Element {
  return (
    <section className="panel panel-feed">
      <h3>Decision Feed</h3>
      <ul className="feed-list">
        {history.map((entry) => (
          <li key={`${entry.decisionHash}-${entry.scores.pscore}`}>
            <p>{entry.policy.message}</p>
            <small>{entry.policy.reasonCodes.join(", ") || "NO_FLAGS"}</small>
          </li>
        ))}
        {!history.length && <li><p>No events yet</p></li>}
      </ul>
    </section>
  );
}
