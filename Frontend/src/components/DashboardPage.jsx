import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (text) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          // Send the token from localStorage
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${data.id}`);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    mutation.mutate(text);
  };

  return (
    <div className="flex-1 min-h-screen pb-[15vh] relative">
      <div className="flex items-center justify-between text-[22px] p-5 text-gray-500">
      <p 
          onClick={() => navigate("/home")} 
          className="cursor-pointer"
        >
          LawMitra
        </p>
      </div>
      <div className="max-w-[900px] mx-auto">
        <>
          <div className="mt-12 mb-12 text-5xl text-gray-400 font-medium p-5">
            <p>
              <span className="bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
                Hello, Mitra.
              </span>
            </p>
            <p>How can I help you today?</p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 p-5">
            {[
              {
                text: "Explain the difference between civil and criminal cases",
                icon: assets.compass_icon,
              },
              {
                text: "Briefly summarize tenant rights under rental agreements",
                icon: assets.bulb_icon,
              },
              {
                text: "Brainstorm ways to structure a argument for a lawsuit",
                icon: assets.message_icon,
              },
              {
                text: "Improve the clarity of my contract drafting",
                icon: assets.code_icon,
              },
            ].map((card, index) => (
              <div
                key={index}
                className="h-[200px] p-4 bg-gray-200 rounded-lg relative cursor-pointer hover:bg-gray-300"
              >
                <p className="text-gray-500 text-lg">{card.text}</p>
                <img
                  src={card.icon}
                  alt="Card Icon"
                  className="w-9 p-1 absolute bg-white rounded-full bottom-3 right-3"
                />
              </div>
            ))}
          </div>
        </>
      </div>

      {/* Bottom Input Section */}
      <div className="absolute bottom-0 w-full max-w-[900px] p-5 mx-30">
        <div className="flex items-center justify-between gap-5 bg-gray-200 p-3 rounded-full h-[65px] ml-5">
          <form
            onSubmit={handleSubmit}
            className="w-full flex items-center gap-5 px-1 py-3"
          >
            <input
              type="text"
              name="text"
              placeholder="Enter a prompt here"
              className="flex-1 bg-transparent border-none outline-none p-2 text-lg"
            />
            <button className="cursor-pointer">
              <img src={assets.send_icon} alt="Send Icon" className="w-5 h-5" />
            </button>
          </form>
        </div>
        <p className="text-center text-sm font-light mt-3 mb-2">
          LawMitra may display inaccurate info, including about people, so
          double-check its responses.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
