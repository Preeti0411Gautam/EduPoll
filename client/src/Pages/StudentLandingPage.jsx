import React, { useState } from "react";
import stars from "./../assets/spark.svg";
import { useNavigate } from "react-router-dom";

const StudentLandingPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleStudentLogin = async (e) => {
    e.preventDefault();

    if (name.trim()) {
      try {
        sessionStorage.setItem("username", name);
        navigate("/poll-question");
      } catch (error) {
        console.error("Error logging in student:", error);
        alert("Error connecting to the server. Please try again.");
      }
    } else {
      alert("Please enter your name");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-1/2 mx-auto">
      <div className="text-center">
        {/* Logo Button */}
        <button className="flex items-center justify-center gap-1 px-3 py-1 text-white rounded-full mb-5 text-sm font-medium"
          style={{
            background: "linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)"
          }}
        >
          <img src={stars} alt="" className="px-1" />
          Intervue Poll
        </button>

        {/* Title */}
        <h3 className="text-2xl font-bold">
          Let's <b>Get Started</b>
        </h3>

        {/* Description */}
        <p className="mb-8 text-gray-600">
          If you're a student, you'll be able to{" "}
          <b className="text-black">submit your answers</b>, participate in live polls,
          and see how your responses compare with your classmates
        </p>

        {/* Form */}
        <form onSubmit={handleStudentLogin}>
          <div className="w-1/2 mx-auto my-4">
            <p className="text-left font-medium">Enter your Name</p>
            <input
              type="text"
              className="w-full bg-gray-100 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
              onChange={(e) => setName(e.target.value)}
            />
            <button
              type="submit"
              className="w-full mt-4 py-2 text-white rounded-full font-medium"
              style={{
                background:
                  "linear-gradient(99.18deg, #8F64E1 -46.89%, #1D68BD 223.45%)"
              }}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentLandingPage;
