
module.exports = {
    components:{
        schemas:{
            id:{
                type:'string',
                description:"An id of a collection",
                example: "tyVgf"
            },
            collection:{
                type:'object',
                properties:{
                    id:{
                        type:'string',
                        description:"collection identification number",
                        example:"ytyVgh"
                    },
                    title:{
                        type:'string',
                        description:"collection's title",
                        example:"Coding in JavaScript"
                    },
                    completed:{
                        type:"boolean",
                        description:"The status of the collection",
                        example:false
                    }
                }
            },
            collectionInput:{
                type:'object',
                properties:{
                    title:{
                        type:'string',
                        description:"collection's title",
                        example:"Coding in JavaScript"
                    },
                    completed:{
                        type:"boolean",
                        description:"The status of the collection",
                        example:false
                    }
                }
            },
            Error:{
                type:'object',
                properties:{
                    message:{
                        type:'string'
                    },
                    internal_code:{
                        type:'string'
                    }
                }
            }
        }
    }
}