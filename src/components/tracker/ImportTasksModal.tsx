import React from "react";
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

interface ImportResult {
  success: boolean;
  imported: number;
  errors: string[];
}

interface ImportTasksModalProps {
  isOpen: boolean;
  importJson: string;
  importResult: ImportResult | null;
  onImportJsonChange: (json: string) => void;
  onImportTasks: () => void;
  onClose: () => void;
}

export function ImportTasksModal({
  isOpen,
  importJson,
  importResult,
  onImportJsonChange,
  onImportTasks,
  onClose,
}: ImportTasksModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Tasks from JSON</DialogTitle>
          <DialogDescription>
            Import multiple tasks at once using JSON format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="import-json">JSON Data</Label>
            <Textarea
              id="import-json"
              value={importJson}
              onChange={(e) => onImportJsonChange(e.target.value)}
              className="font-mono text-sm min-h-[200px]"
              placeholder='[
  {
    "title": "Learn React Hooks",
    "desc": "Master the fundamentals of React Hooks",
    "effort": 3,
    "tags": ["react", "frontend"],
    "status": "todo",
    "execution": "Read React docs and build a practice app",
    "mindset": "Discipline. Innovation. Adaptability."
  },
  {
    "title": "Build Todo App",
    "effort": 5,
    "tags": ["project", "react"]
  }
]'
              autoFocus
            />
          </div>

          {/* JSON Format Help */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-black mb-2">
              Expected JSON Format:
            </h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <strong>Required:</strong> title (string)
              </p>
              <p>
                <strong>Optional:</strong> desc, effort (1-10), tags (array),
                status (todo/inprogress/done)
              </p>
              <p>
                <strong>Advanced:</strong> execution, mindset,
                reflectionPrompts, quizIds, notes
              </p>
            </div>
          </div>

          {/* Import Result */}
          {importResult && (
            <div
              className={`p-4 rounded-lg ${
                importResult.success
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <h3
                className={`font-semibold mb-2 ${
                  importResult.success ? "text-green-800" : "text-red-800"
                }`}
              >
                {importResult.success ? "Import Successful!" : "Import Failed"}
              </h3>
              <p
                className={`text-sm ${
                  importResult.success ? "text-green-700" : "text-red-700"
                }`}
              >
                {importResult.success
                  ? `Successfully imported ${importResult.imported} task(s)`
                  : "Please fix the errors below and try again"}
              </p>
              {importResult.errors.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-medium text-red-800 mb-1">Errors:</h4>
                  <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                    {importResult.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onImportTasks} disabled={!importJson.trim()}>
            Import Tasks
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
