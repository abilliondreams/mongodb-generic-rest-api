const upload = require("./upload");
const express = require("express");
const {nanoid} = require('nanoid');
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const WriteConcern = require("mongodb").WriteConcern;
const databasename = 'ecosystem';
const csv = require('csv-reader');
var Es = require('event-stream');
var Fs = require('fs');
const fastcsv = require("fast-csv");
require("dotenv").config();
const url = process.env.DB_CONNECTION_STRING

const idLength = 8;
/**
 * @swagger
 * components:
 *  schemas:
 *   AppError:
 *    type: object
 *    properties:
 *      code:
 *        type: integer
 *        format: int32
 *      reason:
 *        type: string
 *      message:
 *        type: string
 *   Ids:
 *    required:
 *    - ids
 *    type: array    
 *    description: 'Ids of records'
 *    items:
 *      type: string
 *    example: ["A00000000","A00070000"]
 *   filter:
 *    type: object    
 *    description: 'query to filter records'
 *    properties:
 *      field:
 *          type: object
 *          description: 'filter condition'
 *    example: 
 *      'UWI' : { '$in' : ["A00000000","A00070000"]}
 *   record:
 *    type: object    
 *    description: 'records to insert'
 *    properties:
 *      id:
 *          type: string
 *          description: 'unique identifier'
 *      name:
 *          type: string
 *          description: 'name'
 *    example: 
 *      id : A00070001
 *      UWI : A00070001
 *      Source : PI
 *      API Number : A00070001
 *      Operator Name : 'OCCIDENTAL PERMIAN LTD'
 *      Operator City : HOUSTON
 *      Current Operator Name : OCCIDENTAL PERMIAN LTD
 *      Current Operator City : HOUSTON
 *      Lease Name :  CURTIS RANCH SOUTH
 *      Well Num :  443SH
 *   records:
 *    type: array    
 *    description: 'records to update or insert'
 *    items:
 *      $ref: '#/components/schemas/record'  
 */

/**
 * @swagger
 * /api/v1/collection/{collection}/all:
 *  get:
 *    tags: [Collection]
 *    summary: Get all records of a collection.
 *    description: Get all records of a collection.
 *    parameters:
 *      - in: path
 *        name: collection
 *        required: true
 *        schema:
 *          type: string
 *        description: Name of collection. 
 *      - in: query
 *        name: offset
 *        required: true
 *        schema:
 *          type: integer
 *        description: Page offset. 
 *      - in: query
 *        name: limit
 *        required: true
 *        schema:
 *          type: integer
 *        description: Number of record to fetch. 
 *    responses: 
 *      200:
 *        description: Collection is obtained 
 *      401:
 *        description: User is not authorized.
 *      500: 
 *         description: Server error
 *    security:
 *      - bearerAuth: []
 */
router.get('/:collection/all', (req,res) => {

    MongoClient.connect(url).then((client) => {
        
        const connect = client.db(databasename);
        skip  = req.query.offset;
        limit = req.query.limit;
         // New Collection                
        const collections = connect.collection(req.params.collection)
        collections.find()
        .skip(+skip)
        .limit(+limit)
        .toArray(function(err, items) {
                if (err) {
                    console.log(err)
                  res.status(400).send("Error fetching listings!");
               } else {                
                  res.json(items);
                }
              });
                  
        }).catch((err) => {
          
            // Handling the error 
            console.log(err);
            return res.status(400).send("Error fetching listings!");
        }) 

});

/**
 * @swagger
 * /api/v1/collection/{collection}/search:
 *  post:
 *    tags: [Collection]
 *    summary: Get records from a collection.
 *    description: Get records from a collection.
 *    parameters:
 *      - in: path
 *        name: collection
 *        required: true
 *        schema:
 *          type: string
 *        description: Name of collection. 
 *      - in: query
 *        name: offset
 *        required: true
 *        schema:
 *          type: integer
 *        description: Page offset. 
 *      - in: query
 *        name: limit
 *        required: true
 *        schema:
 *          type: integer
 *        description: Number of record to fetch. 
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/filter'
 *    responses: 
 *      200:
 *        description: Collection is obtained 
 *      401:
 *        description: User is not authorized.
 *      500: 
 *         description: Server error
 *    security:
 *      - bearerAuth: []
 */
