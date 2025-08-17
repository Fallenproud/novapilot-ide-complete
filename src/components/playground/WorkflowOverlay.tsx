
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import WorkflowStepper from "./WorkflowStepper";
import { useAIStore } from "@/stores/aiStore";

interface WorkflowOverlayProps {
  onClose?: () => void;
}

const WorkflowOverlay: React.FC<WorkflowOverlayProps> = ({ onClose }) => {
  const { isProcessing, currentStep, clearWorkflow } = useAIStore();

  if (!isProcessing || !currentStep) {
    return null;
  }

  const handleClose = () => {
    clearWorkflow();
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#161B22] border border-[#21262D] rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#21262D]">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-[#1F6FEB] rounded-full animate-pulse"></div>
            <h2 className="text-lg font-semibold text-[#F0F6FC]">AI Generation in Progress</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Workflow Content */}
        <div className="p-6">
          <WorkflowStepper
            contextLabel="GPT-4"
            onCancel={handleClose}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0D1117] border-t border-[#21262D]">
          <div className="flex items-center justify-between text-sm text-[#8B949E]">
            <span>You can continue working in the editor while generation is in progress</span>
            <Button variant="outline" size="sm" onClick={handleClose}>
              Continue in Background
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowOverlay;
