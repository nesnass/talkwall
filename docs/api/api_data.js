define({ "api": [  {    "type": "get",    "url": "/ping",    "title": "Answers a ping call",    "name": "ping",    "group": "Sync",    "version": "0.0.0",    "filename": "routes/sync.js",    "groupTitle": "Sync"  },  {    "type": "get",    "url": "/change/:nickname/:wall_id/:question_id/:previous_question_id",    "title": "Notify change question",    "name": "changeQuestion",    "group": "authorised",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "wall_id",            "description": ""          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "question_id",            "description": ""          },          {            "group": "Parameter",            "type": "String",            "allowedValues": [              "\"none\"",              "\"id_hex_string\""            ],            "optional": false,            "field": "previous_question_id",            "description": ""          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "nickname",            "description": ""          }        ]      }    },    "description": "<p>Send notification to all users that we are changing the question</p>",    "version": "0.0.0",    "filename": "routes/teacher.js",    "groupTitle": "authorised"  },  {    "type": "post",    "url": "/messageteacher",    "title": "Create message",    "name": "createMessage",    "group": "authorised",    "parameter": {      "examples": [        {          "title": "Input",          "content": "{\n    \"wall_id\": \"123412341234123412341234\",\n    \"nickname\": \"my_nickname\",\n    \"message\": {\n        \"question_id\": \"dcbadcbadcbadcbadcbadcba\",\n        \"text\": \"New message text content\",\n        \"creator\": \"my_nickname\",\n        \"origin\": [\n            {\n                \"nickname\": \"my_nickname\"\n            }\n        ]\n    }\n}",          "type": "json"        }      ]    },    "description": "<p>Create a new message and add its ID to the Question on the given wall</p>",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Message",            "optional": false,            "field": "message",            "description": "<p>The created message</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/teacher.js",    "groupTitle": "authorised"  },  {    "type": "post",    "url": "/question",    "title": "Create question",    "name": "createQuestion",    "group": "authorised",    "parameter": {      "examples": [        {          "title": "Input",          "content": "{\n    \"wall_id\": \"123412341234123412341234\",\n    \"question\": {\n         \"label\": \"New question\";\n         \"grid\": \"horizontal\";\n    }\n}",          "type": "json"        }      ]    },    "description": "<p>Create a new question</p>",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Question",            "optional": false,            "field": "question",            "description": "<p>The newly created question</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/teacher.js",    "groupTitle": "authorised"  },  {    "type": "post",    "url": "/wall",    "title": "Create new wall",    "name": "createWall",    "group": "authorised",    "parameter": {      "examples": [        {          "title": "Input",          "content": "{\n         \"label\": \"New wall\",\n         \"theme\": \"New theme\"\n}",          "type": "json"        }      ]    },    "description": "<p>Create a new wall and allocate a PIN</p>",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Wall",            "optional": false,            "field": "wall",            "description": "<p>Newly created wall with populated Organisers list</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/teacher.js",    "groupTitle": "authorised"  },  {    "type": "delete",    "url": "/question/:wall_id/:question_id",    "title": "Delete a question",    "name": "deleteQuestion",    "group": "authorised",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "wall_id",            "description": "<p>ID of the wall</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "question_id",            "description": "<p>ID of the question</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Wall",            "optional": false,            "field": "wall",            "description": "<p>The wall that contained this question</p>"          }        ]      }    },    "description": "<p>Remove a question for a given wall id</p>",    "version": "0.0.0",    "filename": "routes/teacher.js",    "groupTitle": "authorised"  },  {    "type": "get",    "url": "/disconnectteacher/:nickname/:wall_id",    "title": "Disconnect teacher",    "name": "disconnectWall",    "group": "authorised",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "wall_id",            "description": "<p>ID of the wall to disconnect from</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "nickname",            "description": "<p>This user's nickname</p>"          }        ]      }    },    "description": "<p>Disconnect the nickname from the given wall</p>",    "version": "0.0.0",    "filename": "routes/teacher.js",    "groupTitle": "authorised"  },  {    "type": "post",    "url": "/logs/:wall_id/:startdatetime/:enddatetime/:timelinetime/:selectedtypes",    "title": "Get Logs",    "name": "getLogs",    "group": "authorised",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "wall_id",            "description": "<p>ID of the wall to get logs for</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "startdatetime",            "description": "<p>Unix datetime</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "enddatetime",            "description": "<p>Unix datetime</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "timelinetime",            "description": "<p>Unix datetime</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "selectedtypes",            "description": "<p>JSON encoded types</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "log[]",            "optional": false,            "field": "log",            "description": "<p>object array</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/teacher.js",    "groupTitle": "authorised"  },  {    "type": "get",    "url": "/wall/:wall_id/question/:question_id/contributors",    "title": "Get contributors",    "name": "getQuestionContributors",    "group": "authorised",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "wall_id",            "description": "<p>ID of the wall</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "question_id",            "description": "<p>ID of the question</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "[String]",            "optional": false,            "field": "contributors",            "description": "<p>A list of nicknames</p>"          }        ]      }    },    "description": "<p>Return a list of contributor nicknames for the given wall and question</p>",    "version": "0.0.0",    "filename": "routes/teacher.js",    "groupTitle": "authorised"  },  {    "type": "get",    "url": "/user",    "title": "Get user",    "name": "getUser",    "group": "authorised",    "description": "<p>Return details for the currently authenticated user</p>",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "User",            "optional": false,            "field": "user",            "description": "<p>User object</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/teacher.js",    "groupTitle": "authorised"  },  {    "type": "get",    "url": "/wall/:id",    "title": "Get a wall",    "name": "getWallAuthorised",    "group": "authorised",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "id",            "description": "<p>ID of the wall</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Wall",            "optional": false,            "field": "wall",            "description": "<p>Wall object</p>"          }        ]      }    },    "description": "<p>Get the wall by its id. If the wall was closed it will be re-opned with a new pin</p>",    "version": "0.0.0",    "filename": "routes/teacher.js",    "groupTitle": "authorised"  },  {    "type": "get",    "url": "/walls",    "title": "Get user's walls",    "name": "getWalls",    "group": "authorised",    "description": "<p>Get all walls (limited details) for a user</p>",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "[Wall]",            "optional": false,            "field": "walls",            "description": "<p>List of walls found</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/teacher.js",    "groupTitle": "authorised"  },  {    "type": "put",    "url": "/question",    "title": "Update a question",    "name": "updateQuestion",    "group": "authorised",    "parameter": {      "examples": [        {          "title": "Input",          "content": "{\n    \"wall_id\": \"123412341234123412341234\",\n    \"question\": {\n         \"_id\": \"dcbadcbadcbadcbadcbadcba\"\n         \"label\": \"string\";\n         \"grid\": \"string\";\n    }\n}",          "type": "json"        }      ]    },    "description": "<p>Update an existing question</p>",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Wall",            "optional": false,            "field": "The",            "description": "<p>wall that contains this question</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/teacher.js",    "groupTitle": "authorised"  },  {    "type": "put",    "url": "/user",    "title": "Update user",    "name": "updateUser",    "group": "authorised",    "parameter": {      "examples": [        {          "title": "User",          "content": "{\n    \"user\": {\n         \"defaultEmail\": \"user@talkwall.net\",\n         \"nickname\": \"user\"\n    }\n}",          "type": "json"        }      ]    },    "description": "<p>Update details for the currently authorised user</p>",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "User",            "optional": false,            "field": "user",            "description": "<p>Updated user object (at this time, only 'lastOpenedWall' and 'defaultEmail')</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/teacher.js",    "groupTitle": "authorised"  },  {    "type": "put",    "url": "/wall",    "title": "Update a wall",    "name": "updateWall",    "group": "authorised",    "parameter": {      "examples": [        {          "title": "Input",          "content": "{\n    \"wall\": {\n         \"_id\": \"ab2b6cd12243abba48278935\",\n         \"pin\": \"1234\",\n         \"closed\": false,\n         \"label\": \"New wall\",\n         \"theme\": \"New theme\",\n         \"deleted\": false,\n         \"newOrganiser\": \"newOrganiserEmail@abc.net\"\n    }\n}",          "type": "json"        }      ]    },    "description": "<p>Create a new question</p>",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Wall",            "optional": false,            "field": "wall",            "description": "<p>Updated wall object</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/teacher.js",    "groupTitle": "authorised"  },  {    "type": "get",    "url": "/userexists/:email",    "title": "Confirm user exists",    "name": "userExists",    "group": "authorised",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "email",            "description": ""          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Boolean",            "optional": false,            "field": "boolean",            "description": ""          }        ]      }    },    "version": "0.0.0",    "filename": "routes/teacher.js",    "groupTitle": "authorised"  },  {    "type": "post",    "url": "/logs/:wall_id/:nickname",    "title": "Add logs",    "name": "addLogs",    "group": "non_authorised",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "wall_id",            "description": ""          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "nickname",            "description": ""          }        ]      },      "examples": [        {          "title": "Input",          "content": "{\n    logs: [\n        {\n             \"q_id\": \"dcbadcbadcbadcbadcbadcba\",\n             \"type\": \"code representing log type\",\n             \"itemid\": \"message or question ID\",\n             \"nick\": \"nickname\",\n             \"text\": \"current message or question text\",\n             \"stamp\": \"date stamp made by client\",\n             \"diff\": {\n                \"x\": \"0.xxx\",\n                \"y\": \"0.yyy\"\n             },\n             \"basedOn\": {\n                 \"itemid\": \"originating message ID\",\n                 \"nick\":   \"nickname of originating creator\",\n                 \"text\":   \"text of the originating message\"\n             }\n        }\n    ]\n}",          "type": "json"        }      ]    },    "description": "<p>Create a new question</p>",    "version": "0.0.0",    "filename": "routes/client.js",    "groupTitle": "non_authorised"  },  {    "type": "post",    "url": "/message",    "title": "Create message",    "name": "createMessage",    "group": "non_authorised",    "parameter": {      "examples": [        {          "title": "Input",          "content": "{\n    \"wall_id\": \"123412341234123412341234\",\n    \"nickname\": \"my_nickname\",\n    \"message\": {\n        \"question_id\": \"dcbadcbadcbadcbadcbadcba\",\n        \"text\": \"New message text content\",\n        \"creator\": \"my_nickname\",\n        \"origin\": [\n            {\n                \"nickname\": \"my_nickname\"\n            }\n        ]\n    }\n}",          "type": "json"        }      ]    },    "description": "<p>Create a new message and add its ID to the Question on the given wall</p>",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Message",            "optional": false,            "field": "message",            "description": "<p>The created message</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/client.js",    "groupTitle": "non_authorised"  },  {    "type": "get",    "url": "/disconnect",    "title": "Disconnect from wall",    "name": "disconnectWall",    "group": "non_authorised",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "wall_id",            "description": "<p>ID of the wall to get</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "nickname",            "description": "<p>Connecting client's nickname</p>"          }        ]      }    },    "description": "<p>Disconnect from a wall. Removes user from wall's nickname list</p>",    "version": "0.0.0",    "filename": "routes/client.js",    "groupTitle": "non_authorised"  },  {    "type": "get",    "url": "/export/:wallid",    "title": "Export wall",    "name": "exportWall",    "group": "non_authorised",    "description": "<p>Collate and return export information for this wall - wall, questions, messages</p>",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Wall",            "optional": false,            "field": "wall",            "description": "<p>populated with questions and messages</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/client.js",    "groupTitle": "non_authorised"  },  {    "type": "get",    "url": "/messages/:question_id",    "title": "Get messages for question",    "name": "getMessages",    "group": "non_authorised",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "question_id",            "description": ""          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "[Message]",            "optional": false,            "field": "messages",            "description": "<p>List of messages found</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/client.js",    "groupTitle": "non_authorised"  },  {    "type": "get",    "url": "/clientwall/:wall_id",    "title": "Get wall by wall_id",    "name": "getWallById",    "group": "non_authorised",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "wall_id",            "description": "<p>ID of the wall to get</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/client.js",    "groupTitle": "non_authorised"  },  {    "type": "get",    "url": "/clientwall/:nickname/:pin",    "title": "Get wall by pin",    "name": "getWallByPin",    "group": "non_authorised",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "pin",            "description": "<p>Pin of the wall to get</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "nickname",            "description": "<p>Connecting client's nickname</p>"          }        ]      }    },    "description": "<p>Returns wall details if the pin exists and wall is open.</p>",    "version": "0.0.0",    "filename": "routes/client.js",    "groupTitle": "non_authorised"  },  {    "type": "get",    "url": "/pollteacher/:nickname/:wall_id/:question_id/:previous_question_id/:controlString",    "title": "Poll for updates",    "name": "poll",    "group": "non_authorised",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "wall_id",            "description": "<p>ID of the wall to get</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "question_id",            "description": "<p>ID of the question to get. Can be 'none' if we are only polling for status</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "previous_question_id",            "description": "<p>ID of the previous question to assist removal from polling when changing question Can be 'none' if not changing questions.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "nickname",            "description": "<p>Connecting client's nickname</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "controlString",            "description": "<p>type of poll ('new', 'change', 'poll')</p>"          }        ]      }    },    "description": "<p>Respond with any changed messages and status</p>",    "version": "0.0.0",    "filename": "routes/teacher.js",    "groupTitle": "non_authorised"  },  {    "type": "get",    "url": "/poll",    "title": "",    "name": "poll",    "group": "non_authorised",    "description": "<p>Respond with any changed messages and status</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "wall_id",            "description": "<p>ID of the wall to get</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "question_id",            "description": "<p>ID of the question to get. Can be 'none' if we are only polling for status</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "previous_question_id",            "description": "<p>ID of the previous question to assist removal from polling when changing question Can be 'none' if not changing questions.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "nickname",            "description": "<p>Connecting client's nickname</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "controlString",            "description": "<p>type of poll ('new', 'change', 'poll')</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/client.js",    "groupTitle": "non_authorised"  },  {    "type": "put",    "url": "/message",    "title": "Edit a message",    "name": "updateMessages",    "group": "non_authorised",    "parameter": {      "examples": [        {          "title": "Input",          "content": "{\n    \"wall_id\": \"123412341234123412341234\",\n    \"nickname\": \"my_nickname\",\n    \"controlString\": \"none | edit | position\"\n    \"messages\": [\n        {\n            \"_id\": \"567856785678567856785678\",\n            \"question_id\": \"dcbadcbadcbadcbadcbadcba\",\n            \"text\": \"New message text content\",\n            \"creator\": \"my_nickname\",\n            \"origin\": [\n                {\n                    \"nickname\": \"my_nickname\"\n                }\n            ]\n        }\n     ]\n}",          "type": "json"        }      ]    },    "description": "<p>Update a list of messages</p>",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "[Message]",            "optional": false,            "field": "messages",            "description": "<p>List of updated messages</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/client.js",    "groupTitle": "non_authorised"  },  {    "type": "put",    "url": "/message",    "title": "Edit a message",    "name": "updateMessages",    "group": "non_authorised",    "parameter": {      "examples": [        {          "title": "Input",          "content": "{\n    \"wall_id\": \"123412341234123412341234\",\n    \"nickname\": \"my_nickname\",\n    \"controlString\": \"none | edit | position\"\n    \"messages\": [\n        {\n            \"_id\": \"567856785678567856785678\",\n            \"question_id\": \"dcbadcbadcbadcbadcbadcba\",\n            \"text\": \"New message text content\",\n            \"creator\": \"my_nickname\",\n            \"origin\": [\n                {\n                    \"nickname\": \"my_nickname\"\n                }\n            ]\n        }\n     ]\n}",          "type": "json"        }      ]    },    "description": "<p>Update a list of messages</p>",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "[Message]",            "optional": false,            "field": "messages",            "description": "<p>List of updated messages</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/teacher.js",    "groupTitle": "non_authorised"  }] });
