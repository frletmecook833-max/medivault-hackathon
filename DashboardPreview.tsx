import React from 'react';
import { Link } from 'react-router-dom';

export default function DashboardPreview() {
  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-card">
      <h2 className="text-xl font-bold text-black">Patient Dashboard Preview</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
          <div className="text-sm text-black">Earnings Today</div>
          <div className="text-3xl font-bold text-black">$24.50</div>
          <div className="text-sm text-green-600">+12% from yesterday</div>
        </div>

        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
          <div className="text-sm text-text-muted">Total Earned</div>
          <div className="text-3xl font-bold">$487.32</div>
          <div className="text-sm text-primary">From 23 queries</div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Link to="/patient" className="px-5 py-2 bg-primary text-white rounded-lg">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