router.post('/:collection/search', (req,res) => {

    skip  = req.query.offset;
    limit = req.query.limit;
    //console.log(req.params.id);
    MongoClient.connect(url).then((client) => {
  
        const connect = client.db(databasename);
          
            // New Collection                
        const collections = connect.collection(req.params.collection)
        collections.find(req.body)
        .toArray(function(err, items) {
                if (err) {
                    console.log(err)
                  res.status(400).send("Error fetching listings!");
               } else {                
                  res.json(items);
                }
              });
                  
        }).catch((err) => {
          
            // Handling the error 
            console.log(err);
            return res.status(400).send("Error fetching listings!");
        })       

});


/**
 * @swagger
 * /api/v1/collection/{collection}/count:
 *  get:
 *    tags: [Collection]
 *    summary: Get count of a collection.
 *    description: Get count of a collection.
 *    parameters:
 *      - in: path
 *        name: collection
 *        required: true
 *        schema:
 *          type: string
 *        description: Name of collection.
 *    responses: 
 *      200:
 *        description: Collection is obtained 
 *      401:
 *        description: User is not authorized.
 *      500: 
 *         description: Server error
 *    security:
 *      - bearerAuth: []
 */
router.get('/:collection/count', (req,res) => {

    MongoClient.connect(url).then((client) => {
  
        const connect = client.db(databasename);
          
            // New Collection
            const collections = connect.collection(req.params.collection)
            .stats(function (err, result) {
                if (err) {
                  res.status(400).send("Error fetching listings!");
               } else {                
                console.log(result.count)
                res.json(result.count)                
                }                
            });
                  
        }).catch((err) => {
          
            // Handling the error 
            console.log(err);
            return res.status(400).send("Error fetching listings!");
        })   

});



/**
 * @swagger
 * /api/v1/collection/{collection}:
 *  put:
 *    tags: [Collection]
 *    summary: Write records to a collection.
 *    description: Write records to a collection.
 *    parameters:
 *      - in: path
 *        name: collection
 *        required: true
 *        schema:
 *          type: string
 *      - in: query
 *        name: keys
 *        required: false
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/records'
 *    responses: 
 *      200:
 *        description: Collection is obtained 
 *      401:
 *        description: User is not authorized.
 *      500: 
 *         description: Server error
 *    security:
 *      - bearerAuth: []
 
 */
router.put('/:collection', (req,res) => {

     //console.log(req.params.id);
     MongoClient.connect(url).then((client) => {
  
        const connect = client.db(databasename);
        
        bulkWrite = []

        for (let i = 0; i < req.body.length; i++) {                        
            if (!("_id" in req.body[i] ))
            {
                if("keys" in req.query && req.query.keys.trim().length > 0)
                {
                    id = ''
                    const keys = req.query.keys.split(',');
                    for (let j = 0; j < keys.length; j++) {                                    
                        id = id +  req.body[i][keys[j]]
                    }    
                    console.log(encodeURI(id))
                    req.body[i]['_id'] = encodeURI(id);                    
                    bulkWrite.push( {replaceOne: {filter: {_id: req.body[i]['_id']}, replacement : req.body[i], upsert:true }})
                }
                else{
                    bulkWrite.push( { insertOne: { document: req.body[i] } })
                }
            }
            else{
                bulkWrite.push( {replaceOne: {filter: {_id: req.body[i]['_id']}, replacement : req.body[i], upsert:true }})
            }
        }
        

         // New Collection                
        const collections = connect.collection(req.params.collection)
        collections.bulkWrite(bulkWrite, {ordered:true, w:1}, function(err, result) {    
        //collections.insertMany(req.body,function(err, result) {
                if (err) {
                    console.log(err)
                  res.status(400).send("Error fetching listings!");
               } else {                
                  res.json(result);
                }
              });
                  
        }).catch((err) => {
          
            // Handling the error 
            console.log(err);
            return res.status(400).send("Error fetching listings!");
        })    
});


/**
 * @swagger
 * /api/v1/collection/csv/{collection}:
 *  post:
 *    tags: [Collection]
 *    summary: Ingest a csv file to collection (Upsert).
 *    description: Ingest a csv file to collection (Upsert).
 *    consumes:
 *      - multipart/form-data   
 *    parameters:
 *      - in: path
 *        name: collection
 *        required: true
 *        schema:
 *          type: string
 *      - in: query
 *        name: keys
 *        required: false
 *        schema:
 *          type: string
 *      - in: formData
 *        name: filename
 *        required: true
 *        schema:
 *          type: string
 *      - in: query
 *        name: userId
 *        required: true
 *        schema:
 *          type: string 
 *    responses: 
 *      200:
 *        description: Collection is obtained 
 *      401:
 *        description: User is not authorized.
 *      500: 
 *         description: Server error
 *    security:
 *      - bearerAuth: []
 */

