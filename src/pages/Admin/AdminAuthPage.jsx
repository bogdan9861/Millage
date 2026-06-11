import React, { useEffect, useState } from "react";
import { currentUser, loginUser } from "../../api/entities/user";
import { useNavigate } from "react-router";

import styles from "./Admin.module.css";

import { enums } from "../../enums";

const AdminAuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({});
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    setIsUserLoading(true);

    currentUser()
      .then((res) => {
        setUser(res);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setIsUserLoading(false);
      });
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    if (isUserLoading) return;

    if (user?.role === "ADMIN") {
      navigate("/admin-panel");
    }
  }, [isUserLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    loginUser({ email, password })
      .then((res) => {
        if (res.role === "ADMIN") {
          navigate("/admin-panel");
          localStorage.setItem(enums.TOKEN, res.token);
        } else {
          setError("У вас недостаточно прав");
        }
      })
      .catch((e) => {
        console.log(e);
        if (e.status === 404) {
          setError("Не верный логин или пароль");
          return;
        }

        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={styles["login-container"]}>
      <div className={styles["login-box"]}>
        <form onSubmit={handleSubmit} className={styles["login-form"]}>
          <div className={styles["form-group"]}>
            <label htmlFor="email">Имя пользователя</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите логин"
              required
              autoComplete="off"
            />
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
            />
          </div>

          {error && <div className={styles["error-message"]}>{error}</div>}

          <button
            type="submit"
            className={styles["login-btn"]}
            disabled={loading}
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAuthPage;
