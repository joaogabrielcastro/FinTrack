import { AuthContext } from "@/shared/contexts/AuthContext";
import { ClipboardDocumentListIcon, PowerIcon, UsersIcon } from "@heroicons/react/24/outline";
import {
  UserGroupIcon,
  BuildingOffice2Icon,
  CalendarIcon,
  DocumentChartBarIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "/images/image.png";

const Menus = [
  { title: "Usuarios", path: "/usuarios", icon: <UsersIcon className="w-5 h-5 mr-1" /> },
  { title: "Empresas", path: "/empresas", icon: <BuildingOffice2Icon className="w-5 h-5 mr-1" /> },
  { title: "Clientes", path: "/clientes", icon: <UserGroupIcon className="w-5 h-5 mr-1" /> },
  {
    title: "Funcionarios",
    path: "/funcionarios",
    icon: <UserGroupIcon className="w-5 h-5 mr-1" />,
  },
  {
    title: "Calendário",
    path: "/calendario-iob",
    icon: <CalendarIcon className="w-5 h-5 mr-1" />,
  },
  {
    title: "Periódicos",
    path: "/periodicos",
    icon: <ClipboardDocumentListIcon className="w-5 h-5 mr-1" />,
  },
  {
    title: "IOB",
    path: "/sobre-iob",
    icon: <DocumentChartBarIcon className="w-5 h-5 mr-1" />,
  },
];

const SideBar = ({ children }: { children: React.ReactNode }) => {
  const { user, signOutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Home");
  const [filteredMenus, setFilteredMenus] = useState(Menus);

  useEffect(() => {
    setFilteredMenus(
      Menus.filter((menu) => {
        if (menu.title === "Usuarios") {
          return user?.tipo === "ADMINISTRADOR";
        }
        return true;
      })
    );
  }, [user]);

  useEffect(() => {
    const currentPath = location.pathname;
    const selectedMenu = filteredMenus.find((menu) => menu.path === currentPath);
    if (selectedMenu) {
      setSelectedTab(selectedMenu.title);
    }
  }, [filteredMenus, location]);

  return (
    <div className={`flex bg-zinc-200 min-h-screen`}>
      <nav
        className={`${
          open ? "w-60" : "w-20"
        } md:min-h-screen h-auto bg-[#3C8294] relative duration-200 shadow-lg flex flex-col justify-between`}
      >
        <div>
          <div className="relative">
            <div className={`${!open ? "hidden" : ""} flex justify-center items-center`}>
              <a href="/painel">
                <img src={logo} alt="logo" className="w-15 h-14 mt-6 font-mono" />
              </a>
            </div>
            <span
              className={`${
                !open ? "hidden" : "flex"
              } text-white font-semibold justify-center absolute ml-[90px] `}
            >
              FinTrack
            </span>
            <button
              className={`w-8 h-8 border-2 rounded-full mt-4 ml-auto bg-zinc-200 text-blue-600 absolute top-0 -right-3 duration-300 ${
                !open ? "rotate-180" : ""
              }`}
              onClick={() => setOpen(!open)}
            >
              <ChevronLeftIcon className="w-6" />
            </button>
          </div>
          <div
            className={`flex items-center ${
              open ? "w-52" : "w-9"
            } h-8 bg-[#0E5265] rounded-md p-1 mt-16 ml-6 mr-4 transition-all duration-200`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="text-white w-5 h-5 ml-[3px] block cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="search"
              placeholder="Pesquisar"
              className={`text-base bg-transparent rounded-none ${
                open ? "w-44" : "hidden"
              } focus:outline-none focus:ring-0 ml-2 text-white overflow-hidden transition-all duration-200`}
            />
          </div>
          <ul className="pt-1">
            {filteredMenus.map((menu, index) => (
              <li
                key={index}
                className={`text-base font-semibold relative flex items-center gap-x-3 p-4 cursor-pointer hover:bg-[#0E5265] rounded-md m-4 trasition-all duration-300 ${
                  selectedTab === menu.title && "bg-[#0E5265]"
                }`}
                onClick={() => {
                  setSelectedTab(menu.title);
                  navigate(menu.path);
                }}
              >
                <span className="text-white ">{menu.icon}</span>
                <span className={`text-white ${!open && "hidden"} trasition-all duration-300`}>
                  {menu.title}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <li
            className="text-base font-semibold flex items-center gap-x-3 p-4 cursor-pointer hover:bg-[#0E5265] rounded-md m-4 trasition-all duration-300"
            onClick={() => signOutUser()}
          >
            <span className="text-white">
              <PowerIcon className="w-5 h-5" />
            </span>
            <span className={`text-white ${!open && "hidden"}`}>Sair</span>
          </li>
        </div>
      </nav>

      {children}
    </div>
  );
};

export default SideBar;
