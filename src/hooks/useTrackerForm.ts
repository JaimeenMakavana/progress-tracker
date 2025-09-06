import { useState, useCallback } from "react";
import { TrackerFormData } from "./useTrackerOperations";

export function useTrackerForm() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<TrackerFormData>({
    title: "",
    description: "",
  });

  const handleFormChange = useCallback(
    (field: keyof TrackerFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleCreateTracker = useCallback(
    (createTracker: (data: TrackerFormData) => void) => {
      const trimmedTitle = formData.title.trim();
      if (!trimmedTitle) return;

      createTracker({
        title: trimmedTitle,
        description: formData.description.trim(),
      });

      setFormData({ title: "", description: "" });
      setShowCreateForm(false);
    },
    [formData]
  );

  const handleCloseCreateForm = useCallback(() => {
    setShowCreateForm(false);
    setFormData({ title: "", description: "" });
  }, []);

  const handleOpenCreateForm = useCallback(() => {
    setShowCreateForm(true);
  }, []);

  return {
    showCreateForm,
    formData,
    handleFormChange,
    handleCreateTracker,
    handleCloseCreateForm,
    handleOpenCreateForm,
  };
}
