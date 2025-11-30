import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-3xl p-8 md:p-12 shadow-card">
      <div className="md:flex md:items-center md:justify-between">
        <div className="max-w-xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Your Health Data is Worth $1,000/Year. Start Earning.
          </h1>
          <p className="mb-6 text-text-muted">
            Join 50,000+ patients monetizing their medical data while staying 100% anonymous
          </p>

          <div className="flex gap-4">
            <Link to="/patient" className="bg-accent text-white px-6 py-3 rounded-lg font-semibold">
              Start Earning Today
            </Link>
            <Link to="/privacy-demo" className="px-6 py-3 rounded-lg border border-white/30">
              See Privacy Demo
            </Link>
          </div>

          <div className="flex gap-6 mt-8 text-sm">
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span>Bank-Level Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🛡️</span>
              <span>Zero-Knowledge Privacy</span>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-0">
          <img
            src="https://via.placeholder.com/360x220.png?text=MediVault+Preview"
            alt="preview"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
