/**
 * Created by richardnesnass on 31/05/16.
 */

var common = require('../config/common.js');
var mm = require('../config/message_manager').mm;
var redisClient = require('../config/redis_database').redisClient;
var Wall = require('../models/wall');
var Message = require('../models/message');
var Promise = require('promise');

/**
 * @api {get} /poll Respond to this call with any changed messages and status
 *
 * @apiName poll
 * @apiGroup non-authorised
 *
 * @apiParam {String} wall_id ID of the wall to get
 * @apiParam {String} question_id ID of the question to get.
 *                      Can be 'none' if we are only polling for status
 * @apiParam {String} previous_question_id ID of the previous question to assist removal from polling when changing question
 *                      Can be 'none' if not changing questions.
 * @apiParam {String} nickname Connecting client's nickname
 * @apiParam {String} control type of poll ('new', 'change', 'poll')
 *
 */
exports.poll = function(req, res) {

    if (typeof req.params.wall_id === 'undefined' || req.params.wall_id == null
        || typeof req.params.question_id === 'undefined' || req.params.question_id == null
        || typeof req.params.previous_question_id === 'undefined' || req.params.previous_question_id == null
        || typeof req.params.nickname === 'undefined' || req.params.nickname == null
        || typeof req.params.controlString === 'undefined' || req.params.controlString == null) {
        res.status(common.StatusMessages.PARAMETER_UNDEFINED_ERROR.status)
            .json({message: common.StatusMessages.PARAMETER_UNDEFINED_ERROR.message});
    }

    if (req.params.controlString === 'change' && req.params.previous_question_id !== 'none') {
        // We are changing questions, so remove the user from previous question and add them to the new one
        mm.removeUserFromQuestion(req.params.wall_id, req.params.previous_question_id, req.params.nickname, false);
        mm.addUserToQuestion(req.params.wall_id, req.params.question_id, req.params.nickname, false);
    } else if (req.params.controlString === 'new' && req.params.question_id !== 'none') {
        // We are entering for the first time, so add the user
        mm.addUserToQuestion(req.params.wall_id, req.params.question_id, req.params.nickname, false);
    }

    // Return an update to the user
    var update = mm.getUpdate(req.params.wall_id, req.params.question_id, req.params.nickname, false);
    res.status(common.StatusMessages.POLL_SUCCESS.status)
        .json({message: common.StatusMessages.POLL_SUCCESS.message, result: update});

};

/**
 * @api {get} /clientwall Get a wall by pin - simply returns wall details if the pin exists and wall is open.
 * Adds user to wall nickname list
 *
 * @apiName clientWall
 * @apiGroup non-authorised
 *
 * @apiParam {String} pin Pin of the wall to get
 * @apiParam {String} nickname Connecting client's nickname
 *
 */
exports.getWall = function(req, res) {

    if (typeof req.params.pin === 'undefined' || req.params.pin == null
        || typeof req.params.nickname === 'undefined' || req.params.nickname == null) {
        res.status(common.StatusMessages.PARAMETER_UNDEFINED_ERROR.status)
            .json({message: common.StatusMessages.PARAMETER_UNDEFINED_ERROR.message});
    }

    // Check for the pin in Redis. If exists, look up the value == wall ID
    redisClient.get(req.params.pin, function(error, wall_id) {
        if(wall_id !== null) {
            var query = Wall.findOne({
                _id : wall_id,
                pin : { $gte: 0 }       // Wall is not available to clients if pin is -1
            }).lean();

            query.exec(function(error, wall) {
                if(error) {
                    res.status(common.StatusMessages.GET_ERROR.status).json({
                        message: common.StatusMessages.GET_ERROR.message, result: error});
                }
                else {
                    res.status(common.StatusMessages.CLIENT_CONNECT_SUCCESS.status).json({
                        message: common.StatusMessages.CLIENT_CONNECT_SUCCESS.message, result: wall});
                }
            });
        } else {        // Pin has expired or does not exist
            res.status(common.StatusMessages.PIN_DOES_NOT_EXIST.status).json({
                message: common.StatusMessages.PIN_DOES_NOT_EXIST.message});
        }
    });
};


/**
 * @api {get} /disconnect Disconnect from a wall with pin - Removes user from wall nickname list
 *
 * @apiName disconnectWall
 * @apiGroup non-authorised
 *
 * @apiParam {String} wall_id ID of the wall to get
 * @apiParam {String} question_id ID of the question to get
 * @apiParam {String} nickname Connecting client's nickname
 *
 */
