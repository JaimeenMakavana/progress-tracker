import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface AddTaskModalProps {
  isOpen: boolean;
  title: string;
  effort: number;
  tags: string;
  onTitleChange: (title: string) => void;
  onEffortChange: (effort: number) => void;
  onTagsChange: (tags: string) => void;
  onAddTask: () => void;
  onClose: () => void;
}

export function AddTaskModal({
  isOpen,
  title,
  effort,
  tags,
  onTitleChange,
  onEffortChange,
  onTagsChange,
  onAddTask,
  onClose,
}: AddTaskModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task to track your progress.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Task Title</Label>
            <Input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="e.g., Learn React Hooks"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-effort">Effort (1-10)</Label>
            <Input
              id="task-effort"
              type="number"
              min="1"
              max="10"
              value={effort}
              onChange={(e) => onEffortChange(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-tags">Tags (comma-separated)</Label>
            <Input
              id="task-tags"
              type="text"
              value={tags}
              onChange={(e) => onTagsChange(e.target.value)}
              placeholder="e.g., react, frontend, learning"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onAddTask}>Add Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
