import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backIcon from "./../assets/back.svg";

let apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:5000";

const socket = io(apiUrl);

const PollHistoryPage = () => {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getPolls = async () => {
      const username = sessionStorage.getItem("username");

      try {
        const response = await axios.get(`${apiUrl}/polls/${username}`);
        setPolls(response.data.data);
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };

    getPolls();
  }, []);

  const calculatePercentage = (count, totalVotes) => {
    if (totalVotes === 0) return 0;
    return (count / totalVotes) * 100;
  };

  const handleBack = () => {
    navigate("/teacher-home-page");
  };

  let questionCount = 0;

  return (
    <div className="mx-auto mt-5 w-1/2">
      {/* Back Button */}
      <div className="mb-4 text-left flex items-center gap-2">
        <img
          src={backIcon}
          alt="Back"
          width="25"
          className="cursor-pointer"
          onClick={handleBack}
        />
        <span>
          View <b>Poll History</b>
        </span>
      </div>

      {polls.length > 0 ? (
        polls.map((poll) => {
          const totalVotes = poll.options.reduce(
            (sum, option) => sum + option.votes,
            0
          );

          return (
            <div key={poll._id}>
              <div className="pb-3">{`Question ${++questionCount}`}</div>

              <div className="bg-white rounded-lg shadow-md mb-4 border border-gray-200">
                <div className="p-4">
                  {/* Question */}
                  <h6 className="bg-indigo-600 text-white py-2 px-3 rounded text-left">
                    {poll.question} ?
                  </h6>

                  {/* Options */}
                  <div className="mt-4">
                    {poll.options.map((option) => {
                      const percentage = calculatePercentage(
                        option.votes,
                        totalVotes
                      );
                      return (
                        <div
                          key={option._id}
                          className="bg-gray-50 rounded p-3 m-2 shadow-sm border border-gray-200"
                        >
                          <div className="flex justify-between items-center">
                            <span>{option.text}</span>
                            <span>{Math.round(percentage)}%</span>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-indigo-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-gray-500">Polls not found</div>
      )}
    </div>
  );
};

export default PollHistoryPage;
