"use client";
import React from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface NoteDrawerProps {
  isOpen: boolean;
  taskTitle: string;
  noteType: "reflection" | "snippet" | "link";
  newNote: string;
  onClose: () => void;
  onNoteTypeChange: (type: "reflection" | "snippet" | "link") => void;
  onNoteChange: (note: string) => void;
  onSave: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export default function NoteDrawer({
  isOpen,
  taskTitle,
  noteType,
  newNote,
  onClose,
  onNoteTypeChange,
  onNoteChange,
  onSave,
  onKeyDown,
}: NoteDrawerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Note to &quot;{taskTitle}&quot;</DialogTitle>
          <DialogDescription>
            Add a reflection, code snippet, or link to this task.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="note-type">Note Type</Label>
            <Select
              value={noteType}
              onValueChange={(value: "reflection" | "snippet" | "link") =>
                onNoteTypeChange(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select note type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reflection">Reflection</SelectItem>
                <SelectItem value="snippet">Code Snippet</SelectItem>
                <SelectItem value="link">Link/Resource</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note-content">Note Content</Label>
            <Textarea
              id="note-content"
              value={newNote}
              onChange={(e) => onNoteChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Enter your note here..."
              rows={12}
              autoFocus
            />
            <p className="text-sm text-gray-500">
              Press Ctrl+Enter to save, Esc to cancel
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={!newNote.trim()}>
            Save Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
