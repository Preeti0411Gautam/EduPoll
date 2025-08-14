import React, { useState, useEffect, useRef } from "react";
import Chat from "./Chat";
import { io } from "socket.io-client";

import chatIcon from '../../assets/chat.svg';

let apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:5000";

const socket = io(apiUrl);

const ChatPopover = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
    const username = sessionStorage.getItem("username");
    socket.emit("joinChat", { username });

    socket.on("chatMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    socket.on("participantsUpdate", (participantsList) => {
      setParticipants(participantsList);
    });
    return () => {
      socket.off("participantsUpdate");
      socket.off("chatMessage");
    };
  }, []);

  const username = sessionStorage.getItem("username");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = { user: username, text: newMessage };
      socket.emit("chatMessage", message);
      setNewMessage("");
    }
  };

  const handleKickOut = (participant) => {
    socket.emit("kickOut", participant);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-96 bg-white shadow-lg rounded-lg p-4 flex flex-col">
          <div className="flex border-b border-gray-200 mb-3">
            <button
              className="flex-1 py-2 text-indigo-500 border-b-2 border-indigo-500 text-sm font-medium"
            >
              Chat
            </button>
            <button className="flex-1 py-2 text-gray-500 text-sm font-medium">
              Participants
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <Chat
              messages={messages}
              newMessage={newMessage}
              onMessageChange={setNewMessage}
              onSendMessage={handleSendMessage}
            />
          </div>

          <div className="overflow-y-auto mt-3">
            {participants.length === 0 ? (
              <div className="text-gray-500 text-sm">No participants connected</div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-left p-1">Name</th>
                    {username.startsWith("teacher") && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant, index) => (
                    <tr key={index}>
                      <td className="p-1">{participant}</td>
                      {username.startsWith("teacher") && (
                        <td>
                          <button
                            onClick={() => handleKickOut(participant)}
                            className="text-indigo-500 hover:underline text-xs"
                          >
                            Kick Out
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      <div
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 p-3 bg-indigo-500 rounded-full cursor-pointer"
      >
        <img src={chatIcon} alt="chat icon" className="w-7 h-7" />
      </div>
    </>
  );
};

export default ChatPopover;
