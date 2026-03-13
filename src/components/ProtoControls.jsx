export function ProtoControls({ show, setShow, onSimulateReward, onSimulateMilestone, autoApply, setAutoApply, onResetOnboarding }) {
  return (
    <>
      <button
        className="proto-toggle"
        onClick={() => setShow(!show)}
        aria-label="Prototype controls"
        title="Prototype Controls"
      >
        ⚡
      </button>
      {show && (
        <div className="proto-panel" role="dialog" aria-label="Prototype Controls">
          <h3>Prototype Controls</h3>
          <button className="proto-btn" onClick={onSimulateReward}>
            + Simulate new reward ($3.25)
          </button>
          <button className="proto-btn" onClick={onSimulateMilestone}>
            ★ Trigger milestone celebration
          </button>
          <button className="proto-btn" onClick={() => setAutoApply(!autoApply)}>
            {autoApply ? '○ Disable' : '● Enable'} auto-apply
          </button>
          <button className="proto-btn" onClick={onResetOnboarding}>
            ↺ Replay onboarding
          </button>
          <button className="proto-btn" onClick={() => setShow(false)}>
            Close
          </button>
        </div>
      )}
    </>
  );
}
