// const MongoClient = require('mongodb').MongoClient;


// // global variable is to store the database
// let _db;

// async function connect(url, dbname) {
//     let client = await MongoClient.connect(url, {
//         useUnifiedTopology: true
//     })
//     _db = client.db(dbname);
//     console.log("Database connected");
// }

// function getDB() {
//     return _db;
// }

// module.exports = {
//     connect, getDB
// }

// const MongoClient = require('mongodb').MongoClient;

// // global variable to store the database
// let _db;

// async function connect() {
//     const url = process.env.MONGO_URL;
//     const dbName = process.env.DB_NAME;

//     if (!url) {
//         throw new Error('MongoDB connection string is not defined in the environment variables.');
//     }

//     let client = await MongoClient.connect(url, {
//         useUnifiedTopology: true
//     });
//     _db = client.db(dbName);
//     console.log("Database connected");
// }

// function getDB() {
//     return _db;
// }

// module.exports = {
//     connect, getDB
// }


const MongoClient = require('mongodb').MongoClient;

let _db;

async function connect(url, dbname) {
    if (!url) {
        throw new Error('MongoDB connection string is not defined in the environment variables.');
    }
    let client = await MongoClient.connect(url, {
        useUnifiedTopology: true
    });
    _db = client.db(dbname);
    console.log("Database connected");
}

function getDB() {
    return _db;
}

module.exports = {
    connect, getDB
};

