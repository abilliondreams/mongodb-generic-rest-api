module.exports = {
    get:{
        tags:['collection CRUD operations'],
        description: "Get a collection",
        operationId: "getcollection",
        parameters:[
            {
                name:"id",
                in:"path",
                schema:{
                    $ref:"#/components/schemas/id"
                },
                required:true,
                description: "A single collection id"
            }
        ],
        responses:{
            '200':{
                description:"collection is obtained",
                content:{
                    'application/json':{
                        schema:{
                            $ref:"#/components/schemas/collection"
                        }
                    }
                }
            },
            '404':{
                description: "collection is not found",
                content:{
                    'application/json':{
                        schema:{
                            $ref:'#/components/schemas/Error',
                            example:{
                                message:"We can't find the collection",
                                internal_code:"Invalid id"
                            }
                        }
                    }
                }
            }
        }
    }
}