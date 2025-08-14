import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import stopwatch from "./../assets/stopwatch.svg";
import ChatPopover from "./../components/chat/ChatPopover";
import { useNavigate } from "react-router-dom";
import stars from "./../assets/spark.svg";

let apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:5000";

const socket = io(apiUrl);

const StudentPollPage = () => {
  const [votes, setVotes] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([]);
  const [pollId, setPollId] = useState("");
  const [kickedOut, setKickedOut] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      const username = sessionStorage.getItem("username");
      if (username) {
        socket.emit("submitAnswer", {
          username: username,
          option: selectedOption,
          pollId: pollId,
        });
        setSubmitted(true);
      }
    }
  };

  useEffect(() => {
    const handleKickedOut = () => {
      setKickedOut(true);
      sessionStorage.removeItem("username");
      navigate("/kicked-out");
    };

    socket.on("kickedOut", handleKickedOut);

    return () => {
      socket.off("kickedOut", handleKickedOut);
    };
  }, [navigate]);

  useEffect(() => {
    socket.on("pollCreated", (pollData) => {
      setPollQuestion(pollData.question);
      setPollOptions(pollData.options);
      setVotes({});
      setSubmitted(false);
      setSelectedOption(null);
      setTimeLeft(pollData.timer);
      setPollId(pollData._id);
    });

    socket.on("pollResults", (updatedVotes) => {
      setVotes(updatedVotes);
    });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            setSubmitted(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, submitted]);

  const calculatePercentage = (count) =>
    totalVotes === 0 ? 0 : (count / totalVotes) * 100;

  return (
    <>
      <ChatPopover />
      {kickedOut ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl font-semibold text-red-500">Kicked out</p>
        </div>
      ) : (
        <>
          {pollQuestion === "" && timeLeft === 0 && (
            <div className="flex justify-center items-center h-screen w-3/4 mx-auto">
              <div className="text-center">
                <button
                  className="flex items-center justify-center gap-1 px-3 py-1 text-white rounded-full mb-5 text-sm font-medium"
                  style={{
                    background: "linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)",
                  }}
                >
                  <img src={stars} alt="" className="px-1" />
                  Intervue Poll
                </button>

                <div
                  className="animate-spin inline-block w-6 h-6 border-4 border-purple-700 border-t-transparent rounded-full"
                  role="status"
                ></div>

                <h3 className="text-xl font-bold mt-4">
                  <b>Wait for the teacher to ask questions..</b>
                </h3>
              </div>
            </div>
          )}

          {pollQuestion !== "" && (
            <div className="mt-10 w-1/2 mx-auto">
              {/* Header */}
              <div className="flex items-center mb-4">
                <h5 className="m-0 pr-5 font-semibold">Question</h5>
                <img src={stopwatch} width="15" alt="Stopwatch" />
                <span className="pl-2 text-red-500">{timeLeft}s</span>
              </div>

              {/* Card */}
              <div className="bg-white rounded-lg shadow p-4">
                <h6 className="bg-gradient-to-r from-gray-800 to-gray-500 text-white py-2 px-2 rounded">
                  {pollQuestion}?
                </h6>

                {/* Options */}
                <div className="mt-4 space-y-2">
                  {pollOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`p-3 rounded border ${
                        selectedOption === option.text
                          ? "border-[#7565d9]"
                          : "border-gray-300"
                      } cursor-pointer`}
                      onClick={() => {
                        if (!submitted && timeLeft > 0) {
                          handleOptionSelect(option.text);
                        }
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span
                          className={`${
                            submitted ? "font-bold" : ""
                          } text-gray-800`}
                        >
                          {option.text}
                        </span>
                        {submitted && (
                          <span>
                            {Math.round(
                              calculatePercentage(votes[option.text] || 0)
                            )}
                            %
                          </span>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {submitted && (
                        <div className="w-full bg-gray-200 rounded h-2 mt-2">
                          <div
                            className="h-2 rounded bg-[#7565d9]"
                            style={{
                              width: `${calculatePercentage(
                                votes[option.text] || 0
                              )}%`,
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              {!submitted && selectedOption && timeLeft > 0 && (
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleSubmit}
                    className="w-1/4 py-2 text-white rounded-full font-medium"
                    style={{
                      background:
                        "linear-gradient(99.18deg, #8F64E1 -46.89%, #1D68BD 223.45%)",
                    }}
                  >
                    Submit
                  </button>
                </div>
              )}

              {/* Waiting Message */}
              {submitted && (
                <div className="mt-5 text-center">
                  <h6 className="text-gray-600">
                    Wait for the teacher to ask a new question...
                  </h6>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default StudentPollPage;
