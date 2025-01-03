const express = require('express')
const router = express.Router()
const Noticia = require('../models/noticia')
const mongoose = require('mongoose')
const { fetchNews } = require('../../NewsAPI/newsService')

const axios = require("axios")

module.exports = router

router.post('/importar', async (req, res) => {
    try {
        const { categoria, idioma, fechaInicio, fechaFin } = req.body;
        const noticias = await fetchNews(categoria, idioma, fechaInicio, fechaFin);
        
        console.log('Noticias importadas:', noticias.length);
        console.log('Noticias:', noticias[0]);
        // Guardar las noticias en la base de datos
        for (const noticia of noticias) {
            const noticiaCompleta = {
                titulo: noticia.title || 'Sin título',  
                categoria: categoria || 'Sin categoría',
                idioma: idioma || 'Sin idioma', 
                fuente: noticia.source.name || 'Sin fuente',
                autor: noticia.author || 'Autor anonimo',
                fecha: noticia.publishedAt || new Date().toISOString(),
                url: noticia.url || 'URL no disponible' 
            }
            const existe = await Noticia.findOne({ url: noticia.url });
            if (!existe) {
                const nuevaNoticia = new Noticia(noticiaCompleta);
                await nuevaNoticia.save();
            }
        }

        res.json({ message: 'Noticias importadas con éxito' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// Cogemos todas las noticias
router.get('/', async (req, res) => {
    try {
        const noticias = await Noticia.find()
        res.json(noticias)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Busqueda personalizada
router.post('/filtro', getNoticiasFiltradas, (req, res) => {
    res.send(res.noticia)
})

// Creamos una noticia
router.post('/', async (req, res) => {
   const noticia = new Noticia({
       titulo: req.body.titulo,
       fuente: req.body.fuente,
       categoria: req.body.categoria,
       url: req.body.url,
       fecha: req.body.fecha,
       autor: req.body.autor,
       idioma: req.body.idioma
   }) 
    try {
         const newNoticia = await noticia.save()
         res.status(201).json(newNoticia)
    } catch (err) {
         res.status(400).json({ message: err.message })
    }
         

})

// Borramos una noticia
router.delete('/:id', deleteNoticia, (req, res) => {
    res.send("Noticia eliminada")
})

// Borramos todas las noticias por categoria
router.delete('/categoria/:categoria', async (req, res) => {
    try {
        const categoria = req.params.categoria
        const noticias = await Noticia.find({categoria: categoria})
    
        if (noticias.length === 0) {
            return res.status(404).json({ message: 'No se encontraron noticias con la categoría proporcionada' });
        }
        await Noticia.deleteMany({categoria: categoria})
        res.json({ message: `${noticias.length} Noticias eliminadas con éxito` });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


async function getNoticiasFiltradas(req, res, next) {
    try {
        const { categoria, fechaInicio, fechaFin, idioma } = req.body;

        // Construir la consulta dinámicamente
        const query = {};

        if (categoria) {
            query.categoria = new RegExp(categoria, 'i');
        }
        if (idioma) {
            query.idioma = new RegExp(idioma, 'i');
        }
        if (fechaInicio || fechaFin) {
            query.fecha = {};
            if (fechaInicio) {
                query.fecha.$gte = new Date(fechaInicio);
            }
            if (fechaFin) {
                query.fecha.$lte = new Date(fechaFin);
            }
        }

        const noticias = await Noticia.find(query);

        if (noticias.length === 0) {
            console.log("No se encontraron noticias. Intentando importar...");

            const importarParams = { categoria, idioma, fechaInicio, fechaFin };
            const url = `http://localhost:3000/news/importar`;

            try {
                // Llamar a la función de importación
                const importarResponse = await axios.post(url, importarParams);

                if (importarResponse.data.message === "Noticias importadas con éxito") {
                    // Volver a buscar las noticias después de importar
                    const noticiasActualizadas = await Noticia.find(query);
                    return res.json({
                        message: "Noticias no encontradas localmente. Noticias importadas con éxito.",
                        importarResult: importarResponse.data,
                        noticias: noticiasActualizadas,
                    });
                } else {
                    return res.json({
                        message: "No se pudieron importar las noticias.",
                        importarResult: importarResponse.data,
                    });
                }
            } catch (err) {
                return res.status(500).json({ message: err.message });
            }
        }

        return res.json(noticias); // Enviar las noticias encontradas
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}



async function deleteNoticia(req, res) {
    try {
        const id = req.params.id;

        // Verifica si el ID tiene un formato válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID no válido' });
        }

        // Buscar y eliminar la noticia
        const noticia = await Noticia.findByIdAndDelete(id);

        if (!noticia) {
            return res.status(404).json({ message: 'Noticia no encontrada' });
        }

        res.json({ message: 'Noticia eliminada con éxito' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}