// src/pages/LoginPage.jsx

import React from "react";
import LoginForm from "../components/Auth/LoginForm";
import LoginImage from "../assets/About10X-Top.png"; // Ensure this image exists in src/assets/
import LoginBG from "../assets/HeroBG.png"; // Ensure this image exists in src/assets/

const LoginPage = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Column - Image (Visible on medium screens and above) */}
      <div className="w-1/2 hidden md:block">
        <img
          src={LoginImage}
          alt="Login Illustration"
          className="w-full object-cover h-full"
        />
      </div>

      {/* Right Column - Login Form */}
      <div
        className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 dark:bg-gray-800 bg-cover bg-center"
        style={{ backgroundImage: `url(${LoginBG})` }} // Replace with your image path
      >
        <div className="bg-white dark:bg-gray-900 bg-opacity-80 rounded-lg shadow-lg  w-[450px]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
