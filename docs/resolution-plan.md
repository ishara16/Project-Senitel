# Resolution Plan: Critical Service Recovery

## Context
The objective is to establish a standardized, repeatable resolution protocol for whenever any service in Project Sentinel enters a `CRITICAL` state. This ensures consistent handling of failures, reduces MTTR (Mean Time To Recovery), and guarantees that every incident is documented and guarded by a regression test.

## Resolution Protocol

### Phase 1: Detection & Triaging
- **Symptom Identification**: Scan all `services/*/status.json` files for `"status": "CRITICAL"`.
- **Initial Assessment**: Identify the affected service and the timestamp of the failure.
- **Impact Analysis**: Determine if the failure affects other services (e.g., does `auth-service` failure break `payment-service`?).

### Phase 2: Root Cause Analysis (RCA)
- **Log Inspection**: Read the latest entries in `services/[service-name]/logs/error.log`.
- **Code Audit**: Inspect the service's entry point (`index.js`) and recent changes for syntax errors, logical bugs, or missing dependencies.
- **State Verification**: Compare the current `status.json` with the last known `healthy` state.

### Phase 3: Remediation
- **Immediate Fix**: Apply the minimum necessary change to restore service functionality (e.g., fixing a syntax error, clearing a corrupted log).
- **Verification**: 
  - Run the service manually to ensure it starts without errors.
  - Confirm the fix solves the specific issue identified in the RCA phase.
- **Status Restoration**: Update `services/[service-name]/status.json` to `"status": "healthy"`.

### Phase 4: Stabilization & Guardrails
- **Regression Test**: Write a specialized test in `services/[service-name]/tests/` that specifically targets the root cause of the failure to prevent recurrence.
- **Test Execution**: Run the regression test to confirm it correctly identifies the bug and passes after the fix.

### Phase 5: Documentation & Closure
- **Incident Log**: Append a detailed entry to `docs/incident-history.log` including:
  - Timestamp of resolution.
  - Root cause.
  - Actions taken.
- **Post-Mortem**: If the incident was severe or systemic, generate a detailed report in `docs/post-mortem-report.md`.

## Critical Files Involved
- `services/*/status.json` (Health indicators)
- `services/*/logs/error.log` (Error traces)
- `services/*/index.js` (Service logic)
- `services/*/tests/*.test.js` (Regression tests)
- `docs/incident-history.log` (Audit trail)
- `docs/post-mortem-report.md` (Analysis)

## Verification of Plan
The protocol will be verified by applying it to the next Chaos Monkey event, ensuring each phase is executed sequentially and documented.
