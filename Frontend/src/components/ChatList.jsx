import { Link } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { assets } from "../assets/assets";

const ChatList = () => {
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => res.json()),
  });

  const deleteMutation = useMutation({
    mutationFn: async (chatId) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chats/${chatId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error deleting chat");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
    },
  });

  const handleDelete = (chatId) => {
    if (window.confirm("Are you sure you want to delete this chat?")) {
      deleteMutation.mutate(chatId);
    }
  };

  const validChats = data?.filter((chat) => chat._id && chat.title) || [];

  return (
    <div className="min-h-screen inline-flex flex-col justify-between bg-[#f0f4f9] py-[25px] px-[15px] w-[300px]">
      {/* Menu Icon */}
      <span className="font-semibold text-xs mb-2">
        <Link to="/dashboard">
          <img
            src={assets.menu_icon}
            alt="menu"
            className="block ml-[10px] cursor-pointer w-[30px]"
          />
        </Link>
      </span>

      {/* New Chat Button with Reduced Margin */}
      <Link
        to="/dashboard"
        className="mt-[5px] inline-flex items-center gap-[10px] py-[10px] px-[15px] bg-[#e6eaf1] rounded-[50px] text-[14px] text-gray-500 cursor-pointer"
      >
        <img src={assets.plus_icon} alt="new chat" className="w-[20px]" />
        <p>New Chat</p>
      </Link>

      <p className="mt-[5px] mb-[5px] ml-2.5 text-gray-600 font-medium">
        Recent
      </p>

      {/* Scrollable Chat List */}
      <div className="flex flex-col overflow-y-auto max-h-[300px] pr-2">
        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-500">Something went wrong</p>
        ) : validChats.length > 0 ? (
          validChats.map((chat) => (
            <div
              key={chat._id}
              className="flex items-start gap-[10px] p-[10px] pr-[40px] rounded-[50px] text-[#282828] cursor-pointer hover:bg-[#e2e6eb] transition-colors"
            >
              <Link to={`/dashboard/chats/${chat._id}`} className="flex-1 ml-1">
                {chat.title.slice(0, 19)}
              </Link>
              <button onClick={() => handleDelete(chat._id)} className="ml-8">
                <img
                  src={assets.delete_icon}
                  alt="delete"
                  className="w-4 h-4 mt-1 cursor-pointer"
                />
              </button>
            </div>
          ))
        ) : (
          <span className="text-gray-500 text-sm ml-3">No recent chats</span>
        )}
      </div>

      {/* Fixed Bottom Section */}
      <div className="flex flex-col mt-5">
        <div className="flex items-start gap-[10px] p-[10px] pr-[40px] rounded-[50px] text-[#282828] cursor-pointer hover:bg-[#e2e6eb] transition-colors">
          <img src={assets.question_icon} alt="help" className="w-[20px]" />
          <p>Help</p>
        </div>
        <div className="flex items-start gap-[10px] p-[10px] pr-[40px] rounded-[50px] text-[#282828] cursor-pointer hover:bg-[#e2e6eb] transition-colors">
          <img src={assets.history_icon} alt="history" className="w-[20px]" />
          <p>Activity</p>
        </div>
        <div className="flex items-start gap-[10px] p-[10px] pr-[40px] rounded-[50px] text-[#282828] cursor-pointer hover:bg-[#e2e6eb] transition-colors">
          <img src={assets.setting_icon} alt="settings" className="w-[20px]" />
          <p>Settings</p>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
