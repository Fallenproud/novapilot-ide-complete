import React, { useEffect, useMemo, useState } from "react";
import {
  MessageSquare,   // 1: User Request
  Search,          // 2: Holistic Analysis
  LayoutTemplate,  // 3: Architecture Planning
  FileCode,        // 4: Artifact Generation
  PlayCircle,      // 5: Execution & Preview
  Rocket           // 6: Optional Deployment
} from "lucide-react";

type StepStatus = "pending" | "processing" | "completed" | "error";

export interface WorkflowStepperProps {
  /** 0-based index of the current step (controlled). If omitted, the component self-advances for demo. */
  currentStep?: number;
  /** 0-100 overall progress (controlled). If omitted, the component animates progress for demo. */
  progress?: number;
  /** Called when the user clicks Cancel/Close. */
  onCancel?: () => void;
  /** Optional label shown on the right side of the header (e.g., model name). */
  contextLabel?: string;
}

const WORKFLOW = [
  { title: "User Request", icon: MessageSquare, hint: "Capturing your natural language prompt." },
  { title: "Holistic Analysis", icon: Search, hint: "Understanding repo context & constraints." },
  { title: "Architecture Planning", icon: LayoutTemplate, hint: "Drafting structure & components." },
  { title: "Artifact Generation", icon: FileCode, hint: "Producing production-ready code patches." },
  { title: "Execution & Preview", icon: PlayCircle, hint: "Running dev server & live preview." },
  { title: "Optional Deployment", icon: Rocket, hint: "Preparing one-click deploy." }
] as const;

/**
 * NovaPilot Workflow Stepper
 * - Tailwind first, dark theme friendly
 * - Works with or without controlled props
 */
const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  currentStep,
  progress,
  onCancel,
  contextLabel
}) => {
  // Self-progressing fallback (demo) when not controlled
  const [autoProgress, setAutoProgress] = useState(0);
  const [autoStep, setAutoStep] = useState(0);

  const effectiveProgress = progress ?? autoProgress;
  const effectiveStep = currentStep ?? autoStep;

  useEffect(() => {
    if (progress !== undefined || currentStep !== undefined) return; // controlled
    let raf = 0;
    let value = 0;

    const tick = () => {
      value = Math.min(100, value + 1.5); // ~66 frames ≈ a few seconds
      setAutoProgress(value);
      const stepIndex = Math.min(
        WORKFLOW.length - 1,
        Math.floor((value / 100) * WORKFLOW.length)
      );
      setAutoStep(stepIndex);
      if (value < 100) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress, currentStep]);

  const stepStatuses: StepStatus[] = useMemo(() => {
    return WORKFLOW.map((_, idx) => {
      if (idx < effectiveStep) return "completed";
      if (idx === effectiveStep) return "processing";
      return "pending";
    });
  }, [effectiveStep]);

  return (
    <div className="w-full rounded-lg border border-[#1F232A] bg-[#0D1117] text-[#F0F6FC]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[#1F232A] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#1F6FEB]" aria-hidden />
          <h3 className="text-sm font-medium">Workflow</h3>
          <span className="text-xs text-[#9BA4B5]">
            Step {effectiveStep + 1} of {WORKFLOW.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {contextLabel && (
            <span className="rounded-md border border-[#1F232A] bg-[#161B22] px-2 py-1 text-[11px] text-[#9BA4B5]">
              {contextLabel}
            </span>
          )}
          <button
            onClick={onCancel}
            className="rounded-md border border-[#1F232A] px-2 py-1 text-xs text-[#9BA4B5] hover:bg-[#161B22]"
          >
            {onCancel ? "Cancel" : "Close"}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 pt-3">
        <div className="mb-2 flex items-center justify-between text-[11px] text-[#9BA4B5]">
          <span>Overall Progress</span>
          <span>{Math.round(effectiveProgress)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded bg-[#161B22]">
          <div
            className="h-full bg-[#1F6FEB] transition-[width] duration-300 ease-out"
            style={{ width: `${Math.max(0, Math.min(100, effectiveProgress))}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <ol className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {WORKFLOW.map((step, idx) => {
          const Icon = step.icon;
          const status = stepStatuses[idx];
          const isProcessing = status === "processing";
          const isDone = status === "completed";

          return (
            <li
              key={step.title}
              className={[
                "flex items-start gap-3 rounded-lg border p-3 transition-colors",
                status === "pending" && "border-[#1F232A] bg-[#0D1117]",
                isProcessing && "border-[#1F6FEB]/30 bg-[#161B22]",
                isDone && "border-emerald-700/30 bg-emerald-900/20"
              ].join(" ")}
            >
              <div className="mt-0.5">
                <Icon
                  className={[
                    "h-5 w-5",
                    isProcessing ? "text-[#1F6FEB]" : isDone ? "text-emerald-400" : "text-[#9BA4B5]"
                  ].join(" ")}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4
                    className={[
                      "truncate text-sm font-medium",
                      isProcessing ? "text-[#1F6FEB]" : isDone ? "text-emerald-300" : "text-[#F0F6FC]"
                    ].join(" ")}
                    title={step.title}
                  >
                    {step.title}
                  </h4>
                  {isProcessing && (
                    <span className="text-[11px] text-[#9BA4B5]">processing…</span>
                  )}
                  {isDone && (
                    <span className="text-[11px] text-emerald-400">done</span>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-[12px] text-[#9BA4B5]">{step.hint}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Footer line with ETA */}
      <div className="border-t border-[#1F232A] px-4 py-2 text-[11px] text-[#9BA4B5]">
        ETA: {Math.max(0, Math.ceil((100 - effectiveProgress) / 4))}s
      </div>
    </div>
  );
};

export default WorkflowStepper;
