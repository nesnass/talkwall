/// <reference path="../_references.ts"/>
/// <reference path="urlservice.ts"/>
/// <reference path="authenticationservice.ts"/>
/// <reference path="utilityservice.ts"/>
/// <reference path="urlservice.ts"/>
/// <reference path="../models/models.ts"/>

module TalkwallApp {
    "use strict";
    import IRouteParamsService = angular.route.IRouteParamsService;
    import ILocationService = angular.ILocationService;
    import IPromise = angular.IPromise;
    import IMedia = angular.material.IMedia;

    export interface IDataService {

        /*
         ********* authenticated (teacher only) operations *********
         app.get('/walls',                   jwt({secret: secret.secretToken}),  tokenManager.verifyToken,   routes.teacher.getWalls);
         app.get('/wall/:id',                jwt({secret: secret.secretToken}),  tokenManager.verifyToken,   routes.teacher.getWall);
         app.post('/wall',                   jwt({secret: secret.secretToken}),  tokenManager.verifyToken,   routes.teacher.createWall);
         app.put('/wall',                    jwt({secret: secret.secretToken}),  tokenManager.verifyToken,   routes.teacher.updateWall);
         app.post('/question',               jwt({secret: secret.secretToken}),  tokenManager.verifyToken,   routes.teacher.createQuestion);

         ********* client (student / teacher) operations *********
         app.get('/join/:pin/:nickname',                                                                     routes.client.joinWall);
         app.get('/question/:wall_id/:question_id/:nickname',                                                routes.client.getQuestion);
         app.get('/poll/:wall_id/:question_id/:nickname',                                                    routes.client.poll);
         app.post('/message',                                                                                routes.client.createMessage);
         app.put('/message',

         */

        /**
         * check authentication status
         * @return status as boolean
         */
        userIsAuthorised(): boolean;

        /**
         * establish authentication status
         */
        checkAuthentication(sFunc: (success: {}) => void, eFunc: (error: {}) => void): void;
        /**
         * get authenticated user
         * @param sFunc success callback
         * @param eFunc error callback
         */
        requestUser(sFunc: (success: User) => void, eFunc: (error: {}) => void): void;
        /**
         * get last existing from services wall if any.
         * @param wallId string
         * @param sFunc success callback
         * @param eFunc error callback
         */
        requestWall(wallId: string, sFunc: (success: Wall) => void, eFunc: (error: {}) => void): void;
        /**
         * create a new wall
         * @param sFunc success callback
         * @param eFunc error callback
         */
        createWall(sFunc: (success: Wall) => void, eFunc: (error: {}) => void): void;
        /**
         * join a wall
         * @param sFunc success callback
         * @param eFunc error callback
         */
        joinWall(joinModel: {}, sFunc: (success: Wall) => void, eFunc: (error: {}) => void): void;
        /**
         * get current wall
         * @return the current wall
         */
        getWall(): Wall;
        /**
         * get current question
         * @return the current question
         */
        getQuestion(): Question;
        /**
         * get current nickname
         * @return the current nickname
         */
        setQuestion(questionIndex: number, sFunc: () => void, eFunc: (error: {}) => void): void;
        /**
         * get current nickname
         * @return the current nickname
         */
        getNickname(): string;
        /**
         * set a question based on id
         * @param questionIndex index in the questions array
         * @param sFunc success callback
         * @param eFunc error callback
         */
        requestPoll(previousQuestionId: string, control: string, sFunc: () => void, eFunc: (error: {}) => void): void;
        /**
         * add new question to the wall
         * @param label the question
         * @param sFunc success callback
         * @param eFunc error callback
         */
        addQuestion(label: string, sFunc: (success: Question) => void, eFunc: (error: {}) => void): void;
        /**
         * post new message to the feed
         * @param sFunc success callback
         * @param eFunc error callback
         */
        addMessage(sFunc: (success: Question) => void, eFunc: (error: {}) => void): void;
        /**
         * delete a message from the feed
         * @param sFunc success callback
         * @param eFunc error callback
         */
        updateMessage(sFunc: (success: Question) => void, eFunc: (error: {}) => void): void;
        /**
         * get the board dimensions object
         * @return the dimension object
         */
        getBoardDivSize(): {};
        /**
         * set the board dimensions object
         * @param dimensions as a JSON object
         */
        setBoardDivSize(dimensions: {}): void;

