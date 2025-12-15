"use client";

import { useState, useRef, useEffect } from "react";
import { Task } from "./task-list";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
  onArchive?: (id: string) => void;
  onEdit?: (id: string, newText: string) => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
}

export default function TaskItem({ task, onToggle, onDelete, onArchive, onEdit, onDragStart, onDragEnd }: TaskItemProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleCheck = () => {
    if (task.completed || isChecking) return;
    
    setIsChecking(true);
    setTimeout(() => {
      onToggle(task.id);
      setIsChecking(false);
    }, 300);
  };

  const handleTextClick = () => {
    if (!task.completed && onEdit) {
      setIsEditing(true);
    }
  };

  const handleEditSave = () => {
    if (editText.trim() && editText !== task.text && onEdit) {
      onEdit(task.id, editText.trim());
    } else {
      setEditText(task.text);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEditSave();
    } else if (e.key === "Escape") {
      setEditText(task.text);
      setIsEditing(false);
    }
  };

  return (
    <div className="group content-stretch flex flex-col items-start relative rounded-lg shrink-0 w-full">
      <div className="content-stretch flex items-center relative shrink-0 w-full">
        {/* Drag handle - visible on hover, positioned outside */}
        <div 
          className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          draggable={!!onDragStart}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <svg
            className="size-4 text-[var(--color-grey-60,#999)]"
            viewBox="0 0 16 16"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="5" cy="3" r="1.5" />
            <circle cx="11" cy="3" r="1.5" />
            <circle cx="5" cy="8" r="1.5" />
            <circle cx="11" cy="8" r="1.5" />
            <circle cx="5" cy="13" r="1.5" />
            <circle cx="11" cy="13" r="1.5" />
          </svg>
        </div>
        <button
          type="button"
          onClick={handleCheck}
          className={`rounded-[4px] shrink-0 size-4 flex items-center justify-center transition-all duration-150 ${
            task.completed
              ? "bg-[var(--color-grey-60,#999)]"
              : isChecking
                ? "bg-[#111]"
                : "bg-transparent border border-[var(--color-grey-90,#e5e5e5)]"
          }`}
        >
          {(task.completed || isChecking) && (
            <svg
              className="size-2.5"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.5 5.5L4 8L8.5 2"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px pl-2 pr-0 py-0 relative shrink-0">
          <div className="content-stretch flex flex-col items-start px-0 py-[3px] relative shrink-0 w-full">
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={handleEditSave}
                onKeyDown={handleKeyDown}
                className="font-['SF_Pro_Display:Regular',sans-serif] text-sm text-[color:var(--color-grey-7,#111)] leading-[14px] w-full bg-transparent border-0 outline-none p-0 m-0 selection:bg-black selection:text-white"
              />
            ) : (
              <p
                onClick={handleTextClick}
                className={`flex flex-col font-['SF_Pro_Display:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-sm w-full transition-all duration-150 ${
                  task.completed
                    ? "text-[color:var(--color-grey-60,#999)] line-through"
                    : isChecking
                      ? "text-[color:var(--color-grey-60,#999)] line-through"
                      : "text-[color:var(--color-grey-7,#111)] cursor-text"
                }`}
              >
                <span className="leading-[14px]">{task.text}</span>
              </p>
            )}
          </div>
        </div>
        
        {/* Action buttons - visible on hover */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Archive button */}
          {onArchive && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onArchive(task.id);
              }}
              className="group/archive relative"
              aria-label="Archive"
            >
              <svg
                className="size-3.5 text-[var(--color-grey-60,#999)] hover:text-[#111] transition-colors"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.333 5.333v8a1.333 1.333 0 01-1.333 1.334H4a1.333 1.333 0 01-1.333-1.334v-8M1.333 2.667h13.334v2.666H1.333V2.667zM6.667 8h2.666"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-[#111] rounded opacity-0 group-hover/archive:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Archive
              </span>
            </button>
          )}
          
          {/* Delete button */}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="group/delete relative"
              aria-label="Delete"
            >
              <svg
                className="size-3.5 text-[var(--color-grey-60,#999)] hover:text-[#111] transition-colors"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-[#111] rounded opacity-0 group-hover/delete:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Delete
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

