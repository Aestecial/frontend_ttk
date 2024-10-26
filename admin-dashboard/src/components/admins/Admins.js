// src/components/settings/Settings.js
import React, { useState, useEffect } from 'react';
import '../../styles/Users.css';
import Table from './Table';
import './styles.css';
import { getUsers, createUsers, deleteUsers } from '../../services/api';

const Users = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [data, setData] = useState([]);
  const [newRow, setNewRow] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    // Функция для получения данных о пользователях из API
    const fetchData = async () => {
      try {
        const users = await getUsers();
        setData(users);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError('Ошибка при загрузке данных пользователей.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addRow = async () => {
    try {
      setError(null);
      setIsAdding(true);

      // Проверка на дублирующиеся записи
      const isDuplicate = data.some((row) => row.username === newRow.username || row.email === newRow.email);

      // Получаем токен JWT из localStorage
      const token = localStorage.getItem('access');

      // Конфигурируем запрос с использованием JWT токена
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (isDuplicate) {
        console.warn('Этот пользователь уже существует. Невозможно добавить дублирующиеся записи.');
        setError('Пользователь с таким именем или email уже существует.');
        return;
      }

      // Добавление нового пользователя через API
      const newUser = await createUsers(newRow, config);

      // Обновляем состояние с новыми данными
      setData([...data, newUser]);
      setNewRow({ username: '', email: '', password: '' });
    } catch (error) {
      console.error('Ошибка при добавлении нового пользователя:', error);
      setError('Не удалось добавить пользователя. Пожалуйста, попробуйте снова.');
    } finally {
      setIsAdding(false);
    }
  };

  const deleteRow = async (id) => {
    try {
      // Получаем токен JWT из localStorage
      const token = localStorage.getItem('access');

      // Конфигурируем запрос с использованием JWT токена
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await deleteUsers(id, config);

      // Удаляем строку из состояния
      setData(data.filter((row) => row.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
      setError('Не удалось удалить пользователя. Пожалуйста, попробуйте снова.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRow({ ...newRow, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addRow();
  };

  if (loading) return <p>Загрузка данных...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="main">
      {isAdmin && (
        <div className="settings">
          <h2>Список пользователей</h2>
          <div className="tabl">
            <Table data={data} deleteRow={deleteRow} />
          </div>
          <form onSubmit={handleSubmit} className="add-row-form">
            <h2>Добавить нового пользователя</h2>
            <input
              name="username"
              value={newRow.username}
              onChange={handleInputChange}
              placeholder="Имя пользователя"
              required
            />
            <input
              type="password"
              name="password"
              value={newRow.password}
              onChange={handleInputChange}
              placeholder="Пароль"
              required
            />
            <input
              name="is_staff"
              value={newRow.is_staff}
              onChange={handleInputChange}
              placeholder="Админ - true, Редактор - false"
              required
            />
            <button type="submit" disabled={isAdding}>
              {isAdding ? 'Добавление...' : 'Добавить'}
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
};

export default Users;
