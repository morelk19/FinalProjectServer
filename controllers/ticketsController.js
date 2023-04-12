

const Ticket = require("../models/Tickets");

async function getAllTickets(req, res) {

    //query blogs 
    try {
      const allTickets = await Ticket.find({});
      res.json({tickets: allTickets });
    }catch(e){
      console.log(e);
    }
}

async function createOneTicket(req, res) {
    try {

   
      //parse out fields from POST request
      const title  = req.body.title 
      const description = req.body.description 
      const relatedTicketIds = req.body.relatedTicketIds
      const assignedToUserId = req.body.assignedToUserId
      const status = req.body.status
      const createdById = req.body.createdById
      const lastUpdatedById = req.body.lastUpdatedById
    
  
      //pass fields to new Blog model 
      //notice how it's way more organized and does the type checking for us
      const newTicket = new Ticket({
          title,
          description,
          relatedTicketIds,
          assignedToUserId,
          status,
          createdById,
          lastUpdatedById
      });
  
      //save our new entry to the database 
      const savedData =  await newTicket.save();
      
      //return the successful request to the user 
      res.json({
          success: true,
          tickets: savedData
      });
  
    } catch (e) {
      console.log(typeof e);
      console.log(e);
      res.json({
        error: e.toString(),
      });
    }
  }

async function getOneTicket(req, res, next) {

    console.log(req.params)

    let oneTicketPost;

    try {
        oneTicketPost = await Ticket.findOne({_id: req.params.id});
        console.log(oneTicketPost);
    } catch (error) {
        console.log(error);
    }
    res.json({
        sucess: true,
        oneTicketPost: oneTicketPost
    })
}

async function updateOneTicket(req,res){
    const entryId = req.params.id;

    try {
        await Ticket.updateOne({ _id: entryId }, req.body);
    } catch (err) {
        console.log(err);
        throw err;  
    }
    res.json({
        success: true,
        message: `ticket entry id ${entryId} updated`
    })
}

async function deleteOneTicket(req,res){
    const entryId = req.params.id;
    try {
        await Ticket.deleteOne({_id: entryId});
    } catch (err) {
        console.log(err);
        throw err;  
    }

    res.json({
        success: true
    })
}

module.exports = {
    createOneTicket,
    deleteOneTicket,
    getAllTickets,
    getOneTicket,
    updateOneTicket
};