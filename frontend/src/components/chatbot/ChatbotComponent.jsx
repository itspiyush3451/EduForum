import React, { useState } from "react";
import botimg from "../../assets/botimg.png";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState([]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    // Create a new message object for the user's input
    const userMessage = { text: input, sender: "user" };

    try {
      // Send user message to backend and receive response
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from backend");
      }

      const data = await response.json();
      const botResponse = data.answer;

      // Add user message to conversation
      setConversation((prevConversation) => [...prevConversation, userMessage]);

      // Add bot response to conversation
      setConversation((prevConversation) => [
        ...prevConversation,
        { text: botResponse, sender: "bot" },
      ]);

      // Clear input field
      setInput("");
    } catch (error) {
      console.error("Error sending message to backend:", error);
      // Handle error, maybe display a message to the user
    }
  };

  return (
    <div className="mt-2 ml-2 flex flex-col text-white-100 drop-shadow-sm ">
      <h1>ASK Jarvis :</h1>
      <div className="flex flex-col max-h-72 overflow-y-auto scrollbar-webkit">
        <div className="flex-1 px-4 py-2">
          {/* Chat conversation */}
          {conversation.map((message, index) => (
            <div
              key={index}
              className={`${
                message.sender === "user" ? "text-right" : "text-left"
              } mb-2`}
            >
              <span
                className={`inline-block px-3 py-1 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {message.text}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Input field for sending messages */}
      <div className="flex px-4 py-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={handleInputChange}
          className="w-44 px-3 py-2 rounded-lg border border-gray-700 bg-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
        >
          Send
        </button>
      </div>
      {/* Fixed image below the input field */}
      <div className="flex justify-center items-center ">
        <img src={botimg} alt="Your image" className="w-full h-full" />
      </div>
    </div>
  );
};

export default Chatbot;
