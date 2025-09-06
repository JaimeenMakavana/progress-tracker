"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTrackerPage } from "../../../hooks/useTrackerPage";
import { TrackerHeader, ProgressOverview, TaskList } from "../../../components";
import NoteDrawer from "../../../components/tasks/NoteDrawer";
import TaskPage from "../../../components/tasks/TaskPage";
import { useTrackers } from "../../../context/TrackersContext";

export default function TrackerPage() {
  const params = useParams();
  const router = useRouter();
  const trackerId = params.id as string;

  // Note drawer state
  const [noteDrawerOpen, setNoteDrawerOpen] = React.useState(false);
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(
    null
  );
  const [newNote, setNewNote] = React.useState("");
  const [noteType, setNoteType] = React.useState<
    "reflection" | "snippet" | "link"
  >("reflection");

  // Task page state
  const [taskPageOpen, setTaskPageOpen] = React.useState(false);
  const [selectedTaskForPage, setSelectedTaskForPage] = React.useState<
    string | null
  >(null);

  const {
    tracker,
    showAddTask,
    setShowAddTask,
    showImportTasks,
    setShowImportTasks,
    newTaskTitle,
    setNewTaskTitle,
    newTaskEffort,
    setNewTaskEffort,
    newTaskTags,
    setNewTaskTags,
    importJson,
    setImportJson,
    importResult,
    setImportResult,
    handleAddTask,
    handleEditTask,
    handleImportTasks,
    handleEditTracker,
    onToggleTask,
    onDeleteTask,
    onAddNote,
  } = useTrackerPage(trackerId);

  // Get task page methods from context
  const { saveTaskPage, getTaskPage } = useTrackers();

  // Note drawer handlers
  const handleOpenNoteDrawer = (taskId: string) => {
    setSelectedTaskId(taskId);
    setNoteDrawerOpen(true);
    setNewNote("");
    setNoteType("reflection");
  };

  const handleCloseNoteDrawer = () => {
    setNoteDrawerOpen(false);
    setSelectedTaskId(null);
    setNewNote("");
  };

  const handleSaveNote = () => {
    if (selectedTaskId && newNote.trim()) {
      onAddNote(selectedTaskId, { text: newNote.trim(), type: noteType });
      handleCloseNoteDrawer();
    }
  };

  const handleNoteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSaveNote();
    } else if (e.key === "Escape") {
      handleCloseNoteDrawer();
    }
  };

  // Task page handlers
  const handleOpenTaskPage = (taskId: string) => {
    setSelectedTaskForPage(taskId);
    setTaskPageOpen(true);
  };

  const handleCloseTaskPage = () => {
    setTaskPageOpen(false);
    setSelectedTaskForPage(null);
  };

  const handleSaveTaskPage = (taskPage: any) => {
    saveTaskPage(taskPage);
  };

  if (!tracker) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">
            Tracker not found
          </h1>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TrackerHeader
          tracker={tracker}
          onEditTracker={handleEditTracker}
          onAddTask={() => setShowAddTask(true)}
          onImportTasks={() => setShowImportTasks(true)}
        />

        <ProgressOverview tracker={tracker} />

        {/* Tasks */}
        <div className="minimal-card p-6">
          <h2 className="text-xl font-semibold text-black mb-6">Tasks</h2>
          <TaskList
            tasks={tracker.tasks}
            onToggleTask={onToggleTask}
            onEditTask={handleEditTask}
            onDeleteTask={onDeleteTask}
            onOpenNoteDrawer={handleOpenNoteDrawer}
            onOpenTaskPage={handleOpenTaskPage}
          />
        </div>

        {/* Add Task Modal */}
        {showAddTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-md"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <h2 className="text-xl font-bold text-black mb-4">
                Add New Task
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="e.g., Learn React Hooks"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Effort (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newTaskEffort}
                    onChange={(e) =>
                      setNewTaskEffort(parseInt(e.target.value) || 1)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newTaskTags}
                    onChange={(e) => setNewTaskTags(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="e.g., react, frontend, learning"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleAddTask} className="flex-1 btn-primary">
                  Add Task
                </button>
                <button
                  onClick={() => setShowAddTask(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Import Tasks Modal */}
        {showImportTasks && (
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
                    onChange={(e) => setImportJson(e.target.value)}
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
                      <strong>Optional:</strong> desc, effort (1-10), tags
                      (array), status (todo/inprogress/done)
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
                      {importResult.success
                        ? "Import Successful!"
                        : "Import Failed"}
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
                        <h4 className="font-medium text-red-800 mb-1">
                          Errors:
                        </h4>
                        <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                          {importResult.errors.map((error) => (
                            <li key={error}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleImportTasks}
                  disabled={!importJson.trim()}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Import Tasks
                </button>
                <button
                  onClick={() => {
                    setShowImportTasks(false);
                    setImportJson("");
                    setImportResult(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Note Drawer */}
        <NoteDrawer
          isOpen={noteDrawerOpen}
          taskTitle={
            selectedTaskId ? tracker.tasks[selectedTaskId]?.title || "" : ""
          }
          noteType={noteType}
          newNote={newNote}
          onClose={handleCloseNoteDrawer}
          onNoteTypeChange={setNoteType}
          onNoteChange={setNewNote}
          onSave={handleSaveNote}
          onKeyDown={handleNoteKeyDown}
        />

        {/* Task Page */}
        {taskPageOpen && selectedTaskForPage && (
          <TaskPage
            task={tracker.tasks[selectedTaskForPage]}
            taskPage={getTaskPage(selectedTaskForPage)}
            onSave={handleSaveTaskPage}
            onClose={handleCloseTaskPage}
          />
        )}
      </div>
    </div>
  );
}
