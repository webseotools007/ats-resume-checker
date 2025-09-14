import React from "react";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="relative z-50">
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="font-bold text-xl text-gray-900">
                <span className="font-bold">ATS</span>
                <span className="font-normal">Checker</span>
              </span>
            </Link>
          </div>

          {/* Right side - Navigation Menu */}
          <div className="flex items-center space-x-6">
            <Link
              href="/about"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
