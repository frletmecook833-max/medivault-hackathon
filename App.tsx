// src/App.tsx
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";

const Landing = lazy(() => import("./pages/Landing"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));

const PatientDashboard = lazy(() => import("./pages/PatientDashboard"));
const ResearcherPage = lazy(() => import("./pages/ResearcherPage"));
const ForPatients = lazy(() => import("./pages/ForPatients")); // only if exists
const PrivacyDemo = lazy(() => import("./components/PrivacyDemo"));

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="p-8">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forpatients" element={<ForPatients />} />
            <Route path="/patient" element={<PatientDashboard />} />
            <Route path="/researcher" element={<ResearcherPage />} />
            <Route path="/privacy" element={<PrivacyDemo />} />
            <Route path="*" element={<div className="p-8">Page not found</div>} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
