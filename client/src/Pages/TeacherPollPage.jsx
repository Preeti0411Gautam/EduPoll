import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import ChatPopover from "./../components/chat/ChatPopover";
import { useNavigate } from "react-router-dom";
import eyeIcon from "./../assets/eye.svg";

let apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:5000";
const socket = io(apiUrl);

const TeacherPollPage = () => {
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([]);
  const [votes, setVotes] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("pollCreated", (pollData) => {
      setPollQuestion(pollData.question);
      setPollOptions(pollData.options);
      setVotes({});
    });

    socket.on("pollResults", (updatedVotes) => {
      setVotes(updatedVotes);
      setTotalVotes(Object.values(updatedVotes).reduce((a, b) => a + b, 0));
    });

    return () => {
      socket.off("pollCreated");
      socket.off("pollResults");
    };
  }, []);

  const calculatePercentage = (count) => {
    if (totalVotes === 0) return 0;
    return (count / totalVotes) * 100;
  };

  const askNewQuestion = () => {
    navigate("/teacher-home-page");
  };

  const handleViewPollHistory = () => {
    navigate("/teacher-poll-history");
  };

  return (
    <div className="flex flex-col items-center">
      {/* View Poll History */}
      <button
        className="flex items-center gap-2 rounded-full px-6 py-2 m-2 bg-[rgb(143,100,225)] text-white font-medium"
        onClick={handleViewPollHistory}
      >
        <img src={eyeIcon} alt="" className="w-5 h-5" />
        View Poll history
      </button>

      {/* Poll Results */}
      <div className="mt-10 w-full max-w-xl">
        <h3 className="mb-6 text-center text-2xl font-bold">Poll Results</h3>

        {pollQuestion ? (
          <>
            <div className="bg-white shadow rounded-lg p-4">
              <h6 className="bg-gradient-to-r from-[#343434] to-[#6e6e6e] py-2 px-3 rounded text-white">
                {pollQuestion} ?
              </h6>

              <div className="mt-4 space-y-3">
                {pollOptions.map((option) => (
                  <div
                    key={option.id}
                    className="bg-gray-50 p-3 rounded shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <span>{option.text}</span>
                      <span className="font-semibold">
                        {Math.round(
                          calculatePercentage(votes[option.text] || 0)
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="h-2 rounded-full bg-[#7565d9]"
                        style={{
                          width: `${calculatePercentage(
                            votes[option.text] || 0
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ask new question */}
            <div className="text-center mt-6">
              <button
                className="rounded-full px-6 py-2 bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] text-white font-semibold"
                onClick={askNewQuestion}
              >
                + Ask a new question
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-500 text-center">
            Waiting for the teacher to start a new poll...
          </div>
        )}

        <ChatPopover />
      </div>
    </div>
  );
};

export default TeacherPollPage;
