import React, { use, useEffect, useState } from "react";
import {
  Card,
  Button,
  Switch,
  Slider,
  Select,
  Input,
  Form,
  Upload,
  message,
  Divider,
  Tabs,
  Checkbox,
  Tag,
  Modal,
  Avatar,
  Alert,
} from "antd";
import {
  SettingOutlined,
  UserOutlined,
  GlobalOutlined,
  FileTextOutlined,
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined,
  SafetyOutlined,
  QrcodeOutlined,
  CloudUploadOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import Header from "../components/Header";
import { currentUser, editUser } from "../api/entities/user";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [backupModal, setBackupModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [twoFactorModal, setTwoFactorModal] = useState(false);
  const [user, setUser] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (!user) return;

    form.setFieldValue("name", user?.name);
    form.setFieldValue("email", user?.email);
  }, [user]);

  useEffect(() => {
    setLoading(true);

    currentUser()
      .then((res) => {
        setUser(res);
      })
      .catch((e) => {
        message.error(e?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleUpdateSettings = () => {
    setEditLoading(true);

    editUser(form.getFieldsValue())
      .then((res) => {
        message.success("Данные сохранены");
      })
      .catch((e) => {
        message.error("Не удалось сохранить данные");
      })
      .finally(() => {
        setEditLoading(false);
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
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={handleUpdateSettings}
                  loading={editLoading}
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
                      loading={loading}
                      title="Личная информация"
                      className="!bg-white/5 !border-white/10 !rounded-2xl"
                      headStyle={{
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                        color: "#e5e7eb",
                      }}
                    >
                      <Form layout="vertical" form={form}>
                        <Form.Item
                          label="Имя"
                          name="name"
                          className="[&_.ant-form-item-label_label]:!text-gray-300"
                        >
                          <Input className="!bg-white/5 !border-white/10 !text-white" />
                        </Form.Item>
                        <Form.Item
                          name="email"
                          label="Email"
                          className="[&_.ant-form-item-label_label]:!text-gray-300"
                        >
                          <Input
                            defaultValue="alexey@example.com"
                            className="!bg-white/5 !border-white/10 !text-white"
                          />
                        </Form.Item>
                      </Form>
                    </Card>

                    <Card
                      loading={loading}
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
                      </div>
                      <Divider className="!border-white/10" />
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">ID пользователя</span>
                          <span className="text-white font-mono">
                            {user?.id}
                          </span>
                        </div>
                        <div className="fВlex justify-between">
                          <span className="text-gray-400">
                            Дата регистрации
                          </span>
                          <span className="text-white">
                            {new Date(user?.joinDate).toDateString()}
                          </span>
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
