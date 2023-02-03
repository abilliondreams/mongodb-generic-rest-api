module.exports = {
    put:{
        tags:['collection CRUD operations'],
        description: "Update collection",
        operationId: "updatecollection",
        parameters:[
            {
                name:"id",
                in:"path",
                schema:{
                    $ref:"#/components/schemas/id"
                },
                required:true,
                description: "Id of collection to be updated"
            }
        ],
        responses:{

            '200':{
                description: "collection updated successfully"
            },
            '404':{
                description: "collection not found"
            },
            '500':{
                description: "Server error"
            }
            
        }
    }
}