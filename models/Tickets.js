//import mongoose library
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

//create a blogSchema 
const ticketSchema = new mongoose.Schema({
    title: String,
    description: String,
    relatedTicketIds:{type: String, default: uuidv4()},
    assignedToUserId: {type: String, default: uuidv4()},
    status: {
        type: String, 
        default: 'incomplete',
        required: true,
        enum: ['incomplete', 'complete', 'deferred']
    },
    createdAt: { type: Date, default: Date.now },
    createdById: {type: String, default: uuidv4()},
    lastModified: { type: Date, default: Date.now },
    lastUpdatedById: {type: String, default: uuidv4()}
}); 

//register model to collection
const Ticket = mongoose.model("ticket_db", ticketSchema);

//make our model accessible to outside files 
module.exports = Ticket;