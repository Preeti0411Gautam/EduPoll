import React, { useState } from "react";
import stars from "./../assets/spark.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

let apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:5000";

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const selectRole = (role) => {
    setSelectedRole(role);
  };

  const continueToPoll = async () => {
    if (selectedRole === "teacher") {
      let teacherlogin = await axios.post(`${apiUrl}/teacher-login`);
      sessionStorage.setItem("username", teacherlogin.data.username);
      navigate("/teacher-home-page");
    } else if (selectedRole === "student") {
      navigate("/student-home-page");
    } else {
      alert("Please select a role.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="text-center max-w-xl w-full px-6">
        {/* Intervue Poll Button */}
        <button className="mb-5 inline-flex items-center bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] text-white rounded-full px-4 py-1 text-sm font-medium shadow-md">
          <img src={stars} alt="" className="w-4 h-4 mr-1" />
          Intervue Poll
        </button>

        {/* Title */}
        <h3 className="text-2xl font-bold mb-2">
          Welcome to the <b>Live Polling System</b>
        </h3>

        {/* Description */}
        <p className="mb-8 text-black/50">
          Please select the role that best describes you to begin using the live
          polling system
        </p>

        {/* Role Buttons */}
        <div className="flex justify-around mb-6 gap-4 flex-wrap">
          {/* Student */}
          <div
            onClick={() => selectRole("student")}
            className={`cursor-pointer p-5 rounded-lg bg-white border-2 w-[45%] ${
              selectedRole === "student"
                ? "border-[#6f42c1]"
                : "border-gray-300"
            }`}
          >
            <p className="m-0 text-lg font-medium">I'm a Student</p>
            <span className="block text-sm text-gray-500">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry
            </span>
          </div>

          {/* Teacher */}
          <div
            onClick={() => selectRole("teacher")}
            className={`cursor-pointer p-5 rounded-lg bg-white border-2 w-[45%] ${
              selectedRole === "teacher"
                ? "border-[#6f42c1]"
                : "border-gray-300"
            }`}
          >
            <p className="m-0 text-lg font-medium">I'm a Teacher</p>
            <span className="block text-sm text-gray-500">
              Submit answers and view live poll results in real-time.
            </span>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={continueToPoll}
          className="bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] text-white rounded-full px-8 py-2 text-base font-medium shadow-md"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
