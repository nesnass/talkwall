/// <reference path="../../_references.ts"/>
/// <reference path="../../services/urlservice.ts"/>
/// <reference path="../../services/dataservice.ts"/>
/// <reference path="../../services/utilityservice.ts"/>
/// <reference path="../editMessagePanel/editMessagePanel.ts"/>

module TalkwallApp {
    "use strict";
    import IBottomSheetService = angular.material.IBottomSheetService;
    import ISidenavService = angular.material.ISidenavService;
    import IWindowService = angular.IWindowService;
    import IScope = angular.IScope;

    export interface IOrganiserControllerService {
        /**
         * init function for this controller
         */
        activate(): void;
    }

    export class OrganiserController implements IOrganiserControllerService {
        static $inject = ['DataService', '$mdSidenav', '$mdBottomSheet', '$translate', '$scope', '$timeout', 'URLService', '$window', 'UtilityService'];

        private user: User;
        private walls: Wall[];
        private newWall: {};

        constructor(
            private dataService: DataService,
            private $mdSidenav: ISidenavService,
            private $mdBottomSheet: IBottomSheetService,
            private $translate: angular.translate.ITranslateService,
            private $scope: IScope,
            private $timeout: angular.ITimeoutService,
            private urlService: IURLService,
            private $window: IWindowService,
            private utilityService: UtilityService) {
            console.log('--> OrganiserController: started: ');

            this.dataService.checkAuthentication(() => {
                this.activate();
            }, null);

            this.newWall = {
                label: "",
                theme: ""
            }

        }

        activate(): void {
            this.user = this.dataService.data.user;
            this.dataService.requestWalls((walls) => {
                this.walls = walls;
            }, () => {
                console.log("No walls found");
            })
        }

        createWall(): void {
            this.dataService.createWall(this.newWall, (wall) => {
                this.walls.push(wall);
            }, (error) => {
                console.log('Error creating wall: ' + error.message);
            })
        }

    }
}