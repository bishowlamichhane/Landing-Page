"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import AdminLoginModal from "./AdminLoginModal";

export default function AdminButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-zinc-700 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <ShieldAlert className="mr-1 h-4 w-4" />
        Admin
      </Button>

      <AdminLoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
