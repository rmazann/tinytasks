"use client";

import { Task } from "./task-list";

interface CollapsibleSectionProps {
  title: string;
  tasks: Task[];
  isExpanded: boolean;
  onToggleSection: () => void;
  onRestore?: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
}

export default function CollapsibleSection({ 
  title, 
  tasks, 
  isExpanded,
  onToggleSection,
  onRestore,
  onPermanentDelete 
}: CollapsibleSectionProps) {
  if (tasks.length === 0) return null;

  return (
    <div className="content-stretch flex flex-col gap-1 items-stretch pb-0 pt-2 px-0 relative shrink-0 w-full">
      <button
        type="button"
        onClick={onToggleSection}
        className="h-5 relative shrink-0 w-full text-left"
      >
        <div className="absolute flex items-center justify-center left-0 size-4 top-1/2 -translate-y-1/2">
          <div className={`flex-none transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}>
            <svg
              className="relative size-4"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 4L10 8L6 12"
                stroke="#999"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col items-start left-4 pl-2 pr-0 py-0 top-0">
          <div className="content-stretch flex flex-col items-center relative shrink-0">
            <p className="flex flex-col font-['SF_Pro_Display:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[color:var(--color-grey-60,#999)] text-sm text-center text-nowrap">
              <span className="leading-5">{title} ({tasks.length})</span>
            </p>
          </div>
        </div>
      </button>

      <div 
        className={`grid transition-all duration-200 ease-out ${
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className={isExpanded ? "" : "overflow-hidden"}>
          <div className="content-stretch flex flex-col gap-2 items-stretch relative shrink-0 w-full pt-1">
            {tasks.map((task, index) => (
            <div key={task.id} className="group overflow-visible">
              <div className="flex items-center relative w-full">
                  <div className="content-stretch flex flex-col h-[19px] items-start pb-0 pt-[3px] px-0 relative shrink-0 w-4">
                    <div className="bg-[var(--color-grey-90,#e5e5e5)] relative rounded-[4px] shrink-0 size-4" />
                  </div>
                  <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px pl-2 pr-0 py-0 relative shrink-0">
                    <div className="content-stretch flex flex-col items-start px-0 py-[3px] relative shrink-0 w-full">
                      <p className="flex flex-col font-['SF_Pro_Display:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[color:var(--color-grey-60,#999)] text-sm w-full">
                        <span className="leading-[14px] line-through">{task.text}</span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Action buttons - visible on hover */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Restore button */}
                    {onRestore && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRestore(task.id);
                        }}
                        className="group/restore relative"
                        aria-label="Restore"
                      >
                        <svg
                          className="size-3.5 text-[var(--color-grey-60,#999)] hover:text-[#111] transition-colors"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 6l-3 3 3 3M1 9h10a4 4 0 004-4V4"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-[#111] rounded opacity-0 group-hover/restore:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                          Restore
                        </span>
                      </button>
                    )}
                    
                    {/* Permanent delete button */}
                    {onPermanentDelete && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPermanentDelete(task.id);
                        }}
                        className="group/delete relative"
                        aria-label="Delete permanently"
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
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-[#111] rounded opacity-0 group-hover/delete:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                          Delete
                        </span>
                      </button>
                    )}
                  </div>
              </div>
              {index < tasks.length - 1 && (
                <div className="h-px w-full bg-[var(--color-grey-90,#e5e5e5)] mt-2" />
              )}
            </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

