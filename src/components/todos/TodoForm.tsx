"use client";
import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Todo, TodoCategory } from "../../types";
import { motion, AnimatePresence } from "framer-motion";

interface TodoFormProps {
  onSubmit: (
    todo: Omit<Todo, "id" | "createdAt" | "updatedAt" | "xpValue">
  ) => void;
  categories: TodoCategory[];
}

const todoTypes = [
  { value: "checklist", label: "Checklist Item", icon: "☑️" },
  { value: "learning_term", label: "Learning Term", icon: "📚" },
  { value: "project_milestone", label: "Project Milestone", icon: "🎯" },
  { value: "daily_habit", label: "Daily Habit", icon: "🔥" },
  { value: "quick_action", label: "Quick Action", icon: "⚡" },
] as const;

const priorities = [
  { value: "low", label: "Low", color: "text-gray-600" },
  { value: "medium", label: "Medium", color: "text-yellow-600" },
  { value: "high", label: "High", color: "text-red-600" },
] as const;

export function TodoForm({ onSubmit, categories }: TodoFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "checklist" as Todo["type"],
    category: categories[0]?.id || "",
    priority: "medium" as Todo["priority"],
    tags: [] as string[],
    estimatedTime: undefined as number | undefined,
    dueDate: undefined as string | undefined,
    // Type-specific fields
    definition: "",
    examples: [] as string[],
    masteryLevel: "beginner" as "beginner" | "intermediate" | "advanced",
    projectId: "",
    progress: 0,
    actionType: "other" as "call" | "email" | "research" | "purchase" | "other",
  });
  const [newTag, setNewTag] = useState("");
  const [newExample, setNewExample] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) return;

    const todoData: Omit<Todo, "id" | "createdAt" | "updatedAt" | "xpValue"> = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      type: formData.type,
      category: formData.category,
      priority: formData.priority,
      tags: formData.tags,
      status: "pending",
      estimatedTime: formData.estimatedTime,
      dueDate: formData.dueDate,
      // Type-specific fields
      ...(formData.type === "learning_term" && {
        definition: formData.definition.trim() || undefined,
        examples: formData.examples.filter((ex) => ex.trim()),
        masteryLevel: formData.masteryLevel,
      }),
      ...(formData.type === "project_milestone" && {
        projectId: formData.projectId.trim() || undefined,
        progress: formData.progress,
      }),
      ...(formData.type === "quick_action" && {
        actionType: formData.actionType,
      }),
    };

    onSubmit(todoData);

    // Reset form
    setFormData({
      title: "",
      description: "",
      type: "checklist",
      category: categories[0]?.id || "",
      priority: "medium",
      tags: [],
      estimatedTime: undefined,
      dueDate: undefined,
      definition: "",
      examples: [],
      masteryLevel: "beginner",
      projectId: "",
      progress: 0,
      actionType: "other",
    });
    setIsOpen(false);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addExample = () => {
    if (newExample.trim() && !formData.examples.includes(newExample.trim())) {
      setFormData((prev) => ({
        ...prev,
        examples: [...prev.examples, newExample.trim()],
      }));
      setNewExample("");
    }
  };

  const removeExample = (exampleToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      examples: prev.examples.filter((example) => example !== exampleToRemove),
    }));
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Todo
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={() => setIsOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Create New Todo
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="What needs to be done?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Additional details..."
                rows={3}
              />
            </div>

            {/* Type and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <Select
                  value={formData.type}
                  onValueChange={(value: Todo["type"]) =>
                    setFormData((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger className="bg-white border-gray-300 hover:border-gray-400 focus:border-blue-500">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    {todoTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="bg-white border-gray-300 hover:border-gray-400 focus:border-blue-500">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Priority and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: Todo["priority"]) =>
                    setFormData((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger className="bg-white border-gray-300 hover:border-gray-400 focus:border-blue-500">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Time (minutes)
                </label>
                <Input
                  type="number"
                  value={formData.estimatedTime || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      estimatedTime: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    }))
                  }
                  placeholder="e.g., 30"
                />
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <Input
                type="datetime-local"
                value={formData.dueDate || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
                }
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                />
                <Button type="button" onClick={addTag} size="sm">
                  Add
                </Button>
              </div>
            </div>

            {/* Type-specific fields */}
            <AnimatePresence mode="wait">
              {formData.type === "learning_term" && (
                <motion.div
                  key="learning_term"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 border-t pt-4"
                >
                  <h3 className="font-medium text-gray-900">
                    Learning Term Details
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Definition
                    </label>
                    <Textarea
                      value={formData.definition}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          definition: e.target.value,
                        }))
                      }
                      placeholder="What does this term mean?"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Examples
                    </label>
                    <div className="space-y-2 mb-2">
                      {formData.examples.map((example) => (
                        <div
                          key={example}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm">{example}</span>
                          <button
                            type="button"
                            onClick={() => removeExample(example)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        value={newExample}
                        onChange={(e) => setNewExample(e.target.value)}
                        placeholder="Add an example"
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addExample())
                        }
                      />
                      <Button type="button" onClick={addExample} size="sm">
                        Add
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mastery Level
                    </label>
                    <Select
                      value={formData.masteryLevel}
                      onValueChange={(
                        value: "beginner" | "intermediate" | "advanced"
                      ) =>
                        setFormData((prev) => ({
                          ...prev,
                          masteryLevel: value,
                        }))
                      }
                    >
                      <SelectTrigger className="bg-white border-gray-300 hover:border-gray-400 focus:border-blue-500">
                        <SelectValue placeholder="Select mastery level" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}

              {formData.type === "project_milestone" && (
                <motion.div
                  key="project_milestone"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 border-t pt-4"
                >
                  <h3 className="font-medium text-gray-900">
                    Project Milestone Details
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project ID
                    </label>
                    <Input
                      value={formData.projectId}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          projectId: e.target.value,
                        }))
                      }
                      placeholder="Project identifier"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Progress (%)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.progress}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          progress: parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </motion.div>
              )}

              {formData.type === "quick_action" && (
                <motion.div
                  key="quick_action"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 border-t pt-4"
                >
                  <h3 className="font-medium text-gray-900">
                    Quick Action Details
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Action Type
                    </label>
                    <Select
                      value={formData.actionType}
                      onValueChange={(
                        value:
                          | "call"
                          | "email"
                          | "research"
                          | "purchase"
                          | "other"
                      ) =>
                        setFormData((prev) => ({ ...prev, actionType: value }))
                      }
                    >
                      <SelectTrigger className="bg-white border-gray-300 hover:border-gray-400 focus:border-blue-500">
                        <SelectValue placeholder="Select action type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="call">📞 Call</SelectItem>
                        <SelectItem value="email">📧 Email</SelectItem>
                        <SelectItem value="research">🔍 Research</SelectItem>
                        <SelectItem value="purchase">🛒 Purchase</SelectItem>
                        <SelectItem value="other">⚡ Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Todo</Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