router.post('/csv/:collection', upload.single('filename'), async (req,res) => {
    


    MongoClient.connect(url).then((client) => {

        const connect = client.db(databasename);

        //const wc = new WriteConcern(0).withJournal(false);
        //const collection = connect.collection(req.params.collection).withWriteConcern(wc);
        const collection = connect.collection(req.params.collection);
        
        // writestream = Fs.createWriteStream(req.file.path + "_1")
        // let rows = []
        // Fs.createReadStream(req.file.path, 'utf-8')
        // .pipe(csv({asObject: true, trim:true, allowQuotes : true, multiline : true}))
        // .on('data',(row) =>{
        //     row['id'] = "sachin";
        //     rows.push(row) 
        // })
        // .on('end', rowcount =>
        // {
        //     console.log(rows.length)
        //     fastcsv.write(rows)
        //     .pipe(writestream);            
        // })
        // .on('error', (error) => {
        //      console.log(error)})
        
        
        var callback = function (result) {
            if (result) 
                console.log(result);
            console.log("csv data ingested successfully");
            Fs.unlink(req.file.path,function(err){
                if(err) return console.log(err);
                console.log('file deleted successfully');
           });
            return res.status(200).send(result);            
          };

         load(collection,req, callback);
          


        // bulkwritesync (collection,req).then(result => 
        //     {
        //         console.log(result)
        //         res.json(result)
        //     })                            
    }).catch((err) => {
        
        // Handling the error 
        console.log(err);
        return res.status(400).send("Error inserting csv data!");
        });
}
//,(err, req,res,next)=> res.status(400).send(err.message)
);

var load = function (collection,req,callback) {        
    console.log(req.file.path)        
        Fs.createReadStream(req.file.path, 'utf-8')
        .pipe(csv({asObject: true, trim:true, allowQuotes : true, multiline : true}))
        .pipe(transform(req))
        .pipe(batch(1000))
        .pipe(insert(collection))
        .pipe(result().on('results', callback));    
};   

var insert = function (collection) {
    return Es.map(
      function (data, callback) {
        console.log(data.length)
        if (data.length) {
          var bulk = collection.bulkWrite(data,callback);              
        } else {
          callback();
        }
      }
    );
  };
  
  var transform = function (req) {
    return Es.map(function (data, callback) {
    if (!("_id" in data))
    {
        if("keys" in req.query && req.query.keys.trim().length > 0)
        {
            id = ''
            const keys = req.query.keys.split(',');
            for (let j = 0; j < keys.length; j++) {                                    
                id = id +  data[keys[j]]
            }                
            data['_id'] = encodeURI(id);                    
            data = {replaceOne: {filter: {_id: data['_id']}, replacement : data, upsert:true }}
        }
        else{
            data = { insertOne: { document:data } }
        }
    }
    else{
        data = {replaceOne: {filter: {_id: data['_id']}, replacement : data, upsert:true }}
    }        
    callback(null, data);
    });
  };

  var batch = function (batchSize) {    
    batchSize = batchSize || 1000;
    var batch = [];    
    return Es.through(
      function write (data) {
        stringData = JSON.stringify(data)
        if(stringData.length > 16777216)
        {
            console.log(stringData.length)
            console.log(stringData.slice(0,2000))
        }
        batch.push(data);
        if (batch.length === batchSize) {            
          this.emit('data', batch);
          batch = [];
        }
      },
      function end () {
        if (batch.length) {
          this.emit('data', batch);
          batch = [];
        }
        this.emit('end');
      }
    );
  };

  var result = function () {    
    var SuccessResponse =  {};                            
        SuccessResponse['writeErrors']  = []
        SuccessResponse['writeConcernErrors']  = []
        SuccessResponse['insertedIds']  = []
        SuccessResponse['nInserted']  = 0
        SuccessResponse['nUpserted']  = 0
        SuccessResponse['nMatched']  = 0
        SuccessResponse['nModified']  = 0
        SuccessResponse['nRemoved']  = 0
        SuccessResponse['upserted']  = []   
    return Es.through(
      function write (data) {
        SuccessResponse['writeErrors'] = SuccessResponse['writeErrors'].concat(data.result.writeErrors) 
        SuccessResponse['writeConcernErrors'] = SuccessResponse['writeConcernErrors'].concat(data.result.writeConcernErrors) 
        SuccessResponse['insertedIds'] = SuccessResponse['insertedIds'].concat(data.result.insertedIds) 
        SuccessResponse['nInserted']  += data.result.nInserted;
        SuccessResponse['nUpserted']  += data.result.nUpserted;
        SuccessResponse['nMatched']  += data.result.nMatched;
        SuccessResponse['nModified']  += data.result.nModified;
        SuccessResponse['nRemoved']  += data.result.nRemoved;
        SuccessResponse['upserted'] = SuccessResponse['upserted'].concat(data.result.upserted)          
      },
      function end () {
          //console.log(SuccessResponse)
          this.emit('results', SuccessResponse);
          SuccessResponse = [];                  
      }
    );
  };