        /**
         * set a message as the editable message object
         */
        setMessageToEdit(message: Message): void;
        /**
         * retrieve the editable message object
         */
        getMessageToEdit(): Message;
        /**
         * run the polling timer
         */
        startPolling(previous_question_id: string, control: string): void;
        /**
         * pause the polling timer
         */
        stopPolling(): void;
    }

    export class DataService implements IDataService {
        static $inject = ['$http', '$window', '$routeParams', '$location', '$interval', 'UtilityService', 'URLService', '$mdMedia'];
        private user: User = null;
        private wall: Wall = null;
        private question: Question = null;
        private messageToEdit: Message = new Message();
        private phoneMode: boolean = false;

        private timerHandle;

        //for dev only
        private studentNickname: string = null;
        private participants: Array<string> = [];
        private boardDivSize: {};
        private userAuthorised = false;

        constructor (private $http: ng.IHttpService,
                     private $window: ng.IWindowService,
                     private $routeParams: IRouteParamsService,
                     private $location: ILocationService,
                     private $interval: ng.IIntervalService,
                     private utilityService: UtilityService,
                     private urlService: IURLService,
                     private $mdMedia: IMedia) {
            console.log('--> DataService started ...');
        }

        // Remove token string from the address bar. Then, if authorised, get the user model and the most recent wall
        // Otherwise, follow on back to where we came from..
        checkAuthentication(successCallbackFn, errorCallbackFn): void {
            let tKey = 'authenticationToken', tokenKey = 'token';
            this.phoneMode = this.$mdMedia('max-width: 960px');
            var tokenParam = this.$routeParams[tKey] || '';
            if (tokenParam !== '') {
                //look at the route params first for 'authenticationToken'
                console.log('--> DataService: token from parameter');
                this.$window.sessionStorage[tokenKey] = tokenParam;
                //this will reload the page, clearing the token parameter. next time around it will hit the next 'else if'
                this.$location.search(tKey, null);
            } else if (this.$window.sessionStorage[tokenKey]) {
                this.userAuthorised = true;
                //look at the window session object for the token. time to load the question
                console.log('--> DataService: token already existing');

                this.requestUser((user: User) => {
                        if (user.lastOpenedWall === null) {
                            this.createWall(successCallbackFn, errorCallbackFn);
                        } else {
                            this.requestWall(user.lastOpenedWall, successCallbackFn, errorCallbackFn);
                        }
                    }, (error) => {
                        //TODO: handle get user error
                    }
                );
            } else {
                // Fall through..
                successCallbackFn();
            }
        }

        requestUser(successCallbackFn, errorCallbackFn): void {
            //this will return the correct user from the service, based on the req.user object.
            this.$http.get(this.urlService.getHost() + '/user')
                .success((data) => {
                    let resultKey = 'result';
                    this.user = data[resultKey];
                    console.log('--> DataService: getUser success');
                    if (typeof successCallbackFn === "function") {
                        successCallbackFn(this.user);
                    }
                })
                .catch((error) => {
                    console.log('--> DataService: getUser failure: ' + error);
                    if (typeof errorCallbackFn === "function") {
                        errorCallbackFn({status: error.status, message: error.message});
                    }
                });
        }


        requestWall(wallId, successCallbackFn, errorCallbackFn): void {
            //return the previous wall with a the existing PIN from REDIS (if expired return true)
            this.$http.get(this.urlService.getHost() + '/wall/' + wallId)
                .success((data) => {
                    let resultKey = 'result';
                    this.wall = data[resultKey];
                    console.log('--> DataService: getWall success');
                    this.setQuestion(0, successCallbackFn, errorCallbackFn);
                })
                .catch((error) => {
                    console.log('--> DataService: getWall failure: ' + error);
                    if (typeof errorCallbackFn === "function") {
                        errorCallbackFn({status: error.status, message: error.message});
                    }
                });
        }

