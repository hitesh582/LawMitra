import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { assets } from "../assets/assets";

const ChatList = () => {
  const [collapsed, setCollapsed] = useState(false);
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
      if (!response.ok) throw new Error("Error deleting chat");
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
    <div
      className={`min-h-screen flex flex-col justify-between transition-all duration-300 ease-in-out bg-[#f0f4f9] p-4 ${
        collapsed ? "w-[80px] items-center" : "w-[300px]"
      }`}
    >
      {/* Menu Toggle */}
      <button onClick={() => setCollapsed((prev) => !prev)} className="mb-4">
        <img src={assets.menu_icon} alt="menu" className="w-8 cursor-pointer" />
      </button>

      {/* New Chat */}
      <Link
        to="/dashboard"
        className="mt-6 mb-4 flex items-center gap-2 py-2 px-4 bg-[#e6eaf1] rounded-full text-gray-500 cursor-pointer"
      >
        <img src={assets.plus_icon} alt="new chat" className="w-5" />
        {!collapsed && <span>New Chat</span>}
      </Link>

      {/* Recent Section */}
      {!collapsed && (
        <>
          <p className="mt-6 ml-2 mb-2 text-gray-600 font-medium">Recent</p>
          <div className="flex-1 ml-2 overflow-y-auto  max-h-[300px] pr-2">
            {isLoading ? (
              <p className="text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-red-500">Something went wrong</p>
            ) : validChats.length > 0 ? (
              validChats.map((chat) => (
                <div
                  key={chat._id}
                  className="flex items-center justify-between p-2 rounded-full hover:bg-[#e2e6eb] transition-colors"
                >
                  <Link
                    to={`/dashboard/chats/${chat._id}`}
                    className="flex-1 truncate"
                  >
                    {chat.title.slice(0, 19)}
                  </Link>
                  <button onClick={() => handleDelete(chat._id)}>
                    <img
                      src={assets.delete_icon}
                      alt="delete"
                      className="w-4 h-4 cursor-pointer"
                    />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent chats</p>
            )}
          </div>
        </>
      )}

      {/* Bottom Menu */}
      <Link
        to="/termsofuse"
      >
        <div className="mt-4 mb-4 w-full cursor-pointer">
          <div className="flex items-center gap-2 p-2 rounded-full hover:bg-[#e2e6eb] transition-colors">
            <img src={assets.question_icon} alt="help" className="w-5" />
            {!collapsed && <span>Help</span>}
          </div>
          <div className="flex items-center gap-2 p-2 rounded-full hover:bg-[#e2e6eb] transition-colors mt-2">
            <img src={assets.history_icon} alt="history" className="w-5" />
            {!collapsed && <span>Activity</span>}
          </div>
          <div className="flex items-center gap-2 p-2 rounded-full hover:bg-[#e2e6eb] transition-colors mt-2">
            <img src={assets.setting_icon} alt="settings" className="w-5" />
            {!collapsed && <span>Settings</span>}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ChatList;
