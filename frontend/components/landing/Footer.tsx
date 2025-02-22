"use client";
import { useState, useEffect } from 'react';
import Link from "next/link";

export default function Footer() {
  const [year, setYear] = useState('');
  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="relative overflow-hidden py-8 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left Section: Logo and Description */}
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">ResQSync</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Smart Crisis Management Solutions
            </p>
          </div>

          {/* Right Section: Navigation Links */}
          <nav className="flex flex-wrap justify-center md:justify-start space-x-4 sm:space-x-6">
            <Link href="#" className="hover:text-primary text-xs sm:text-sm">
              About
            </Link>
            <Link href="#" className="hover:text-primary text-xs sm:text-sm">
              Features
            </Link>
            <Link href="#" className="hover:text-primary text-xs sm:text-sm">
              Contact
            </Link>
            <Link href="#" className="hover:text-primary text-xs sm:text-sm">
              Privacy Policy
            </Link>
          </nav>
        </div>

        {/* Copyright Text */}
        <div className="mt-8 text-center text-xs sm:text-sm text-muted-foreground">
          © {year} ResQSync. All rights reserved.
        </div>
      </div>
    </footer>
  );
}