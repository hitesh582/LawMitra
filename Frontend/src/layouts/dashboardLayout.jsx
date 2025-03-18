import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import ChatList from "../components/ChatList";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();

  // Check for a user token in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/userlogin");
    }
  }, [navigate]);

  return (
    <div className="flex h-screen">
      {/* Sidebar: fixed width, sticky, with independent vertical scrolling */}
      <div className="w-1/4 sticky top-0 h-full overflow-y-auto">
        <ChatList />
      </div>
      {/* Main chat area: takes remaining width, scrollable content */}
      <div className="flex-1 bg-white flex flex-col">
        {/* Use flex-1 and overflow-y-auto to allow scrolling of conversation */}
        <div className="flex-1 overflow-y-auto ">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
