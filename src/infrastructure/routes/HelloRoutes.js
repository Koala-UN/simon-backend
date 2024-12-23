const express = require('express');

const router = express.Router();

// Ruta que responde con "Hola Mundo"
router.get('/', (req, res) => {
    try {
        // Caso: Respuesta exitosa
        res.status(200).json({ message: 'Hola Mundo' });
    } catch (error) {
        // Caso: Error inesperado
        res.status(500).json({ error: 'An unexpected error occurred.' });
    }
});

// Ruta de prueba: Error de parámetros (simulado)
router.get('/error', (req, res) => {
    try {
        const { param } = req.query;

        // Caso: Parámetro no proporcionado
        if (!param) {
            return res.status(400).json({ error: 'Missing required parameter: param' });
        }

        // Respuesta exitosa si el parámetro existe
        res.status(200).json({ message: `Received parameter: ${param}` });
    } catch (error) {
        // Caso: Error inesperado
        res.status(500).json({ error: 'An unexpected error occurred.' });
    }
});

module.exports = router;