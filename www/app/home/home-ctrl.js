// weather app based on driftyco ionic-weather
// https://github.com/driftyco/ionic-weather
angular.module('ionic.metApp')
	.controller('HomeCtrl', function(metApi, $scope, $timeout, $rootScope, Weather, Geo, Flickr, $ionicModal, $ionicPlatform, $ionicPopup, $interval, $ionicBackdrop, $state, $ionicHistory) {
		var _this = this;
		$scope.activeBgImageIndex = 0;
		// $scope.country = '';
		$scope.isFlipped = false;
		//  - - - - - - - - - - - - - - -  -
		// interval block: how ofter the app will refresh it's data \\
		var interval = 10 * 60000;
		$interval(function time() {
			// $scope.refreshData();
			$rootScope.ref_trin();
			$rootScope.ref_bago();
			console.log("fetch info and location", 'cache cleared');
			$ionicHistory.clearCache()
		}, interval);

		$rootScope.$on("call_test", function() {
			$scope.test();
			// $scope.$emit("pingBack", $scope.test());
		})
		// this ,ethod will be called from a parent controller in the app.js file
		$scope.test = function() {
			return "LOL";
		}
		// flip tp tobago after making all calls if location is tobago
		setTimeout(function() {
			if ($rootScope.c == "Tobago") {
				$scope.flip('Tobago')
			}
		}, 1000);
		// end if interval block

		//  - - - - - - - - - - - - - - - - - - -
		// MET API functions: all function look to met factory for consuming data

		$scope.set_due_point = function(idx, arr) {
			var p = arr[idx].value;
			// console.log('dew point', p);
			var pat = /([0-9\.]+)%/g;
			// if tobago then switch to tobago dewpoint
			return (r = pat.exec(p))[0];
		}

		// show alert: can show any type of alert, its a very generic function
		$scope.showAlert = function(title, message) {
			var alertPopup = $ionicPopup.alert({
				title: title,
				template: message
			})
		}

		$scope.flip = function(country) {
			$scope.isFlipped = !$scope.isFlipped;
			// console.debug($scope)
			if (country == "Trinidad") {
				$rootScope.ref_trin();
			} else {
				$rootScope.ref_bago();
			}
		}

		$scope.$on('$ionicView.beforeEnter', function() {
			console.log('before enter')
			// $state.reload();
			// $ionicHistory.clearCache();
			// $ionicHistory.clearHistory();
		})

		// close any modal found in the scope
		// also special case: if modal is a child of met services menu then open parent
		$scope.closeModal = function(a) {
			$scope.modal.hide();
		}

		$scope.$on('modal.hidden', function() {
			$ionicBackdrop.release();
		})

		// open uv info modal
		// $scope.uv_modalOpen = function() {
		// 	$ionicBackdrop.retain();
		// 	if (!$scope.uv_modal) {
		// 		$ionicModal.fromTemplateUrl('app/home/uv_modal.html', function(uv_modal) {
		// 			$scope.uv_modal = uv_modal;
		// 			$scope.uv_modal.show();
		// 		}, {
		// 			// animation we want for modal entrance
		// 			// animation: 'scale-in'
		// 			animation: 'slide-in-up'
		// 		})
		// 	} else {
		// 		$scope.uv_modal.show();
		// 	}
		// }


		// helper functins
		// they help format dates and stuff
		// get us the time of day as a string
		$scope.timeOfDay = function() {
			var date = new Date();
			var time = date.getHours();
			var s = "";

			if (time >= 0 && time < 12) {
				s = "morning";
			} else if (time >= 12 && time < 18) {
				s = "mid day";
			} else if (time >= 18) {
				s = "night";
			};

			return s;
		}

		// get us the hour of day: primarily for displaying the uv index hour
		$scope.hourOfDay = function() {
			var d = new Date();
			var t = d.getHours();
			if (t >= 0 && t <= 12) {
				t = (t == 0 ? '12' : t) + 'am';
			}
			if (t > 12) {
				t = (t - 12) + 'pm';
			}
			return t;
		}

		// a full date in array
		$scope.my_date = function() {
			var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
			var today = new Date();
			return [days[today.getDay()], today.getDate(), months[today.getMonth()], today.getFullYear()];
		}

		// return a string of any day from the current day
		// @ add_days will be the number of days to add to today
		$scope.day_string = function(add_days) {
			var today = new Date();
			var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'];
			return days[today.getDay() + add_days];
		}

		// convert a unix timestamp to a full date
		$scope.convertTimestamp = function(UNIX_timestamp) {
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

		// testing a function to dynamically change text color
		$scope.getAverageRGB = function(el, el2) {
			var blockSize = 5,
				defaultRGB = {
					r: 0,
					g: 0,
					b: 0
				},
				canvas = document.createElement('canvas'),
				context = canvas.getContext && canvas.getContext('2d'),
				data, width, height,
				i = -4,
				length,
				rgb = {
					r: 0,
					g: 0,
					b: 0
				},
				count = 0;
			var bright = 0;
			if (!context) {
				return defaultrgb;
			}
			height = canvas.height = el.naturalHeight || el.offsetHeight || el.height;
			width = canvas.width = el.naturalWidth || el.offsetWidth || el.width;
			context.drawImage(el, 0, 0);
			data = context.getImageData(0, 0, width, height);
			length = data.data.length;

			while ((i += blockSize * 4) < length) {
				++count;
				rgb.r += data.data[i];
				rgb.g += data.data[i + 1];
				rgb.b += data.data[i + 2];
				bright += (0.34 * rgb.r + 0.5 * rgb.g + 0.16 * rgb.b);
				if (bright !== 0) bright /= 2;
			}
			// bright = 0.1;
			if (bright > 0.5) var textColor = "#FFFFFF";
			else var textColor = "#000000";

			// ~~ used to floor values
			rgb.r = ~~ (rgb.r / count);
			rgb.g = ~~ (rgb.g / count);
			rgb.b = ~~ (rgb.b / count);
			$(el2 + '.bar, ' + el2 + '.d3').css('background-color', 'rgba(' + [rgb.r, rgb.g, rgb.b, 0.6].join(', ') + ')');
			$('#cw-summary').css('color', textColor);
			$(el2 + '.of1').css('background-color', 'rgba(' + [rgb.r, rgb.g, rgb.b, 0.9].join(', ') + ')');
			$('.item-complex').css('border-bottom', '1px solid rgba(' + [rgb.r, rgb.g, rgb.b, 0.9].join(', ') + ')');
		}

		function is_word_in_string(string, word) {
			return new RegExp('\\b' + word + '\\b', 'i').test(string);
		}
	})
	.controller('TrinCtrl', function(metApi, $scope, $timeout, $rootScope, Weather, Geo, Flickr, $ionicModal, $ionicPlatform, $ionicPopup, $interval, $ionicBackdrop, $state) {
		var _this = this;
		$scope.fcasttrin = "sunny"; // default trin image
		$scope.fcastbago = "sunny";

		$rootScope.ref_trin = function() {
			_this.refreshData();
		}

		_this.refreshData = function() {
			Geo.getLocation().then(function(position) {
				var lc = "";
				var lat = position.coords.latitude;
				var lng = position.coords.longitude;
				// google map service will give us a location string based on our current location (or nearest detected location)
				Geo.reverseGeocode(lat, lng).then(function(locString) {
					$scope.currentLocationString = locString;
					$scope.country = $scope.currentLocationString.indexOf('Tobago') > -1 ? 'Tobago' : 'Trinidad';
					$scope.$watch('country', function() {
						$rootScope.c = $scope.country;
					})
					_this.getCurrent(lat, lng);
					_this.get_uv_index();
					_this.metars_trin();
					_this.trin_3day();
					// setTimeout(function() {
					// 	$scope.getAverageRGB(document.querySelector('#i-trin'), '.trin')
					// }, 2000)
					// getAverageRGB(el)
				});
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

		_this.getCurrent = function(lat, lng) {
			Weather.getAtLocation(lat, lng).then(function(resp) {
				$scope.current = resp.data;
				$rootScope.$broadcast('scroll.refreshComplete');
				var s = $scope.timeOfDay(); // time of day, eg: morning, night
				$scope.today = $scope.my_date();; // today is
				// $scope.time = convertTimestamp($scope.current.currently.time); //t.toISOString();
				// fetch a background image from flickr based on out location, time and current weather conditinos
				console.log('currently', $scope.current)
				_this.getBackgroundImage("Trinidad");
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

		// gives us a random background after a refresh
		_this.cycleBgImages = function() {
			$timeout(function cycle() {
				if ($scope.bgImages) {
					$scope.activeBgImage = $scope.bgImages[$scope.activeBgImageIndex++ % $scope.bgImages.length + 3];
					setTimeout(function() {
						$scope.getAverageRGB(document.querySelector('#i-trin'), '.trin')
					}, 2000)
				}
			})
		}

		// gets images from flickr, consimes flicker api, with s failed attempt to cache images in local storage
		this.getBackgroundImage = function(locString) {
			Flickr.search(locString).then(function(resp) {
				var photos = resp.photos;
				console.debug('photos', photos)
				$scope.bgImages = photos.photo;
				_this.cycleBgImages();
			}, function(error) {
				console.log('Unable to get Flickr images', error);
			})
		}

		_this.get_uv_index = function() {
			var today_index = [];
			var today = new Date();
			var el = document.getElementById('uv-index');
			var d = today.getDate() + '.' + (today.getMonth() + 1) + '.' + today.getFullYear();
			$scope.hour_of_day = $scope.hourOfDay();
			// these indexes represent uv values. but instead of using the value directly we use a color in place of the index to represent the value
			// the index will match to a color class to represent the uv_index value on the summary page
			var uv_c = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11'];
			metApi.get_uv_index(function(data) {
				// console.log(data);
				// console.log("UV Index: ");

				// drop all uv_info not for today
				for (var i = 0; i < data.items.length; i++) {
					var uv_date_clean = data.items[i].uv_date.trim();
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

					// find uv index color
					// uv range color values array will come here
					// ii = 2;
					// ensure the uv value matches the correct color class
					// i = 10;
					var ci = i == 0 || i == 1 ? 0 : i == 11 || i > 11 ? (11 - 1) : i - 1;
					$scope.uv_color = uv_c[ci];

					// remove any stray uv classes from the uv display
					for (x = 0; x < uv_c.length; x++) {
						if (hasClass(el, uv_c[x])) {
							el.classList.remove(uv_c[x])
							// console.log(uv_c[x])
						}
					}
					$scope.$watch('uv_color', function() {
						el.className = el.className + "  " + $scope.uv_color;
						// console.log('uv color value', $scope.uv_color, ci, i);
						// console.log("watch on uv_value updated");
					})
				}
				// else {
				// 	// just some placeholder data for when the uv index has not been updated yet
				// 	var ti = [{
				// 		'uv_value': 0
				// 	}]
				// 	var el = document.getElementById('uv-index');
				// 	$scope.uv_index = ti[0];
				// 	el.className = el.className + " c1";
				// }
			})

			if (!today_index.length) {
				var ti = [{
						'uv_value': 0
					}]
					// var el = document.getElementById('uv-index');
				$scope.uv_index = ti[0];
				el.className = el.className + " c1";
			}
		}

		function hasClass(el, cls) {
			return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
		}

		_this.metars_trin = function() {
			$scope.current_temp_trin = "No data";
			metApi.get_metar(function(data) {
				var m = data.items;
				// gets the current temp, we only care about the exact number so pull that out from the string

				// these are the ids of the metas we want for trinidad
				var ids = [{
					'id': 1, // metar fir
					'icon': 'icon ion-ios-location-outline',
					'el': 'met-loc',
					'show': true
				}, {
					'id': 2, // text
					'icon': 'icon ion-thermometer',
					'el': null,
					'show': false
				}, {
					'id': 3, // temp
					'icon': 'icon ion-thermometer',
					'el': 'temp',
					'show': true
				}, {
					'id': 4, // dewpoint
					'icon': 'icon ion-waterdrop',
					'el': 'dew',
					'show': true
				}, {
					'id': 5, // pressure
					'icon': 'icon ion-ios-speedometer-outline',
					'el': 'pressure',
					'show': true
				}, {
					'id': 6, // winds
					'icon': 'icon ion-ios-analytics-outline',
					'el': 'winds',
					'show': true
				}, {
					'id': 7, // visibility
					'icon': 'icon',
					'el': 'weather',
					'show': false
				}, {
					'id': 8, // ceiling
					'el': 'weather',
					'show': false
				}, {
					'id': 9, // clouds
					'icon': 'icon ion-ios-cloudy-outline',
					'el': 'clouds',
					'show': true
				}, {
					'id': 10, // weather
					'icon': 'icon ion-umbrella',
					'el': 'weather',
					'show': false
				}];

				_this.mdata = [];
				for (i = 0; i < m.length; i++) {
					if (m[i].station == "TTPP") {
						_this.mdata.push({
							'id': m[i].id,
							'label': m[i].label,
							'station': m[i].station,
							'value': m[i].value,
							'icon': ids[i].icon,
							'el': ids[i].el,
							'show': ids[i].show
						});
					}
				}

				$scope.current_temp_trin = _this.mdata[2].value.substring(0, 3);
				$scope.dew_point_trin = $scope.set_due_point(3, _this.mdata);
				console.debug('metars trin', data);
				$scope.summary_text_trin = _this.mdata[1].value.indexOf('NOSIG') > -1 ? 'Clear ' + $scope.timeOfDay() : '';
			})
		}

		$scope.showMetarsTrin = function() {
			$ionicBackdrop.retain();
			if (!$scope.mettrin_modal) {
				// load modal from given template URL
				$ionicModal.fromTemplateUrl('app/home/metars-trin.html', function(mt_modal) {
					$scope.mettrin_modal = mt_modal;
					$scope.mettrin_modal.show();
				}, {
					// animation we want for modal entrance
					// animation: 'scale-in'
					animation: 'slide-in-up'
				})
			} else {
				$scope.mettrin_modal.show();
			}
		}
		_this.trin_3day = function(t) { // can be input of the country we load data for
			metApi.get_o_tv(function(data) {
				var i = data.items[0];
				// 3- day forecast
				// days as text
				// $scope.t = $scope.day_string(0);
				$scope.t = 'Today';
				$scope.tm = $scope.day_string(1);
				$scope.nd = $scope.day_string(2);
				// will need to find a way to switch between trin and bago here
				_this.max24 = i.maxTrin24look;
				_this.min24 = i.minTrin24look;
				_this.max48 = i.maxTrin48look;
				_this.min48 = i.minTrin48look;
			})

			// get forecast
			metApi.get_forecast(function(data) {
				var f = data.items[0];
				_this.ftime_trin = f.forecastTime;
				if(_this.ftime_trin == "05:30PM") {
					$scope.t = 'Tonight';
				}
				_this.th = f.PiarcoFcstMnTemp;
				_this.tl = f.PiarcoFcstMxTemp;
				$scope.fcasttrin = f.imageTrin;
				console.debug($scope.fcasttrin);
				// $scope.$watch('fcasttrin', function() {
					// $scope.fct = f.imageTrin;
				// })
				// $scope.summary_text_trin = f.textArea1;
			})
		}

		_this.refreshData();
	})
	.controller('BagoCtrl', function(metApi, $scope, $timeout, $rootScope, Weather, Geo, Flickr, $ionicModal, $ionicPlatform, $ionicPopup, $interval, $ionicBackdrop, $state) {
		var _this = this;

		// refresh when we flip screen
		$rootScope.ref_bago = function() {
			_this.refreshData();
		}

		_this.refreshData = function() {
			Geo.getLocation().then(function(position) {
				var lc = "";
				var lat = position.coords.latitude;
				var lng = position.coords.longitude;
				// google map service will give us a location string based on our current location (or nearest detected location)
				Geo.reverseGeocode(lat, lng).then(function(locString) {
					$scope.currentLocationString = locString;
					// $scope.country = $scope.currentLocationString.indexOf('Tobago') > -1 ? 'Tobago' : 'Trinidad';
					_this.getCurrent(lat, lng);
					// _this.get_uv_index();
					_this.metars_bago();
					_this.bago_3day();
					_this.set_time_bubble();
				});
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

		_this.getCurrent = function(lat, lng) {
			Weather.getAtLocation(lat, lng).then(function(resp) {
				$scope.current = resp.data;
				$rootScope.$broadcast('scroll.refreshComplete');
				var s = $scope.timeOfDay(); // time of day, eg: morning, night
				$scope.today = $scope.my_date();; // today is
				// $scope.time = convertTimestamp($scope.current.currently.time); //t.toISOString();
				// fetch a background image from flickr based on out location, time and current weather conditinos
				console.log('currently', $scope.current)
				_this.getBackgroundImage($scope.current.currently.summary + ", Tobago");
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

		// gives us a random background after a refresh
		_this.cycleBgImages = function() {
			$timeout(function cycle() {
				if ($scope.bgImages) {
					$scope.activeBgImage = $scope.bgImages[$scope.activeBgImageIndex++ % $scope.bgImages.length];
					setTimeout(function() {
						$scope.getAverageRGB(document.querySelector('#i-bago'), '.bago')
					}, 2000)
				}
			})
		}

		// gets images from flickr, consimes flicker api, with s failed attempt to cache images in local storage
		this.getBackgroundImage = function(locString) {
			Flickr.search(locString).then(function(resp) {
				var photos = resp.photos;
				$scope.bgImages = photos.photo;
				_this.cycleBgImages();
			}, function(error) {
				console.log('Unable to get Flickr images', error);
			})
		}

		_this.metars_bago = function() {
			metApi.get_metar(function(data) {
				var m = data.items;

				// ids of metars for tobago
				var ids = [{
					'id': 9, // metar for
					'icon': 'icon ion-ios-location-outline',
					'el': 'met-loc',
					'show': true
				}, {
					'id': 10, // text
					'icon': 'icon ',
					'el': null,
					'show': false
				}, {
					'id': 11, // temperature
					'icon': 'icon ion-thermometer',
					'el': 'temp',
					'show': true
				}, {
					'id': 12, // dewpoint
					'icon': 'icon ion-waterdrop',
					'el': 'dew',
					'show': true
				}, {
					'id': 13, // pressure
					'icon': 'icon ion-ios-speedometer-outline',
					'el': 'pressure',
					'show': true
				}, {
					'id': 14, // winds
					'icon': 'icon ion-ios-analytics-outline',
					'el': 'winds',
					'show': true
				}, {
					'id': 15, // visibility
					'icon': 'icon ion-thermometer',
					'el': null,
					'show': false
				}, {
					'id': 16, // ceiling
					'icon': 'icon ',
					'el': null,
					'show': false
				}, {
					'id': 17, // clouds
					'icon': 'icon ion-ios-cloudy-outline',
					'el': 'clouds',
					'show': true
				}];

				_this.mdatab = null;
				_this.mdatab = [];
				var c = 0;
				for (i = 0; i < m.length; i++) { // metars
					if (m[i].station == 'TTCP') {
						_this.mdatab.push({
							'id': m[i].id,
							'label': m[i].label,
							'station': m[i].station,
							'value': m[i].value,
							'icon': ids[c] != undefined ? ids[c].icon : '',
							'el': ids[c] != undefined ? ids[c].el : '',
							'show': ids[c] != undefined ? ids[c].show : ''
						});
						// console.log(i, ids[c])
						c++;
					}
				}


				$scope.current_temp = _this.mdatab[2].value.substring(0, 3);
				console.log('bago temp', _this.mdatab)
				$scope.dew_point = $scope.set_due_point(3, _this.mdatab);
				$scope.summary_text = _this.mdatab[1].value.indexOf('NOSIG') > -1 ? 'Clear ' + $scope.timeOfDay() : '';
			})
		}

		_this.set_time_bubble = function() {
			// these indexes represent uv values. but instead of using the value directly we use a color in place of the index to represent the value
			// the index will match to a color class to represent the uv_index value on the summary page
			var today = new Date();
			var d = today.getDate() + '.' + (today.getMonth() + 1) + '.' + today.getFullYear();
			$scope.hour_of_day = $scope.hourOfDay();
		}

		$scope.showMetarsBago = function() {
			$ionicBackdrop.retain();
			if (!$scope.metbago_modal) {
				// load modal from given template URL
				$ionicModal.fromTemplateUrl('app/home/metars-bago.html', function(mb_modal) {
					$scope.metbago_modal = mb_modal;
					$scope.metbago_modal.show();
				}, {
					// animation we want for modal entrance
					// animation: 'scale-in'
					animation: 'slide-in-up'
				})
			} else {
				$scope.metbago_modal.show();
			}
		}

		_this.bago_3day = function(t) { // can be input of the country we load data for
			metApi.get_o_tv(function(data) {
				var i = data.items[0];
				// 3- day forecast
				// days as text
				// need to find a bettwe way to do this as it will fail at the end of the week
				// $scope.tb = $scope.day_string(0);
				$scope.t = 'Today';
				$scope.tm = $scope.day_string(1);
				$scope.nd = $scope.day_string(2);
				_this.max24 = i.maxTbo24look;
				_this.min24 = i.minTbo24look;
				_this.max48 = i.maxTob48look;
				_this.min48 = i.minTob48look;
			})

			// get forecast
			metApi.get_forecast(function(data) {
				var f = data.items[0];

				_this.ftime_bago = f.forecastTime;
				if(_this.ftime_bago == "05:30PM") {
					$scope.t = 'Tonight';
				}
				$scope.fcastbago = f.imagebago;
				_this.th = f.CrownFcstMnTemp;
				_this.tl = f.CrownFcstMxTemp;
			})
		}

		_this.refreshData();

	})
	.directive('weatherIconTrin', function() {
		// // console.log($timeout)
		// return {
		// 	restrict: 'E',
		// 	replace: true,
		// 	scope: {
		// 		fcasttrin: '=fcasttrin'
		// 	},
		// 	templateUrl: 'app/home/svg/{{fcasttrin}}.html',
		// 	// link: function($scope, $element, $attr) { }
		// }
		return {
	        restrict: 'E',
	        link: function(scope, element, attrs) {
	        	setTimeout(function() {
	        		var j = scope.fcasttrin.replace(/\s/g, "-").toLowerCase();
	        		console.debug('fcast trin', scope.fcasttrin)

	        		scope.getContentUrl  = function() {
	        			return 'app/home/svg/'+j+'.html';
	        		}
	        	}, 2000)
	        },
	        template: '<div ng-include="getContentUrl()"></div>'
	    };
	})
	.directive('weatherIconBago', function($timeout) {
		return {
			restrict: 'E',
			link: function(scope, element, attrs) {
	        	setTimeout(function() {
	        		var j = scope.fcastbago.replace(/\s/g, "-").toLowerCase();
	        		console.debug('fcast bago', scope.fcastbago)
	        		scope.getContentUrl  = function() {
	        			return 'app/home/svg/'+j+'.html';
	        		}
	        	}, 2000)
	        },
	        template: '<div ng-include="getContentUrl()"></div>'
		}
	})
	// .directive('passObject', function() {
	//     return {
	//         restrict: 'E',
	//         // replace: true,
	//         // scope: { fcasttrin: '=fcasttrin' },
	//         // controller: function($scope, $rootScope) {
	//         // 	$scope.ff = $scope.fcasttrin;
	//         // 	console.debug('directive controller:', $scope.fcasttrin)
	//         // },
	//         link: function(scope, element, attrs) {
	//         	setTimeout(function() {
	//         		console.debug(scope.fcasttrin)
	//         		scope.getContentUrl  = function() {
	//         			return 'app/home/svg/'+scope.fcasttrin+'.html';
	//         		}
	//         	}, 2000)
	//         },
	//         template: '<div ng-include="getContentUrl()"></div>'
	//         // template: 'app/home/svg/{{ff}}.html',
	//     };
	// });
