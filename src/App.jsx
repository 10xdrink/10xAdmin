// src/App.jsx

import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
      <AppRoutes />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default App;
