import React, { useState } from "react";
import {
  Card,
  Button,
  Avatar,
  Tabs,
  Form,
  Input,
  DatePicker,
  Select,
  Upload,
  message,
  Switch,
  Divider,
  Badge,
  Progress,
  Tag,
  Tooltip,
  Modal,
  List,
  Statistic,
  Timeline,
  Rate,
} from "antd";
import {
  UserOutlined,
  CarOutlined,
  SettingOutlined,
  HistoryOutlined,
  TrophyOutlined,
  EditOutlined,
  CameraOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  GlobalOutlined,
  LockOutlined,
  BellOutlined,
  SafetyOutlined,
  LogoutOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
  ThunderboltOutlined,
  RiseOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  WalletOutlined,
  GiftOutlined,
  TeamOutlined,
  FileTextOutlined,
  ShareAltOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import Header from "../components/Header";

// Mock user data
const initialUserData = {
  id: "1",
  name: "Алексей Иванов",
  email: "alexey.ivanov@example.com",
  phone: "+7 (999) 123-45-67",
  location: "Москва, Россия",
  joinDate: "2024-01-15",
  avatar: null,
  bio: "Автомобильный энтузиаст, люблю путешествия и оптимизацию расхода топлива. Управляю автопарком из 3 автомобилей.",
  preferences: {
    language: "ru",
    theme: "dark",
    notifications: {
      email: true,
      push: true,
      reminders: true,
    },
    units: "metric",
  },
  stats: {
    totalDistance: 144970,
    totalTrips: 125,
    avgConsumption: 12.5,
    savedFuel: 342,
    ecoScore: 85,
    rank: "Золотой водитель",
    level: 12,
    experience: 3400,
    nextLevelExp: 5000,
  },
  achievements: [
    {
      id: 1,
      name: "Первая поездка",
      icon: "🚗",
      date: "2024-01-20",
      earned: true,
    },
    { id: 2, name: "1000 км", icon: "🏁", date: "2024-02-15", earned: true },
    {
      id: 3,
      name: "Экономия 100л",
      icon: "⛽",
      date: "2024-03-10",
      earned: true,
    },
    {
      id: 4,
      name: "Марафонец",
      icon: "🏆",
      date: null,
      earned: false,
      progress: 65,
    },
    {
      id: 5,
      name: "Эксперт",
      icon: "⭐",
      date: null,
      earned: false,
      progress: 40,
    },
  ],
  recentActivities: [
    {
      id: 1,
      type: "trip",
      title: "Поездка в Москва → Санкт-Петербург",
      date: "2025-03-25",
      distance: 820,
      points: 150,
    },
    {
      id: 2,
      type: "fuel",
      title: "Заправка 45.2 л",
      date: "2025-03-20",
      cost: 2350,
      points: 50,
    },
    {
      id: 3,
      type: "achievement",
      title: 'Получено достижение "Экономия 100л"',
      date: "2025-03-10",
      points: 100,
    },
    {
      id: 4,
      type: "service",
      title: "Плановое ТО BMW X5",
      date: "2025-03-05",
      points: 75,
    },
  ],
  cars: [
    {
      id: "1",
      name: "Tesla Model 3",
      plate: "A123BC",
      mileage: 12450,
      image: null,
    },
    { id: "2", name: "BMW X5", plate: "B456DE", mileage: 87320, image: null },
    {
      id: "3",
      name: "Mercedes E-Class",
      plate: "C789FG",
      mileage: 45200,
      image: null,
    },
  ],
};

const Profile = () => {
  const [userData, setUserData] = useState(initialUserData);
  const [activeTab, setActiveTab] = useState("profile");
  const [editModal, setEditModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const handleUpdateProfile = (values) => {
    setUserData({
      ...userData,
      name: values.name,
      email: values.email,
      phone: values.phone,
      location: values.location,
      bio: values.bio,
    });
    setEditModal(false);
    message.success("Профиль обновлен");
  };

  // Handle avatar upload
  const handleAvatarChange = (info) => {
    if (info.file.status === "done") {
      message.success("Аватар загружен");
      setUserData({
        ...userData,
        avatar:
          info.file.response?.url ||
          URL.createObjectURL(info.file.originFileObj),
      });
    } else if (info.file.status === "error") {
      message.error("Ошибка загрузки");
    }
  };

  // Handle logout
  const handleLogout = () => {
    Modal.confirm({
      title: "Выход из аккаунта",
      content: "Вы уверены, что хотите выйти?",
      onOk: () => {
        message.success("До свидания!");
        // Navigate to login page would go here
      },
      okText: "Выйти",
      cancelText: "Отмена",
      okButtonProps: { danger: true },
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const getRankColor = (rank) => {
    if (rank.includes("Золотой")) return "#f59e0b";
    if (rank.includes("Серебряный")) return "#94a3b8";
    if (rank.includes("Платиновый")) return "#8b5cf6";
    return "#3b82f6";
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      {/* Main Content */}
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Background accents */}
          <div className="fixed top-0 left-0 right-0 h-[300px] bg-gradient-radial from-blue-500/5 via-transparent to-transparent pointer-events-none" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10"
          >
            {/* Header */}
            <motion.div
              variants={itemVariants}
              className="flex justify-between items-end flex-wrap gap-4 mb-8"
            >
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent tracking-tight mb-2 flex items-center gap-3"
                >
                  <UserOutlined className="text-blue-400" />
                  Профиль пользователя
                </motion.h1>
                <p className="text-gray-500 text-sm">
                  Управляйте аккаунтом, отслеживайте достижения и статистику
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => setEditModal(true)}
                  className="!bg-white/5 !border-white/10 !text-gray-300 hover:!text-white !rounded-full !h-11"
                >
                  Редактировать
                </Button>
                <Button
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  className="!bg-red-500/10 !border-red-500/20 !text-red-400 hover:!text-red-300 !rounded-full !h-11"
                >
                  Выйти
                </Button>
              </div>
            </motion.div>

            {/* Profile Header Card */}
            <motion.div variants={itemVariants} className="mb-8">
              <Card className="!bg-gradient-to-br !from-white/5 !to-white/5 !backdrop-blur-sm !border-white/10 !rounded-2xl overflow-hidden">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                  {/* Avatar Section */}
                  <div className="relative">
                    <Upload
                      showUploadList={false}
                      beforeUpload={() => false}
                      onChange={handleAvatarChange}
                      accept="image/*"
                    >
                      <div className="cursor-pointer group relative">
                        <Avatar
                          size={120}
                          src={userData.avatar}
                          icon={!userData.avatar && <UserOutlined />}
                          className="!bg-gradient-to-br !from-blue-500 !to-purple-600 shadow-xl"
                          style={{ fontSize: 48 }}
                        />
                        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <CameraOutlined className="text-white text-2xl" />
                        </div>
                      </div>
                    </Upload>
                    <Badge
                      count="PRO"
                      style={{ backgroundColor: "#f59e0b" }}
                      className="absolute -bottom-1 -right-1"
                    />
                  </div>

                  {/* User Info */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start mb-2">
                      <h2 className="text-2xl font-bold text-white">
                        {userData.name}
                      </h2>
                      <Tag
                        color={getRankColor(userData.stats.rank)}
                        className="rounded-full px-3 py-1"
                      >
                        {userData.stats.rank}
                      </Tag>
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start text-gray-400 text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <MailOutlined />
                        <span>{userData.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <PhoneOutlined />
                        <span>{userData.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <EnvironmentOutlined />
                        <span>{userData.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarOutlined />
                        <span>
                          С нами с{" "}
                          {dayjs(userData.joinDate).format("MMMM YYYY")}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm max-w-2xl">
                      {userData.bio}
                    </p>
                  </div>

                  {/* Level Progress */}
                  <div className="min-w-[200px]">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white mb-1">
                        {userData.stats.level}
                      </div>
                      <div className="text-xs text-gray-400 mb-2">Уровень</div>
                      <Progress
                        percent={
                          (userData.stats.experience /
                            userData.stats.nextLevelExp) *
                          100
                        }
                        strokeColor="#8b5cf6"
                        trailColor="rgba(255,255,255,0.1)"
                        showInfo={false}
                      />
                      <div className="text-xs text-gray-400 mt-2">
                        {userData.stats.experience} /{" "}
                        {userData.stats.nextLevelExp} XP
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
            >
              <Card className="!bg-white/5 !border-white/10 !rounded-2xl">
                <Statistic
                  title={
                    <span className="text-gray-400 text-xs">Общий пробег</span>
                  }
                  value={userData.stats.totalDistance}
                  valueStyle={{
                    color: "#fff",
                    fontSize: "24px",
                    fontWeight: 600,
                  }}
                  suffix="км"
                  prefix={<CarOutlined className="text-blue-400 mr-2" />}
                />
              </Card>
              <Card className="!bg-white/5 !border-white/10 !rounded-2xl">
                <Statistic
                  title={
                    <span className="text-gray-400 text-xs">Всего поездок</span>
                  }
                  value={userData.stats.totalTrips}
                  valueStyle={{
                    color: "#fff",
                    fontSize: "24px",
                    fontWeight: 600,
                  }}
                  prefix={<HistoryOutlined className="text-green-400 mr-2" />}
                />
              </Card>
              <Card className="!bg-white/5 !border-white/10 !rounded-2xl">
                <Statistic
                  title={
                    <span className="text-gray-400 text-xs">
                      Средний расход
                    </span>
                  }
                  value={userData.stats.avgConsumption}
                  precision={1}
                  valueStyle={{
                    color: "#fff",
                    fontSize: "24px",
                    fontWeight: 600,
                  }}
                  suffix="л/100км"
                  prefix={
                    <ThunderboltOutlined className="text-orange-400 mr-2" />
                  }
                />
              </Card>
              <Card className="!bg-white/5 !border-white/10 !rounded-2xl">
                <Statistic
                  title={
                    <span className="text-gray-400 text-xs">
                      Сэкономлено топлива
                    </span>
                  }
                  value={userData.stats.savedFuel}
                  valueStyle={{
                    color: "#fff",
                    fontSize: "24px",
                    fontWeight: 600,
                  }}
                  suffix="л"
                  prefix={<RiseOutlined className="text-green-400 mr-2" />}
                />
              </Card>
              <Card className="!bg-white/5 !border-white/10 !rounded-2xl">
                <div>
                  <p className="text-gray-400 text-xs mb-2">Eco Score</p>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-white">
                      {userData.stats.ecoScore}
                    </div>
                    <Progress
                      type="circle"
                      percent={userData.stats.ecoScore}
                      width={50}
                      strokeColor="#10b981"
                      trailColor="rgba(255,255,255,0.1)"
                      format={() => null}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Tabs */}
            <motion.div variants={itemVariants} className="mb-8">
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                className="[&_.ant-tabs-tab]:!text-gray-400 [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-white [&_.ant-tabs-ink-bar]:!bg-blue-500"
                items={[
                  { key: "profile", label: "Профиль", icon: <UserOutlined /> },
                  {
                    key: "cars",
                    label: "Мои автомобили",
                    icon: <CarOutlined />,
                  },
                  {
                    key: "achievements",
                    label: "Достижения",
                    icon: <TrophyOutlined />,
                  },
                  {
                    key: "activity",
                    label: "Активность",
                    icon: <HistoryOutlined />,
                  },
                  {
                    key: "settings",
                    label: "Настройки",
                    icon: <SettingOutlined />,
                  },
                ]}
              />
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card
                      title="Личная информация"
                      className="!bg-white/5 !border-white/10 !rounded-2xl"
                      headStyle={{
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                        color: "#e5e7eb",
                      }}
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between py-2 border-b border-white/10">
                          <span className="text-gray-400">Полное имя</span>
                          <span className="text-white">{userData.name}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-white/10">
                          <span className="text-gray-400">Email</span>
                          <span className="text-white">{userData.email}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-white/10">
                          <span className="text-gray-400">Телефон</span>
                          <span className="text-white">{userData.phone}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-white/10">
                          <span className="text-gray-400">Местоположение</span>
                          <span className="text-white">
                            {userData.location}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-gray-400">
                            Дата регистрации
                          </span>
                          <span className="text-white">
                            {dayjs(userData.joinDate).format("DD MMMM YYYY")}
                          </span>
                        </div>
                      </div>
                    </Card>

                    <Card
                      title="Статистика аккаунта"
                      className="!bg-white/5 !border-white/10 !rounded-2xl"
                      headStyle={{
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                        color: "#e5e7eb",
                      }}
                    >
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-400">Уровень</span>
                            <span className="text-white">
                              {userData.stats.level}
                            </span>
                          </div>
                          <Progress
                            percent={
                              (userData.stats.experience /
                                userData.stats.nextLevelExp) *
                              100
                            }
                            strokeColor="#8b5cf6"
                            trailColor="rgba(255,255,255,0.1)"
                          />
                        </div>
                        <div className="flex justify-between py-2 border-b border-white/10">
                          <span className="text-gray-400">Всего XP</span>
                          <span className="text-white">
                            {userData.stats.experience}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-white/10">
                          <span className="text-gray-400">
                            Следующий уровень
                          </span>
                          <span className="text-white">
                            {userData.stats.nextLevelExp} XP
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-gray-400">Ранг</span>
                          <Tag
                            color={getRankColor(userData.stats.rank)}
                            className="rounded-full"
                          >
                            {userData.stats.rank}
                          </Tag>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <Card
                    title="О себе"
                    className="!bg-white/5 !border-white/10 !rounded-2xl"
                    headStyle={{
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      color: "#e5e7eb",
                    }}
                  >
                    <p className="text-gray-300">{userData.bio}</p>
                  </Card>
                </motion.div>
              )}

              {activeTab === "cars" && (
                <motion.div
                  key="cars"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {userData.cars.map((car, index) => (
                    <motion.div
                      key={car.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="!bg-white/5 !border-white/10 !rounded-2xl hover:!border-white/20 transition-all">
                        <div className="text-center">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 mx-auto mb-4 flex items-center justify-center">
                            <CarOutlined className="text-4xl text-blue-400" />
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-1">
                            {car.name}
                          </h3>
                          <p className="text-gray-400 text-sm mb-3">
                            {car.plate}
                          </p>
                          <Divider className="!border-white/10 !my-3" />
                          <div className="flex justify-between">
                            <span className="text-gray-400">Пробег</span>
                            <span className="text-white">
                              {car.mileage.toLocaleString()} км
                            </span>
                          </div>
                          <Button className="mt-4 !bg-white/5 !border-white/10 !text-gray-300 w-full hover:!text-white">
                            Подробнее
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="!bg-white/5 !border-dashed !border-white/20 !rounded-2xl hover:!border-white/40 transition-all cursor-pointer">
                      <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center">
                          <CarOutlined className="text-2xl text-gray-400" />
                        </div>
                        <p className="text-gray-400">Добавить автомобиль</p>
                        <p className="text-xs text-gray-500 mt-1">
                          + новый автомобиль в парк
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === "achievements" && (
                <motion.div
                  key="achievements"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userData.achievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card
                          className={`!bg-white/5 !border-white/10 !rounded-2xl ${
                            achievement.earned ? "opacity-100" : "opacity-60"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-4xl mb-3">
                              {achievement.icon}
                            </div>
                            <h3 className="text-white font-semibold mb-1">
                              {achievement.name}
                            </h3>
                            {achievement.earned ? (
                              <>
                                <Tag
                                  color="green"
                                  className="rounded-full mt-2"
                                >
                                  Получено
                                </Tag>
                                <p className="text-xs text-gray-500 mt-2">
                                  {dayjs(achievement.date).format("DD.MM.YYYY")}
                                </p>
                              </>
                            ) : (
                              <>
                                <Progress
                                  percent={achievement.progress}
                                  strokeColor="#f59e0b"
                                  trailColor="rgba(255,255,255,0.1)"
                                  className="mt-2"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                  {achievement.progress}% выполнения
                                </p>
                              </>
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "activity" && (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  <Card
                    title="Недавняя активность"
                    className="!bg-white/5 !border-white/10 !rounded-2xl"
                    headStyle={{
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      color: "#e5e7eb",
                    }}
                  >
                    <Timeline
                      items={userData.recentActivities.map((activity) => ({
                        color:
                          activity.type === "trip"
                            ? "blue"
                            : activity.type === "fuel"
                            ? "green"
                            : "purple",
                        dot:
                          activity.type === "trip" ? (
                            <CarOutlined />
                          ) : activity.type === "fuel" ? (
                            <ThunderboltOutlined />
                          ) : (
                            <TrophyOutlined />
                          ),
                        children: (
                          <div>
                            <div className="text-white">{activity.title}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {dayjs(activity.date).format("DD MMMM YYYY")}
                              {activity.points && (
                                <Tag color="gold" className="ml-2 rounded-full">
                                  +{activity.points} XP
                                </Tag>
                              )}
                            </div>
                          </div>
                        ),
                      }))}
                      className="[&_.ant-timeline-item]:!text-gray-300"
                    />
                  </Card>

                  <Card
                    title="Статистика по месяцам"
                    className="!bg-white/5 !border-white/10 !rounded-2xl"
                    headStyle={{
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      color: "#e5e7eb",
                    }}
                  >
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Март 2025</span>
                          <span className="text-white">1,850 км</span>
                        </div>
                        <Progress
                          percent={85}
                          strokeColor="#3b82f6"
                          trailColor="rgba(255,255,255,0.1)"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Февраль 2025</span>
                          <span className="text-white">1,620 км</span>
                        </div>
                        <Progress
                          percent={74}
                          strokeColor="#3b82f6"
                          trailColor="rgba(255,255,255,0.1)"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Январь 2025</span>
                          <span className="text-white">1,480 км</span>
                        </div>
                        <Progress
                          percent={68}
                          strokeColor="#3b82f6"
                          trailColor="rgba(255,255,255,0.1)"
                        />
                      </div>
                    </div>
                    <Divider className="!border-white/10 !my-4" />
                    <div className="flex justify-between">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">125</div>
                        <div className="text-xs text-gray-500">
                          Всего поездок
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">342</div>
                        <div className="text-xs text-gray-500">
                          Сэкономлено л
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">
                          4,250
                        </div>
                        <div className="text-xs text-gray-500">Всего XP</div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <Card
                    title="Настройки уведомлений"
                    className="!bg-white/5 !border-white/10 !rounded-2xl"
                    headStyle={{
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      color: "#e5e7eb",
                    }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white">Email уведомления</div>
                          <div className="text-xs text-gray-500">
                            Получать уведомления на почту
                          </div>
                        </div>
                        <Switch
                          defaultChecked={
                            userData.preferences.notifications.email
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white">Push-уведомления</div>
                          <div className="text-xs text-gray-500">
                            Мгновенные уведомления в браузере
                          </div>
                        </div>
                        <Switch
                          defaultChecked={
                            userData.preferences.notifications.push
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white">Напоминания о ТО</div>
                          <div className="text-xs text-gray-500">
                            Уведомления о предстоящем обслуживании
                          </div>
                        </div>
                        <Switch
                          defaultChecked={
                            userData.preferences.notifications.reminders
                          }
                        />
                      </div>
                    </div>
                  </Card>

                  <Card
                    title="Настройки приватности"
                    className="!bg-white/5 !border-white/10 !rounded-2xl"
                    headStyle={{
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      color: "#e5e7eb",
                    }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white">Публичный профиль</div>
                          <div className="text-xs text-gray-500">
                            Показывать профиль другим пользователям
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white">
                            Показывать статистику
                          </div>
                          <div className="text-xs text-gray-500">
                            Делиться статистикой в рейтингах
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <Button
                        icon={<LockOutlined />}
                        onClick={() => setPasswordModal(true)}
                        className="!bg-white/5 !border-white/10 !text-gray-300 w-full mt-4"
                      >
                        Изменить пароль
                      </Button>
                    </div>
                  </Card>

                  <Card
                    title="Настройки интерфейса"
                    className="!bg-white/5 !border-white/10 !rounded-2xl"
                    headStyle={{
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      color: "#e5e7eb",
                    }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white">Темная тема</div>
                          <div className="text-xs text-gray-500">
                            Использовать темную тему оформления
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white">Единицы измерения</div>
                          <div className="text-xs text-gray-500">
                            Метрическая система (км, л)
                          </div>
                        </div>
                        <Select
                          defaultValue="metric"
                          className="!bg-white/5 !w-32"
                          dropdownClassName="!bg-[#1a1a24]"
                        >
                          <Select.Option value="metric">
                            Метрическая
                          </Select.Option>
                          <Select.Option value="imperial">
                            Имперская
                          </Select.Option>
                        </Select>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer Info */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex justify-between flex-wrap gap-4 text-xs text-gray-500 border-t border-white/10 pt-6"
            >
              <div>
                <SafetyOutlined className="mr-1" /> Ваши данные защищены
              </div>
              <div>
                <ShareAltOutlined className="mr-1" /> Поделиться профилем
              </div>
              <div>
                <DownloadOutlined className="mr-1" /> Экспорт данных
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        title="Редактировать профиль"
        open={editModal}
        onCancel={() => setEditModal(false)}
        footer={null}
        modalRender={(node) => (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {node}
          </motion.div>
        )}
        className="[&_.ant-modal-content]:!bg-[#0a0a0f] [&_.ant-modal-content]:!border [&_.ant-modal-content]:!border-white/10 [&_.ant-modal-header]:!bg-transparent [&_.ant-modal-header]:!border-b-white/10 [&_.ant-modal-title]:!text-white"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateProfile}
          initialValues={userData}
        >
          <Form.Item
            name="name"
            label="Имя"
            rules={[{ required: true }]}
            className="[&_.ant-form-item-label_label]:!text-gray-300"
          >
            <Input className="!bg-white/5 !border-white/10 !text-white" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
            className="[&_.ant-form-item-label_label]:!text-gray-300"
          >
            <Input className="!bg-white/5 !border-white/10 !text-white" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Телефон"
            className="[&_.ant-form-item-label_label]:!text-gray-300"
          >
            <Input className="!bg-white/5 !border-white/10 !text-white" />
          </Form.Item>
          <Form.Item
            name="location"
            label="Местоположение"
            className="[&_.ant-form-item-label_label]:!text-gray-300"
          >
            <Input className="!bg-white/5 !border-white/10 !text-white" />
          </Form.Item>
          <Form.Item
            name="bio"
            label="О себе"
            className="[&_.ant-form-item-label_label]:!text-gray-300"
          >
            <Input.TextArea
              rows={4}
              className="!bg-white/5 !border-white/10 !text-white"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="!bg-blue-500 !border-none !rounded-full !h-11"
            >
              Сохранить изменения
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        title="Изменить пароль"
        open={passwordModal}
        onCancel={() => setPasswordModal(false)}
        footer={null}
        modalRender={(node) => (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {node}
          </motion.div>
        )}
        className="[&_.ant-modal-content]:!bg-[#0a0a0f] [&_.ant-modal-content]:!border [&_.ant-modal-content]:!border-white/10 [&_.ant-modal-header]:!bg-transparent [&_.ant-modal-header]:!border-b-white/10 [&_.ant-modal-title]:!text-white"
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={() => {
            message.success("Пароль изменен");
            setPasswordModal(false);
          }}
        >
          <Form.Item
            name="currentPassword"
            label="Текущий пароль"
            rules={[{ required: true }]}
            className="[&_.ant-form-item-label_label]:!text-gray-300"
          >
            <Input.Password className="!bg-white/5 !border-white/10 !text-white" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Новый пароль"
            rules={[{ required: true, min: 6 }]}
            className="[&_.ant-form-item-label_label]:!text-gray-300"
          >
            <Input.Password className="!bg-white/5 !border-white/10 !text-white" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Подтвердите пароль"
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Пароли не совпадают"));
                },
              }),
            ]}
            className="[&_.ant-form-item-label_label]:!text-gray-300"
          >
            <Input.Password className="!bg-white/5 !border-white/10 !text-white" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="!bg-blue-500 !border-none !rounded-full !h-11"
            >
              Сменить пароль
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(
            circle at 20% 30%,
            rgba(59, 130, 246, 0.03),
            transparent
          );
        }
      `}</style>
    </div>
  );
};

export default Profile;
