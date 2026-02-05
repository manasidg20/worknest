"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";

export default function Header({ name }) {

  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);

  const today = new Date().toDateString();

  function handleLogout() {
    localStorage.clear();
    router.push("/");
  }

  return (
    <div className="flex justify-between items-center bg-white p-5 border-b relative">

      <div>
        <h1 className="text-xl font-semibold">
          Welcome back, {name}
        </h1>

        <p className="text-gray-500">{today}</p>
      </div>

      <div
        className="flex items-center gap-3 cursor-pointer relative"
        onClick={() => setOpenMenu(!openMenu)}
      >
        <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
          👨
        </div>

        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-gray-500">Employee</p>
        </div>

        {openMenu && (
          <div className="absolute right-0 top-14 bg-white shadow-lg rounded-lg w-40 p-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded-lg"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
