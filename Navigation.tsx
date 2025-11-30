import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navigation(): JSX.Element {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? "bg-blue-600 text-white" : "text-gray-200 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <nav className="bg-gray-900 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-md bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
                MV
              </div>
              <span className="text-lg font-semibold">MediVault</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavLink to="/" className={linkClass} end>
              Home
            </NavLink>
          
            <NavLink to="/researcher" className={linkClass}>
              Researcher
            </NavLink>
            <NavLink to="/privacy" className={linkClass}>
              Privacy Demo
            </NavLink>
          </div>

          {/* Right: Auth buttons */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            <Link to="/signin" className="px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-700 hover:text-white">
              Sign in
            </Link>
            <Link
              to="/signup"
              className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setOpen(prev => !prev)}
              aria-expanded={open}
              aria-label="Toggle navigation menu"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink to="/" className={linkClass} end onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/forpatients" className={linkClass} onClick={() => setOpen(false)}>
              For Patients
            </NavLink>
            <NavLink to="/researcher" className={linkClass} onClick={() => setOpen(false)}>
              Researcher
            </NavLink>
            <NavLink to="/privacy" className={linkClass} onClick={() => setOpen(false)}>
              Privacy Demo
            </NavLink>

            <div className="border-t border-gray-700 mt-2 pt-3 space-y-1">
              <Link
                to="/signin"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-gray-700 hover:text-white"
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => setOpen(false)}
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
