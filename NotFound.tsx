import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center p-12">
      <img src="https://via.placeholder.com/600x300.png?text=404" alt="404" className="mx-auto mb-6 rounded-lg shadow-lg" />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-text-muted mb-4">This page is still in peer review.</p>
      <Link to="/" className="px-4 py-2 bg-primary text-white rounded-lg">Go Home</Link>
    </div>
  );
}
