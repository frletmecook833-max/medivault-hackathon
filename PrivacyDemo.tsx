import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Step = { text: string; duration: number };
type Result = { count: number; proof: string } | null;

export default function PrivacyDemo(): JSX.Element {
  const steps: Step[] = [
    { text: "Validating query structure...", duration: 800 },
    { text: "Generating zero-knowledge proof...", duration: 1500 },
    { text: "Verifying privacy guarantees...", duration: 1200 },
    { text: "Executing on encrypted data...", duration: 1000 },
    { text: "✅ Query complete!", duration: 400 },
  ];

  const [step, setStep] = useState<number>(0);
  const [result, setResult] = useState<Result>(null);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | null = null;

    if (step < steps.length) {
      t = setTimeout(() => setStep((s) => s + 1), steps[step].duration);
    } else {
      // all steps done -> set result once
      setResult({ count: 347, proof: "0x7a3f...8c2d" });
    }

    return () => {
      if (t) clearTimeout(t);
    };
  }, [step]);

  // progress percentage (0..100)
  const progressPercent = Math.round(Math.min(step / steps.length, 1) * 100);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="p-6 bg-white rounded-lg shadow border border-gray-200 text-gray-900">
        <h2 className="text-xl font-semibold mb-4">Your Private Data</h2>

        <div className="space-y-3">
          {steps.map((s, i) => {
            // Determine status: completed / running / pending
            const isCompleted = i < step;
            const isRunning = i === step && step < steps.length;
            const statusText = isCompleted ? "completed" : isRunning ? "running" : "pending";

            return (
              <div
                key={i}
                className={`flex items-center justify-between p-3 rounded-md ${
                  isCompleted ? "bg-gray-50 border border-gray-200" : "bg-white"
                }`}
              >
                <div>
                  <div className="text-sm text-gray-800">{s.text}</div>
                </div>

                <div className="text-sm font-mono text-gray-600 capitalize">{statusText}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <div className="h-2 bg-gray-200 rounded overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ ease: "linear", duration: 0.4 }}
              className="h-2 bg-blue-600"
            />
          </div>

          <div className="mt-4 text-sm text-gray-700">
            {result ? (
              <>
                <div className="font-semibold">Result: {result.count} patients</div>
                <div className="mt-1 text-xs text-gray-500">Proof: {result.proof}</div>
              </>
            ) : (
              <div>Running privacy-preserving query...</div>
            )}
          </div>
        </div>
      </div>

      {/* Right: encrypted sample */}
      <div className="p-6 bg-white rounded-lg shadow border border-gray-200 text-gray-900 font-mono">
        <h3 className="text-lg font-semibold mb-3">Encrypted Records (preview)</h3>

        <pre className="text-sm text-gray-700 max-h-[60vh] overflow-auto bg-gray-50 p-3 rounded">
{`patient_001: { age: "X7$#K2@4", condition: "P9!%Q3M8" }
patient_002: { age: "K0@#D7z9", condition: "M8!Q2%F4" }
patient_003: { age: "J1&vL3r2", condition: "N2#pS8k1" }`}
        </pre>

        <div className="mt-4 text-sm text-gray-600">
          This preview shows encrypted payloads — data is unreadable without the decryption key.
        </div>
      </div>
    </div>
  );
}
