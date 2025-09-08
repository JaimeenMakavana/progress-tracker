"use client";

import React from "react";
import { useAutoSync } from "../hooks/useAutoSync";

export default function AutoSyncMount() {
  useAutoSync();
  return null;
}
