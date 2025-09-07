import React from "react";
import { TrackerFormData } from "../../hooks/useTrackerOperations";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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
import { Plus } from "lucide-react";

interface CreateTrackerModalProps {
  isOpen: boolean;
  formData: TrackerFormData;
  onFormChange: (field: keyof TrackerFormData, value: string) => void;
  onCreateTracker: () => void;
  onClose: () => void;
}

export function CreateTrackerModal({
  isOpen,
  formData,
  onFormChange,
  onCreateTracker,
  onClose,
}: CreateTrackerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2C3930] rounded-xl flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Create New Tracker</DialogTitle>
              <DialogDescription>
                Set up a new tracker to monitor your progress.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="tracker-title">Tracker Title</Label>
            <Input
              id="tracker-title"
              type="text"
              value={formData.title}
              onChange={(e) => onFormChange("title", e.target.value)}
              className="text-lg"
              placeholder="What are you tracking?"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tracker-description">Description (optional)</Label>
            <Textarea
              id="tracker-description"
              value={formData.description}
              onChange={(e) => onFormChange("description", e.target.value)}
              placeholder="Add context about your goals..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="py-4 text-lg font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={onCreateTracker}
            className="py-4 text-lg font-semibold text-white"
          >
            Create Tracker
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
