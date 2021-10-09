const express = require('express');
const cors = require('cors');
require('dotenv').config();
const MongoUtil = require("./MongoUtil.js");
const ObjectId = require('mongodb').ObjectId;
MONGO_URL='mongodb+srv://root:rotiprata123@cluster0.ii2xi.mongodb.net/?retryWrites=true&w=majority'



/* 1. SETUP EXPRESS */
let app = express();

// important for RESTFul API:

// allow Express to process JSON payload
// in POST, PUT and PATCH requests
app.use(express.json());

// enable CORS so that our React applications
// hosted on a domain name can use it
app.use(cors());

async function main() {

await MongoUtil.connect(process.env.MONGO_URL, 'radiology_cases');

app.get('/patientsData', (req, res) => {
    res.json({
        "message": "hello world"
    })
})

app.post('/patientsData', async (req, res) => {

    try {
        // req.body is an object that contains the
        // data sent to the express endpoint
        let gender = req.body.gender;
        let clinicalHistory = req.body.clinicalHistory;
        // check if the datetime key exists in the req.body object
        // if it does, create a new Date object from it
        // or else, default to today's date
        // let datetime = req.body.datetime ? new Date(req.body.datetime) : new Date();

        let db = MongoUtil.getDB();
        let result = await db.collection('patientsData').insertOne({
            gender, clinicalHistory
        })

           // inform the client that the process is successful
           res.status(200);
           res.json(result);
       } catch (e) {
           res.status(500);
           res.json({
               'error': "We have encountered an interal server error. Please contact admin"
           });
           console.log(e);
       }
   })

   app.put('/patientsData/:id', async(req,res)=>{
    // assume that we are replacing the document
    let gender = req.body.gender;
    let clinicalHistory = req.body.clinicalHistory;
    // let datetime = req.body.datetime ? new Date(req.body.datetime) : new Date();

    let db = MongoUtil.getDB();
    let results = await db.collection('patientsData').updateOne({
        '_id': ObjectId(req.params.id)
    },{
        '$set':{
            gender, clinicalHistory
        }
    })
    res.status(200);
    res.send(results)
})

app.delete('/patientsData/:id', async(req,res) => {
    let db = MongoUtil.getDB();
    let results = await db.collection('patientsData').remove({
        '_id': ObjectId(req.params.id)
    })
    res.status(200);
    res.send(results);
})

}
main();

// START SERVER
app.listen(5000, ()=>{
    console.log("Server started")
})


 


