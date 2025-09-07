"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Plus, Archive, Edit, Trash2 } from "lucide-react";
import { TrackerGroup } from "../../types";

interface GroupManagerProps {
  groups: Record<string, TrackerGroup>;
  onCreateGroup: (data: {
    name: string;
    description?: string;
    color?: string;
  }) => void;
  onUpdateGroup: (id: string, patch: Partial<TrackerGroup>) => void;
  onDeleteGroup: (id: string) => void;
  onClose: () => void;
}

const GROUP_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#84CC16", // Lime
  "#EC4899", // Pink
  "#6B7280", // Gray
];

export default function GroupManager({
  groups,
  onCreateGroup,
  onUpdateGroup,
  onDeleteGroup,
  onClose,
}: GroupManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: GROUP_COLORS[0],
  });

  const handleCreateGroup = () => {
    if (formData.name.trim()) {
      onCreateGroup({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color,
      });
      setFormData({ name: "", description: "", color: GROUP_COLORS[0] });
      setShowCreateForm(false);
    }
  };

  const handleUpdateGroup = (groupId: string) => {
    if (formData.name.trim()) {
      onUpdateGroup(groupId, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color,
      });
      setFormData({ name: "", description: "", color: GROUP_COLORS[0] });
      setEditingGroup(null);
    }
  };

  const startEdit = (group: TrackerGroup) => {
    setFormData({
      name: group.name,
      description: group.description || "",
      color: group.color || GROUP_COLORS[0],
    });
    setEditingGroup(group.id);
  };

  const sortedGroups = Object.values(groups).sort((a, b) => a.order - b.order);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Manage Groups</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-black transition-colors rounded-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Create New Group Button */}
          {!showCreateForm && !editingGroup && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all mb-6"
            >
              <div className="flex items-center justify-center gap-3">
                <Plus className="w-6 h-6 text-gray-400" />
                <span className="text-gray-600 font-medium">
                  Create New Group
                </span>
              </div>
            </button>
          )}

          {/* Create/Edit Form */}
          {(showCreateForm || editingGroup) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 rounded-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingGroup ? "Edit Group" : "Create New Group"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="e.g., Math for AI/ML"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Brief description of this group..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {GROUP_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, color }))
                        }
                        className={`w-8 h-8 rounded-full border-2 ${
                          formData.color === color
                            ? "border-gray-900"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    if (editingGroup) {
                      handleUpdateGroup(editingGroup);
                    } else {
                      handleCreateGroup();
                    }
                  }}
                  className="flex-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {editingGroup ? "Update Group" : "Create Group"}
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingGroup(null);
                    setFormData({
                      name: "",
                      description: "",
                      color: GROUP_COLORS[0],
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          {/* Groups List */}
          <div className="space-y-3">
            {sortedGroups.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Archive className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No groups yet</p>
                <p className="text-sm">
                  Create your first group to organize your trackers
                </p>
              </div>
            ) : (
              sortedGroups.map((group) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: group.color }}
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {group.name}
                        </h4>
                        {group.description && (
                          <p className="text-sm text-gray-600">
                            {group.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(group)}
                        className="p-2 text-gray-400 hover:text-black transition-colors rounded-lg hover:bg-gray-100"
                        title="Edit group"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteGroup(group.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Delete group"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
