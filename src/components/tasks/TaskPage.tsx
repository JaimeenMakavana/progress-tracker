"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, FileText, Edit, List, Code, Clipboard, Plus } from "lucide-react";
import { Task, TaskPage as TaskPageType, ContentBlock } from "../../types";
import ContentBlockComponent from "./ContentBlock";
import { v4 as uuid } from "uuid";

interface TaskPageProps {
  task: Task;
  taskPage?: TaskPageType;
  onSave: (taskPage: TaskPageType) => void;
  onClose: () => void;
}

export default function TaskPage({
  task,
  taskPage,
  onSave,
  onClose,
}: TaskPageProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState(task.title);

  useEffect(() => {
    if (taskPage) {
      setBlocks(taskPage.blocks);
      setPageTitle(taskPage.title);
    } else {
      // Create initial blocks for new page
      const initialBlocks: ContentBlock[] = [
        {
          id: uuid(),
          type: "text",
          content: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setBlocks(initialBlocks);
    }
  }, [taskPage, task.title]);

  const updateBlock = (blockId: string, content: string) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId
          ? { ...block, content, updatedAt: new Date().toISOString() }
          : block
      )
    );
  };

  const deleteBlock = (blockId: string) => {
    setBlocks((prev) => {
      const newBlocks = prev.filter((block) => block.id !== blockId);
      if (newBlocks.length === 0) {
        // Add a new empty block if all blocks are deleted
        newBlocks.push({
          id: uuid(),
          type: "text",
          content: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      return newBlocks;
    });
  };

  const addBlock = (afterBlockId: string, type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: uuid(),
      type,
      content: "",
      metadata: type === "heading" ? { level: 2 } : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBlocks((prev) => {
      const index = prev.findIndex((block) => block.id === afterBlockId);
      const newBlocks = [...prev];
      newBlocks.splice(index + 1, 0, newBlock);
      return newBlocks;
    });

    setEditingBlockId(newBlock.id);
  };

  const handleSave = () => {
    const taskPageData: TaskPageType = {
      taskId: task.id,
      title: pageTitle,
      blocks,
      createdAt: taskPage?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
    };
    onSave(taskPageData);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex" onKeyDown={handleKeyDown}>
      {/* Backdrop */}
      <div className="flex-1 bg-black bg-opacity-50" onClick={onClose} />

      {/* Page */}
      <div className="w-full sm:w-3/5 bg-white shadow-2xl flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <input
              type="text"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none w-full"
              placeholder="Page title..."
            />
            <p className="text-sm text-gray-500 mt-1">
              {task.status} • {task.tags.join(", ")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-black transition-colors rounded-lg hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {blocks.length === 0 ||
            (blocks.length === 1 && blocks[0].content === "") ? (
              <div className="py-12">
                {/* Welcome Section */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Start building your knowledge
                  </h3>
                  <p className="text-gray-600 mb-6">
                    This is your personal space for &ldquo;{task.title}&rdquo;.
                    Add thoughts, code snippets, links, and insights as you
                    learn.
                  </p>
                </div>

                {/* Quick Start Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 cursor-pointer transition-all"
                    onClick={() => {
                      setEditingBlockId(blocks[0]?.id || null);
                      if (blocks[0]) {
                        setEditingBlockId(blocks[0].id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Edit className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Start writing
                        </h4>
                        <p className="text-sm text-gray-600">
                          Begin with your thoughts and ideas
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 cursor-pointer transition-all"
                    onClick={() => {
                      if (blocks[0]) {
                        const newBlock: ContentBlock = {
                          id: uuid(),
                          type: "heading",
                          content: "Key Concepts",
                          metadata: { level: 2 },
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        };
                        setBlocks((prev) => [newBlock, ...prev]);
                        setEditingBlockId(newBlock.id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <List className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Add a heading
                        </h4>
                        <p className="text-sm text-gray-600">
                          Structure your content with headings
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 cursor-pointer transition-all"
                    onClick={() => {
                      if (blocks[0]) {
                        const newBlock: ContentBlock = {
                          id: uuid(),
                          type: "code",
                          content:
                            "// Add your code here\nconsole.log('Hello, world!');",
                          metadata: { language: "javascript" },
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        };
                        setBlocks((prev) => [newBlock, ...prev]);
                        setEditingBlockId(newBlock.id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Code className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Add code</h4>
                        <p className="text-sm text-gray-600">
                          Include code snippets and examples
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 cursor-pointer transition-all"
                    onClick={() => {
                      if (blocks[0]) {
                        const newBlock: ContentBlock = {
                          id: uuid(),
                          type: "list",
                          content:
                            "First important point\nSecond key insight\nThird takeaway",
                          metadata: { listType: "bullet" },
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        };
                        setBlocks((prev) => [newBlock, ...prev]);
                        setEditingBlockId(newBlock.id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <Clipboard className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Create a list
                        </h4>
                        <p className="text-sm text-gray-600">
                          Organize key points and takeaways
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* First Block - Always Visible */}
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Plus className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-blue-700">
                      Click here to start writing
                    </span>
                  </div>
                  <div
                    className="min-h-[60px] p-4 bg-white rounded-lg border border-blue-200 cursor-text hover:border-blue-300 transition-colors"
                    onClick={() => setEditingBlockId(blocks[0]?.id || null)}
                  >
                    <p className="text-gray-500 text-sm">
                      Type your first thoughts about &ldquo;{task.title}
                      &rdquo;...
                    </p>
                  </div>
                </div>

                {/* Tips */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    💡 Tips to get started:
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Start with what you already know about this topic</li>
                    <li>• Add questions you want to explore</li>
                    <li>• Include code examples or formulas</li>
                    <li>• Link to helpful resources</li>
                    <li>• Update this page as you learn more</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {blocks.map((block, index) => (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ContentBlockComponent
                      block={block}
                      isEditing={editingBlockId === block.id}
                      onUpdate={updateBlock}
                      onDelete={deleteBlock}
                      onAddBlock={addBlock}
                      onStartEdit={setEditingBlockId}
                      onStopEdit={() => setEditingBlockId(null)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span>Press Ctrl+S to save</span>
              <span>•</span>
              <span>Press Esc to close</span>
            </div>
            <div>
              {blocks.length} block{blocks.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
