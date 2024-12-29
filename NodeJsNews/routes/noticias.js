const express = require('express')
const router = express.Router()
const Noticia = require('../models/noticia')
const mongoose = require('mongoose')

module.exports = router

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
router.get('/filtro', getNoticiasFiltradas, (req, res) => {
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


async function getNoticiasFiltradas(req, res, next) {
    try {
        const { categoria, fechaInicio, fechaFin, autor, idioma } = req.query;

        // Construir la consulta dinámicamente
        const query = {};

        // Agregar parámetros si están presentes
        if (categoria) {
            query.categoria = new RegExp(categoria, 'i'); 
        }
        if (idioma) {
            query.idioma = new RegExp(idioma, 'i'); 
        }
        if (autor) {
            query.autor = new RegExp(autor, 'i'); 
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
            return res.status(404).json({ message: 'No se encontraron noticias con los criterios proporcionados' });
        }

        res.json(noticias);
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