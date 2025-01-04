const express = require('express');
const TableController = require('../controllers/TableController');
const router = express.Router();

const tableController = new TableController();

router.post('/', tableController.createTable);
router.patch('/:id', tableController.updateTable);
router.get('/:id', tableController.getTableById);
router.get('/', tableController.getAllTables);
router.delete('/:id', tableController.deleteTable);
module.exports = router;