import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";
import { Fragment, useState, useEffect } from "react";
import NewPrompt from "./NewPrompt";

// Typewriter effect component for model messages
const TypewriterText = ({ text }) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    // const delayTimer = setTimeout(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 20); // 20ms per character for a fast effect
    return () => clearInterval(interval);
    // }, 5000); // 2000ms delay before starting to type
    // return () => clearTimeout(delayTimer);
  }, [text]);

  return <Markdown>{displayed}</Markdown>;
};

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();

  const { isLoading, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => res.json()),
  });

  // Local state to manage chat messages
  const [messages, setMessages] = useState([]);

  // When initial data loads, initialize messages with history.
  useEffect(() => {
    if (!isLoading && data?.history) {
      setMessages(data.history);
    }
  }, [isLoading, data]);

  // Callback function called when the user sends a prompt.
  // getStream is an async generator yielding AI response chunks.
  const handleUserSend = async (userText, getStream) => {
    // Append the user message (displayed on the right)
    const userMsg = { role: "user", parts: [{ text: userText }] };
    setMessages((prev) => [...prev, userMsg]);

    // Append a loading placeholder message (displayed on the left) with extra top margin.
    const loadingMsg = { role: "loading", parts: [{ text: "" }] };
    setMessages((prev) => [...prev, loadingMsg]);

    try {
      let accumulatedText = "";
      for await (const chunk of getStream()) {
        accumulatedText += chunk.text();
      }
      // Extra delay (e.g., 1 second) to keep the loading animation visible.
      // await new Promise((resolve) => setTimeout(resolve, 5000));

      // Remove any loading placeholder and append the model response.
      setMessages((prev) =>
        prev
          .filter((msg) => msg.role !== "loading")
          .concat({
            role: "model",
            parts: [{ text: accumulatedText }],
          })
      );
    } catch (err) {
      console.error("Error streaming the AI response:", err);
      // Remove loading placeholder if error occurs.
      setMessages((prev) => prev.filter((msg) => msg.role !== "loading"));
    }
  };

  return (
    <>
      {/* Inline custom keyframes for loader animation */}
      <style>
        {`
          @keyframes loader {
            0% { background-position: -800px 0; }
            100% { background-position: 800px 0; }
          }
        `}
      </style>
      <div className="h-screen flex flex-col">
        {/* Scrollable chat container */}
        <div className="flex-1 overflow-y-auto px-4 py-2 max-h-[calc(100vh-120px)]">
          <div className="max-w-3xl mx-auto flex flex-col gap-5 pb-28">
            {isLoading ? (
              // Overall loader while fetching initial chat history
              <div className="w-full flex flex-col gap-[10px] mt-20">
                <div
                  className="rounded border-0 h-[20px] bg-gradient-to-r from-[#9ed7ff] via-[#ffffff] to-[#9ed7ff] bg-[length:800px_50px]"
                  style={{ animation: "loader 3s linear infinite" }}
                />
                <div
                  className="rounded border-0 h-[20px] bg-gradient-to-r from-[#9ed7ff] via-[#ffffff] to-[#9ed7ff] bg-[length:800px_50px]"
                  style={{ animation: "loader 3s linear infinite" }}
                />
                <div
                  className="rounded border-0 h-[20px] bg-gradient-to-r from-[#9ed7ff] via-[#ffffff] to-[#9ed7ff] bg-[length:800px_50px]"
                  style={{ animation: "loader 3s linear infinite" }}
                />
              </div>
            ) : error ? (
              "Something went wrong"
            ) : (
              messages.map((message, i) => (
                <Fragment key={i}>
                  {message.img && (
                    <IKImage
                      urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                      path={message.img}
                      height="300"
                      width="400"
                      transformation={[{ height: 300, width: 400 }]}
                      loading="lazy"
                      lqip={{ active: true, quality: 20 }}
                    />
                  )}
                  <div
                    className={
                      message.role === "user"
                        ? "p-5 bg-white rounded-xl self-end"
                        : "p-5 bg-gray-200 rounded-xl self-start"
                    }
                  >
                    {message.role === "user" ? (
                      // Render user messages immediately
                      <Markdown>{message.parts[0].text}</Markdown>
                    ) : message.role === "model" ? (
                      // Render model messages with typewriter effect
                      <TypewriterText text={message.parts[0].text} />
                    ) : message.role === "loading" ? (
                      // Render loading placeholder with extra margin
                      <div className="mt-8 w-full flex flex-col gap-[10px]">
                        <div
                          className="rounded border-0 h-[20px] bg-gradient-to-r from-[#9ed7ff] via-[#ffffff] to-[#9ed7ff] bg-[length:800px_50px]"
                          style={{ animation: "loader 3s linear infinite" }}
                        />
                      </div>
                    ) : null}
                  </div>
                </Fragment>
              ))
            )}
          </div>
          {/* Input bar at the bottom */}
          <div className="bg-white p-4">
            {/* Pass handleUserSend to NewPrompt */}
            <NewPrompt data={data} onUserSend={handleUserSend} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