exports.disconnectWall = function(req, res) {

    if (typeof req.params.wall_id === 'undefined' || req.params.wall_id == null
        || typeof req.params.question_id === 'undefined' || req.params.question_id == null
        || typeof req.params.nickname === 'undefined' || req.params.nickname == null) {
        res.status(common.StatusMessages.PARAMETER_UNDEFINED_ERROR.status)
            .json({message: common.StatusMessages.PARAMETER_UNDEFINED_ERROR.message});
    }

    // Check for the student on the wall
    if(mm.studentIsOnWall(req.params.wall_id, req.params.nickname)) {
        var query = Wall.findOne({
            _id : req.params.wall_id,
            pin : { $gte: 0 }       // Wall is not available to clients if pin is -1
        }).lean();

        query.exec(function(error, wall) {
            if(error) {
                res.status(common.StatusMessages.CLIENT_DISCONNECT_ERROR.status).json({
                    message: common.StatusMessages.CLIENT_DISCONNECT_ERROR.message, result: error});
            }
            else {
                // Remove nickname from the wall users list (message manager)
                mm.removeUserFromQuestion(wall._id, req.params.question_id, req.params.nickname, false);
                mm.removeUserFromWall(wall._id, req.params.nickname, false);
                res.status(common.StatusMessages.CLIENT_DISCONNECT_SUCCESS.status).json({
                    message: common.StatusMessages.CLIENT_DISCONNECT_SUCCESS.message, result: wall});
            }
        });
    } else {        // Pin has expired or does not exist
        res.status(common.StatusMessages.PIN_DOES_NOT_EXIST.status).json({
            message: common.StatusMessages.PIN_DOES_NOT_EXIST.message});
    }
};

/**
 * @api {post} /message Create a new message and add it to the Question
 * @apiName createMessage
 * @apiGroup non-authorised
 *
 * @apiSuccess {Message} message Newly created message
 */
exports.createMessage = function(req, res) {

    if (typeof req.body.message === 'undefined' || req.body.message == null
        || typeof req.body.wall_id === 'undefined' || req.body.wall_id == null
        || typeof req.body.nickname === 'undefined' || req.body.nickname == null) {
        res.status(common.StatusMessages.PARAMETER_UNDEFINED_ERROR.status)
            .json({message: common.StatusMessages.PARAMETER_UNDEFINED_ERROR.message});
    }

    if (mm.studentIsOnWall(req.body.wall_id, req.body.nickname)) {

        // Create a new Message with the supplied object, including board properties   *** Not vetted!! :S
        var newMessage = new Message(req.body.message);
        newMessage.save(function (error, message) {
            if (error) {
                res.status(common.StatusMessages.CREATE_ERROR.status).json({
                    message: common.StatusMessages.CREATE_ERROR.message, result: error
                });
            }
            else {
                // Update the message manager to notify other clients
                mm.postUpdate(req.body.wall_id, message.question_id, req.body.nickname, message, 'create', false);

                // Update the question with this new message, and return
                Wall.findOneAndUpdate({
                    '_id': req.body.wall_id,
                    'questions._id': req.body.message.question_id
                }, { $push: { "questions.$.messages" : message}, $addToSet: { "questions.$.contributors" : req.body.nickname }}, function(error, wall) {
                    if(error) {
                        res.status(common.StatusMessages.CREATE_ERROR.status).json({
                            message: common.StatusMessages.CREATE_ERROR.message
                        });
                    } else {
                        res.status(common.StatusMessages.CREATE_SUCCESS.status).json({
                            message: common.StatusMessages.CREATE_SUCCESS.message, result: message
                        });
                    }
                });
            }
        })
    } else {
        res.status(common.StatusMessages.INVALID_USER.status).json({
            message: common.StatusMessages.INVALID_USER.message
        });
    }

};

/**
 * @api {get} /messages Get all messages for a wall and question
 * @apiName getMessages
 * @apiGroup non-authorised
 *
 * @apiSuccess {Array<Message>} messages List of messages found
 */
exports.getMessages = function(req, res) {

    if (typeof req.params.question_id === 'undefined' || req.params.question_id == null) {
        res.status(common.StatusMessages.PARAMETER_UNDEFINED_ERROR.status)
            .json({message: common.StatusMessages.PARAMETER_UNDEFINED_ERROR.message});
    }

    var query = Message.find({
        'question_id' : req.params.question_id
    }).lean();

    query.exec(function(error, messages) {
        if(error) {
            res.status(common.StatusMessages.GET_ERROR.status).json({
                message: common.StatusMessages.GET_ERROR.message, result: error});
        }
        else {
            res.status(common.StatusMessages.GET_SUCCESS.status).json({
                message: common.StatusMessages.GET_SUCCESS.message, result: messages});
        }
    })
};

