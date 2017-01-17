/// <reference path="../../_references.ts"/>
/// <reference path="../../models/models.ts"/>
/// <reference path="../../services/dataservice.ts"/>
/// <reference path="../../services/utilityservice.ts"/>

module TalkwallApp {
	"use strict";

    export interface IOrganiserItemController {
        deleteWall(): void;
        editDetails(): void;
        toggleLock(): void;
        editOrganisers(): void;
        shareWall(): void;
        deleteWall(): void;
        submitEditedDetails(): void;
    }

	class OrganiserItemController implements IOrganiserItemController {
		static $inject = ['$scope', 'DataService', '$document', 'UtilityService', '$window'];

		public wall: Wall;
		private showControls: boolean = false;
		private showEditor: boolean = false;
		private timeFromNow: string;
		private totalContributors: number;
		private totalMessages: number;

		constructor(
			private isolatedScope: OrganiserItemDirectiveScope,
			public dataService: DataService,
			public $document: ng.IDocumentService,
            public utilityService: UtilityService,
			public $window: ng.IWindowService) {

            this.wall = isolatedScope.data;
            this.timeFromNow = UtilityService.getFormattedDateTimeFromNow(this.wall.lastOpenedAt);

			this.totalContributors = this.totalMessages = 0;
			this.wall.questions.forEach((q) => {
				this.totalContributors += q.contributors.length;
				this.totalMessages += q.messages.length;
			});

		};

		toggleShowControls(): void {
			this.showControls = !this.showControls;
		}

		editDetails(): void {
		    this.showEditor = true;
			this.showControls = false;
		}

		toggleLock(): void {
		    this.wall.closed = !this.wall.closed;
		    this.dataService.updateWall(this.wall, (wall) => {
		        this.wall.pin = wall.pin;
            }, () => {
		        console.log('error updating wall');
            });
			this.showControls = false;
		}

		editOrganisers(): void {
            this.showControls = false;
		}

		shareWall(): void {
			this.showControls = false;
		}

		deleteWall(): void {
		    this.wall.deleted = true;
            this.dataService.updateWall(this.wall, null, null);
			this.showControls = false;
		}

        submitEditedDetails(): void {
            this.dataService.updateWall(this.wall, null, null);
            this.showEditor = false;
        }

	}

	//isolated scope interface
	export interface OrganiserItemDirectiveScope extends ng.IScope {
		data: Wall;
		showEditPanel(): void;
		openThisWall(): void;
	}

	//directive declaration
	export function OrganiserItem(): ng.IDirective {
		return {
			restrict: 'A',
			scope: {
				data: '=',
				showEditPanel: "&",
				openThisWall: "&"
			},
			templateUrl: 'js/components/organiserItem/organiserItem.html',
			controller: OrganiserItemController,
			controllerAs: 'orgItemC',
			replace: true
		};
	}
}