"use client";

import { Task } from "./task-list";

interface CompletedTasksProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  isExpanded: boolean;
  onToggleSection: () => void;
}

export default function CompletedTasks({ tasks, onToggle, isExpanded, onToggleSection }: CompletedTasksProps) {
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
              <span className="leading-5">Completed ({tasks.length})</span>
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
            <div key={task.id}>
              <div className="flex items-center relative w-full">
                  <div className="content-stretch flex flex-col h-[19px] items-start pb-0 pt-[3px] px-0 relative shrink-0 w-4">
                    <button
                      type="button"
                      onClick={() => onToggle(task.id)}
                      className="bg-[var(--color-grey-60,#999)] relative rounded-[4px] shrink-0 size-4 cursor-pointer flex items-center justify-center"
                    >
                      <div className="absolute content-stretch flex items-center justify-center inset-0">
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
                      </div>
                    </button>
                  </div>
                  <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px pl-2 pr-0 py-0 relative shrink-0">
                    <div className="content-stretch flex flex-col gap-[7px] items-start pb-0 pt-[3px] px-0 relative shrink-0 w-full">
                      {task.linkText ? (
                        <div className="content-stretch flex items-center relative shrink-0 w-full">
                          <div className="content-stretch flex h-[14px] items-center relative shrink-0">
                            <span className="flex flex-col font-['SF_Pro_Display:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[color:var(--color-grey-60,#999)] text-sm text-nowrap">
                              <span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid leading-[14px] line-through">
                                {task.text}
                              </span>
                            </span>
                            <div className="content-stretch flex items-start px-0 py-[1.5px] relative shrink-0">
                              <a
                                href={task.linkUrl || "#"}
                                className="flex flex-col font-['SF_Pro_Display:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[color:var(--color-grey-60,#999)] text-sm text-nowrap"
                              >
                                <span className="[text-underline-position:from-font] decoration-solid leading-[14px] underline line-through">
                                  {task.linkText}
                                </span>
                              </a>
                            </div>
                            {task.textAfterLink && (
                              <span className="flex flex-col font-['SF_Pro_Display:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[color:var(--color-grey-60,#999)] text-sm text-nowrap">
                                <span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid leading-[14px] line-through">
                                  {task.textAfterLink}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="flex flex-col font-['SF_Pro_Display:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[color:var(--color-grey-60,#999)] text-sm text-nowrap">
                          <span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid leading-[14px] line-through">
                            {task.text}
                          </span>
                        </p>
                      )}
                      {task.description && (
                        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                          <p className="flex flex-col font-['SF_Pro_Display:Regular',sans-serif] justify-center leading-5 not-italic relative shrink-0 text-[color:var(--color-grey-60,#999)] text-sm w-full">
                            {task.description.split("\n").map((line, i) => (
                              <span key={i} className="mb-0">
                                {line}
                              </span>
                            ))}
                          </p>
                        </div>
                      )}
                    </div>
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

