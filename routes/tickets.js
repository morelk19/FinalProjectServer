var express = require("express");
var router = express.Router();


const ticketsController = require('../controllers/ticketsController');

//CRUD OPERATIONS 
router.get('/all',ticketsController.getAllTickets);
router.post("/create-one", ticketsController.createOneTicket);
router.get("/get-one/:id", ticketsController.getOneTicket);
router.put("/update-one/:id", ticketsController.updateOneTicket);
router.delete("/delete-one/:id", ticketsController.deleteOneTicket);

module.exports = router;