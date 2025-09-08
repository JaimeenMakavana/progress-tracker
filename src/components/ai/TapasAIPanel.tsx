"use client";
import React, { useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Brain, Sparkles, AlertTriangle, CheckCircle } from "lucide-react";
import { useTrackers } from "../../context/TrackersContext";

type TapasAIPanelProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

type Intervention = {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  actionLabel?: string;
  onAction?: () => void;
};

export function TapasAIPanel({ open, onOpenChange }: TapasAIPanelProps) {
  const { state } = useTrackers();

  // Simple heuristic insights across all trackers
  const interventions = useMemo<Intervention[]>(() => {
    const items: Intervention[] = [];
    const trackers = Object.values(state.trackers);

    if (trackers.length === 0) {
      items.push({
        id: "no-trackers",
        title: "Create your first tracker",
        description:
          "You don't have any trackers yet. Start by creating one goal and Tapas AI will help you keep momentum.",
        severity: "low",
      });
      return items;
    }

    trackers.forEach((t) => {
      const tasks = Object.values(t.tasks);
      const total = tasks.length;
      const completed = tasks.filter((x) => x.status === "done").length;
      const inProgress = tasks.filter((x) => x.status === "inprogress").length;

      // 1) No progress yet but have tasks → suggest a 15-min starter
      if (total > 0 && completed === 0 && inProgress === 0) {
        items.push({
          id: `starter-${t.id}`,
          title: `Start small on ${t.title}`,
          description:
            "No tasks started yet. Pick the easiest task and commit to a 15‑minute sprint.",
          severity: "medium",
        });
      }

      // 2) Backlog too large → suggest prioritization
      if (total >= 12) {
        items.push({
          id: `prioritize-${t.id}`,
          title: `Backlog for ${t.title} is getting large`,
          description:
            "You have 12+ tasks. Archive low‑impact items or mark top 3 for this week.",
          severity: "low",
        });
      }

      // 3) All TODO for 3+ days (approx by createdAt) → momentum nudge
      const stale = tasks.every((task) => {
        const created = task.createdAt
          ? new Date(task.createdAt).getTime()
          : Date.now();
        const days = (Date.now() - created) / (1000 * 60 * 60 * 24);
        return task.status !== "done" && days >= 3;
      });
      if (total > 0 && stale) {
        items.push({
          id: `stale-${t.id}`,
          title: `Momentum nudge for ${t.title}`,
          description:
            "No completions in ~3 days. Schedule one 30‑minute focused session today.",
          severity: "high",
        });
      }
    });

    if (items.length === 0) {
      items.push({
        id: "all-good",
        title: "You're on track",
        description:
          "Nice pace! Keep shipping. Tapas AI will notify you if momentum dips.",
        severity: "low",
      });
    }

    return items;
  }, [state.trackers]);

  const severityBadge = (s: Intervention["severity"]) => {
    const variant =
      s === "high" ? "destructive" : s === "medium" ? "default" : "secondary";
    const Icon =
      s === "high" ? AlertTriangle : s === "medium" ? Sparkles : CheckCircle;
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3.5 w-3.5" /> {s}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-[#2C3930]" /> Tapas AI • Proactive
            Monitoring
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {interventions.map((n) => (
            <div
              key={n.id}
              className="rounded-lg border p-4 flex items-start gap-3 bg-white"
            >
              <div className="pt-0.5">{severityBadge(n.severity)}</div>
              <div className="flex-1">
                <div className="font-medium mb-1">{n.title}</div>
                <div className="text-sm text-gray-600">{n.description}</div>
              </div>
              {n.onAction && (
                <Button size="sm" onClick={n.onAction} className="shrink-0">
                  {n.actionLabel || "Do it"}
                </Button>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
