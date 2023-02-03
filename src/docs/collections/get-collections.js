module.exports = {
    get:{
        tags: ['collection CRUD operations'],
        description: "Get collections",
        operationId: 'getcollections',
        parameters:[],
        responses:{
            '200':{
                description:"collections were obtained",
                content:{
                    'application/json':{
                        schema:{
                            $ref:'#/components/schemas/collection'
                        }
                    }
                }
            }
        }
    }
}