const express = require('express');
const cors = require('cors');
require('dotenv').config();
const MongoUtil = require("./MongoUtil.js");
const ObjectId = require('mongodb').ObjectId;




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

// app.get('/patientsData', async (req, res) => {
//     try {
//     let db = MongoUtil.getDB();
//     let result = await db.collection('patientsData');
    
//         res.status(200);
//         res.json(result);
//        } catch (e) {
//            res.status(500);
//            res.json({
//                'error': "We have encountered an interal server error. Please contact admin"
//            });
//            console.log(e);
//     }
// })

app.get('/patientsData1', async (req, res) => {
    try {
        let db = MongoUtil.getDB();
        // start with an empty critera object
        let criteria = {};
        // we fill in the critera depending on whether specific
        // query string keys are provided
        // if the `description` key exists in req.query
        if (req.query.signsSymptomsTitle) {
            criteria['signsSymptomsTitle'] = {
                '$regex': req.query.signsSymptomsTitle,
                '$options': 'i'
            }
        }
        if (req.query.studentsTagged) {
            criteria['studentsTagged'] = {
                '$in': [req.query.studentsTagged]
            }
        }
        // console.log(criteria)
        let result = await db.collection('patientsData').find().toArray();
        res.status(200);
        res.json(result);
    } catch (e) {
        res.status(500);
        res.send({
            'error':"We have encountered an internal server error"
        })         
    }
})


app.get('/featuredCase', async (req, res) => {
    try {
        let db = MongoUtil.getDB();
        
        // start with an empty critera object
        // let criteria = {};
        // we fill in the critera depending on whether specific
        // query string keys are provided
        // if the `description` key exists in req.query
        // if (req.query.signsSymptomsTitle) {
        //     criteria['signsSymptomsTitle'] = {
        //         '$regex': req.query.signsSymptomsTitle,
        //         '$options': 'i'
        //     }
        // }
        // if (req.query.studentsTagged) {
        //     criteria['studentsTagged'] = {
        //         '$in': [req.query.studentsTagged]
        //     }
        // }
        // console.log(criteria)
        let result = await db.collection('featuredCase').find().toArray();
        console.log(result)
        res.status(200);
        res.json(result);
    } catch (e) {
        res.status(500);
        res.send({
            'error':"We have encountered an internal server error"
        })         
    }
})

app.put('/featuredCase/:id', async (req, res) => {
    // console.log(req.body)
    try {
        // req.body is an object that contains the
        // data sent to the express endpoint
        let signsSymptomsTitle = req.body.signsSymptomsTitle;
        let bodySystems = req.body.bodySystems;
        let gender=req.body.gender;
        let dob=req.body.dob;
        let clinicalHistory=req.body.clinicalHistory;
        let images=req.body.images;
        let modality=req.body.modality;
        let publishedDate=req.body.publishedDate;
        let caseDiscussion=req.body.caseDiscussion;
        let radiologistId=req.body.radiologistId;
        let scientificReferences=req.body.scientificReferences
        let patientID=req.body.patientID
        // let ID=req.body._id

        // check if the datetime key exists in the req.body object
        // if it does, create a new Date object from it
        // or else, default to today's date
        // let datetime = req.body.datetime ? new Date(req.body.datetime) : new Date();

        let db = MongoUtil.getDB();
        let result = await db.collection('featuredCase').updateOne({
            '_id': ObjectId(req.params.id)
        },{
            '$set':{
            signsSymptomsTitle, bodySystems, gender, dob, clinicalHistory, images, 
            modality, publishedDate, caseDiscussion, radiologistId, scientificReferences,patientID,
            }
        })
           // inform the client that the process is successful
           res.status(200);
           res.json(result);
       } catch (e) {
           res.status(500);
           res.json({
               'error': "We have encountered an internal server error. Please contact admin"
           });
        //    console.log(result);
       }
   })

   app.get('/featuredCase/:id', async (req, res) => {
    console.log(req.params.id)
    try {
        // req.body is an object that contains the
        // data sent to the express endpoint
        // let signsSymptomsTitle = req.body.signsSymptomsTitle;
        // let bodySystems = req.body.bodySystems;
        // let gender=req.body.gender;
        // let dob=req.body.dob;
        // let clinicalHistory=req.body.clinicalHistory;
        // let images=req.body.images;
        // let modality=req.body.modality;
        // let publishedDate=req.body.publishedDate;
        // let caseDiscussion=req.body.caseDiscussion;
        // let radiologistId=req.body.radiologistId;
        // let scientificReferences=req.body.scientificReferences
        // let patientID=req.body.patientID
        // let ID=req.body._id

        // let criteria = {}

        // check if the datetime key exists in the req.body object
        // if it does, create a new Date object from it
        // or else, default to today's date
        // let datetime = req.body.datetime ? new Date(req.body.datetime) : new Date();

        let db = MongoUtil.getDB();
        let result = await db.collection('featuredCase').findOne({
            '_id': ObjectId(req.params.id)
        });
        // {
        //     '$set':{
        //     signsSymptomsTitle, bodySystems, gender, dob, clinicalHistory, images, 
        //     modality, publishedDate, caseDiscussion, radiologistId, scientificReferences,patientID,
        //     }
        // }
        
           // inform the client that the process is successful
           console.log("app get", result)
           res.status(200);
           res.json(result);
       } catch (e) {
           res.status(500);
           res.json({
               'error': "We have encountered an internal server error. Please contact admin"
           });
        //    console.log(result);
       }
   })

app.post('/patientsData', async (req, res) => {

    try {
        // req.body is an object that contains the
        // data sent to the express endpoint
        let signsSymptomsTitle = req.body.signsSymptomsTitle;
        let bodySystems = req.body.bodySystems;
        let patientId=req.body.patientId;
        let gender=req.body.gender;
        let dob=req.body.dob;
        let clinicalHistory=req.body.clinicalHistory;
        let images=req.body.images;
        let modality=req.body.modality;
        let publishedDate=req.body.publishedDate;
        let caseDiscussion=req.body.caseDiscussion;
        let radiologistId=req.body.radiologistId;
        let scientificReferences=req.body.scientificReferences

        // check if the datetime key exists in the req.body object
        // if it does, create a new Date object from it
        // or else, default to today's date
        // let datetime = req.body.datetime ? new Date(req.body.datetime) : new Date();

        let db = MongoUtil.getDB();
        let result = await db.collection('patientsData').insertOne({
            signsSymptomsTitle, bodySystems, gender, dob, clinicalHistory, images, 
            modality, publishedDate, caseDiscussion, radiologistId, scientificReferences
        })

           // inform the client that the process is successful
           res.status(200);
           res.json(result);
       } catch (e) {
           res.status(500);
           res.json({
               'error': "We have encountered an internal server error. Please contact admin"
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

app.delete('/patientsData1/:id', async(req,res) => {
    console.log(req.params.id)
    let db = MongoUtil.getDB();
    let results = await db.collection('patientsData').deleteOne({
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


 


