import { DecisionPayload } from "../../types/dashboard";

interface Props {
  history: DecisionPayload[];
  onClear: () => void;
}

export function DecisionFeed({ history, onClear }: Props): JSX.Element {
  const formatAction = (action: string): string => action.replace(/_/g, " ");
  const formatReasons = (reasons: string[]): string => (reasons.length ? reasons.join(" · ") : "No flags");

  return (
    <section className="panel panel-feed console-feed">
      <div className="feed-header">
        <h3>Decision Feed</h3>
        <button type="button" className="feed-clear" onClick={onClear}>
          Clear Feed
        </button>
      </div>
      <ul className="feed-list console-list">
        {history.map((entry) => (
          <li
            key={`${entry.decisionHash}-${entry.scores.pscore}`}
            className={`console-line console-${entry.policy.alertLevel.toLowerCase()}`}
          >
            <div className="console-main">
              <span className="console-prompt">$</span>
              <span className={`console-badge badge-${entry.policy.alertLevel.toLowerCase()}`}>
                [{entry.policy.alertLevel}]
              </span>
              <span className="console-action">{formatAction(entry.policy.powerAction)}</span>
              <span className="console-score">pscore={entry.scores.pscore.toFixed(3)}</span>
            </div>
            <div className="console-sub">
              <span className="console-message">{entry.policy.message}</span>
              <span className="console-meta">
                {formatReasons(entry.policy.reasonCodes)} | hash={entry.decisionHash.slice(0, 10)}...
              </span>
            </div>
          </li>
        ))}
        {!history.length && (
          <li className="console-empty">
            <p>$ waiting for stream events...</p>
            <small>Clear Feed will reset the list but live updates will keep flowing.</small>
          </li>
        )}
      </ul>
    </section>
  );
}
