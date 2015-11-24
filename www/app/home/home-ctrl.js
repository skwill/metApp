// weather app based on driftyco ionic-weather
// https://github.com/driftyco/ionic-weather
angular.module('ionic.metApp')
	.controller('HomeCtrl', function(metApi, $scope, $timeout, $rootScope, Weather, Geo, Flickr, $ionicModal, $ionicPlatform, $ionicPopup, $interval) {
		var _this = this;
		$scope.activeBgImageIndex = 0;
		$scope.has_images = false; // bool: tells us if we have images in cache or not
		//  - - - - - - - - - - - - - - -  -
		// interval block: how ofter the app will refresh it's data \\
		var interval = 10 * 60000;
		$interval(function time() {
			$scope.refreshData();
			console.log("fetch info and location")
		}, interval);

		$rootScope.$on("call_test", function() {
			$scope.test();
			// $scope.$emit("pingBack", $scope.test());
		})
		// this ,ethod will be called from a parent controller in the app.js file
		$scope.test = function() {
			return "LOL";
		}
		// end if interval block

		//  - - - - - - - - - - - - - - - - - - -
		// MET API functions: all function look to met factory for consuming data

		// gets the uv_index form out met factory
		_this.get_uv_index = function() {
			var today_index = [];
			metApi.get_uv_index(function(data) {
				// console.log(data);
				console.log("UV Index: ");
				var today = new Date();
				var d = today.getDate() + '.' + (today.getMonth() + 1) + '.' + today.getFullYear();
				$scope.hour_of_day = hour_of_day();
				// drop all uv_info not for today
				for (var i = 0; i < data.items.length; i++) {
					var uv_date_clean = data.items[i].uv_date;
					if (d == uv_date_clean) {
						today_index.push(data.items[i]);
					}
				}
				if (today_index.length) {
					$scope.uv_index = today_index[today_index.length - 1];
					var ii = Number($scope.uv_index.uv_value);
					var i = ii.toFixed(0);
					$scope.uv_index.uv_value = i; // our scope uv variable
					console.log($scope.uv_index);
				}
				// uv range color values array will come here
			})
		}
		_this.get_uv_index();

		// get current location based on device latitude and longitude, this feeds off google map api
		_this.getCurrent = function(lat, lng) {
			Weather.getAtLocation(lat, lng).then(function(resp) {
				$scope.current = resp.data;
				$rootScope.$broadcast('scroll.refreshComplete');
				var s = timeOfDay(); // time of day, eg: morning, night
				$scope.today = my_date();; // today is
				$scope.time = convertTimestamp($scope.current.currently.time); //t.toISOString();
				// fetch a background image from flickr based on out location, time and current weather conditinos
				_this.getBackgroundImage(lat, lng, $scope.current.currently.summary + ", " + $scope.current.daily.icon + ", carribbean, " + s);
			}, function(error) {
				var errorTxt = "";
				switch (error.status) {
					case 404:
						errorTxt = "No network connection";
						break;
					case 'The last location provider was disabled': // attempt to catch error of location services being disabled
						errorTxt = error.status + "<br> Try enabling Location services in Settings";
						break;
				}
				$scope.showAlert('Unable to get current conditions', errorTxt);
				$rootScope.$broadcast('scroll.refreshComplete');
			});
		};

		// our home controller freresh method, in charge of updating ion-* content on the forecast page, will trigger other function to update
		$scope.refreshData = function() {
			Geo.getLocation().then(function(position) {
				var lc = "";
				var lat = position.coords.latitude;
				var lng = position.coords.longitude;
				// google map service will give us a location string based on our current location (or nearest detected location)
				Geo.reverseGeocode(lat, lng).then(function(locString) {
					$scope.currentLocationString = locString;
				});
				_this.getCurrent(lat, lng);
			}, function(error) {
				// in some cases something may go wrong
				// most times locatio service for android may be turned off
				if (error.message == 'The last location provider was disabled') {
					error.message = error.message + "<br> Try enabling Location services in Settings";
				}
				$scope.showAlert('Unable to get current location', 'Try enabling Location services in Settings');
				$scope.currentLocationString = "Unable to get current location:" + error;
				$rootScope.$broadcast('scroll.refreshComplete');
			});
		};

		// show alert: can show any type of alert, its a very generic function
		$scope.showAlert = function(title, message) {
			var alertPopup = $ionicPopup.alert({
				title: title,
				template: message
			})
		}

		// gives us a random background after a refresh
		_this.cycleBgImages = function() {
			$timeout(function cycle() {
				if ($scope.bgImages) {
					$scope.activeBgImage = $scope.bgImages[$scope.activeBgImageIndex++ % $scope.bgImages.length];
				}
			})
		}

		// gets images from flickr, consimes flicker api, with s failed attempt to cache images in local storage
		this.getBackgroundImage = function(lat, lng, locString) {

			var photo_store = $scope.bgImages;
			// console.log("Has images: " + $scope.has_images);
			if ($scope.has_images) {
				// console.log('we have loaded images');
				// $scope.bgImages = window.localStorage.getItem('photo_store');
				// console.log($scope.bgImages);
				_this.cycleBgImages();

			} else {
				Flickr.search(locString, lat, lng).then(function(resp) {
					var photos = resp.photos;
					var images = [];
					// console.log("Photos");
					// console.log(resp);
					if (photos.photo.length) {
						$scope.bgImages = photos.photo;
						// console.log($scope.bgImages);
						// var photo_store = window.localStorage.getItem('photo_store');
						// if (photo_store) {

						// } else {

						for (i = 0; i < 20; i++) {
							images.push({
								i: $scope.bgImages[i]
							});
						}
						// images = {
						// 	'0': 1
						// }
						// images = angular.extend({}, images, images);
						// }

						// console.log('photo store empty');
						// window.localStorage['photo_store'] = images; //JSON.stringify(images);
						// }
						// console.log(images);
						_this.cycleBgImages();
						$scope.has_images = true;
					}
				}, function(error) {
					console.log('Unable to get Flickr images', error);
				})
			}

		}

		$scope.refreshData();


		// this is supposed to give us today's forecast
		// _this.getForecast = function() {
		// 	metApi.get_forecast(function(data) {
		// 		console.log(data)
		// 		// _this.bulletins = data.items[0];
		// 	});
		// }
		// _this.getForecast();

		// helper functins
		// they help format dates and stuff

		// get us the time of day as a string
		function timeOfDay() {
			var date = new Date();
			var time = date.getHours();
			var s = "";

			if (time >= 6 && time < 12) {
				s = "morning";
			} else if (time >= 12 && time < 18) {
				s = "mid day";
			} else if (time >= 18) {
				s = "night";
			};

			return s;
		}

		// get us the hour of day: primarily for displaying the uv index hour
		function hour_of_day() {
			var d = new Date();
			var t = d.getHours();
			if (t >= 0 && t < 12) {
				t = (t == 0 ? '12' : t) + 'am';
			}
			if (t > 12) {
				t = (t - 12) + 'pm';
			}

			return t;
		}

		// a full date in array
		function my_date() {
			var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
			var today = new Date();
			return [days[today.getDay()], today.getDate(), months[today.getMonth()], today.getFullYear()];
		}

		// convert a unix timestamp to a full date
		function convertTimestamp(UNIX_timestamp) {
			var a = new Date(UNIX_timestamp * 1000);
			var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			var year = a.getFullYear();
			var month = months[a.getMonth()];
			var date = a.getDate();
			var hour = a.getHours();
			var min = a.getMinutes();
			var sec = a.getSeconds();
			var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
			return time;
		}

		// show out met services menu as a partial modal
		$scope.showHomeMenu = function() {
			if (!$scope.home_menu_modal) {
				// load modal from given template URL
				$ionicModal.fromTemplateUrl('app/home/home_menu.html', function(hm_modal) {
					$scope.home_menu_modal = hm_modal;
					$scope.home_menu_modal.show();
				}, {
					// animation we want for modal entrance
					// animation: 'scale-in'
					animation: 'slide-in-up'
				})
			} else {
				$scope.home_menu_modal.show();
			}
		}

		// close any modal found in the scope
		// also special case: if modal is a child of met services menu then open parent
		$scope.closeModal = function(a) {
			$scope.modal.hide();
			if (a == "show_home") {
				$scope.showHomeMenu();
			}
		}

		// open uv modal from met services menu
		$scope.uv_modalOpen = function() {
			$scope.modal.hide();
			if (!$scope.uv_modal) {
				$ionicModal.fromTemplateUrl('app/home/uv_modal.html', function(uv_modal) {
					$scope.uv_modal = uv_modal;
					$scope.uv_modal.show();
				}, {
					// animation we want for modal entrance
					// animation: 'scale-in'
					animation: 'slide-in-up'
				})
			} else {
				$scope.uv_modal.show();
			}
		}
	})

.controller('SettingsCtrl', function($scope, Settings) {
	$scope.setings = Settings.getSettings();

	// watch for settings changes and save them if necessary
	$scope.$watch('settings', function(v) {
		Settings.save();
	}, true);

	$scope.closeSettings = function() {
		$scope.modal.hide();
		Settings.save();
	}

	$scope.changeCurrentTemp = function(type) {
		Settings.set('tempUnits', type);
		Settings.save(type)
	}
})
