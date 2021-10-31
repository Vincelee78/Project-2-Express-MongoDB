const express = require('express');
const cors = require('cors');
require('dotenv').config();
const MongoUtil = require("./MongoUtil.js");
const ObjectId = require('mongodb').ObjectId;
const { response } = require('express');




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


    app.get('/report', async (req, res) => {

        try {
            let db = MongoUtil.getDB();


            let result = await db.collection('reportsData').find().toArray();
            console.log(response)
            res.status(200);
            res.json(result);
        } catch (e) {
            res.status(500);
            res.send({
                'error': "We have encountered an internal server error"
            })
        }
    })

    app.post('/createReport', async (req, res) => {
        try {
            let reportId = req.body.reportId
            let reportTitle = req.body.reportTitle;
            let reportContent = req.body.reportContent;
            let reportReferences = req.body.reportReferences;
            let reportTags = req.body.reportTags;

            let db = MongoUtil.getDB();
            let result = await db.collection('reportsData').insertOne({
                reportTitle, reportContent, reportReferences, reportTags, reportId
            })

            res.status(200);
            res.json(result)
        } catch (e) {
            res.status(500);
            res.json({
                'error': 'We have encountered an internal server error. Please contact admin'
            });

        }

    })

    app.post('/AddRadiologist', async (req, res) => {
        try {
            let radiologistId = req.body.radiologistId
            let radiologistName = req.body.radiologistName;
            let speciality = req.body.speciality;
            let medicalInstitution = req.body.medicalInstitution;
            let email = req.body.email;

            let db = MongoUtil.getDB();
            let result = await db.collection('radiologistsData').insertOne({
                radiologistId, radiologistName, speciality, medicalInstitution, email
            })

            res.status(200);
            res.json(result)
        } catch (e) {
            res.status(500);
            res.json({
                'error': 'We have encountered an internal server error. Please contact admin'
            });

        }

    })

    app.delete('/report/:id', async (req, res) => {
        console.log(req.params.id)
        let db = MongoUtil.getDB();
        let results = await db.collection('reportsData').deleteOne({
            '_id': ObjectId(req.params.id)
        })
        res.status(200);
        res.send(results);
    })



    app.get('/featuredCase', async (req, res) => {
        try {
            let db = MongoUtil.getDB();

            let result = await db.collection('featuredCase').find().toArray();

            res.status(200);
            res.json(result);
        } catch (e) {
            res.status(500);
            res.send({
                'error': "We have encountered an internal server error"
            })
        }
    })

    app.put('/featuredCase/:id', async (req, res) => {

        try {
            // req.body is an object that contains the
            // data sent to the express endpoint
            let signsSymptomsTitle = req.body.signsSymptomsTitle;
            let bodySystems = req.body.bodySystems;
            let gender = req.body.gender;
            let dob = req.body.dob;
            let clinicalHistory = req.body.clinicalHistory;
            let images = req.body.images;
            let modality = req.body.modality;
            let publishedDate = req.body.publishedDate;
            let caseDiscussion = req.body.caseDiscussion;
            let radiologistId = req.body.radiologistId;
            let scientificReferences = req.body.scientificReferences
            let patientID = req.body.patientID


            let db = MongoUtil.getDB();
            let result = await db.collection('featuredCase').updateOne({
                '_id': ObjectId(req.params.id)
            }, {
                '$set': {
                    signsSymptomsTitle, bodySystems, gender, dob, clinicalHistory, images,
                    modality, publishedDate, caseDiscussion, radiologistId, scientificReferences, patientID,
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

        }
    })

    app.get('/patientsDataAllCases', async (req, res) => {
        try {
            let db = MongoUtil.getDB();


            let result = await db.collection('patientsData').find().toArray();
            res.status(200);
            res.json(result);
        } catch (e) {
            res.status(500);
            res.send({
                'error': "We have encountered an internal server error"
            })
        }
    })

    app.get('/featuredCase/:id', async (req, res) => {
        console.log(req.params.id)
        try {

            let db = MongoUtil.getDB();
            let result = await db.collection('featuredCase').findOne({
                '_id': ObjectId(req.params.id)
            });

            // inform the client that the process is successful
            console.log("app get", result)
            res.status(200);
            res.json(result);
        } catch (e) {
            res.status(500);
            res.json({
                'error': "We have encountered an internal server error. Please contact admin"
            });

        }
    })


    app.post('/createNewCase', async (req, res) => {

        try {

            let signsSymptomsTitle = req.body.signsSymptomsTitle;
            let bodySystems = req.body.bodySystems;
            let patientID = req.body.patientID;
            let gender = req.body.gender;
            let dob = req.body.dob;
            let clinicalHistory = req.body.clinicalHistory;
            let images = req.body.images;
            let modality = req.body.modality;
            let publishedDate = req.body.publishedDate;
            let caseDiscussion = req.body.caseDiscussion;
            let radiologistId = req.body.radiologistId;
            let scientificReferences = req.body.scientificReferences


            let db = MongoUtil.getDB();
            let result = await db.collection('patientsData').insertOne({
                signsSymptomsTitle, bodySystems, gender, dob, clinicalHistory, images,
                modality, publishedDate, caseDiscussion, radiologistId, scientificReferences, patientID
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

    app.put('/updateEditedPatientCase/:id', async (req, res) => {
        // assume that we are replacing the document
        let signsSymptomsTitle = req.body.signsSymptomsTitle;
        let bodySystems = req.body.bodySystems;
        let gender = req.body.gender;
        let dob = new Date(req.body.dob);
        let clinicalHistory = req.body.clinicalHistory;
        let images = req.body.images;
        let modality = req.body.modality;
        let publishedDate = req.body.publishedDate;
        let caseDiscussion = req.body.caseDiscussion;
        let radiologistId = req.body.radiologistId;
        let scientificReferences = req.body.scientificReferences
        let patientID = req.body.patientID

        let db = MongoUtil.getDB();
        let results = await db.collection('patientsData').updateOne({
            '_id': ObjectId(req.params.id)
        }, {
            '$set': {
                signsSymptomsTitle, bodySystems, gender, dob, clinicalHistory, images,
                modality, publishedDate, caseDiscussion, radiologistId, scientificReferences, patientID,
            }
        })
        res.status(200);
        res.send(results)
    })

    app.get('/retrieveEditedPatientCase/:id', async (req, res) => {

        try {

            let db = MongoUtil.getDB();
            let result = await db.collection('patientsData').findOne({
                '_id': ObjectId(req.params.id)
            });

            // inform the client that the process is successful

            res.status(200);
            res.json(result);
        } catch (e) {
            res.status(500);
            res.json({
                'error': "We have encountered an internal server error. Please contact admin"
            });
        }
    })

    app.delete('/patientsDataAllCases/:id', async (req, res) => {
        console.log(req.params.id)
        let db = MongoUtil.getDB();
        let results = await db.collection('patientsData').deleteOne({
            '_id': ObjectId(req.params.id)
        })
        res.status(200);
        res.send(results);
    })

    

    app.get('/radiologistDataFeatured', async (req, res) => {
        console.log(req)
        try {
            let db = MongoUtil.getDB();
            // start with an empty critera object

            let result = await db.collection('radiologistsData').find({ radiologistId: { '$regex': '^R03$' } }).toArray();
            console.log(response)
            res.status(200);
            res.json(result);
        } catch (e) {
            res.status(500);
            res.send({
                'error': "We have encountered an internal server error"
            })
        }
    })

    app.get('/allradiologistData', async (req, res) => {
        
        try {
            let db = MongoUtil.getDB();
            // start with an empty critera object

            let result = await db.collection('radiologistsData').find().toArray();
            console.log(response)
            res.status(200);
            res.json(result);
        } catch (e) {
            res.status(500);
            res.send({
                'error': "We have encountered an internal server error"
            })
        }
    })


    app.get('/allRadiologistDataforAllCases', async (req, res) => {

        try {
            let db = MongoUtil.getDB();
            // start with an empty critera object
            // let criteria = {req.query.radiologistId:{'$regex': '^R01$'}};
            // // we fill in the critera depending on whether specific
            // // query string keys are provided
            // // if the `description` key exists in req.query
            // if (req.query.radiologistId) {
            //     criteria['radiologistId'] = {
            //         '$regex': '^R01$',
            //         // '$options': 'i'
            //     }
            // }
            let result = await db.collection('radiologistsData').find().toArray();
                
            
            res.status(200);
            res.json(result);
        } catch (e) {
            res.status(500);
            res.send({
                'error': "We have encountered an internal server error"
            })
        }
    })

    app.get('/searchCases', async (req, res) => {
        let criteria = {};

        if (req.query.search) {
            criteria['$or'] = [
                { signsSymptomsTitle: { $regex: req.query.search, $options: 'i' } },
                { caseDiscussion: { $regex: req.query.search, $options: 'i' } },
                { modality: { $regex: req.query.search, $options: 'i' } },
            ];
        }
        try {
            let db = MongoUtil.getDB();
            let result = await db.collection('patientsData').find(criteria).sort({
                publishedDate: -1,
            })
                .toArray();
            res.status(200);
            res.json(result);


        } catch (e) {
            res.status(500);
            res.send({
                'error': "We have encountered an internal server error"
            })
        }


    })

    app.get('/filterAgeMore60', async (req, res) => {
        let criteria = {
            'dob': {
                $lte: new Date('1961-01-01')

            },
        }

        let projection = {

            'patientID': 0,

        };


        try {
            let db = MongoUtil.getDB();
            let result = await db.collection('patientsData').find(criteria).project(projection).sort({
                publishedDate: -1,
            })
                .toArray();
            res.status(200);
            res.json(result);


        } catch (e) {
            res.status(500);
            res.send({
                'error': "We have encountered an internal server error"
            })
        }


    })


    app.get('/filterAgeLess21', async (req, res) => {
        let criteria = {
            'dob': {
                $gt: new Date('2000-10-31')

            },
        }

        let projection = {

            'patientID': 0,

        };


        try {
            let db = MongoUtil.getDB();
            let result = await db.collection('patientsData').find(criteria).project(projection).sort({
                publishedDate: -1,
            })
                .toArray();
            res.status(200);
            res.json(result);


        } catch (e) {
            res.status(500);
            res.send({
                'error': "We have encountered an internal server error"
            })
        }


    })

    app.get('/modalityUltrasound', async (req, res) => {
        let criteria = {

            'modality': 'Ultrasound',

        };
        let projection = {

            'patientID': 0,

        };

        try {
            let db = MongoUtil.getDB();
            let result = await db.collection('patientsData').find(criteria).project(projection).sort({
                publishedDate: -1,
            })
                .toArray();
            res.status(200);
            res.json(result);


        } catch (e) {
            res.status(500);
            res.send({
                'error': "We have encountered an internal server error"
            })
        }


    })


    app.get('/cardioEndocrineSystem', async (req, res) => {
        let criteria = {

            'bodySystems': {
                '$in': ['Endocrine', 'Cardiovascular']
            }
        };


        try {
            let db = MongoUtil.getDB();
            let result = await db.collection('patientsData').find(criteria).sort({
                publishedDate: -1,
            })
                .toArray();
            res.status(200);
            res.json(result);


        } catch (e) {
            res.status(500);
            res.send({
                'error': "We have encountered an internal server error"
            })
        }


    })

}

main();

// START SERVER
app.listen(process.env.PORT, () => {
    console.log("Server started")
})





