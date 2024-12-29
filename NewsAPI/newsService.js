require('dotenv').config()

const axios = require('axios')

const API_KEY = process.env.API_KEY
const BASE_URL = process.env.BASE_URL  


async function fetchNews(categoria, idioma, fechaInicio, fechaFin) {
    
    try {
        // Construir el objeto de parámetros dinámicamente
        const params = { apiKey: API_KEY }; // apiKey siempre estará presente

        if (categoria) params.q = categoria;
        if (fechaInicio) params.from = fechaInicio;
        if (fechaFin) params.to = fechaFin;
        if (idioma) params.language = idioma;

        console.log('Parameters for request:', params);
        // Realizar la solicitud a la API
        const response = await axios.get(BASE_URL, { params });
        
        // Devolver las noticias
        return response.data.articles;
    } catch (error) {
        console.error('Error al obtener noticias:', error.message);
    }
}
module.exports = { fetchNews }