        createWall(successCallbackFn, errorCallbackFn): void {
            this.$http.post(this.urlService.getHost() + '/wall', {label: "New Wall: " + new Date().toDateString()})
                .success((data) => {
                    let resultKey = 'result';
                    this.wall = data[resultKey];
                    console.log('--> DataService: getWall success');
                    if (typeof successCallbackFn === "function") {
                        successCallbackFn(this.wall);
                    }
                })
                .catch((error) => {
                    console.log('--> DataService: getWall failure: ' + error);
                    if (typeof errorCallbackFn === "function") {
                        errorCallbackFn({status: error.status, message: error.message});
                    }
                });
        }

        joinWall(joinModel, successCallbackFn, errorCallbackFn): void {
            this.$http.get(this.urlService.getHost() + '/join/' + joinModel.nickname + '/' + joinModel.pin)
                .success((data) => {
                    let resultKey = 'result';
                    this.wall = data[resultKey];
                    this.studentNickname = joinModel.nickname;
                    console.log('--> DataService: getWall success');
                    if (typeof successCallbackFn === "function") {
                        successCallbackFn(this.wall);
                    }
                })
                .catch((error) => {
                    console.log('--> DataService: getWall failure: ' + error);
                    if (typeof errorCallbackFn === "function") {
                        errorCallbackFn({status: error.status, message: error.message});
                    }
                });
        }

        // Accessor functions for passing messages between directives
        setMessageToEdit(message: Message) {
            this.messageToEdit = message;
        }

        getMessageToEdit(): Message {
            return this.messageToEdit;
        }

        userIsAuthorised(): boolean {
            return this.userAuthorised;
        }

        getWall(): Wall {
            return this.wall;
        }

        getQuestion(): Question {
            return this.question;
        }

        // If we are changing questions, set the polling params correctly
        setQuestion(questionIndex, successCallbackFn, errorCallbackFn): void {
            var previous_question_id = 'none', control = 'none';

            // If true, we are changing questions
            if (this.question !== null && this.wall.questions.indexOf(this.question) !== questionIndex) {
                previous_question_id = this.question._id;
                control = 'change';
            } else if (this.question === null) {  // If true, this is the first time we started polling on the wall
                control = 'new';
            }   // Otherwise, we continue to poll the same question

            this.question = this.wall.questions[questionIndex];
            this.stopPolling();
            this.startPolling(previous_question_id, control);
            if (typeof successCallbackFn === "function") {
                successCallbackFn(this.wall);
            }
        }

        getNickname(): string {
            if (this.userAuthorised) {
                return this.user.nickname;
            } else {
                return this.studentNickname;
            }
        }

        // Set previousQuestionIndex if we are changing questions. Else set it to -1
        requestPoll(previousQuestionId, control, successCallbackFn, errorCallbackFn): void {
            this.$http.get(this.urlService.getHost() + '/poll/' + this.getNickname() + '/' + this.wall._id +
                '/' + this.question._id + '/' + previousQuestionId + '/' + control)
                    .success((data) => {
                        let resultKey = 'result';
                        this.processUpdatedMessages(data[resultKey]);
                        if (typeof successCallbackFn === "function") {
                            successCallbackFn();
                        }
                    })
                    .catch((error) => {
                        if (typeof errorCallbackFn === "function") {
                            errorCallbackFn({status: error.status, message: error.message});
                        }
                    });
        }

        //generate a new question on server with _id and returns it
        addQuestion(label, successCallbackFn, errorCallbackFn): void {
            var question = new Question(label);
            this.$http.post(this.urlService.getHost() + '/question', {wall_id: this.wall._id, question: question})
                .success((data) => {
                    let resultKey = 'result';
                    question.createdAt = data[resultKey].createdAt;
                    question._id = data[resultKey]._id;
                    this.wall.questions.push(question);
                    this.question = question;
                    if (typeof successCallbackFn === "function") {
                        successCallbackFn(question);
                    }
                })
                .catch((error) => {
                    console.log('--> DataService: getQuestion failure: ' + error);
                    if (typeof errorCallbackFn === "function") {
                        errorCallbackFn({status: error.status, message: error.message});
                    }
                });
        }

