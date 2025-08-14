import React, { useEffect } from "react";

const Chat = ({ messages, newMessage, onMessageChange, onSendMessage }) => {
  const username = sessionStorage.getItem("username");

  useEffect(() => {
    const chatWindow = document.getElementById("chat-window");
    if (chatWindow) {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div
        id="chat-window"
        className="max-h-52 overflow-y-auto p-3 rounded-lg bg-gray-100"
      >
        {messages.length === 0 ? (
          <div className="text-gray-500 text-sm">No messages yet</div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 text-xs break-words whitespace-pre-wrap max-w-[80%] ${
                msg.user === username
                  ? "bg-purple-500 text-white rounded-lg p-2 ml-auto"
                  : "bg-gray-700 text-white rounded-lg p-2 mr-auto"
              }`}
            >
              <span className="mr-1 font-semibold">
                {msg.user === username ? "You" : msg.user}:
              </span>
              <span>{msg.text}</span>
            </div>
          ))
        )}
      </div>

      <input
        type="text"
        value={newMessage}
        onChange={(e) => onMessageChange(e.target.value)}
        placeholder="Type a message"
        className="mt-2 text-xs rounded-lg border border-gray-300 p-2 w-full"
      />

      <button
        onClick={onSendMessage}
        className="mt-2 rounded-lg text-xs px-4 py-2 text-white bg-indigo-500 hover:bg-indigo-600 border-none"
      >
        Send
      </button>
    </>
  );
};

export default Chat;
