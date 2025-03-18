import { Link, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { assets } from "../assets/assets";

const queryClient = new QueryClient();

const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="py-4 px-16 h-screen flex flex-col">
        <header className="flex items-center justify-between">
          <Link to="/" className="flex items-center font-bold gap-2">
            <img src={assets.logo} alt="" className="w-8 h-8" />
            <span>LawMitra</span>
          </Link>
          <div>
            {/* Custom user menu can be added here if desired */}
          </div>
        </header>
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default RootLayout;
