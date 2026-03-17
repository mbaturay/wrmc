import '../onboarding.css';

export function OnboardingTimeline({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="ob-timeline">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const nextStep = !isLast ? steps[i + 1] : null;
        // Line is green if current step is complete
        const lineGreen = step.status === 'complete';

        return (
          <div className="ob-timeline-step" key={i}>
            <div className="ob-timeline-left">
              <div className={`ob-timeline-dot ${step.status}`}>
                {step.status === 'complete' && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M2 5L4.2 7.5L8 2.5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              {!isLast && (
                <div
                  className={`ob-timeline-line${lineGreen ? ' complete' : ''}`}
                />
              )}
            </div>
            <div className="ob-timeline-content">
              <span
                className={`ob-timeline-title${
                  step.status === 'active' ? ' bold' : ''
                }${step.status === 'upcoming' ? ' muted' : ''}`}
              >
                {step.title}
              </span>
              {step.subtitle && (
                <span className="ob-timeline-subtitle">{step.subtitle}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
