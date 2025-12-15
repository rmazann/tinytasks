"use client";

import { useState, FormEvent } from "react";

interface TaskInputProps {
  onAddTask: (text: string) => void;
}

export default function TaskInput({ onAddTask }: TaskInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddTask(inputValue);
      setInputValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-[var(--color-grey-95,#f2f2f2)] h-9 overflow-clip relative rounded-[6px] shrink-0 w-full">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task..."
          className="absolute bottom-[9.5px] left-3 top-[9.5px] right-3 bg-transparent border-0 outline-0 font-['SF_Pro_Display:Regular',sans-serif] text-[color:var(--color-grey-33,#555)] text-sm placeholder:text-[color:var(--color-grey-33,#555)]"
        />
      </div>
    </form>
  );
}

