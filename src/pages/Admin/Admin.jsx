import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Trash2,
  LogOut,
  Car,
  MapPin,
  Calendar,
  TrendingUp,
  Activity,
  X,
  Eye,
  BarChart3,
  Fuel,
  Navigation,
  Cloud,
  Star,
  DollarSign,
  Clock,
  DownloadIcon,
} from "lucide-react";
import {
  currentUser,
  getAllUsers,
  registerUser,
  removeUser,
} from "../../api/entities/user";
import { useNavigate } from "react-router";
import { enums } from "../../enums";
import styles from "./Admin.module.css";
import { getUsersTrips } from "../../api/entities/trips";
import { Button } from "antd";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [showTripsModal, setShowTripsModal] = useState(false);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    currentUser()
      .then((res) => {
        setUser(res);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (loading) return;
    if (user?.role !== "ADMIN") {
      navigate("/admin-panel/login");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (loading) return;
    getAllUsers()
      .then((res) => {
        setUsers(res?.filter((u) => u.id !== user.id));
      })
      .catch((e) => {
        console.log(e);
      });
  }, [loading, user.id]);

  const addUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    if (users.some((u) => u.email === newUser.email)) {
      alert("Пользователь с такой почтой уже существует");
      return;
    }

    registerUser({
      email: newUser.email,
      name: newUser.name,
      password: newUser.password,
    }).then((res) => {
      setNewUser({ name: "", email: "", password: "" });
      setShowAddModal(false);
      setUsers((prev) => [res.data, ...prev]);
    });
  };

  const deleteUser = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить этого пользователя?")) {
      try {
        await removeUser(id);
        setUsers(users.filter((user) => user.id !== id));
      } catch (e) {
        alert("Не удалось удалить пользователя");
      }
    }
  };

  const viewUserTrips = async (user) => {
    setSelectedUser(user);
    setShowTripsModal(true);
    setLoadingTrips(true);
    try {
      const res = await getUsersTrips(user.id);
      console.log(res);

      setUserTrips(res.trips);
    } catch (error) {
      console.error("Error loading trips:", error);
      setUserTrips([]);
    } finally {
      setLoadingTrips(false);
    }
  };

  const filteredUsers = users?.filter(
    (user) =>
      user?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      user?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase()),
  );

  const handleLogout = () => {
    localStorage.removeItem(enums.TOKEN);
    navigate("/admin-panel/login");
  };

  const getRouteTypeIcon = (type) => {
    switch (type) {
      case "CITY":
        return <MapPin size={14} />;
      case "MOTORWAY":
        return <Navigation size={14} />;
      default:
        return <MapPin size={14} />;
    }
  };

  const getWeatherIcon = (weather) => {
    switch (weather) {
      case "SUNNY":
        return "☀️";
      case "CLOUDY":
        return "☁️";
      case "RAINY":
        return "🌧";
      case "SNOWY":
        return "❄️";
      default:
        return "☀️";
    }
  };

  const getRatingStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={12}
          fill={i < rating ? "#fbbf24" : "none"}
          color="#fbbf24"
        />
      ));
  };

  return (
    <div className={styles.adminPanel}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <Car size={28} />
            <span>AdminHub</span>
          </div>
        </div>
        <div className={styles.sidebarContent}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userName}>{user?.name || "Admin"}</p>
              <p className={styles.userEmail}>{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={18} />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Управление пользователями</h1>
            <p className={styles.pageSubtitle}>
              Просмотр и управление всеми пользователями системы
            </p>
          </div>
          <button
            className={styles.addBtn}
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} />
            Добавить пользователя
          </button>
        </header>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Users />
            </div>
            <div className={styles.statInfo}>
              <h3>{users.length}</h3>
              <p>Всего пользователей</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Activity />
            </div>
            <div className={styles.statInfo}>
              <h3>{users?.filter((u) => u?.role === "DRIVER")?.length}</h3>
              <p>Водителей</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <TrendingUp />
            </div>
            <div className={styles.statInfo}>
              <h3>{new Date().toLocaleDateString()}</h3>
              <p>Активных сегодня</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Поиск по имени или email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>Пользователь</th>
                <th>Email</th>
                <th>Дата регистрации</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.userAvatarSmall}>
                        {user.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className={styles.userNameCell}>{user.name}</div>
                        <div className={styles.userRole}>
                          {user.role || "DRIVER"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                  <td>
                    <span className={styles.statusBadgeActive}>Активен</span>
                  </td>
                  <td>
                    <div className={styles.actionBtns}>
                      <button
                        className={styles.viewBtn}
                        onClick={() => viewUserTrips(user)}
                        title="Просмотреть поездки"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => deleteUser(user.id)}
                        title="Удалить пользователя"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className={styles.noData}>
                    <Users size={48} />
                    <p>Пользователи не найдены</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showAddModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowAddModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Добавить пользователя</h3>
              <button
                className={styles.modalClose}
                onClick={() => setShowAddModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Имя пользователя</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  placeholder="Введите имя"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  placeholder="example@mail.com"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Пароль</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  placeholder="••••••"
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowAddModal(false)}
              >
                Отмена
              </button>
              <button className={styles.submitBtn} onClick={addUser}>
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}

      {showTripsModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowTripsModal(false)}
        >
          <div
            className={styles.modalLarge}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <h3>Отчеты о поездках</h3>
                <p className={styles.modalSubtitle}>
                  Пользователь: <strong>{selectedUser?.name}</strong>
                </p>
              </div>
              <button
                className={styles.modalClose}
                onClick={() => setShowTripsModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              {loadingTrips ? (
                <div className={styles.loadingState}>
                  <Activity size={32} className={styles.spinning} />
                  <p>Загрузка поездок...</p>
                </div>
              ) : userTrips.length === 0 ? (
                <div className={styles.emptyState}>
                  <Car size={48} />
                  <p>У пользователя пока нет поездок</p>
                </div>
              ) : (
                <div className={styles.tripsList}>
                  {userTrips?.map((trip) => (
                    <div>
                      <div key={trip.id} className={styles.tripCard}>
                        <div className={styles.tripHeader}>
                          <div className={styles.tripRoute}>
                            <MapPin size={16} />
                            <span>{trip.startPoint}</span>
                            <span className={styles.arrow}>→</span>
                            <span>{trip.endPoint}</span>
                          </div>
                          <div className={styles.tripRating}>
                            {getRatingStars(trip.rating)}
                          </div>
                        </div>
                        <div className={styles.tripDetails}>
                          <div className={styles.tripDetailItem}>
                            <Calendar size={14} />
                            <span>
                              {new Date(trip.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className={styles.tripDetailItem}>
                            <Clock size={14} />
                            <span>{trip.duration} мин</span>
                          </div>
                          <div className={styles.tripDetailItem}>
                            <Fuel size={14} />
                            <span>{trip.fuelWaste} л</span>
                          </div>
                          <div className={styles.tripDetailItem}>
                            <DollarSign size={14} />
                            <span>{trip.fuelCost} ₽</span>
                          </div>
                        </div>
                        <div
                          className={styles.tripMeta}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <span className={styles.metaTag}>
                              {getRouteTypeIcon(trip.routeType)}{" "}
                              {trip.routeType}
                            </span>
                            <span className={styles.metaTag}>
                              {getWeatherIcon(trip.weather)} {trip.weather}
                            </span>
                            <span className={styles.metaTag}>
                              📍 {trip.startMillage} - {trip.endMillage} км
                            </span>
                          </div>

                          {trip.fileUrl && (
                            <Button
                              size="small"
                              icon={<DownloadIcon size={14} />}
                              type="primary"
                              onClick={() => {
                                window.open(trip.fileUrl, "_blank");
                              }}
                            >
                              Скачать документ
                            </Button>
                          )}
                        </div>
                        {trip.message && trip.message !== "undefined" && (
                          <div className={styles.tripMessage}>
                            {trip.message}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
