module.exports = {
    delete:{
        tags: ['collection CRUD operations'],
        description: "Deleting a collection",
        operationId: "deletecollection",
        parameters:[
            {
                name:"id",
                in:"path",
                schema:{
                    $ref:"#/components/schemas/id"
                },
                required:true,
                description: "Deleting a done collection"
            }
        ],
        responses:{
            '200':{
                description:"collection deleted successfully"
            },
            '404':{
                description:"collection not found"
            },
            '500':{
                description:"Server error"
            }
        }
    }
}