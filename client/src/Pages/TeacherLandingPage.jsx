import React, { useState } from "react";
import stars from "./../assets/spark.svg";
import eyeIcon from "./../assets/eye.svg";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

let apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:5000";

const socket = io(apiUrl);

const TeacherLandingPage = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{ id: 1, text: "", correct: null }]);
  const [timer, setTimer] = useState("60");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const username = sessionStorage.getItem("username");

  const handleQuestionChange = (e) => setQuestion(e.target.value);
  const handleTimerChange = (e) => setTimer(e.target.value);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index].text = value;
    setOptions(updated);
  };

  const handleCorrectToggle = (index, isCorrect) => {
    const updated = [...options];
    updated[index].correct = isCorrect;
    setOptions(updated);
  };

  const addOption = () => {
    setOptions([...options, { id: options.length + 1, text: "", correct: null }]);
  };

  const validateForm = () => {
    if (!question.trim()) return setError("Question cannot be empty"), false;
    if (options.length < 2) return setError("At least two options are required"), false;
    if (options.some((o) => !o.text.trim())) return setError("All options must have text"), false;
    if (!options.some((o) => o.correct === true)) return setError("At least one correct option must be selected"), false;
    setError("");
    return true;
  };

  const askQuestion = () => {
    if (validateForm()) {
      socket.emit("createPoll", { question, options, timer, teacherUsername: username });
      navigate("/teacher-poll");
    }
  };

  return (
    <div className="p-6">
      {/* View Poll History */}
      <button
        className="px-4 py-2 mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center gap-2"
        onClick={() => navigate("/teacher-poll-history")}
      >
        <img src={eyeIcon} alt="" className="w-4 h-4" />
        View Poll History
      </button>

      {/* Title */}
      <div className="max-w-3xl mx-auto">
        <button className="px-3 py-1 mb-3 text-sm font-medium bg-purple-100 rounded-full flex items-center gap-2">
          <img src={stars} alt="Poll Icon" className="w-4 h-4" /> Intervue Poll
        </button>

        <h2 className="text-2xl font-bold">Let's <span className="font-extrabold">Get Started</span></h2>
        <p><b>Teacher:</b> {username}</p>
        <p className="text-gray-500">You'll be able to create and manage polls...</p>

        {error && <div className="p-2 my-3 text-white bg-red-500 rounded">{error}</div>}

        {/* Question */}
        <div className="mb-6">
          <div className="flex justify-between pb-2">
            <label className="font-medium">Enter your question</label>
            <select
              className="border rounded px-2 py-1"
              value={timer}
              onChange={handleTimerChange}
            >
              <option value="60">60 seconds</option>
              <option value="30">30 seconds</option>
              <option value="90">90 seconds</option>
            </select>
          </div>
          <input
            type="text"
            id="question"
            maxLength="100"
            placeholder="Type your question..."
            className="w-full px-3 py-2 rounded bg-gray-100"
            onChange={handleQuestionChange}
          />
          <div className="text-right text-gray-500 mt-1">{question.length}/100</div>
        </div>

        {/* Options */}
        <div className="mb-6">
          <div className="flex justify-between pb-2">
            <span className="font-medium">Edit Options</span>
            <span className="font-medium">Is it correct?</span>
          </div>
          {options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-3 mb-2">
              <span className="flex items-center justify-center w-8 h-8 text-white rounded-full"
                style={{ background: "linear-gradient(243.94deg, #8F64E1 -50.82%, #4E377B 216.33%)" }}>
                {index + 1}
              </span>
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder="Option text..."
                className="flex-1 px-3 py-2 rounded bg-gray-100"
              />
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  checked={option.correct === true}
                  onChange={() => handleCorrectToggle(index, true)}
                  className="text-purple-500"
                /> Yes
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  checked={option.correct === false}
                  onChange={() => handleCorrectToggle(index, false)}
                  className="text-purple-500"
                /> No
              </label>
            </div>
          ))}
        </div>

        {/* Add Option */}
        <button
          className="px-3 py-1 border border-purple-500 text-purple-500 rounded"
          onClick={addOption}
        >
          + Add More Option
        </button>

        <hr className="my-6" />

        {/* Ask Question */}
        <button
          className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white"
          onClick={askQuestion}
        >
          Ask Question
        </button>
      </div>
    </div>
  );
};

export default TeacherLandingPage;
