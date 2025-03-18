import React from "react";
import {
  FaXTwitter,
  FaYoutube,
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaGamepad,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white text-black py-8 px-6 ">
      <div className="max-w-6xl mx-auto">
        {/* Top Section - Fixed Layout */}
        <div className="flex justify-between text-sm">
          {/* Column 1 */}
          <div>
            <h3 className="font-semibold mb-2">Our research</h3>
            <ul>
              <Link to="/overview">
                <li className="transition-all duration-300 hover:text-gray-400 cursor-pointer">
                  Overview
                </li>
              </Link>
              <Link to="/index">
                <li className="transition-all duration-300 hover:text-gray-400 cursor-pointer">
                  Index
                </li>
              </Link>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-semibold mb-2">LawMitra</h3>
            <ul>
              <Link to="/dashboard">
                <li className="transition-all duration-300 hover:text-gray-400 cursor-pointer">
                  For everyone
                </li>
              </Link>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-semibold mb-2">Safety overview</h3>
            <ul>
              <Link to="/safety">
                <li className="transition-all duration-300 hover:text-gray-400 cursor-pointer">
                  Safety overview
                </li>
              </Link>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="font-semibold mb-2">Company</h3>
            <ul>
              <Link to="/aboutus">
                <li className="transition-all duration-300 hover:text-gray-400 cursor-pointer">
                  About us
                </li>
              </Link>
            </ul>
          </div>

          {/* Column 5 */}
          <div>
            <h3 className="font-semibold mb-2">Terms & policies</h3>
            <ul>
              <Link to="/termsofuse">
                <li className="transition-all duration-300 hover:text-gray-400 cursor-pointer">
                  Terms of use
                </li>
              </Link>

              <Link to="/privacypolicy">
                <li className="transition-all duration-300 hover:text-gray-400 cursor-pointer">
                  Privacy policy
                </li>
              </Link>
            </ul>
          </div>
        </div>

        {/* Bottom Section - Fixed Layout */}
        <div className="flex justify-between items-center mt-20 text-sm">
          <p>LawMitra © 2024</p>
          {/* Social Icons */}
          <div className="flex space-x-6 text-2xl">
            <FaXTwitter className="cursor-pointer hover:opacity-75" />
            <FaYoutube className="cursor-pointer hover:opacity-75" />
            <FaLinkedin className="cursor-pointer hover:opacity-75" />
            <FaGithub className="cursor-pointer hover:opacity-75" />
            <FaInstagram className="cursor-pointer hover:opacity-75" />
            <FaGamepad className="cursor-pointer hover:opacity-75" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