async function bulkwritesync(collection,req,res)  
{
        isError = false;
        var SuccessResponse =  {};                            
        SuccessResponse['writeErrors']  = []
        SuccessResponse['writeConcernErrors']  = []
        SuccessResponse['insertedIds']  = []
        SuccessResponse['nInserted']  = 0
        SuccessResponse['nUpserted']  = 0
        SuccessResponse['nMatched']  = 0
        SuccessResponse['nModified']  = 0
        SuccessResponse['nRemoved']  = 0
        SuccessResponse['upserted']  = []
   
        //let stream = fs.createReadStream(req.file.path);
        


        rows = 1500;        
        batchSize = 1000;
        
        var docs = [];
        
        batch = 0;
        totalTime = 0;

        for (let i = 0; i < rows; ++i) {
            key1 = "7";
            key2 = "8395829";
            key3 = "928749";
            key4 = "9";
            key5 = "28";
            key6 = "44923.59";
            key7 = "0.094";
            key8 = "0.29";
            key9 = "e";
            key10 = "r";
            key11 = "2020-03-16";
            key12 = "2020-03-16";
            key13 = "2020-03-16";
            key14 = "klajdlfaijdliffna";
            key15 = "933490";
            key17 = "paorgpaomrgpoapmgmmpagm";

            var doc = {"key17": key17,
                    "key12": key12, "key7": key7, "key6": key6,
                    "key4" : key4, 
                    "key10" : key10, "key1" : key1, "key2" : key2,
                    "key5" : key5, "key13" :  key13, "key9" : key9,
                    "key11" : key11, "key14" :  key14, 
                    "key15" : key15, 
                    "key3" :key3,
                    "key8" : key8};
            
                    if (!("_id" in doc))
                    {
                        if("keys" in req.query && req.query.keys.trim().length > 0)
                        {
                            id = ''
                            const keys = req.query.keys.split(',');
                            for (let j = 0; j < keys.length; j++) {                                    
                                id = id +  doc[keys[j]]
                            }    
                            console.log(encodeURI(id))
                            doc['_id'] = encodeURI(id);                    
                            docs.push( {replaceOne: {filter: {_id: doc['_id']}, replacement : doc, upsert:true }})
                        }
                        else{
                            docs.push( { insertOne: { document:doc } })
                        }
                    }
                    else{
                        docs.push( {replaceOne: {filter: {_id: doc['_id']}, replacement : doc, upsert:true }})
                    }                

            batch++;

            if (batch >= batchSize) {
                start = Date.now();
                  
                await new Promise((resolve, reject) => {
                collection.bulkWrite(docs, {ordered:true, w:1}, function(err, result) {                        
                            if (err) {
                                console.log(err)
                                isError = fasle;
                            } else {                        
                                //console.log(result.result)      
                                SuccessResponse['writeErrors'] = SuccessResponse['writeErrors'].concat(result.result.writeErrors) 
                                SuccessResponse['writeConcernErrors'] = SuccessResponse['writeConcernErrors'].concat(result.result.writeConcernErrors) 
                                SuccessResponse['insertedIds'] = SuccessResponse['insertedIds'].concat(result.result.insertedIds) 
                                SuccessResponse['nInserted']  += result.result.nInserted;
                                SuccessResponse['nUpserted']  += result.result.nUpserted;
                                SuccessResponse['nMatched']  += result.result.nMatched;
                                SuccessResponse['nModified']  += result.result.nModified;
                                SuccessResponse['nRemoved']  += result.result.nRemoved;
                                SuccessResponse['upserted'] = SuccessResponse['upserted'].concat(result.result.upserted)                                 
                                resolve()
                            }
                            });
                        })
                
                totalTime += Date.now() - start;
                
                docs.length = 0;
                batch = 0;
            }
        }

        if (batch > 0) {
            start = Date.now();
            
            await new Promise((resolve, reject) => {
                collection.bulkWrite(docs, {ordered:true, w:1}, function(err, result) {                        
                            if (err) {
                                console.log(err)
                                isError = fasle;
                            } else {             
                                //console.log(result.result)                                                           
                                SuccessResponse['writeErrors'] = SuccessResponse['writeErrors'].concat(result.result.writeErrors) 
                                SuccessResponse['writeConcernErrors'] = SuccessResponse['writeConcernErrors'].concat(result.result.writeConcernErrors) 
                                SuccessResponse['insertedIds'] = SuccessResponse['insertedIds'].concat(result.result.insertedIds) 
                                SuccessResponse['nInserted']  += result.result.nInserted;
                                SuccessResponse['nUpserted']  += result.result.nUpserted;
                                SuccessResponse['nMatched']  += result.result.nMatched;
                                SuccessResponse['nModified']  += result.result.nModified;
                                SuccessResponse['nRemoved']  += result.result.nRemoved;
                                SuccessResponse['upserted'] = SuccessResponse['upserted'].concat(result.result.upserted)  
                                resolve()
                            }
                            });
                        })
            
            totalTime += Date.now() - start;
            
            docs.length = 0;
        }        

        console.log( "Elapsed: " + (totalTime / 1000.0) + " seconds.");
        
        if(isError)
        {
            res.status(400).send("Error inserting data!");
        }
        else
        {
            console.log(SuccessResponse)
            return SuccessResponse;
        }        
}

