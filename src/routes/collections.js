const express = require("express");
const {nanoid} = require('nanoid');
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const databasename = 'ecosystem';
require("dotenv").config();
const url = process.env.DB_CONNECTION_STRING

const idLength = 8;
/**
 * @swagger
 * /api/v1/collections:
 *  get:
 *    tags: [Collections]
 *    summary: Get all collections.
 *    description: Get all collections.
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
router.get('/', (req,res) => {    

    MongoClient.connect(url).then((client) => {
  
    const connect = client.db(databasename);
      
        // New Collection
    const collections = connect.listCollections({}, { nameOnly: true })
        .toArray(function (err, result) {
            if (err) {
              res.status(400).send("Error fetching listings!");
           } else {
            var collections = [];
            for (let i = 0; i < result.length; i++) {            
                collections.push(result[i].name);
              };            
              res.json(collections);
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
 * /api/v1/collections/count:
 *  get:
 *    tags: [Collections]
 *    summary: Get count of all collections.
 *    description: Get  count of all collections.
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
router.get('/count', (req,res) => {

    MongoClient.connect(url).then((client) => {
  
        const connect = client.db(databasename);
          
            // New Collection
        const collections = connect.listCollections({}, { nameOnly: true })
            .toArray(function (err, result) {
                if (err) {
                  res.status(400).send("Error fetching listings!");
               } else {                
                                
                    getcollectionscount (connect ,result,res).then(collscount => 
                        {
                            console.log(collscount)
                            res.json(collscount)
                        })                    
                }                
            });
                  
        }).catch((err) => {
          
            // Handling the error 
            console.log(err);
            return res.status(400).send("Error fetching listings!");
        })       

});

async function getcollectionscount(connect, collections,res)  
{
    var result =  {};                            
   for(i = 0; i < collections.length; i++) {                        
    
    await new Promise((resolve, reject) => {
    
    connect.collection(collections[i].name).stats(function(error, stats){
        if(error) {
            return res.status(400).send("Error fetching listings!")
        }                       
        else{                                          
            result[collections[i].name] = stats.count;                
            resolve()
            }
        });            
    })
    }
    
    return result
}

/**
 * @swagger
 * /api/v1/collections:
 *  delete:
 *    tags: [Collections]
 *    summary: Delete all collections.
 *    description: Delete all collections.
 *    responses: 
 *      201:
 *        description: Collections are deleted
 *      401:
 *        description: User is not authorized.
 *      500: 
 *         description: Server error
 *    security:
 *      - bearerAuth: []
 */
router.delete('/', (req,res) => {

    MongoClient.connect(url).then((client) => {
  
        const connect = client.db(databasename);
          
            // New Collection
        const collections = connect.listCollections({}, { nameOnly: true })
            .toArray(function (err, result) {
                if (err) {
                  res.status(400).send("Error fetching listings!");
               } else {
                var collections = [];
                for (let i = 0; i < result.length; i++) {                                
                    connect.dropCollection(result[i].name, function(err, result){
                    // handle the error if any
                    if (err) throw err;
                    else
                    {
                        console.log("Collection is deleted! "+result);
                    }                    
                });
                }            
                res.status(201).send("All collections are deleted.");
                }
              });
                  
        }).catch((err) => {
          
            // Handling the error 
            console.log(err);
            return res.status(400).send("Error fetching listings!");
        }) 

});


module.exports = router;