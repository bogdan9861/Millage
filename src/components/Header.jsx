import React, { useEffect, useState } from "react";
import {
  CarOutlined,
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined,
  BarChartOutlined,
  FileTextOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Tooltip, Avatar } from "antd";
import { Link, useHref, useNavigate } from "react-router";
import { enums } from "../enums";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const href = useHref();
  const [activeNav, setActiveNav] = useState(href);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(enums.TOKEN);

    if (!token) {
      navigate("/auth");
    }
  }, []);

  const navItems = [
    {
      key: "dashboard",
      label: "Дашборд",
      icon: <DashboardOutlined />,
      href: "/",
    },
    { key: "trips", label: "Поездки", icon: <CarOutlined />, href: "/trips" },
    {
      key: "statistics",
      label: "Статистика",
      icon: <BarChartOutlined />,
      href: "/statistic",
    },

    {
      key: "settings",
      label: "Настройки",
      icon: <SettingOutlined />,
      href: "/settings",
    },

    {
      key: "notifications",
      label: "Уведомления",
      icon: <NotificationOutlined />,
      href: "/notifications",
    },
  ];

  const logout = () => {
    localStorage.removeItem(enums.TOKEN);
    navigate("/auth", { replace: true });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <CarOutlined className="text-white text-sm" />
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">
              DriveLog
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveNav(item.key);
                  navigate(item.href);
                }}
                className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    flex items-center gap-2
                    ${
                      activeNav === item.href
                        ? "bg-white/10 text-white"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }
                  `}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 cursor-pointer"
              style={{ cursor: "default" }}
            >
              <Avatar
                icon={<UserOutlined />}
                style={{ backgroundColor: "#2c2c3a" }}
              />
              <span className="hidden sm:inline text-sm text-gray-300">
                Алексей
              </span>
            </div>

            <Tooltip title="Выйти">
              <Button
                onClick={logout}
                type="text"
                icon={<LogoutOutlined />}
                className="text-gray-400 hover:text-white"
              />
            </Tooltip>
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveNav(item.key);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                      w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                      flex items-center gap-3
                      ${
                        activeNav === item.key
                          ? "bg-white/10 text-white"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }
                    `}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              <div className="pt-3 mt-3 border-t border-white/10">
                <div className="px-4 py-2 flex items-center gap-3 text-sm text-gray-400">
                  <UserOutlined />
                  <span>Алексей Иванов</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;
