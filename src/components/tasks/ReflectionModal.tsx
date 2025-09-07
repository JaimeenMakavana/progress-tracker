"use client";
import React, { useState } from "react";
import { Task } from "../../types";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface ReflectionModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (reflection: ReflectionData) => void;
}

interface ReflectionData {
  explanation: string;
  codeSnippet: string;
  surprise: string;
}

export default function ReflectionModal({
  task,
  isOpen,
  onClose,
  onSave,
}: ReflectionModalProps) {
  const [reflection, setReflection] = useState<ReflectionData>({
    explanation: "",
    codeSnippet: "",
    surprise: "",
  });

  const handleSubmit = () => {
    if (reflection.explanation.trim()) {
      onSave(reflection);
      setReflection({ explanation: "", codeSnippet: "", surprise: "" });
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Task Completed!</DialogTitle>
          <DialogDescription>
            {task.title} - Take a moment to reflect on what you learned.
          </DialogDescription>
        </DialogHeader>

        {/* Task Context */}
        {task.execution && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Execution Plan:</h4>
            <p className="text-sm text-gray-700">{task.execution}</p>
          </div>
        )}

        {task.mindset && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Mindset:</h4>
            <p className="text-sm text-blue-700">{task.mindset}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="explanation">What did you learn? (Required)</Label>
            <Textarea
              id="explanation"
              value={reflection.explanation}
              onChange={(e) =>
                setReflection({ ...reflection, explanation: e.target.value })
              }
              onKeyDown={handleKeyDown}
              placeholder="Explain what you learned, how you solved problems, and key takeaways..."
              rows={4}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code-snippet">Code Snippet (Optional)</Label>
            <Textarea
              id="code-snippet"
              value={reflection.codeSnippet}
              onChange={(e) =>
                setReflection({ ...reflection, codeSnippet: e.target.value })
              }
              onKeyDown={handleKeyDown}
              placeholder="Share any interesting code you wrote..."
              rows={6}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="surprise">What surprised you? (Optional)</Label>
            <Textarea
              id="surprise"
              value={reflection.surprise}
              onChange={(e) =>
                setReflection({ ...reflection, surprise: e.target.value })
              }
              onKeyDown={handleKeyDown}
              placeholder="Any unexpected discoveries or insights?"
              rows={3}
            />
          </div>
        </div>

        {/* Reflection Prompts */}
        {task.reflectionPrompts && task.reflectionPrompts.length > 0 && (
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">
              Reflection Prompts:
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              {task.reflectionPrompts.map((prompt, index) => (
                <li key={index}>• {prompt}</li>
              ))}
            </ul>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Skip
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!reflection.explanation.trim()}
          >
            Save Reflection
          </Button>
        </DialogFooter>

        {/* Keyboard Shortcuts */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>
            Press{" "}
            <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">
              Ctrl+Enter
            </kbd>{" "}
            to save or{" "}
            <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">
              Esc
            </kbd>{" "}
            to close
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
