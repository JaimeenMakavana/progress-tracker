"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Brain } from "lucide-react";
import { TapasAIPanel } from "./TapasAIPanel";

type Props = {
  className?: string;
  size?: "sm" | "default" | "lg";
};

export function TapasAIButton({ className, size = "sm" }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button className={className} size={size} onClick={() => setOpen(true)}>
        <Brain className="mr-2 h-4 w-4" /> Tapas AI
      </Button>
      <TapasAIPanel open={open} onOpenChange={setOpen} />
    </>
  );
}
