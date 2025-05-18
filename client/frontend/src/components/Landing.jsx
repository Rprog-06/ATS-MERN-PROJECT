import React from "react";
import { Link } from "react-router-dom";
import '../App.css';

//import { Button } from "@/components/ui/button";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-200 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10 animate-fade-in-up">
        <h1 className="text-5xl md:text-6xl font-bold text-blue-900 drop-shadow-lg mb-6">
          Welcome to JobHunt Pro
        </h1>
        <p className="text-lg md:text-xl text-blue-700 max-w-xl mx-auto">
          Your all-in-one Applicant Tracking System. Streamline your hiring, manage job applications, and connect with candidates like never before.
        </p>
      </div>

      <div className="flex gap-6 animate-fade-in-up delay-150">
        <Link to="/LoginPage">
          <button className="px-6 py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg transition-all duration-300">
  Login
</button>

        </Link>
        <Link to="/register">
          <button className="px-6 py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg transition-all duration-300">
  Register
</button>

        </Link>
      </div>

      <footer className="absolute bottom-4 text-sm text-blue-600 animate-fade-in-up delay-300">
        © 2025 JobHunt Pro. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;

        