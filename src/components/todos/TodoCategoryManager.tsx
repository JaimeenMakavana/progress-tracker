"use client";
import React, { useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { TodoCategory } from "../../types";

interface TodoCategoryManagerProps {
  categories: TodoCategory[];
  onAddCategory: (
    category: Omit<TodoCategory, "id" | "createdAt" | "order">
  ) => void;
  onUpdateCategory: (id: string, updates: Partial<TodoCategory>) => void;
  onDeleteCategory: (id: string) => void;
}

const defaultColors = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F97316", // Orange
];

const defaultIcons = [
  "💼",
  "📚",
  "🏠",
  "💪",
  "🎨",
  "💰",
  "🚀",
  "🎯",
  "🔥",
  "⚡",
  "🌟",
  "💎",
  "🏆",
  "🎪",
  "🎭",
  "🎨",
  "🎵",
  "🎬",
  "📱",
  "💻",
];

export function TodoCategoryManager({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}: TodoCategoryManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TodoCategory | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: defaultColors[0],
    icon: defaultIcons[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategory) {
      onUpdateCategory(editingCategory.id, formData);
      setEditingCategory(null);
    } else {
      onAddCategory(formData);
    }

    setFormData({
      name: "",
      description: "",
      color: defaultColors[0],
      icon: defaultIcons[0],
    });
    setIsOpen(false);
  };

  const handleEdit = (category: TodoCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      color: category.color,
      icon: category.icon,
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    ) {
      onDeleteCategory(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between my-4">
        <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
        <Button
          onClick={() => {
            setEditingCategory(null);
            setIsOpen(true);
          }}
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
                  style={{ backgroundColor: category.color }}
                >
                  {category.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{category.name}</h4>
                  {category.description && (
                    <p className="text-sm text-gray-600">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(category)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Category Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Category name"
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
                    placeholder="Category description"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {defaultColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, color }))
                        }
                        className={`w-8 h-8 rounded-full border-2 ${
                          formData.color === color
                            ? "border-gray-900"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {defaultIcons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, icon }))
                        }
                        className={`w-8 h-8 rounded border-2 text-lg ${
                          formData.icon === icon
                            ? "border-gray-900"
                            : "border-gray-300"
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingCategory ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
