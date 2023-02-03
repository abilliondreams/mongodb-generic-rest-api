const getcollections = require('./get-collections');
const getcollection = require('./get-collection');
const createcollection = require('./create-collection');
const updatecollection = require('./update-collection');
const deletecollection = require('./delete-collection');

module.exports = {
    paths:{
        '/collections':{
            ...getcollections,
            ...createcollection
        },
        '/collections/{id}':{
            ...getcollection,
            ...updatecollection,
            ...deletecollection
        }
    }
}