"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useTrackerPage } from "../../../hooks/useTrackerPage";
import { useNoteDrawer } from "../../../hooks/useNoteDrawer";
import { useTaskPageModal } from "../../../hooks/useTaskPageModal";
import { TrackerHeader, ProgressOverview, TaskList } from "../../../components";
import NoteDrawer from "../../../components/tasks/NoteDrawer";
import TaskPage from "../../../components/tasks/TaskPage";
import { useTrackers } from "../../../context/TrackersContext";
import {
  AddTaskModal,
  ImportTasksModal,
  TrackerNotFound,
} from "../../../components/tracker";

export default function TrackerPage() {
  const params = useParams();
  const router = useRouter();
  const trackerId = params.id as string;

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

  // Custom hooks for modal management
  const noteDrawer = useNoteDrawer(onAddNote);
  const taskPageModal = useTaskPageModal(saveTaskPage);

  // Handlers
  const handleBackToDashboard = () => {
    router.push("/");
  };

  const handleCloseImportModal = () => {
    setShowImportTasks(false);
    setImportJson("");
    setImportResult(null);
  };

  if (!tracker) {
    return <TrackerNotFound onBackToDashboard={handleBackToDashboard} />;
  }

  return (
    <div className="min-h-screen">
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
            onOpenNoteDrawer={noteDrawer.handleOpen}
            onOpenTaskPage={taskPageModal.handleOpen}
          />
        </div>

        {/* Add Task Modal */}
        <AddTaskModal
          isOpen={showAddTask}
          title={newTaskTitle}
          effort={newTaskEffort}
          tags={newTaskTags}
          onTitleChange={setNewTaskTitle}
          onEffortChange={setNewTaskEffort}
          onTagsChange={setNewTaskTags}
          onAddTask={handleAddTask}
          onClose={() => setShowAddTask(false)}
        />

        {/* Import Tasks Modal */}
        <ImportTasksModal
          isOpen={showImportTasks}
          importJson={importJson}
          importResult={importResult}
          onImportJsonChange={setImportJson}
          onImportTasks={handleImportTasks}
          onClose={handleCloseImportModal}
        />

        {/* Note Drawer */}
        <NoteDrawer
          isOpen={noteDrawer.isOpen}
          taskTitle={
            noteDrawer.selectedTaskId
              ? tracker.tasks[noteDrawer.selectedTaskId]?.title || ""
              : ""
          }
          noteType={noteDrawer.noteType}
          newNote={noteDrawer.newNote}
          onClose={noteDrawer.handleClose}
          onNoteTypeChange={noteDrawer.setNoteType}
          onNoteChange={noteDrawer.setNewNote}
          onSave={noteDrawer.handleSave}
          onKeyDown={noteDrawer.handleKeyDown}
        />

        {/* Task Page */}
        {taskPageModal.isOpen && taskPageModal.selectedTaskId && (
          <TaskPage
            task={tracker.tasks[taskPageModal.selectedTaskId]}
            taskPage={getTaskPage(taskPageModal.selectedTaskId)}
            onSave={taskPageModal.handleSave}
            onClose={taskPageModal.handleClose}
          />
        )}
      </div>
    </div>
  );
}
