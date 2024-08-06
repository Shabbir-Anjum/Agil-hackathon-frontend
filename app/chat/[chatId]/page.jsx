'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  connectSocket,
  disconnectSocket,
  sendMessage,
  joinRoom,
} from "@/services/socketService";
import { setCurrentMessages, setCurrentRoom } from "@/store/ChatSlice";
import { IoSend } from "react-icons/io5";
import ChatWindow from "@/components/ChatWindow";
import ProtectedRoute from "@/components/ProtectedRoute";
import ChatLayout from "@/components/ChatLayout";
import { FaRobot, FaArrowLeft } from "react-icons/fa";
import SubmitAIMessage from "@/components/SubmitAIMessage";
import { motion } from 'framer-motion';

const ChatRoom = () => {
  const [messageInput, setMessageInput] = useState("");
  const [showSubmitAIMessage, setShowSubmitAIMessage] = useState(false);
  const router = useRouter();
  const messages = useSelector((state) => state.chat.messages);
  const currentRoom = useSelector((state) => state.chat.currentRoom);
  const RoomName = useSelector((state) => state.chat.RoomName);
  const dispatch = useDispatch();
  const currentuser = useSelector((state) => state.chat.user);
  const serverUrl = useSelector((state) => state.chat.server_url);

  // ... (keep all the existing useEffect and handler functions)

  useEffect(() => {
    connectSocket();
    if (currentRoom) {
      handleJoin(currentRoom);
    }

    const storedMessages = JSON.parse(localStorage.getItem("chatMessages"));
    if (storedMessages) {
      dispatch(setCurrentMessages(storedMessages));
    }

    return () => {
      disconnectSocket();
    };
  }, [currentRoom]);

  const handleJoin = (currentRoom) => {
    joinRoom(currentRoom);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const datetime = new Date().toGMTString();
    sendMessage(messageInput, currentRoom, currentuser, datetime);

    fetch(`${serverUrl}/api/get-outings/${currentRoom}/chat/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/9.2.0'
      },
      body: JSON.stringify({
        content: messageInput,
        send_from: currentuser,
      }),
    });
    setMessageInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
  };


  return (
    <ProtectedRoute>
      <ChatLayout>
        {currentRoom && (
          <div className="flex flex-col h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <header className="bg-white bg-opacity-10 backdrop-blur-lg text-white p-4 flex justify-between items-center shadow-md">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white hover:text-blue-300 transition-colors duration-200"
                  onClick={() => { router.push('/'); }}
                >
                  <FaArrowLeft size={20} />
                </motion.button>
                <h2 className="text-xl font-semibold">{RoomName}</h2>
              </div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-2xl cursor-pointer text-white hover:text-blue-300 transition-colors duration-200"
                onClick={() => { setShowSubmitAIMessage(!showSubmitAIMessage); }}
              >
                <FaRobot />
              </motion.div>
            </header>
            
            <main className="flex-1 overflow-y-auto bg-white bg-opacity-10 backdrop-blur-md p-4">
              {showSubmitAIMessage && (
                <>
                  <div
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                    onClick={() => { setShowSubmitAIMessage(false); }}
                  ></div>
                  <SubmitAIMessage
                    currentRoom={currentRoom}
                    currentuser={currentuser}
                    serverUrl={serverUrl}
                    setShowSubmitAIMessage={setShowSubmitAIMessage}
                  />
                </>
              )}
              <ChatWindow messages={messages} />
            </main>

            <footer className="p-4 bg-white bg-opacity-10 backdrop-blur-lg">
              <div className="flex items-center bg-white bg-opacity-20 rounded-full overflow-hidden shadow-lg">
                <input
                  className="flex-1 p-3 bg-transparent text-white placeholder-gray-300 focus:outline-none"
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-white text-purple-600 rounded-full mr-1"
                  onClick={handleSubmit}
                >
                  <IoSend />
                </motion.button>
              </div>
            </footer>
          </div>
        )}
      </ChatLayout>
    </ProtectedRoute>
  );
};

export default ChatRoom;