import TaskList from "@/components/task-list";
import DateTimeLocation from "@/components/date-time-location";

export default function Home() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center p-4 relative min-h-screen w-full">
      <DateTimeLocation />
      <div className="content-stretch flex flex-col gap-4 items-start max-w-[448px] relative shrink-0 w-full">
        <TaskList />
      </div>
    </div>
  );
}

