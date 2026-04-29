import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  message,
  Tabs,
  Alert,
  Divider,
  Modal,
  Input as AntInput,
} from "antd";
import {
  CarOutlined,
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  GoogleOutlined,
  AppleOutlined,
  FacebookOutlined,
  ArrowRightOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  DashboardOutlined,
  HistoryOutlined,
  SettingOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { loginUser, registerUser } from "../api/entities/user";
import { enums } from "../enums";
import { useNavigate } from "react-router";

const Login = () => {
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotModal, setForgotModal] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [speed, setSpeed] = useState(0);
  const navigate = useNavigate();

  const carControls = useAnimation();
  const roadControls = useAnimation();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setCursorPosition({ x, y });

      const speedX = Math.abs(e.movementX);
      const speedY = Math.abs(e.movementY);
      const newSpeed = Math.min(Math.max(speedX + speedY, 0), 30);
      setSpeed(newSpeed);

      carControls.start({
        x: (x - 50) * 0.5,
        y: (y - 50) * 0.2,
        rotate: (x - 50) * 0.3,
        transition: { type: "spring", stiffness: 100, damping: 20 },
      });

      roadControls.start({
        x: (x - 50) * -0.2,
        transition: { duration: 0.1 },
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [carControls, roadControls]);

  const handleLogin = async (values) => {
    setLoading(true);

    console.log(values);

    loginUser(values)
      .then((res) => {
        localStorage.setItem(enums.TOKEN, res.token);
        navigate("/");
      })
      .catch((e) => {
        console.log(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRegister = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error("Пароли не совпадают");
      return;
    }
    setLoading(true);

    registerUser(values)
      .then((res) => {
        localStorage(enums.TOKEN, res.data.token);
        navigate("/");
      })
      .catch((e) => {
        message.error(e?.response?.data?.message || "Не удалось войти");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleForgotPassword = (values) => {
    message.success(
      `Инструкции по восстановлению отправлены на ${values.email}`
    );
    setForgotModal(false);
  };

  const features = [
    {
      icon: <DashboardOutlined />,
      title: "Учет пробега",
      desc: "Точный учет каждого километра",
    },
    {
      icon: <HistoryOutlined />,
      title: "История заправок",
      desc: "Анализ расхода топлива",
    },
    {
      icon: <ThunderboltOutlined />,
      title: "Экономия",
      desc: "Оптимизация затрат до 15%",
    },
    {
      icon: <SettingOutlined />,
      title: "Автоматизация",
      desc: "Умные напоминания о ТО",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  };

  const formVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
    exit: { x: -50, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at ${cursorPosition.x}% ${cursorPosition.y}%, rgba(59,130,246,0.3) 0%, transparent 50%)`,
            transition: "background 0.1s ease",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' fill='none' stroke='rgba(59,130,246,0.03)' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Animated Road Lines */}
      <motion.div
        animate={roadControls}
        className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none overflow-hidden"
      >
        <svg
          className="absolute bottom-0 w-full"
          height="120"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d="M0,80 L1440,40 L1440,120 L0,120 Z"
            fill="url(#roadGradient)"
          />
          <motion.line
            x1="0"
            y1="70"
            x2="1440"
            y2="70"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="20 30"
            animate={{ x: [-100, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
          <motion.line
            x1="0"
            y1="90"
            x2="1440"
            y2="90"
            stroke="#8b5cf6"
            strokeWidth="2"
            strokeDasharray="20 30"
            animate={{ x: [0, -100] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
        </svg>
      </motion.div>

      {/* Animated Cars */}
      <motion.div
        animate={carControls}
        className="fixed bottom-20 right-10 pointer-events-none z-10"
        style={{ x: 0, y: 0 }}
      >
        <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
          <motion.g
            animate={{ x: [0, 5, -5, 0], y: [0, -2, 2, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <rect
              x="20"
              y="30"
              width="80"
              height="30"
              rx="10"
              fill="url(#carGradient)"
            />
            <rect x="30" y="20" width="60" height="20" rx="5" fill="#1f2937" />
            <circle
              cx="35"
              cy="60"
              r="12"
              fill="#111"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            <circle
              cx="85"
              cy="60"
              r="12"
              fill="#111"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            <rect x="45" y="25" width="30" height="12" rx="2" fill="#374151" />
          </motion.g>
          <defs>
            <linearGradient id="carGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Speed Indicator */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed top-20 right-8 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 z-20"
      >
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Скорость движения</div>
          <div className="text-3xl font-bold text-white">
            {Math.floor(speed)}
          </div>
          <div className="text-xs text-gray-500">км/ч</div>
        </div>
        <div className="mt-2 w-20 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            animate={{ width: `${(speed / 30) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl w-full mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Branding & Features */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="hidden lg:block"
            >
              <motion.div variants={itemVariants} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <CarOutlined className="text-white text-2xl" />
                  </div>
                  <span className="text-2xl font-bold text-white">
                    DriveLog
                  </span>
                </div>
                <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
                  Умный учет
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {" "}
                    пробега
                  </span>
                </h1>
                <p className="text-gray-400 text-lg">
                  Контролируйте расход топлива, отслеживайте техническое
                  состояние и экономьте до 15% на эксплуатации автомобиля
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 text-xl">
                      {feature.icon}
                    </div>
                    <div>
                      <div className="text-white font-semibold">
                        {feature.title}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {feature.desc}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex gap-6 text-gray-500"
              >
                <div className="flex items-center gap-2">
                  <SafetyOutlined />
                  <span className="text-sm">Безопасные данные</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThunderboltOutlined />
                  <span className="text-sm">Мгновенная синхронизация</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Auth Form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
            >
              <Card className="!bg-white/5 !backdrop-blur-xl !border-white/10 !rounded-3xl overflow-hidden">
                <div className="p-6 sm:p-8">
                  {/* Tabs */}
                  <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    centered
                    className="mb-6 [&_.ant-tabs-tab]:!text-gray-400 [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-white [&_.ant-tabs-ink-bar]:!bg-gradient-to-r !from-blue-500 !to-purple-500"
                    items={[
                      { key: "login", label: "Вход", icon: <UserOutlined /> },
                      {
                        key: "register",
                        label: "Регистрация",
                        icon: <CarOutlined />,
                      },
                    ]}
                  />

                  <AnimatePresence mode="wait">
                    {activeTab === "login" && (
                      <motion.div
                        key="login"
                        variants={formVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <Form
                          form={loginForm}
                          onFinish={handleLogin}
                          layout="vertical"
                          size="large"
                        >
                          <Form.Item
                            name="email"
                            rules={[
                              { required: true, message: "Введите email" },
                              { type: "email", message: "Некорректный email" },
                            ]}
                          >
                            <Input
                              prefix={
                                <MailOutlined className="text-gray-400" />
                              }
                              placeholder="Email"
                              className="!bg-white/5 !border-white/10 !text-white !rounded-xl"
                            />
                          </Form.Item>

                          <Form.Item
                            name="password"
                            rules={[
                              { required: true, message: "Введите пароль" },
                            ]}
                          >
                            <Input.Password
                              prefix={
                                <LockOutlined className="text-gray-400" />
                              }
                              placeholder="Пароль"
                              iconRender={(visible) =>
                                visible ? (
                                  <EyeOutlined />
                                ) : (
                                  <EyeInvisibleOutlined />
                                )
                              }
                              className="!bg-white/5 !border-white/10 !text-white !rounded-xl"
                            />
                          </Form.Item>

                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            className="!bg-gradient-to-r !from-blue-500 !to-purple-600 !border-none !rounded-xl !h-12 !font-semibold mb-4"
                          >
                            Войти
                          </Button>
                        </Form>
                      </motion.div>
                    )}

                    {activeTab === "register" && (
                      <motion.div
                        key="register"
                        variants={formVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <Form
                          form={registerForm}
                          onFinish={handleRegister}
                          layout="vertical"
                          size="large"
                        >
                          <Form.Item
                            name="name"
                            rules={[{ required: true, message: "Введите имя" }]}
                          >
                            <Input
                              prefix={
                                <UserOutlined className="text-gray-400" />
                              }
                              placeholder="Имя"
                              className="!bg-white/5 !border-white/10 !text-white !rounded-xl"
                            />
                          </Form.Item>

                          <Form.Item
                            name="email"
                            rules={[
                              { required: true, message: "Введите email" },
                              { type: "email", message: "Некорректный email" },
                            ]}
                          >
                            <Input
                              prefix={
                                <MailOutlined className="text-gray-400" />
                              }
                              placeholder="Email"
                              className="!bg-white/5 !border-white/10 !text-white !rounded-xl"
                            />
                          </Form.Item>

                          <Form.Item
                            name="password"
                            rules={[
                              { required: true, message: "Введите пароль" },
                              { min: 6, message: "Минимум 6 символов" },
                            ]}
                          >
                            <Input.Password
                              prefix={
                                <LockOutlined className="text-gray-400" />
                              }
                              placeholder="Пароль"
                              iconRender={(visible) =>
                                visible ? (
                                  <EyeOutlined />
                                ) : (
                                  <EyeInvisibleOutlined />
                                )
                              }
                              className="!bg-white/5 !border-white/10 !text-white !rounded-xl"
                            />
                          </Form.Item>

                          <Form.Item
                            name="confirmPassword"
                            dependencies={["password"]}
                            rules={[
                              { required: true, message: "Подтвердите пароль" },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (
                                    !value ||
                                    getFieldValue("password") === value
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error("Пароли не совпадают")
                                  );
                                },
                              }),
                            ]}
                          >
                            <Input.Password
                              prefix={
                                <LockOutlined className="text-gray-400" />
                              }
                              placeholder="Подтвердите пароль"
                              iconRender={(visible) =>
                                visible ? (
                                  <EyeOutlined />
                                ) : (
                                  <EyeInvisibleOutlined />
                                )
                              }
                              className="!bg-white/5 !border-white/10 !text-white !rounded-xl"
                            />
                          </Form.Item>

                          <Form.Item
                            name="agreement"
                            valuePropName="checked"
                            rules={[
                              {
                                required: true,
                                message: "Необходимо согласие",
                              },
                            ]}
                          >
                            <Checkbox className="text-gray-400 text-sm">
                              Я соглашаюсь с{" "}
                              <a href="#" className="text-blue-400">
                                условиями использования
                              </a>{" "}
                              и
                              <a href="#" className="text-blue-400">
                                {" "}
                                политикой конфиденциальности
                              </a>
                            </Checkbox>
                          </Form.Item>

                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            className="!bg-gradient-to-r !from-blue-500 !to-purple-600 !border-none !rounded-xl !h-12 !font-semibold"
                          >
                            Зарегистрироваться
                          </Button>
                        </Form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        title="Восстановление пароля"
        open={forgotModal}
        onCancel={() => setForgotModal(false)}
        footer={null}
        className="[&_.ant-modal-content]:!bg-[#0a0a0f] [&_.ant-modal-content]:!border [&_.ant-modal-content]:!border-white/10 [&_.ant-modal-header]:!bg-transparent [&_.ant-modal-header]:!border-b-white/10 [&_.ant-modal-title]:!text-white"
      >
        <Form onFinish={handleForgotPassword} layout="vertical">
          <Alert
            message="Введите email, указанный при регистрации"
            type="info"
            showIcon
            className="!bg-blue-500/10 !border-blue-500/20 !text-blue-300 mb-4"
          />
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Введите email" },
              { type: "email", message: "Некорректный email" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              className="!bg-white/5 !border-white/10 !text-white"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="!bg-gradient-to-r !from-blue-500 !to-purple-600 !border-none !rounded-xl"
            >
              Отправить инструкции
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Floating particles animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0,
            }}
            animate={{
              y: [null, -100, -200],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .ant-card {
          background: rgba(10, 10, 15, 0.8);
          backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  );
};

// Custom Card component since we're using Tailwind
const Card = ({ children, className }) => {
  return (
    <div
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl ${className}`}
    >
      {children}
    </div>
  );
};

export default Login;
