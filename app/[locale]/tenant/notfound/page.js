"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Building2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-lg"
      >
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4"
          >
            <Building2 className="w-8 h-8 text-red-500" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tenant Not Found</h1>
          <p className="text-gray-600 mb-6">
            The tenant you're trying to access doesn't exist. Please check the URL or contact your administrator.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
} 