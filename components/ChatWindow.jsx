import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";

const ChatWindow = ({ messages }) => {
  const messagesEndRef = useRef(null);
  const currentuser = useSelector((state) => state.chat.user);
  const userdata = useSelector((state) => state.chat.userdata);
  const photoURL = userdata?.photoURL || 'https://img.freepik.com/free-psd/abstract-background-design_1297-75.jpg?w=1060&t=st=1723186219~exp=1723186819~hmac=788b74d69097f6551006599dae26ad0dc3d51a2845e9f452e3f926b2f229286a';
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);



  return (
    <div className="w-full overflow-x-auto">
      <div className="chat-content bg-transparent p-4 rounded-lg shadow-lg">
        <div className="flex flex-col gap-2">
          {messages && messages.length > 0 ? (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex justify-start items-start gap-2 text-transparent hover:text-black delay-150 ${
                  message.send_from === currentuser ? "justify-end" : "justify-start"
                }`}
              >
                {message.send_from === currentuser ? (
                  <>
                    <div className="sender mt-auto text-sm">
                      {message.send_from}
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <div>
                      
                      </div>
                      <div
                        className={`p-2 max-w-xs bg-black text-white rounded-br-none rounded-lg break-words`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 justify-start">
                    
                      <div
                        className={`p-2 max-w-xs bg-gray-400 text-white rounded-bl-none rounded-lg break-words`}
                      >
                        {message.content}
                      </div>
                    </div>
                    <div className="sender mt-auto text-sm">
                      {message.send_from}
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-4">
              No messages yet.
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
