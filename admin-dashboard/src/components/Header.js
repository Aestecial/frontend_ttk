import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import { getCurrentUser } from '../services/api'; // Предполагается, что есть функция для получения текущего пользователя

function Header({ toggleSidebar, isSidebarOpen }) {
  const navigate = useNavigate(); // Хук для навигации между страницами
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Получаем информацию о текущем пользователе
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser(); // Запрос на API для получения текущего пользователя
        console.log(user.is_staff)
        setIsStaff(user.is_staff); // Устанавливаем, является ли пользователь администратором
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        // Если ошибка, можно перенаправить на страницу входа или обработать иначе
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // Функция для выхода пользователя
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (loading) return null; // Пока данные загружаются, можно ничего не отображать

  return (
    <header className="header">
      <div className="burger__panel">
        <div
          id="burger"
          className={`burger ${isSidebarOpen ? 'active' : ''}`}
          onClick={toggleSidebar}
        >
          <span></span>
        </div>
        <h2 className="header-text">Админ-панель</h2>
        <nav className={isSidebarOpen ? 'active' : ''}>
          <h2><Link to="/panel/">Главная</Link></h2>
          <h2><Link to="/panel/users">Клиенты</Link></h2>
          <h2><Link to="/panel/settings">Намерения</Link></h2>
          {/* Эта ссылка отображается только если пользователь админ */}
          {isStaff && <h2><Link to="/panel/admins">Админы</Link></h2>}
        </nav>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Выйти
      </button>
    </header>
  );
}

export default Header;
