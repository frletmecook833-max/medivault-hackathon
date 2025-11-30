import React, { useEffect, useState } from "react";
import { getPatientDashboard } from "../services/api";

export default function PatientDashboard(): JSX.Element {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // uses API stub - will attempt local API_BASE or fallback
        const result = await getPatientDashboard("demo-wallet");
        setData(result);
      } catch {
        setData({
          earningsToday: 24.5,
          totalEarned: 487.32,
          activity: [
            { id: 1, t: "Diabetes research query", amount: 12.3, time: "2 hours ago" },
            { id: 2, t: "Cancer treatment study", amount: 8.2, time: "5 hours ago" },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="text-black">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Welcome back, Patient</h1>

      {loading && <div className="p-6 bg-white rounded-lg shadow border border-gray-200 text-gray-900">Loading...</div>}

      {!loading && data && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow border border-gray-200 text-black">
            <div className="text-sm text-black">Earnings Today</div>
            <div className="font-bold text-black">${data.earningsToday}</div>
            <div className="text-sm text-green-600">+12% from yesterday</div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow border border-gray-200 ">
            <div className="text-sm text-gray-600">Total Earned</div>
            <div className="font-bold text-black">${data.totalEarned}</div>
            <div className="text-sm text-blue-600">From 23 queries</div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow border border-gray-200 text-gray-900">
            <div className="text-sm text-black">Privacy Status</div>
            <div className="text-2xl font-bold text-gray-900">🔒 100% Protected</div>
            <div className="mt-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Privacy Settings</button>
            </div>
          </div>

          <div className="md:col-span-3 p-6 bg-white rounded-lg shadow border border-gray-200 text-gray-900">
            <h3 className="font-bold mb-2 text-gray-900">Recent Activity</h3>
            <ul className="space-y-2">
              {data.activity.map((a: any) => (
                <li key={a.id} className="flex justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{a.t}</div>
                    <div className="text-sm text-gray-600">{a.time}</div>
                  </div>
                  <div className="text-green-600">+${a.amount.toFixed(2)}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
