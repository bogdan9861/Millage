import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./NotificationsPage.css";

import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
  EyeOutlined,
  CarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  DollarOutlined,
  SettingOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Spin, message } from "antd";
import {
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "../../api/entities/notifications";
import Header from "../../components/Header";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  // Загрузка уведомлений
  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await getNotifications();
      setNotifications(response);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      message.error("Ошибка загрузки уведомлений");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [currentPage]);

  // Фильтрация уведомлений
  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((n) => !n.isReaded);
    } else if (filter === "read") {
      return notifications.filter((n) => n.isReaded);
    }
    return notifications;
  }, [notifications, filter]);

  // Статистика
  const stats = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((n) => !n.isReaded).length;
    const read = total - unread;
    return { total, unread, read };
  }, [notifications]);

  // Отметка как прочитанное
  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isReaded: true } : n))
      );
      message.success("Уведомление отмечено как прочитанное");
    } catch (error) {
      message.error("Ошибка при отметке уведомления");
    }
  };

  // Отметка всех как прочитанные
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isReaded: true })));
      message.success("Все уведомления отмечены как прочитанные");
    } catch (error) {
      message.error("Ошибка при отметке уведомлений");
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // Выбор всех
  const selectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map((n) => n.id));
    }
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "только что";
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays === 1) return "вчера";
    if (diffDays < 7) return `${diffDays} дня назад`;

    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
    });
  };

  // Анимации
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.03, duration: 0.2 },
    }),
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className="app notifications-page gap-30"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Header />

      <div className="notifications-page__container">
        {/* Шапка страницы */}
        <div className="notifications-page__header">
          <motion.h1
            className="notifications-page__title"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <BellOutlined
              className="notifications-page__title-icon"
              style={{ color: "#6E61FF" }}
            />
            Уведомления
          </motion.h1>
          <motion.div
            className="notifications-page__actions"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            {stats.unread > 0 && (
              <button
                className="notifications-page__action-btn"
                onClick={handleMarkAllAsRead}
              >
                <CheckOutlined />
                Отметить все прочитанными
              </button>
            )}
          </motion.div>
        </div>

        {/* Статистика */}
        <div className="notifications-page__stats">
          <div className="notifications-page__stat-card">
            <BellOutlined
              className="notifications-page__stat-icon"
              style={{ color: "#6E61FF" }}
            />
            <div className="notifications-page__stat-info">
              <span className="notifications-page__stat-label">Всего</span>
              <span className="notifications-page__stat-value">
                {stats.total}
              </span>
            </div>
          </div>
          <div className="notifications-page__stat-card notifications-page__stat-card--unread">
            <ClockCircleOutlined className="notifications-page__stat-icon" />
            <div className="notifications-page__stat-info">
              <span className="notifications-page__stat-label">
                Непрочитанные
              </span>
              <span className="notifications-page__stat-value">
                {stats.unread}
              </span>
            </div>
          </div>
          <div className="notifications-page__stat-card notifications-page__stat-card--read">
            <CheckCircleOutlined className="notifications-page__stat-icon" />
            <div className="notifications-page__stat-info">
              <span className="notifications-page__stat-label">
                Прочитанные
              </span>
              <span className="notifications-page__stat-value">
                {stats.read}
              </span>
            </div>
          </div>
        </div>

        {/* Фильтры и массовые действия */}
        <div className="notifications-page__filters">
          <div className="notifications-page__filter-group">
            <button
              className={`notifications-page__filter-btn ${
                filter === "all" ? "notifications-page__filter-btn--active" : ""
              }`}
              onClick={() => setFilter("all")}
            >
              Все
            </button>
            <button
              className={`notifications-page__filter-btn ${
                filter === "unread"
                  ? "notifications-page__filter-btn--active"
                  : ""
              }`}
              onClick={() => setFilter("unread")}
            >
              Непрочитанные
              {stats.unread > 0 && (
                <span className="notifications-page__badge">
                  {stats.unread}
                </span>
              )}
            </button>
            <button
              className={`notifications-page__filter-btn ${
                filter === "read"
                  ? "notifications-page__filter-btn--active"
                  : ""
              }`}
              onClick={() => setFilter("read")}
            >
              Прочитанные
            </button>
          </div>

          <div className="notifications-page__batch-actions">
            {!isSelectMode ? (
              <button
                className="notifications-page__batch-btn"
                onClick={() => setIsSelectMode(true)}
              >
                <CheckCircleOutlined />
                Выбрать
              </button>
            ) : (
              <div className="notifications-page__batch-tools">
                <button
                  className="notifications-page__batch-btn"
                  onClick={() => handleMarkAsRead(selectedIds)}
                >
                  Прочитать
                </button>
                <button
                  className="notifications-page__batch-btn"
                  onClick={selectAll}
                >
                  {selectedIds.length === filteredNotifications.length
                    ? "Отменить все"
                    : "Выбрать все"}
                </button>

                <button
                  className="notifications-page__batch-btn"
                  onClick={() => {
                    setIsSelectMode(false);
                    setSelectedIds([]);
                  }}
                >
                  <CloseCircleOutlined />
                  Отмена
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Список уведомлений */}
        <div className="notifications-page__list">
          {loading ? (
            <div className="notifications-page__loading">
              <Spin size="large" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="notifications-page__empty">
              <BellOutlined className="notifications-page__empty-icon" />
              <h3 className="notifications-page__empty-title">
                Уведомлений пока нет
              </h3>
              <p className="notifications-page__empty-text">
                Здесь будут отображаться уведомления о ТО, расходах и других
                событиях
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  className={`notifications-page__item ${
                    !notification.isReaded
                      ? "notifications-page__item--unread"
                      : ""
                  } ${
                    selectedIds.includes(notification.id)
                      ? "notifications-page__item--selected"
                      : ""
                  }`}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={index}
                  layout
                >
                  {isSelectMode && (
                    <div className="notifications-page__item-checkbox">
                      <label className="notifications-page__checkbox">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(notification.id)}
                          onChange={() => toggleSelect(notification.id)}
                        />
                        <span className="notifications-page__checkbox-custom"></span>
                      </label>
                    </div>
                  )}

                  <div className="notifications-page__item-content">
                    <div className="notifications-page__item-header">
                      <h4 className="notifications-page__item-title">
                        {notification.title}
                        {!notification.isReaded && (
                          <span className="notifications-page__unread-dot" />
                        )}
                      </h4>
                      <span className="notifications-page__item-date">
                        {formatDate(notification.date)}
                      </span>
                    </div>
                    <p className="notifications-page__item-message">
                      {notification.message}
                    </p>
                    {notification.car && (
                      <div className="notifications-page__item-car">
                        <CarOutlined />
                        {notification.car.mark} {notification.car.model}
                        {notification.car.number && (
                          <span className="notifications-page__item-car-number">
                            ({notification.car.number})
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {!isSelectMode && (
                    <div className="notifications-page__item-actions">
                      {!notification.isReaded && (
                        <button
                          className="notifications-page__item-action"
                          onClick={() => handleMarkAsRead([notification.id])}
                          title="Отметить как прочитанное"
                        >
                          <CheckOutlined />
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="notifications-page__pagination">
            <button
              className="notifications-page__pagination-btn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="notifications-page__pagination-info">
              Страница {currentPage} из {totalPages}
            </span>
            <button
              className="notifications-page__pagination-btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationsPage;
