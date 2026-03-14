export function ProtoControls({ show, setShow, onSimulateReward, onSimulateMilestone, onSimulateRedemption, onResetOnboarding }) {
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
            + Simulate reward earned +$3.00
          </button>
          <button className="proto-btn" onClick={onSimulateRedemption}>
            - Simulate Walmart redemption -$5.00
          </button>
          <button className="proto-btn" onClick={onSimulateMilestone}>
            ★ Trigger milestone celebration
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
