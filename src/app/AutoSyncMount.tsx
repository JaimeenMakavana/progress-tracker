"use client";
import { useAutoSync } from "../hooks/useAutoSync";

export default function AutoSyncMount() {
  useAutoSync();
  return null;
}
