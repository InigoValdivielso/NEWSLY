const { urlencoded } = require('express')
const mongoose = require('mongoose')

const noticiaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    fuente: {
        type: String
    },
    url: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true,
        
    },
    autor: {
        type: String,
        required: true
    },
    idioma: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Noticia', noticiaSchema)

