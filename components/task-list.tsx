"use client";

import { useState, useRef, useEffect } from "react";
import TaskInput from "./task-input";
import TaskItem from "./task-item";
import CompletedTasks from "./completed-tasks";
import CollapsibleSection from "./collapsible-section";

export interface TaskLink {
  text: string;
  url?: string;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  description?: string;
  linkText?: string;
  linkUrl?: string;
  textAfterLink?: string;
}

const initialTasks: Task[] = [];

const initialCompletedTasks: Task[] = [];

type OpenSection = "completed" | "archived" | "deleted" | null;

const STORAGE_KEYS = {
  tasks: "tinytasks_tasks",
  completedTasks: "tinytasks_completedTasks",
  archivedTasks: "tinytasks_archivedTasks",
  deletedTasks: "tinytasks_deletedTasks",
  openSection: "tinytasks_openSection",
};

// Load tasks from localStorage
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Save tasks to localStorage
const saveToStorage = <T,>(key: string, value: T): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export default function TaskList() {
  // Start with empty state to match SSR
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [completedTasks, setCompletedTasks] = useState<Task[]>(initialCompletedTasks);
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [deletedTasks, setDeletedTasks] = useState<Task[]>([]);
  const [openSection, setOpenSection] = useState<OpenSection>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleToggleSection = (section: OpenSection) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const handleAddTask = (text: string) => {
    if (!text.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
    };
    
    setTasks([...tasks, newTask]);
  };

  const handleToggleTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      // Move from active to completed
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
      setCompletedTasks((prevCompleted) => [
        { ...task, completed: true },
        ...prevCompleted,
      ]);
    }
  };

  const handleDeleteTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
      setDeletedTasks((prev) => [task, ...prev]);
    }
  };

  const handleArchiveTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
      setArchivedTasks((prev) => [task, ...prev]);
    }
  };

  const handleEditTask = (id: string, newText: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  };

  const handleRestoreFromArchive = (id: string) => {
    const task = archivedTasks.find((t) => t.id === id);
    if (task) {
      setArchivedTasks((prev) => prev.filter((t) => t.id !== id));
      setTasks((prevTasks) => [...prevTasks, { ...task, completed: false }]);
    }
  };

  const handleRestoreFromDeleted = (id: string) => {
    const task = deletedTasks.find((t) => t.id === id);
    if (task) {
      setDeletedTasks((prev) => prev.filter((t) => t.id !== id));
      setTasks((prevTasks) => [...prevTasks, { ...task, completed: false }]);
    }
  };

  const handlePermanentDelete = (id: string) => {
    setDeletedTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleCompletedTask = (id: string) => {
    const task = completedTasks.find((t) => t.id === id);
    if (task) {
      // Move from completed to active
      setCompletedTasks((prevCompleted) => prevCompleted.filter((t) => t.id !== id));
      setTasks((prevTasks) => [
        ...prevTasks,
        { ...task, completed: false },
      ]);
    }
  };

  // Drag and drop
  const dragItem = useRef<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragItem.current = index;
    setDraggingIndex(index);
    
    // Create invisible drag image
    const dragImage = document.createElement('div');
    dragImage.style.width = '1px';
    dragImage.style.height = '1px';
    dragImage.style.position = 'fixed';
    dragImage.style.top = '-1000px';
    dragImage.style.left = '-1000px';
    dragImage.style.opacity = '0.01';
    dragImage.style.pointerEvents = 'none';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    requestAnimationFrame(() => {
      document.body.removeChild(dragImage);
    });
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
  };

  const handleDragEnter = (index: number) => {
    if (dragItem.current === null) return;
    if (index !== dragOverIndex) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverIndex === null) {
      setDraggingIndex(null);
      setDragOverIndex(null);
      return;
    }
    if (dragItem.current === dragOverIndex) {
      dragItem.current = null;
      setDraggingIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newTasks = [...tasks];
    const draggedTask = newTasks[dragItem.current];
    newTasks.splice(dragItem.current, 1);
    newTasks.splice(dragOverIndex, 0, draggedTask);
    
    dragItem.current = null;
    setDraggingIndex(null);
    setDragOverIndex(null);
    setTasks(newTasks);
  };

  const handleDragLeave = () => {
    // Only reset if leaving the entire list
  };

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    const loadedTasks = loadFromStorage(STORAGE_KEYS.tasks, initialTasks);
    const loadedCompletedTasks = loadFromStorage(STORAGE_KEYS.completedTasks, initialCompletedTasks);
    const loadedArchivedTasks = loadFromStorage(STORAGE_KEYS.archivedTasks, []);
    const loadedDeletedTasks = loadFromStorage(STORAGE_KEYS.deletedTasks, []);
    const loadedOpenSection = loadFromStorage(STORAGE_KEYS.openSection, null);

    setTasks(loadedTasks);
    setCompletedTasks(loadedCompletedTasks);
    setArchivedTasks(loadedArchivedTasks);
    setDeletedTasks(loadedDeletedTasks);
    setOpenSection(loadedOpenSection);
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever tasks change (only after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.tasks, tasks);
    }
  }, [tasks, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.completedTasks, completedTasks);
    }
  }, [completedTasks, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.archivedTasks, archivedTasks);
    }
  }, [archivedTasks, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.deletedTasks, deletedTasks);
    }
  }, [deletedTasks, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.openSection, openSection);
    }
  }, [openSection, isLoaded]);

  return (
    <>
      <div className="content-stretch flex flex-col gap-1 items-start relative shrink-0 w-full">
        <div className="content-stretch flex flex-col gap-[3px] items-start relative shrink-0 w-full">
          <img 
            src="/tiny-logo.png" 
            alt="Tiny Tasks Logo" 
            className="w-[19px] h-[23px]"
          />
          <h1 className="flex flex-col font-['SF_Pro_Display:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[color:var(--color-grey-7,#111)] text-base w-full">
            <span className="leading-6">tinytasks.io</span>
          </h1>
        </div>
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
          <p className="flex flex-col font-['SF_Pro_Display:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[color:var(--color-grey-33,#555)] text-sm w-full">
            <span className="leading-5">Task management made simple.</span>
          </p>
        </div>
      </div>

      <div className="content-stretch flex flex-col gap-4 items-stretch relative shrink-0 w-full">
        <TaskInput onAddTask={handleAddTask} />

        {/* Tasks section */}
        <div className="content-stretch flex flex-col gap-1 items-stretch pt-2 relative shrink-0 w-full">
          {/* Tasks header */}
          <div className="h-5 relative shrink-0 w-full">
            <p className="font-['SF_Pro_Display:Regular',sans-serif] text-sm text-[color:var(--color-grey-60,#999)]">
              Tasks ({tasks.length})
            </p>
          </div>

          <div className="content-stretch flex flex-col items-stretch relative shrink-0 w-full pt-1">
          {tasks.map((task, index) => {
            const isDragging = draggingIndex === index;
            const isDragOver = dragOverIndex === index && draggingIndex !== null && draggingIndex !== index;
            const isAboveDragging = draggingIndex !== null && dragOverIndex !== null && 
              index > draggingIndex && index <= dragOverIndex;
            const isBelowDragging = draggingIndex !== null && dragOverIndex !== null && 
              index < draggingIndex && index >= dragOverIndex;
            
            return (
              <div
                key={task.id}
                className={`w-full transition-all duration-200 ease-out py-1 ${
                  isDragging 
                    ? "opacity-40 scale-[1.02] bg-gray-50 rounded-lg shadow-sm z-10" 
                    : "opacity-100"
                } ${
                  isAboveDragging ? "-translate-y-1" : ""
                } ${
                  isBelowDragging ? "translate-y-1" : ""
                } ${
                  isDragOver ? "border-t-2 border-[var(--color-grey-60,#999)]" : "border-t-2 border-transparent"
                }`}
                onDragEnter={() => handleDragEnter(index)}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={handleDragLeave}
              >
                <TaskItem 
                  task={task} 
                  onToggle={handleToggleTask} 
                  onDelete={handleDeleteTask} 
                  onArchive={handleArchiveTask} 
                  onEdit={handleEditTask}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                />
                {index < tasks.length - 1 && (
                  <div className="h-px w-full bg-[var(--color-grey-90,#e5e5e5)] mt-2" />
                )}
              </div>
            );
          })}
          </div>
        </div>

        <CompletedTasks 
          tasks={completedTasks} 
          onToggle={handleToggleCompletedTask}
          isExpanded={openSection === "completed"}
          onToggleSection={() => handleToggleSection("completed")}
        />

        <CollapsibleSection 
          title="Archived" 
          tasks={archivedTasks}
          isExpanded={openSection === "archived"}
          onToggleSection={() => handleToggleSection("archived")}
          onRestore={handleRestoreFromArchive}
        />

        <CollapsibleSection 
          title="Deleted" 
          tasks={deletedTasks}
          isExpanded={openSection === "deleted"}
          onToggleSection={() => handleToggleSection("deleted")}
          onRestore={handleRestoreFromDeleted}
          onPermanentDelete={handlePermanentDelete}
        />
      </div>
    </>
  );
}

