import { Briefcase } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="bg-purple-600 p-3 rounded-xl text-white">
        <Briefcase size={30} />
      </div>
      <h1 className="text-xl font-semibold text-gray-700">
        WorkNest Attendance Hub
      </h1>
    </div>
  );
}
