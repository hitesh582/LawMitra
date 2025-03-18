import { useEffect, useRef, useState } from "react";
import Upload from "./Upload";
import { IKImage } from "imagekitio-react";
import model from "../lib/gemini";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const NewPrompt = ({ data }) => {
  if (!data) return null;

  const [promptText, setPromptText] = useState(""); // <-- Control the input
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  const chat = model.startChat({
    history: [
      { role: "user", parts: [{ text: "Hello, How are you?" }] },
      {
        role: "model",
        parts: [{ text: "Great to meet you! What would you like to know?" }],
      },
    ],
    generationConfig: {},
  });

  const endRef = useRef(null);
  const formRef = useRef(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data, promptText, answer, img.dbData]);

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          question: promptText.length ? promptText : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          formRef.current.reset();
          setPromptText("");
          setAnswer("");
          setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {},
          });
        });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  const add = async (text, isInitial) => {
    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, text] : [text]
      );

      let accumulatedText = "";
      for await (const chunk of result.stream) {
        accumulatedText += chunk.text();
        setAnswer(accumulatedText);
      }
      mutation.mutate();
    } catch (error) {
      console.error("Error in add function:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    add(promptText.trim(), false);
  };

  const hasRun = useRef(false);
  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true);
      }
      hasRun.current = true;
    }
  }, [data]);

  return (
    <>
      <div className="absolute bottom-0 w-full max-w-[900px] p-5 mx-24">
        <div className="flex items-center justify-between gap-5 bg-gray-200 p-3 rounded-full h-[65px] ml-5">
          {img.isLoading && <div>Loading...</div>}
          {img.dbData?.filePath && (
            <IKImage
              urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
              path={img.dbData.filePath}
              width="380"
              transformation={[{ width: 380 }]}
            />
          )}
          {/* {promptText && <div className="message user">{promptText}</div>} */}
          {answer && (
            <div className="message">
              <Markdown>{answer}</Markdown>
            </div>
          )}
          <div className="pb-[100px]" ref={endRef}></div>

          <form
            className="w-full flex items-center gap-5 px-1 py-3"
            onSubmit={handleSubmit}
            ref={formRef}
          >
            <Upload setImg={setImg} />
            <input id="file" type="file" multiple={false} hidden />

            {/* Controlled Input */}
            <input
              type="text"
              name="text"
              placeholder="Enter a prompt here"
              className="flex-1 bg-transparent border-none outline-none p-2 text-lg"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)} // <-- Keep local state in sync
            />

            <button type="submit" className="cursor-pointer">
              <img src={assets.send_icon} alt="" className="w-5 h-5" />
            </button>
          </form>
        </div>
        <p className="text-center text-sm font-light mt-3">
          LawMitra may display inaccurate info, including about people, so
          double-check its responses.
        </p>
      </div>
    </>
  );
};

export default NewPrompt;
