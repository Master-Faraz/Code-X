"use client";
import React, { useState } from "react";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
const loadingStates = [
  {
    text: "Validating all required fields",
  },
  {
    text: "Checking missing fields",
  },
  {
    text: "Validating all other fields",
  },
  {
    text: "Validating images",
  },
  {
    text: "Uploading images",
  },
  {
    text: "Creating your listing",
  },
  {
    text: "All Done 🎉",
  },
];

export default function MultiStepLoaderDemo() {
  const [loading, setLoading] = useState(false);
  let steps = Number(3)
  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      {/* Core Loader Modal */}
      <Loader loadingStates={loadingStates} loading={loading} loop={false} value={steps!} />

      {/* The buttons are for demo only, remove it in your actual code ⬇️ */}
      <button
        onClick={() => setLoading(true)}
        className="bg-[#39C3EF] hover:bg-[#39C3EF]/90 text-black mx-auto text-sm md:text-base transition font-medium duration-200 h-10 rounded-lg px-8 flex items-center justify-center"
        style={{
          boxShadow:
            "0px -1px 0px 0px #ffffff40 inset, 0px 1px 0px 0px #ffffff40 inset",
        }}
      >
        Click to load
      </button>

    </div>
  );
}
