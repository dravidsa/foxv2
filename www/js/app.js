angular.module('app', ['ionic', 'app.controllers', 'app.services','app.routes','btford.socket-io','ionic-timepicker','ionic-datepicker'])

    .run(function ($rootScope, $state, $ionicPlatform, $window, $localstorage, Login) {
        var userModel = {
            isLogIn: false, userid:"", firstname: "", lastname: "", mobileno: "", emailid: "", birthdate: "",
            address1: "", address2: "", city: "", pincode: "", state: "", country: "", cardno: "", memberpin: "", points: "",
            pointsexpirydate:"",points_inprocess:"",points_redeemable:""
        }
        $rootScope.userModel = userModel;
        $rootScope.authtemplate = "templates/authTemplate.html";
        console.log  ( ' in run') ; 
        $rootScope.userModel.isLogIn = false ; 
        $rootScope.isEmptyObject= function(ob)
        {
            var obj = Object.getOwnPropertyNames(ob);
            if (obj.length == 0)
                return true;
            else
                return false;
        }

       
        
        var loginData = $localstorage.getObject('loginData');
        var userModelData = $localstorage.getObject('userModel');
        if ($rootScope.isEmptyObject(loginData) == true)
        {
            $rootScope.userModel.isLogIn = false;
        }
        else
        {
            $rootScope.userModel = userModelData;
        }

    })
.config(function (ionicDatePickerProvider) {
    var datePickerObj = {
      inputDate: new Date(),
      setLabel: 'Set',
      todayLabel: 'Today',
      closeLabel: 'Close',
      mondayFirst: false,
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'popup',
      from: new Date(2012, 8, 1),
      to: new Date(2018, 8, 1),
      showTodayButton: true,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: false,
      disableWeekdays: [6]
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
  })

.config(function (ionicTimePickerProvider) {
    var timePickerObj = {
      inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
      format: 12,
      step: 15,
      setLabel: 'Set',
      closeLabel: 'Close'
    };
    ionicTimePickerProvider.configTimePicker(timePickerObj);
  })

    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

        $httpProvider.defaults.headers.common = {};
        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.put = {};
        $httpProvider.defaults.headers.patch = {};

        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        $httpProvider.defaults.transformRequest = [function (data) {
            /**
             * The workhorse; converts an object to x-www-form-urlencoded serialization.
             * @param {Object} obj
             * @return {String}
             */
            var param = function (obj) {
                var query = '';
                var name, value, fullSubName, subName, subValue, innerObj, i;

                for (name in obj) {
                    value = obj[name];

                    if (value instanceof Array) {
                        for (i = 0; i < value.length; ++i) {
                            subValue = value[i];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                    else if (value instanceof Object) {
                        for (subName in value) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                    else if (value !== undefined && value !== null) {
                        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                    }
                }

                return query.length ? query.substr(0, query.length - 1) : query;
            };
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];

           });

