import React, { useState } from "react";
import {
  Card,
  Button,
  Switch,
  Slider,
  Select,
  Input,
  Form,
  DatePicker,
  Upload,
  message,
  Divider,
  Tabs,
  Radio,
  Checkbox,
  Tag,
  Tooltip,
  Badge,
  Progress,
  Modal,
  List,
  Avatar,
  Alert,
  Space,
  ColorPicker,
  TimePicker,
} from "antd";
import {
  SettingOutlined,
  UserOutlined,
  BellOutlined,
  LockOutlined,
  CarOutlined,
  GlobalOutlined,
  FileTextOutlined,
  ApiOutlined,
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  MoonOutlined,
  SunOutlined,
  DollarOutlined,
  LineChartOutlined,
  NotificationOutlined,
  MailOutlined,
  MessageOutlined,
  MobileOutlined,
  QrcodeOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import Header from "../components/Header";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("ru");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    reminders: true,
    promotions: false,
    updates: true,
  });
  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showStats: true,
    showCars: false,
    showTrips: true,
  });
  const [units, setUnits] = useState("metric");
  const [currency, setCurrency] = useState("rub");
  const [backupModal, setBackupModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [twoFactorModal, setTwoFactorModal] = useState(false);

  // Handle settings update
  const handleUpdateSettings = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("Настройки сохранены");
    }, 1000);
  };

  // Handle export data
  const handleExportData = () => {
    message.success("Экспорт данных начат");
    setTimeout(() => {
      message.success("Данные экспортированы успешно");
    }, 1500);
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

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Main Content */}
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Background accents */}
          <div className="fixed top-0 left-0 right-0 h-[300px] bg-gradient-radial from-purple-500/5 via-transparent to-transparent pointer-events-none" />

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
                  className="text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent tracking-tight mb-2 flex items-center gap-3"
                >
                  <SettingOutlined className="text-purple-400" />
                  Настройки
                </motion.h1>
                <p className="text-gray-500 text-sm">
                  Управляйте настройками приложения, настройте уведомления и
                  безопасность
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleUpdateSettings}
                  loading={loading}
                  className="!bg-white/5 !border-white/10 !text-gray-300 hover:!text-white !rounded-full !h-11"
                >
                  Сбросить
                </Button>
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={handleUpdateSettings}
                  loading={loading}
                  className="!bg-gradient-to-r !from-purple-500 !to-blue-500 !border-none !rounded-full !h-11"
                >
                  Сохранить
                </Button>
              </div>
            </motion.div>

            {/* Settings Tabs */}
            <motion.div variants={itemVariants} className="mb-8">
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                className="[&_.ant-tabs-tab]:!text-gray-400 [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-white [&_.ant-tabs-ink-bar]:!bg-purple-500"
                items={[
                  { key: "profile", label: "Профиль", icon: <UserOutlined /> },

                  {
                    key: "vehicles",
                    label: "Автомобили",
                    icon: <CarOutlined />,
                  },
                ]}
              />
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {/* Profile Settings */}
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
                      <Form layout="vertical">
                        <Form.Item
                          label="Имя"
                          className="[&_.ant-form-item-label_label]:!text-gray-300"
                        >
                          <Input
                            defaultValue="Алексей Иванов"
                            className="!bg-white/5 !border-white/10 !text-white"
                          />
                        </Form.Item>
                        <Form.Item
                          label="Email"
                          className="[&_.ant-form-item-label_label]:!text-gray-300"
                        >
                          <Input
                            defaultValue="alexey@example.com"
                            className="!bg-white/5 !border-white/10 !text-white"
                          />
                        </Form.Item>
                        <Form.Item
                          label="Телефон"
                          className="[&_.ant-form-item-label_label]:!text-gray-300"
                        >
                          <Input
                            defaultValue="+7 (999) 123-45-67"
                            className="!bg-white/5 !border-white/10 !text-white"
                          />
                        </Form.Item>
                        <Form.Item
                          label="Дата рождения"
                          className="[&_.ant-form-item-label_label]:!text-gray-300"
                        >
                          <DatePicker
                            className="!bg-white/5 !border-white/10 !text-white w-full"
                            format="DD.MM.YYYY"
                          />
                        </Form.Item>
                        <Form.Item
                          label="О себе"
                          className="[&_.ant-form-item-label_label]:!text-gray-300"
                        >
                          <Input.TextArea
                            rows={3}
                            defaultValue="Автомобильный энтузиаст"
                            className="!bg-white/5 !border-white/10 !text-white"
                          />
                        </Form.Item>
                      </Form>
                    </Card>

                    <Card
                      title="Аватар"
                      className="!bg-white/5 !border-white/10 !rounded-2xl"
                      headStyle={{
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                        color: "#e5e7eb",
                      }}
                    >
                      <div className="text-center">
                        <Avatar
                          size={120}
                          icon={<UserOutlined />}
                          className="!bg-gradient-to-br !from-purple-500 !to-blue-500 mb-4"
                        />
                        <div className="flex gap-3 justify-center mt-4">
                          <Upload showUploadList={false}>
                            <Button
                              icon={<UploadOutlined />}
                              className="!bg-white/5 !border-white/10 !text-gray-300"
                            >
                              Загрузить
                            </Button>
                          </Upload>
                          <Button
                            icon={<DeleteOutlined />}
                            danger
                            className="!bg-red-500/10 !border-red-500/20"
                          >
                            Удалить
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                          Рекомендуемый размер: 512x512px. Поддерживаются JPG,
                          PNG
                        </p>
                      </div>
                      <Divider className="!border-white/10" />
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">ID пользователя</span>
                          <span className="text-white font-mono">
                            #USR-12345
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Дата регистрации
                          </span>
                          <span className="text-white">15 января 2024</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Статус</span>
                          <Tag color="green" className="rounded-full">
                            Активен
                          </Tag>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <Card
                    title="Социальные сети"
                    className="!bg-white/5 !border-white/10 !rounded-2xl"
                    headStyle={{
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      color: "#e5e7eb",
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        prefix={<GlobalOutlined />}
                        placeholder="Telegram"
                        className="!bg-white/5 !border-white/10 !text-white"
                      />
                      <Input
                        prefix={<GlobalOutlined />}
                        placeholder="Instagram"
                        className="!bg-white/5 !border-white/10 !text-white"
                      />
                      <Input
                        prefix={<GlobalOutlined />}
                        placeholder="Facebook"
                        className="!bg-white/5 !border-white/10 !text-white"
                      />
                      <Input
                        prefix={<GlobalOutlined />}
                        placeholder="VK"
                        className="!bg-white/5 !border-white/10 !text-white"
                      />
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Vehicles Settings */}
              {activeTab === "vehicles" && (
                <motion.div
                  key="vehicles"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <Card
                    title="Основной автомобиль"
                    className="!bg-white/5 !border-white/10 !rounded-2xl"
                    headStyle={{
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      color: "#e5e7eb",
                    }}
                  >
                    <Select
                      defaultValue="tesla"
                      className="!bg-white/5 !w-full"
                    >
                      <Select.Option value="tesla">
                        Tesla Model 3 (A123BC)
                      </Select.Option>
                      <Select.Option value="bmw">BMW X5 (B456DE)</Select.Option>
                      <Select.Option value="mercedes">
                        Mercedes E-Class (C789FG)
                      </Select.Option>
                    </Select>
                  </Card>

                  <Card
                    title="Настройки учета"
                    className="!bg-white/5 !border-white/10 !rounded-2xl"
                    headStyle={{
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      color: "#e5e7eb",
                    }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white">
                            Автоматический расчет расхода
                          </div>
                          <div className="text-xs text-gray-500">
                            Рассчитывать расход на основе данных заправок
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white">Напоминания о ТО</div>
                          <div className="text-xs text-gray-500">
                            Автоматические напоминания о техобслуживании
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white">Интервал ТО</div>
                          <div className="text-xs text-gray-500">
                            Периодичность напоминаний о техобслуживании
                          </div>
                        </div>
                        <Select
                          defaultValue="10000"
                          className="!bg-white/5 !w-32"
                        >
                          <Select.Option value="5000">5,000 км</Select.Option>
                          <Select.Option value="10000">10,000 км</Select.Option>
                          <Select.Option value="15000">15,000 км</Select.Option>
                          <Select.Option value="20000">20,000 км</Select.Option>
                        </Select>
                      </div>
                    </div>
                  </Card>

                  <Card
                    title="Типы топлива"
                    className="!bg-white/5 !border-white/10 !rounded-2xl"
                    headStyle={{
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      color: "#e5e7eb",
                    }}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <Checkbox
                          defaultChecked
                          className="[&_.ant-checkbox-inner]:!border-white/30"
                        />
                        <span className="text-white flex-1">АИ-92</span>
                        <Tag color="blue" className="rounded-full">
                          Tesla Model 3
                        </Tag>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <Checkbox
                          defaultChecked
                          className="[&_.ant-checkbox-inner]:!border-white/30"
                        />
                        <span className="text-white flex-1">АИ-95</span>
                        <Tag color="green" className="rounded-full">
                          BMW X5
                        </Tag>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <Checkbox
                          defaultChecked
                          className="[&_.ant-checkbox-inner]:!border-white/30"
                        />
                        <span className="text-white flex-1">АИ-98</span>
                        <Tag color="purple" className="rounded-full">
                          Mercedes E-Class
                        </Tag>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <Checkbox className="[&_.ant-checkbox-inner]:!border-white/30" />
                        <span className="text-white flex-1">Дизель</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Data Settings */}
              {activeTab === "data" && (
                <motion.div
                  key="data"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <Card
                    title="Управление данными"
                    className="!bg-white/5 !border-white/10 !rounded-2xl"
                    headStyle={{
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      color: "#e5e7eb",
                    }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <div className="text-white">Экспорт данных</div>
                          <div className="text-xs text-gray-500">
                            Выгрузить все данные в JSON/CSV формате
                          </div>
                        </div>
                        <Button
                          icon={<DownloadOutlined />}
                          onClick={handleExportData}
                          className="!bg-white/5 !border-white/10 !text-gray-300"
                        >
                          Экспорт
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <div className="text-white">Импорт данных</div>
                          <div className="text-xs text-gray-500">
                            Загрузить данные из файла
                          </div>
                        </div>
                        <Upload showUploadList={false}>
                          <Button
                            icon={<UploadOutlined />}
                            className="!bg-white/5 !border-white/10 !text-gray-300"
                          >
                            Импорт
                          </Button>
                        </Upload>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <div className="text-white">
                            Резервное копирование
                          </div>
                          <div className="text-xs text-gray-500">
                            Создать резервную копию данных
                          </div>
                        </div>
                        <Button
                          icon={<CloudUploadOutlined />}
                          onClick={() => setBackupModal(true)}
                          className="!bg-white/5 !border-white/10 !text-gray-300"
                        >
                          Создать
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Card
                    title="История"
                    className="!bg-white/5 !border-white/10 !rounded-2xl"
                    headStyle={{
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      color: "#e5e7eb",
                    }}
                  >
                    <div className="space-y-4">
                      <div>
                        <div className="text-white mb-2">Хранение данных</div>
                        <Slider
                          defaultValue={12}
                          min={1}
                          max={60}
                          marks={{ 12: "12 мес", 24: "24 мес", 36: "36 мес" }}
                        />
                        <div className="text-xs text-gray-500 mt-2">
                          Данные хранятся 12 месяцев
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white">
                            Автоматическая очистка
                          </div>
                          <div className="text-xs text-gray-500">
                            Удалять старые данные автоматически
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </Card>

                  <Alert
                    message="Удаление аккаунта"
                    description="Удаление аккаунта приведет к безвозвратной потере всех данных. Это действие нельзя отменить."
                    type="error"
                    icon={<DeleteOutlined />}
                    className="!bg-red-500/10 !border-red-500/20 !text-red-300"
                    showIcon
                    action={
                      <Button
                        danger
                        size="small"
                        onClick={() => setDeleteModal(true)}
                        className="!bg-red-500/20 !border-red-500/30"
                      >
                        Удалить аккаунт
                      </Button>
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer Info */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex justify-between flex-wrap gap-4 text-xs text-gray-500 border-t border-white/10 pt-6"
            >
              <div>
                <SafetyOutlined className="mr-1" /> Версия приложения 2.4.0
              </div>
              <div>
                <FileTextOutlined className="mr-1" /> Политика
                конфиденциальности
              </div>
              <div>
                <GlobalOutlined className="mr-1" /> Пользовательское соглашение
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Backup Modal */}
      <Modal
        title="Резервное копирование"
        open={backupModal}
        onCancel={() => setBackupModal(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setBackupModal(false)}
            className="!bg-white/5 !border-white/10 !text-gray-300"
          >
            Отмена
          </Button>,
          <Button
            key="backup"
            type="primary"
            onClick={() => {
              message.success("Резервная копия создана");
              setBackupModal(false);
            }}
            className="!bg-blue-500"
          >
            Создать
          </Button>,
        ]}
        className="[&_.ant-modal-content]:!bg-[#0a0a0f] [&_.ant-modal-content]:!border [&_.ant-modal-content]:!border-white/10 [&_.ant-modal-header]:!bg-transparent [&_.ant-modal-header]:!border-b-white/10 [&_.ant-modal-title]:!text-white"
      >
        <p className="text-gray-300">
          Будет создана полная резервная копия ваших данных: поездки, заправки,
          автомобили и настройки.
        </p>
        <div className="mt-4 p-3 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2 text-gray-400">
            <CloudUploadOutlined />
            <span>Размер данных: ~2.3 MB</span>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        title="Удаление аккаунта"
        open={deleteModal}
        onCancel={() => setDeleteModal(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setDeleteModal(false)}
            className="!bg-white/5 !border-white/10 !text-gray-300"
          >
            Отмена
          </Button>,
          <Button
            key="delete"
            danger
            onClick={() => {
              message.error("Аккаунт удален");
              setDeleteModal(false);
            }}
            className="!bg-red-500/20 !border-red-500/30"
          >
            Удалить навсегда
          </Button>,
        ]}
        className="[&_.ant-modal-content]:!bg-[#0a0a0f] [&_.ant-modal-content]:!border [&_.ant-modal-content]:!border-white/10 [&_.ant-modal-header]:!bg-transparent [&_.ant-modal-header]:!border-b-white/10 [&_.ant-modal-title]:!text-white"
      >
        <Alert
          message="Внимание!"
          description="Удаление аккаунта приведет к безвозвратной потере всех данных. Пожалуйста, убедитесь, что вы сделали резервную копию важных данных."
          type="error"
          showIcon
          className="!bg-red-500/10 !border-red-500/20 !text-red-300 mb-4"
        />
        <Form layout="vertical">
          <Form.Item label="Введите пароль для подтверждения">
            <Input.Password className="!bg-white/5 !border-white/10 !text-white" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 2FA Modal */}
      <Modal
        title="Двухфакторная аутентификация"
        open={twoFactorModal}
        onCancel={() => setTwoFactorModal(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setTwoFactorModal(false)}
            className="!bg-white/5 !border-white/10 !text-gray-300"
          >
            Отмена
          </Button>,
          <Button
            key="enable"
            type="primary"
            onClick={() => {
              message.success("2FA включена");
              setTwoFactorModal(false);
            }}
            className="!bg-blue-500"
          >
            Включить
          </Button>,
        ]}
        className="[&_.ant-modal-content]:!bg-[#0a0a0f] [&_.ant-modal-content]:!border [&_.ant-modal-content]:!border-white/10 [&_.ant-modal-header]:!bg-transparent [&_.ant-modal-header]:!border-b-white/10 [&_.ant-modal-title]:!text-white"
      >
        <div className="text-center">
          <div className="w-32 h-32 bg-white/5 mx-auto rounded-xl flex items-center justify-center mb-4">
            <QrcodeOutlined className="text-6xl text-gray-400" />
          </div>
          <p className="text-gray-300 mb-4">
            Отсканируйте QR-код в приложении аутентификатора
          </p>
          <code className="block bg-black/50 p-2 rounded text-xs text-gray-400">
            SECRET_KEY_2FA_12345
          </code>
          <p className="text-xs text-gray-500 mt-4">
            Используйте Google Authenticator или аналогичное приложение
          </p>
        </div>
      </Modal>

      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(
            circle at 20% 30%,
            rgba(139, 92, 246, 0.03),
            transparent
          );
        }
      `}</style>
    </div>
  );
};

export default Settings;