        //generate a new message on server with _id and returns it
        addMessage(successCallbackFn, errorCallbackFn): void {
            var nickname = this.getNickname();
            if (this.messageToEdit === null) {
                errorCallbackFn({status: '400', message: "message is not defined"});
            }
            this.messageToEdit.creator = this.getNickname();
            this.messageToEdit.origin.push({nickname: this.messageToEdit.creator, message_id: this.messageToEdit._id});
            this.messageToEdit.edits.push({date: this.messageToEdit.createdAt, text: this.messageToEdit.text});

            this.$http.post(this.urlService.getHost() + '/message', {
                message: this.messageToEdit,
                pin: this.wall.pin,
                nickname: nickname
            })
                .success((data) => {
                    let resultKey = 'result';
                    this.messageToEdit.createdAt = data[resultKey].createdAt;
                    this.messageToEdit._id = data[resultKey]._id;
                    this.question.messages.push(this.messageToEdit);
                    if (typeof successCallbackFn === "function") {
                        successCallbackFn(this.messageToEdit);
                    }
                })
                .catch((error) => {
                    console.log('--> DataService: getQuestion failure: ' + error);
                    if (typeof errorCallbackFn === "function") {
                        errorCallbackFn({status: error.status, message: error.message});
                    }
                });
        }

        //update a new on server and return it
        updateMessage(successCallbackFn, errorCallbackFn): void {
            if (this.messageToEdit === null) {
                errorCallbackFn({status: '400', message: "message is not defined"});
            }
            this.$http.put(this.urlService.getHost() + '/message', {
                    message: this.messageToEdit,
                    pin: this.wall.pin,
                    nickname: this.getNickname()
                })
                .success((data) => {
                    let resultKey = 'result';
                    var message = data[resultKey];
                    if (typeof successCallbackFn === "function") {
                        successCallbackFn(message);
                    }
                })
                .catch((error) => {
                    console.log('--> DataService: getQuestion failure: ' + error);
                    if (typeof errorCallbackFn === "function") {
                        errorCallbackFn({status: error.status, message: error.message});
                    }
                });
        }

        /*
        deleteMessage(successCallbackFn, errorCallbackFn): void {
            //update message on server with _id and returns it
            // this.$http.put('message.json')
            //on response, update the feed
            /*let idKey = '_id';
             for (var i = 0; i < this.question.messageFeed.length; i++) {
             if (this.question.messageFeed[i][idKey] === message._id) {
             this.question.messageFeed.splice(i, 1);
             this.question.messageFeed.splice(i, 0, message);
             }
             }
            //if we get a 200 response we are happy, nothing to do
            successCallbackFn();
        }
        */

        setBoardDivSize(newSize: any): void {
            console.log('--> Dataservice: setBoardDivSize: ' + angular.toJson(newSize));
            this.phoneMode = this.$mdMedia('max-width: 960px');
            this.boardDivSize = newSize;
        }

        getBoardDivSize() {
            return this.boardDivSize;
        }

        //  Run the polling timer
        // 'previous_question_id' can be an empty string if not changing questions
        // 'control' this is a regular poll 'none', the first poll 'new', or we are changing questions 'change'
        startPolling(previous_question_id: string, control: string) {
            // Don't allow more than one timer
            if ( angular.isDefined(this.timerHandle) ) {
                return;
            }

            // Make the special request without delay, and set up regular polling
            this.requestPoll(previous_question_id, control, (success) => {

                // Begin further requests at time intervals
                this.timerHandle = this.$interval(() => {
                    this.requestPoll('none', 'none', null, null);
                }, 5000);

            }, null);
        }

        // Stop the polling timer
        stopPolling() {
            if (angular.isDefined(this.timerHandle)) {
                this.$interval.cancel(this.timerHandle);
                this.timerHandle = undefined;
            }
        }


        // Process updated messages retrieved on the poll response
        processUpdatedMessages(pollUpdateObject: PollUpdate) {

            // Status updates

            // Update participant list
            this.participants = pollUpdateObject.status.connected_nicknames;
            // Change questions if directed by the update
            if (pollUpdateObject.status.select_question_id !== this.question._id) {
                this.setQuestion(this.wall.getQuestionIndexById(pollUpdateObject.status.select_question_id), null, null);
            }

            // Message updates

            pollUpdateObject.messages.forEach(function(message) {
                console.log('Message from: ' + message.creator + ' : ' + message.text);
            });
        }
    }
}
