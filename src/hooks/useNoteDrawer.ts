import { useState, useCallback } from "react";

export type NoteType = "reflection" | "snippet" | "link";

export interface NoteData {
  text: string;
  type: NoteType;
}

export function useNoteDrawer(
  onAddNote: (taskId: string, note: NoteData) => void
) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState<NoteType>("reflection");

  const handleOpen = useCallback((taskId: string) => {
    setSelectedTaskId(taskId);
    setIsOpen(true);
    setNewNote("");
    setNoteType("reflection");
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSelectedTaskId(null);
    setNewNote("");
  }, []);

  const handleSave = useCallback(() => {
    if (selectedTaskId && newNote.trim()) {
      onAddNote(selectedTaskId, { text: newNote.trim(), type: noteType });
      handleClose();
    }
  }, [selectedTaskId, newNote, noteType, onAddNote, handleClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        handleSave();
      } else if (e.key === "Escape") {
        handleClose();
      }
    },
    [handleSave, handleClose]
  );

  return {
    isOpen,
    selectedTaskId,
    newNote,
    noteType,
    handleOpen,
    handleClose,
    handleSave,
    handleKeyDown,
    setNewNote,
    setNoteType,
  };
}
