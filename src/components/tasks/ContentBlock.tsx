"use client";
import React, { useState, useRef, useEffect } from "react";
import { ContentBlock as ContentBlockType } from "../../types";

interface ContentBlockProps {
  block: ContentBlockType;
  isEditing: boolean;
  onUpdate: (blockId: string, content: string) => void;
  onDelete: (blockId: string) => void;
  onAddBlock: (afterBlockId: string, type: ContentBlockType["type"]) => void;
  onStartEdit: (blockId: string) => void;
  onStopEdit: () => void;
}

export default function ContentBlock({
  block,
  isEditing,
  onUpdate,
  onDelete,
  onAddBlock,
  onStartEdit,
  onStopEdit,
}: ContentBlockProps) {
  const [content, setContent] = useState(block.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(content.length, content.length);
    }
  }, [isEditing, content.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (content.trim()) {
        onUpdate(block.id, content);
        onStopEdit();
        onAddBlock(block.id, "text");
      }
    } else if (e.key === "Escape") {
      setContent(block.content);
      onStopEdit();
    } else if (e.key === "Backspace" && content === "") {
      e.preventDefault();
      onDelete(block.id);
    }
  };

  const handleBlur = () => {
    if (content !== block.content) {
      onUpdate(block.id, content);
    }
    onStopEdit();
  };

  const getPlaceholderText = (type: string) => {
    switch (type) {
      case "heading":
        return "Enter heading text...";
      case "code":
        return "Enter your code here...";
      case "list":
        return "Enter list items (one per line)...";
      case "quote":
        return "Enter quote text...";
      case "link":
        return "Enter link text...";
      default:
        return "Type something...";
    }
  };

  const renderContent = () => {
    switch (block.type) {
      case "heading":
        const HeadingTag = `h${
          block.metadata?.level || 2
        }` as keyof React.JSX.IntrinsicElements;
        return (
          <HeadingTag
            className={`font-bold text-gray-900 ${
              block.metadata?.level === 1
                ? "text-2xl"
                : block.metadata?.level === 2
                ? "text-xl"
                : "text-lg"
            }`}
          >
            {block.content}
          </HeadingTag>
        );

      case "code":
        return (
          <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="whitespace-pre-wrap">{block.content}</pre>
          </div>
        );

      case "quote":
        return (
          <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700">
            {block.content}
          </blockquote>
        );

      case "list":
        const ListTag = block.metadata?.listType === "numbered" ? "ol" : "ul";
        const listItems = block.content
          .split("\n")
          .filter((item) => item.trim());
        return (
          <ListTag
            className={
              block.metadata?.listType === "numbered"
                ? "list-decimal list-inside"
                : "list-disc list-inside"
            }
          >
            {listItems.map((item, index) => (
              <li key={index} className="mb-1">
                {item.trim()}
              </li>
            ))}
          </ListTag>
        );

      case "divider":
        return <hr className="border-gray-300 my-4" />;

      case "link":
        return (
          <a
            href={block.metadata?.url || block.content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {block.content}
          </a>
        );

      default:
        return (
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {block.content}
          </p>
        );
    }
  };

  if (isEditing) {
    return (
      <div className="group border-2 border-blue-300 rounded-lg p-4 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-xs font-medium text-blue-700">
            Editing {block.type}
          </span>
        </div>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-full resize-none border-none outline-none bg-transparent text-gray-800 leading-relaxed"
          placeholder={getPlaceholderText(block.type)}
          rows={Math.max(1, content.split("\n").length)}
        />
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <span>Press Enter to create new block</span>
          <span>•</span>
          <span>Press Esc to cancel</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group hover:bg-gray-50 rounded-lg p-3 -m-3 cursor-text border border-transparent hover:border-gray-200 transition-all"
      onClick={() => onStartEdit(block.id)}
    >
      {block.content === "" ? (
        <div className="text-gray-400 italic">
          {getPlaceholderText(block.type)}
        </div>
      ) : (
        renderContent()
      )}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
              {block.type}
            </span>
            <span>•</span>
            <span>{new Date(block.updatedAt).toLocaleDateString()}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(block.id);
            }}
            className="text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
