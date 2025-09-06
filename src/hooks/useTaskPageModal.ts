import { useState, useCallback } from "react";
import { TaskPage } from "../types";

export function useTaskPageModal(saveTaskPage: (taskPage: TaskPage) => void) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleOpen = useCallback((taskId: string) => {
    setSelectedTaskId(taskId);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSelectedTaskId(null);
  }, []);

  const handleSave = useCallback(
    (taskPage: TaskPage) => {
      saveTaskPage(taskPage);
    },
    [saveTaskPage]
  );

  return {
    isOpen,
    selectedTaskId,
    handleOpen,
    handleClose,
    handleSave,
  };
}
