/// <reference path="../../_references.ts"/>
/// <reference path="../../services/urlservice.ts"/>
/// <reference path="../../services/dataservice.ts"/>
/// <reference path="../editMessage/editMessage.ts"/>

module TalkwallApp {
	"use strict";
	import IBottomSheetService = angular.material.IBottomSheetService;
	import ISidenavService = angular.material.ISidenavService;

	export interface IWallControllerService {
		/**
		 * init function for this controller
		 */
		activate(): void;
	}

	export class WallController implements IWallControllerService {
		static $inject = ['URLService', 'DataService', '$mdSidenav', '$mdBottomSheet'];
		private magnified: boolean = false;

		constructor(
			private urlService: IURLService,
			private dataService: DataService,
			private $mdSidenav: ISidenavService,
			private $mdBottomSheet: IBottomSheetService) {
			console.log('--> WallController: started: ');

			if (this.dataService.checkAuthenticated()) {
				this.activate();
			}
		}

		activate(): void {
			console.log('--> WallController: activated: ');
		}

		showMessageEditor(): void {
			this.$mdSidenav('left').open();
			this.$mdBottomSheet.show({
				controller: EditMessageController,
				controllerAs: 'editMessageC',
				templateUrl: 'js/components/editMessage/editMessage.html'
			}).then(function(answer) {
				//dialog answered
				console.log('--> WallController: answer: ' + answer);
			}, function() {
				//dialog dismissed
				console.log('--> WallController: dismissed');
			});
		}

		toggleRightSideMenu(): void {
			this.$mdSidenav('right').toggle();
		}
	}
}