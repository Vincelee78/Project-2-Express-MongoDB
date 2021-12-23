const express = require('express');
const cors = require('cors');
require('dotenv').config();
const MongoUtil = require("./MongoUtil.js");
const ObjectId = require('mongodb').ObjectId;
const { response } = require('express');
const yup = require('yup');





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
    // connect to radiology_cases database in mongoDB
    await MongoUtil.connect(process.env.MONGO_URL, 'radiology_cases');

    // retrieve data from report endpoint url from reportsData collection
    app.get('/report', async (req, res) => {

        try {
            let db = MongoUtil.getDB();


            let result = await db.collection('reportsData').find().toArray();

            res.status(200);
            res.json(result);
            // display server error if unable to get data from mongoDB
        } catch (e) {
            res.status(500);
            res.send({
                'error': "We have encountered an internal server error"
            })
        }
    })

    // send data from server side using endpoint url to reportsData collection in mongoDB and insert a new document
    app.post('/createReport', async (req, res) => {
        let formSchema = yup.object().shape({
            reportId: yup.string().required(),
            reportTags: yup.array().of(yup.string()).required(),
            reportContent: yup.string().required(),
            reportReferences: yup.string().required(),
            reportTitle: yup.string().required(),
          });
        try {
            await formSchema.validate(req.body)

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

            // display server error if unable to send data to mongoDB
        } catch (e) {
            res.status(500);
            res.json({
                'error': e.message
            });

        }

    })

    // send data from server side using endpoint url to radiologistsData collection in mongoDB and insert a new document
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

            // display server error if unable to send data to mongoDB
        } catch (e) {
            res.status(500);
            res.json({
                'error': 'We have encountered an internal server error. Please contact admin'
            });

        }

    })

    // send data to mongoDB in reportsData collection from server side to delete the document by its ObjectId in mongoDB
    app.delete('/report/:id', async (req, res) => {

        let db = MongoUtil.getDB();
        let results = await db.collection('reportsData').deleteOne({
            '_id': ObjectId(req.params.id)
        })
        res.status(200);
        res.send(results);
    })


    // retrieve data from featuredCase endpoint url from reportsData collection in mongoDB
    app.get('/featuredCase', async (req, res) => {
        try {
            let db = MongoUtil.getDB();

            let result = await db.collection('featuredCase').find().toArray();

            res.status(200);
            res.json(result);

            // display server error if unable to get data from mongoDB
        } catch (e) {
            res.status(500);
            res.send({
                'error': "We have encountered an internal server error"
            })
        }
    })

    // update the document based on its Id in the featuredCase collection in mongoDB
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
                // update document based on its objectId
                '_id': ObjectId(req.params.id)
            }, {
                // set these fields below to the new modified fields
                '$set': {
                    signsSymptomsTitle, bodySystems, gender, dob, clinicalHistory, images,
                    modality, publishedDate, caseDiscussion, radiologistId, scientificReferences, patientID,
                }
            })
            // inform the client that the process is successful
            res.status(200);
            res.json(result);
            // display error if unable to replace document data in mongoDB
        } catch (e) {
            res.status(500);
            res.json({
                'error': "We have encountered an internal server error. Please contact admin"
            });

        }
    })

    // retrieve data from all cases endpoint url from patientsData collection in mongoDB
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

    // retrieve updated modified data based on the document objectId in featuredCase collection after editing(app.put) in 
    //mongoDB after the data has been updated
    app.get('/featuredCase/:id', async (req, res) => {

        try {

            let db = MongoUtil.getDB();
            let result = await db.collection('featuredCase').findOne({
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

    // send data from server side using endpoint url to patientsData collection in mongoDB and insert a new document
    app.post('/createNewCase', async (req, res) => {
        let formSchema = yup.object().shape({
            signsSymptomsTitle: yup.string().required(),
            bodySystems: yup.array().of(yup.string()).required(),
            patientID: yup.string().required(),
            gender: yup.string().required(),
            dob: yup.string().required(),
            clinicalHistory: yup.string().required(),
            images: yup.string().required(),
            modality: yup.string().required(),
            publishedDate: yup.string().required(),
            caseDiscussion: yup.string().required(),
            radiologistId: yup.string().required(),
            scientificReferences: yup.string().required(),
          });
          
        try {
            await formSchema.validate(req.body)


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
                'error': e.message
            });
            console.log(e);
        }
    })

    // update the document based on its objectId in the patientsData collection in mongoDB
    app.put('/updateEditedPatientCase/:id', async (req, res) => {

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

    // retrieve updated modified data based on the document objectId in patientsData collection after editing(app.put) in 
    //mongoDB after the data has been updated
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

    // send data to mongoDB in patientdsData collection from server side to delete the document by its ObjectId in mongoDB
    app.delete('/patientsDataAllCases/:id', async (req, res) => {
        console.log(req.params.id)
        let db = MongoUtil.getDB();
        let results = await db.collection('patientsData').deleteOne({
            '_id': ObjectId(req.params.id)
        })
        res.status(200);
        res.send(results);
    })

    // retrieve the data for the patients info details field in the featured case 
    app.get('/patientInfoFeatured', async (req, res) => {

        try {
            let db = MongoUtil.getDB();

            // retrieve the document in patientsInfo collection 
            let result = await db.collection('patientsinfo').find().toArray();

            res.status(200);
            res.json(result);
        } catch (e) {
            res.status(500);
            res.send({
                'error': "We have encountered an internal server error"
            })
        }
    })

    // retrieve the data for the radiologist details field in the featured case 
    app.get('/radiologistDataFeatured', async (req, res) => {

        try {
            let db = MongoUtil.getDB();

            // retrieve the document in radiologistsData collection which has the radiologistId as R03
            let result = await db.collection('radiologistsData').find({ radiologistId: { '$regex': '^R03$' } }).toArray();

            res.status(200);
            res.json(result);
        } catch (e) {
            res.status(500);
            res.send({
                'error': "We have encountered an internal server error"
            })
        }
    })

    // retrieve all the radiologist data from the radiologistsData collection to display in the radiologists information page in 
    // React
    app.get('/allradiologistData', async (req, res) => {

        try {
            let db = MongoUtil.getDB();

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

    // retrieve all the radiologist data from the radiologistsData collection to display in the radiologist ID field in the all 
    // cases page in React
    app.get('/allRadiologistDataforAllCases', async (req, res) => {

        try {
            let db = MongoUtil.getDB();
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

    // retrieve all patient cases based on the search criteria
    app.get('/searchCases', async (req, res) => {
        let criteria = {};

        if (req.query.search) {
            // search for the user's keywords in 3 fields, signsSymptomsTitle or caseDiscussion or modality
            criteria['$or'] = [
                { signsSymptomsTitle: { $regex: req.query.search, $options: 'i' } },
                { caseDiscussion: { $regex: req.query.search, $options: 'i' } },
                { modality: { $regex: req.query.search, $options: 'i' } },
            ];
        }
        try {
            let db = MongoUtil.getDB();
            let result = await db.collection('patientsData').find(criteria).sort({
                // display the results by the most recent published date
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

    // retrieve the data from patientsData collection to filter based on patient's age more than 60
    app.get('/filterAgeMore60', async (req, res) => {
        let criteria = {
            // any date less than or equal to year 1960 is more than 60 years old
            'dob': {
                $lte: new Date('1961-01-01')

            },
        }
        // project all fields except the patient ID
        let projection = {

            'patientID': 0,

        };


        try {
            let db = MongoUtil.getDB();
            let result = await db.collection('patientsData').find(criteria).project(projection).sort({
                // display the results by the most recent published date
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

    // retrieve the data from patientsData collection to filter based on patient's age less than 21
    app.get('/filterAgeLess21', async (req, res) => {
        let criteria = {
            // any date greater than year 2000 is less than 21 years old
            'dob': {
                $gt: new Date('2000-10-31')

            },
        }

        // project all fields except the patient ID
        let projection = {

            'patientID': 0,

        };


        try {
            let db = MongoUtil.getDB();
            let result = await db.collection('patientsData').find(criteria).project(projection).sort({
                // display the results by the most recent published date
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

    // retrieve the data from patientsData collection to filter based on all ultrasound cases
    app.get('/modalityUltrasound', async (req, res) => {
        let criteria = {
            // show all cases if modality is ultrasound
            'modality': 'Ultrasound',

        };
        let projection = {
            // project all fields except the patient ID
            'patientID': 0,

        };

        try {
            let db = MongoUtil.getDB();
            let result = await db.collection('patientsData').find(criteria).project(projection).sort({
                // display the results by the most recent published date
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

    // retrieve the data from patientsData collection to filter based on all cardiovascular or endocrine system 
    // in the bodysystems array
    app.get('/cardioEndocrineSystem', async (req, res) => {
        let criteria = {
            // select all cases with bodysystems array that has endocrine or cardiovascular in its array
            'bodySystems': {
                '$in': ['Endocrine', 'Cardiovascular']
            }
        };


        try {
            let db = MongoUtil.getDB();
            let result = await db.collection('patientsData').find(criteria).sort({
                // display the results by the most recent published date
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
app.listen(6000, () => {
    console.log("Server started")
})





