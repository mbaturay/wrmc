import '../onboarding.css';

export function SetupProgress({ steps = 4, current = 1 }) {
  const percent = Math.min(Math.max((current / steps) * 100, 0), 100);

  return (
    <div className="setup-progress">
      <span className="setup-progress-label">
        Step {current} of {steps}
      </span>
      <div className="setup-progress-bar">
        <div
          className="setup-progress-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
