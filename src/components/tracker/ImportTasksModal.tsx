import React from "react";
import { motion } from "framer-motion";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <h2 className="text-xl font-bold text-black mb-4">
          Import Tasks from JSON
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              JSON Data
            </label>
            <textarea
              value={importJson}
              onChange={(e) => onImportJsonChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-mono text-sm"
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
              rows={12}
              autoFocus
              aria-label="JSON data for importing tasks"
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

        <div className="flex gap-3 mt-6">
          <button
            onClick={onImportTasks}
            disabled={!importJson.trim()}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Import tasks from JSON"
          >
            Import Tasks
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Cancel import"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
