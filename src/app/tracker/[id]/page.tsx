"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useTrackerPage } from "../../../hooks/useTrackerPage";
import { useNoteDrawer } from "../../../hooks/useNoteDrawer";
import { useTaskPageModal } from "../../../hooks/useTaskPageModal";
import {
  TrackerHeader,
  ProgressOverview,
  EnhancedTaskList,
} from "../../../components";
import NoteDrawer from "../../../components/tasks/NoteDrawer";
import TaskPage from "../../../components/tasks/TaskPage";
import { AICoach } from "../../../components/coach";
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
    // onToggleTask,
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
    <div className="min-h-screen w-full">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 py-2 sm:py-4 lg:py-6">
        <div className="mb-4 sm:mb-6">
          <TrackerHeader
            tracker={tracker}
            onEditTracker={handleEditTracker}
            onAddTask={() => setShowAddTask(true)}
            onImportTasks={() => setShowImportTasks(true)}
          />
        </div>

        <div className="mb-4 sm:mb-6">
          <ProgressOverview tracker={tracker} />
        </div>

        {/* Tasks */}
        <div className="bg-white/30 backdrop-blur-sm ">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-6 sm:mb-8">
            Tasks
          </h2>
          <EnhancedTaskList
            tracker={tracker}
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

        {/* AI Coach */}
        {tracker && <AICoach trackerId={trackerId} />}
      </div>
    </div>
  );
}