// /**
//  * @swagger
//  * /api/v1/collection/{collection}:
//  *  put:
//  *    tags: [Collection]
//  *    summary: Update records in a collection.
//  *    description: Update records in a collection.
//  *    responses: 
//  *      200:
//  *        description: Collection is obtained 
//  *      401:
//  *        description: User is not authorized.
//  *      500: 
//  *         description: Server error
//  *    security:
//  *      - bearerAuth: []
//  */
// router.put('/:collection', (req,res) => {

//     //find collection.
//     let collection = req.app.db.get("collections").find({
//         id: req.params.id
//     }).value();

//     if(!collection){

//         return res.sendStatus(404);

//     };

//     //update that collection.
//     try {

//         req.app.db.get("collections").find({
//             id:req.params.id
//         })
//         .assign({ completed: !collection['completed'] })
//         .write();

//         return res.send("collection updated");

//     } catch(error) {

//         res.sendStatus(500);

//         return res.send(error);

//     };

// });

/**
 * @swagger
 * /api/v1/collection/{collection}:
 *  delete:
 *    tags: [Collection]
 *    summary: Delete records from a collection.
 *    description: Delete records from a collection.
 *    parameters:
 *      - in: path
 *        name: collection
 *        required: true
 *        schema:
 *          type: string
 *        description: Name of collection.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/filter'
 *    responses: 
 *      200:
 *        description: Collection is obtained 
 *      401:
 *        description: User is not authorized.
 *      500: 
 *         description: Server error
 *    security:
 *      - bearerAuth: []
 */
router.delete('/:collection', (req,res) => {

    //console.log(req.params.id);
    MongoClient.connect(url).then((client) => {
  
        const connect = client.db(databasename);
          
            // New Collection                
        const collections = connect.collection(req.params.collection)
        //collections.deleteMany({"UWI" : { "$in" : req.body}},function(err, obj) {
        collections.deleteMany( req.body,function(err, obj) {
                if (err) {
                    console.log(err)
                  res.status(400).send("Error fetching listings!");
               } else {                
                  res.json(obj);
                }
              });
                  
        }).catch((err) => {
          
            // Handling the error 
            console.log(err);
            return res.status(400).send("Error fetching listings!");
        })    

});

/**
 * @swagger
 * /api/v1/collection/{collection}/all:
 *  delete:
 *    tags: [Collection]
 *    summary: Delete all records in a collection.
 *    description: Delete  records in a  collection.
 *    parameters:
 *      - in: path
 *        name: collection
 *        required: true
 *        schema:
 *          type: string
 *    responses: 
 *      201:
 *        description: Collection is deleted
 *      401:
 *        description: User is not authorized.
 *      500: 
 *         description: Server error
 *    security:
 *      - bearerAuth: []
 */
router.delete('/:collection/all', (req,res) => {

    console.log("in delete")
    MongoClient.connect(url).then((client) => {
  
    const connect = client.db(databasename);
        
        // New Collection
    const collections = connect.dropCollection(req.params.collection, function(err, result){            
            if (err) {
                res.status(400).send("Error fetching listings!");
            } else {                
                res.status(201).send("Collections is deleted.");
            }
            });
                
    }).catch((err) => {
        
        // Handling the error 
        console.log(err);
        return res.status(400).send("Error fetching listings!");
    }) 


});

module.exports = router;