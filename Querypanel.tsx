import React, { useMemo, useState } from "react";

/** small helper types */
type PatientRow = {
  id: string;
  age: number;
  condition: string;
  treatment: string;
  lastSeen: string;
  earnings: number;
};

/** utility: simple random id */
const randId = (n = 6) =>
  Math.random().toString(36).slice(2, 2 + n).toUpperCase();

/** generate N dummy rows consistent with filters */
function generateDummyPatients(
  condition: string,
  treatment: string | null,
  ageMin: number,
  ageMax: number,
  count = 10
): PatientRow[] {
  const rows: PatientRow[] = [];
  for (let i = 0; i < count; i++) {
    const age = Math.floor(Math.random() * (ageMax - ageMin + 1)) + ageMin;
    const treatments = ["Metformin", "Lisinopril", "Aspirin", "None", "Insulin"];
    const chosenTreatment =
      treatment === "None" || !treatment
        ? (Math.random() > 0.6 ? "None" : treatments[Math.floor(Math.random() * treatments.length)])
        : treatment;
    rows.push({
      id: "pat-" + randId(8),
      age,
      condition: condition || (["Diabetes", "Hypertension", "Asthma", "Cancer"][Math.floor(Math.random() * 4)]),
      treatment: chosenTreatment,
      lastSeen: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)).toISOString(),
      earnings: parseFloat((Math.random() * 25 + 1).toFixed(2)),
    });
  }
  return rows;
}

/** convert array of objects to CSV text (comma) */
function arrayToCSV(rows: Record<string, any>[]): string {
  if (!rows || rows.length === 0) return "";
  const keys = Object.keys(rows[0]);
  const escape = (v: any) =>
    `"${String(v ?? "").replace(/"/g, '""')}"`; // quoted fields
  const header = keys.map((k) => escape(k)).join(",");
  const lines = rows.map((r) => keys.map((k) => escape(r[k])).join(","));
  return [header, ...lines].join("\r\n");
}

/** download helper */
function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 200);
}

/** main component */
export default function QueryPanel(): JSX.Element {
  const conditionOptions = useMemo(() => ["All", "Diabetes", "Hypertension", "Cancer", "Asthma", "Arthritis"], []);
  const treatmentOptions = useMemo(() => ["None", "Metformin", "Lisinopril", "Insulin", "Aspirin"], []);

  const [condition, setCondition] = useState<string>("Asthma");
  const [treatment, setTreatment] = useState<string>("Lisinopril");
  const [ageMin, setAgeMin] = useState<number>(30);
  const [ageMax, setAgeMax] = useState<number>(40);

  const [running, setRunning] = useState(false);
  const [resultRows, setResultRows] = useState<PatientRow[] | null>(null);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);

  const runQuery = async () => {
    setRunning(true);
    setResultRows(null);
    setEstimatedCost(null);

    // simulate query latency
    await new Promise((r) => setTimeout(r, 650 + Math.random() * 900));

    // size heuristic -> random count based on filters
    const base = 50;
    const condFactor = condition === "All" ? 1 : 0.25;
    const treatFactor = treatment === "None" ? 1 : 0.9;
    const ageRangeFactor = Math.max(1, (ageMax - ageMin) / 10);
    const count = Math.max(3, Math.round(base * condFactor * treatFactor * (1 / ageRangeFactor)));

    const rows = generateDummyPatients(condition, treatment === "None" ? null : treatment, ageMin, ageMax, count);
    setResultRows(rows);

    // fake cost calculation (for Run Query button label)
    const cost = +(rows.length * (0.12 + Math.random() * 0.08)).toFixed(2);
    setEstimatedCost(cost);

    setRunning(false);
  };

  const handleDownloadCSV = () => {
    if (!resultRows || resultRows.length === 0) {
      // produce a small sample if user clicks without running
      const sample = generateDummyPatients(condition, treatment === "None" ? null : treatment, ageMin, ageMax, 5);
      const csv = arrayToCSV(sample as any[]);
      downloadTextFile(`medivault_sample_${condition || "all"}_${Date.now()}.csv`, csv);
      return;
    }
    const csv = arrayToCSV(resultRows as any[]);
    downloadTextFile(`medivault_${condition}_${resultRows.length}_${Date.now()}.csv`, csv);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow border border-gray-200 text-gray-900">
      <div className="grid md:grid-cols-3 gap-6 items-end">
        {/* Condition */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Select Condition</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            {conditionOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Age range */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Age Range</label>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={ageMin}
              onChange={(e) => setAgeMin(Math.max(0, Number(e.target.value)))}
              className="w-20 border rounded px-2 py-1"
            />
            <span>-</span>
            <input
              type="number"
              value={ageMax}
              onChange={(e) => setAgeMax(Math.max(ageMin, Number(e.target.value)))}
              className="w-20 border rounded px-2 py-1"
            />
          </div>
        </div>

        {/* Treatment */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Treatment Filter (optional)</label>
          <select
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            {treatmentOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* buttons row */}
      <div className="mt-6 flex items-center space-x-6">
        <button
          onClick={runQuery}
          disabled={running}
          className={`px-6 py-3 rounded-lg text-white font-semibold shadow ${
            running ? "bg-blue-400 cursor-wait" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {running ? "Running..." : `Run Query${estimatedCost ? ` ($${estimatedCost})` : ""}`}
        </button>

        <button
          onClick={handleDownloadCSV}
          className={`px-4 py-2 rounded-lg font-medium ${resultRows ? "text-blue-700" : "text-gray-400"}`}
        >
          Download CSV
        </button>

        <div className="text-sm text-gray-600">
          {resultRows ? `${resultRows.length} rows ready` : "No results yet. Run query to generate results."}
        </div>
      </div>
    </div>
  );
}
