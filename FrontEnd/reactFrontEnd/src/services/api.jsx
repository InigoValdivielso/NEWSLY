import axios from 'axios';
import { data } from 'react-router-dom';

// Configuración base de Axios
const api = axios.create({
    baseURL: 'http://localhost:2000/api', // Cambia esta URL por la de tu API Gateway
    headers: {
        'Content-Type': 'application/json',
    },
});

// Obtener usuarios
export const getUsers = async () => {
  try {
      const response = await api.get('/python/users');
      return response.data;
  } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
  }
};

// Registrar un nuevo usuario
export const registerUser = async (user) => {
  try {
      const response = await api.post('/python/register', user);
      return response.data;
  } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
  }
};

// Actualizar un usuario
export const updateUser = async (user) => {
    console.log("User:", user);
  try {
    const token = sessionStorage.getItem("token"); // Obtén el token de sessionStorage
    if (!token) throw new Error("Token no encontrado");
      const response = await api.put('python/users', user, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return response.data;
  } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
  }
};

// Eliminar un usuario
export const deleteUser = async (user, token) => {
  try {
      const response = await api.delete('/users', {
          data: user,
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return response.data;
  } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
  }
};

// Inicio de sesión
export const login = async (username, password) => {
  try {
      const response = await api.post('/python/login', { username, password });
      return response.data; // Retorna el token si el inicio de sesión es exitoso
  } catch (error) {
      console.error('Error al iniciar sesión:', error.response?.data || error.message);
      throw error;
  }
};

// Verificar token
export const verifyToken = async () => {
  try {
    const token = sessionStorage.getItem("token"); // Obtén el token de sessionStorage
    if (!token) throw new Error("Token no encontrado");
      const response = await api.post('python/verify/token', null, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return response.data; // Retorna los datos decodificados del token
  } catch (error) {
      console.error('Error al verificar el token:', error.response?.data || error.message);
      throw error;
  }
};

// Obtener todos los favoritos del usuario
export const getFavorites = async () => {
  try {
    const token = sessionStorage.getItem("token"); // Obtén el token de sessionStorage
    if (!token) throw new Error("Token no encontrado");
      const response = await api.get('python/favorites', {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return response.data; // Lista de favoritos
  } catch (error) {
      console.error('Error al obtener los favoritos:', error.response?.data || error.message);
      throw error;
  }
};

// Agregar un favorito
export const addFavorite = async (categoria, token) => {
  try {
    const token = sessionStorage.getItem("token"); // Obtén el token de sessionStorage
    if (!token) throw new Error("Token no encontrado");
      const response = await api.post(
          'python/favorites',
          { categoria },
          {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          }
      );
      return response.data; // Confirmación de adición
  } catch (error) {
      console.error('Error al agregar el favorito:', error.response?.data || error.message);
      throw error;
  }
};

// Eliminar un favorito
export const deleteFavorite = async (categoria, token) => {
  try {
      const response = await api.delete('/favorites', {
          headers: {
              Authorization: `Bearer ${token}`,
          },
          data: { categoria }, // El cuerpo de la solicitud DELETE
      });
      return response.data; // Confirmación de eliminación
  } catch (error) {
      console.error('Error al eliminar el favorito:', error.response?.data || error.message);
      throw error;
  }
};

// Importar noticias desde NewsAPI
export const importarNoticias = async (data, token) => {
  try {
      const response = await api.post('/noticias/importar', data, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return response.data; // Confirmación de importación
  } catch (error) {
      console.error('Error al importar noticias:', error.response?.data || error.message);
      throw error;
  }
};

// Obtener todas las noticias
export const getNoticias = async () => {
  try {
      const response = await api.get('express/news');
      return response.data; // Lista de noticias
  } catch (error) {
      console.error('Error al obtener las noticias:', error.response?.data || error.message);
      throw error;
  }
};

// Filtrar noticias
export const getNoticiasFiltradas = async (filtros) => {
    try {
        console.log('Filtros:', filtros);
        const response = await api.post('express/news/filtro', filtros, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        return response.data; // Noticias filtradas
      } catch (error) {
        console.error('Error al filtrar noticias:', error.response?.data || error.message);
        throw error;
      }
};
// Borrar el token del almacenamiento de sesión
export const clearAuthToken = () => {
    sessionStorage.removeItem('token');  
};

// Crear una nueva noticia
export const crearNoticia = async (data, token) => {
  try {
      const response = await api.post('/noticias', data, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return response.data; // Noticia creada
  } catch (error) {
      console.error('Error al crear noticia:', error.response?.data || error.message);
      throw error;
  }
};

// Eliminar una noticia por ID
export const eliminarNoticia = async (id, token) => {
  try {
      const response = await api.delete(`/noticias/${id}`, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return response.data; // Confirmación de eliminación
  } catch (error) {
      console.error('Error al eliminar noticia:', error.response?.data || error.message);
      throw error;
  }
};

// Eliminar noticias por categoría
export const eliminarNoticiasPorCategoria = async (categoria, token) => {
  try {
      const response = await api.delete(`/noticias/categoria/${categoria}`, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return response.data; // Confirmación de eliminación
  } catch (error) {
      console.error('Error al eliminar noticias por categoría:', error.response?.data || error.message);
      throw error;
  }
};