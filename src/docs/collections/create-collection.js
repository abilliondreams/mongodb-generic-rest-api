
module.exports = {
    post:{
        tags:['collection CRUD operations'],
        description: "Create collection",
        operationId: "createcollection",
        parameters:[],
        requestBody: {
            content:{
                'application/json': {
                    schema:{
                        $ref:'#/components/schemas/collectionInput'
                    }
                }
            }
        },
        responses:{
            '201':{
                description: "collection created successfully"
            },
            '500':{
                description: 'Server error'
            }
        }
    }
}