/**
 * @api {put} /message Edit a message by submitting a Message object and pin
 * @apiName updateMessages
 * @apiGroup non-authorised
 *
 */
exports.updateMessages = function(req, res) {

    if (typeof req.body.messages === 'undefined' || req.body.messages == null
        || typeof req.body.wall_id === 'undefined' || req.body.wall_id == null
        || typeof req.body.controlString === 'undefined' || req.body.controlString == null
        || typeof req.body.nickname === 'undefined' || req.body.nickname == null) {
        res.status(common.StatusMessages.PARAMETER_UNDEFINED_ERROR.status)
            .json({message: common.StatusMessages.PARAMETER_UNDEFINED_ERROR.message});
    }

    if (mm.studentIsOnWall(req.body.wall_id, req.body.nickname)) {
        for (var m = 0; m < req.body.messages.length; m++) {
            var message = req.body.messages[m];
            var query = Message.findOneAndUpdate({
                _id: message._id
            }, message, {new: true});

            query.exec(function (error, updated_message) {
                if (error) {
                    res.status(common.StatusMessages.UPDATE_ERROR.status).json({
                        message: common.StatusMessages.UPDATE_ERROR.message, result: error
                    });
                } else {
                    // Update the message manager to notify other clients
                    if (req.body.controlString !== 'none') {
                        mm.postUpdate(req.body.wall_id, updated_message.question_id, req.body.nickname, updated_message, req.body.controlString, false);
                    }

                    res.status(common.StatusMessages.UPDATE_SUCCESS.status).json({
                        message: common.StatusMessages.UPDATE_SUCCESS.message, result: updated_message
                    });
                }
            })
        }
    } else {
        res.status(common.StatusMessages.INVALID_USER.status).json({
            message: common.StatusMessages.INVALID_USER.message
        });
    }

};

/**
 * @api {get} /export/:wallid Get a wall to be formatted for export purposes
 * @apiName exportWall
 * @apiGroup non-authorised
 *
 */
exports.exportWall = function(req, res) {

    if (typeof req.params.wall_id === 'undefined' || req.params.wall_id == null) {
        res.status(common.StatusMessages.PARAMETER_UNDEFINED_ERROR.status)
            .json({message: common.StatusMessages.PARAMETER_UNDEFINED_ERROR.message});
    }

    var query = Wall.findOne({
        _id : req.params.wall_id
    });
    query.select('-pin');
    query.select('-closed');
    query.exec(function(error, wall) {
        if(error) {
            res.status(common.StatusMessages.DELETE_ERROR.status).json({
                message: common.StatusMessages.DELETE_ERROR.message, result: error});
        }
        else {

            var expandedResultsPromise = [];
            wall.questions.forEach(function(question) {    // Collect Fixtures for the user and include in return
                expandedResultsPromise.push(populateQuestion(question));
            });
            Promise.all(expandedResultsPromise).then(function(questionsArray) {
                wall.questions = questionsArray;
                res.status(common.StatusMessages.GET_SUCCESS.status).json({
                    message: common.StatusMessages.GET_SUCCESS.message, result: wall});
            }).catch(function(err) {
                res.status(common.StatusMessages.DATABASE_ERROR.status)
                    .json({message: common.StatusMessages.DATABASE_ERROR.message});
            });
        }
    });
};

//function that returns a promise with a populated fixture with views and surveys based on an ID.
//Note: Only published fixtures will be returned
function populateQuestion(question) {

    return new Promise(function(resolve, reject) {

        var expandedResultsPromise = [];
        question.messages.forEach(function(message) {    // Collect Fixtures for the user and include in return
            expandedResultsPromise.push(populateMessage(message));
        });
        Promise.all(expandedResultsPromise).then(function(messagesArray) {
            question.messages = messagesArray;
            resolve(question);
        }).catch(function(err) {
            reject(err);
        });
        
        
        
    });
}

function populateMessage(message) {

    return new Promise(function(resolve, reject) {
        var query = Message.findOne({_id: message});
        //query.populate('messages');
        query.exec(function (err, expandedMessage) {
            if (err) {
                reject(err);
            }
            resolve(expandedMessage);
        });
    });
}

