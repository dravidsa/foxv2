angular.module('app.controllers', [])

    .controller('AppCtrl', function ($scope, $state, $rootScope, Config, $ionicLoading, $localstorage) {
        $scope.serverBaseUrl = Config.serverBaseUrl;
        $scope.logout = function () {
            $rootScope.userModel.isLogIn = false;

            $scope.userModel.isLogIn = false;
            $localstorage.setObject('loginData', {});
            $localstorage.setObject('userModel', {});
            $state.go('app.featured');
        };

        $scope.showLoading = function () {
            $scope.loading = $ionicLoading.show({
                content: 'Loading...'
            });
        };
        $scope.showProcessing = function () {
            $scope.loading = $ionicLoading.show({
                content: 'Processing...'
            });
        };
        $scope.hide = function () {
            $scope.loading.hide();
        };

    })

     
    .controller('LoginCtrl', function ($scope, $state, $location, Login, Vehicle , $rootScope, $localstorage) {
        console.log( "in controller ") ; 

        $scope.username = "";
        $scope.loginAlerts = [];
        $rootScope.userModel.isLogIn = false ;

        var formdata = new FormData();
        formdata.append("username", "ritesh@gmail.com");
        formdata.append("password", "iloyal@123");
        //$scope.loginData = {
        //    username: "ritesh@gmail.com",
        //    password: "iloyal@123"
        //}
        $scope.loginData = {
            username: "",
            password: ""
        }
        $scope.doLogin = function (loginData) {
           
           console.log( "in login of controller "+loginData);
           console.log( "is login is " + $rootScope.userModel.isLogIn ) ; 
           console.log(loginData) ; 


            $scope.loginAlerts = [];
            if (validate(loginData) == false) return;

            //$scope.$parent.showProcessing();
            Login.execute(loginData).then(function (data) {
                console.log(data);
                //data = data[0];
                if (data  >  0) {
                    console.log( "here in success ") ; 
                    $rootScope.userModel.isLogIn = true;
                    $rootScope.userModel.userid = data;
                    $rootScope.userModel.firstname = data.name;
                    $rootScope.userModel.lastname = data.lastname;
                    $rootScope.userModel.mobileno = data.mobile;
                    $rootScope.userModel.emailid = data.email;
                    $rootScope.userModel.birthdate = data.dob;
                    $rootScope.userModel.address1 = data.address1;
                    $rootScope.userModel.address2 = data.address2;
                    $rootScope.userModel.city = data.city;
                    $rootScope.userModel.pincode = data.pincode;
                    $rootScope.userModel.state = data.state;
                    $rootScope.userModel.country = data.country;
                    $rootScope.userModel.cardno = data.cardno;
                    $rootScope.userModel.memberpin = data.pinnumber;
                    $rootScope.userModel.points = data.points;
                    $rootScope.userModel.pointsexpirydate = data.pointsexpirydate;
                    $rootScope.userModel.points_inprocess = data.points_inprocess;
                    $rootScope.userModel.points_redeemable = data.points_redeemable;
                    console.log($rootScope.userModel);

                    $localstorage.setObject('loginData', loginData);
                    $localstorage.setObject('userModel', $rootScope.userModel);
                    
                    Vehicle.execute( data).then(function (vehicledata) { 
                            console.log("got vehicle" + vehicledata ) ; 
                  

                    $rootScope.userModel.vehicle = vehicledata[0].vehicle_id; 
                      console.log(" vehicle id is " + vehicledata[0].vehicle_id ) ;  
                    }); 
                    //window.location.href="#/app/camera";
                    $location.path('/camera');
                    
                    // $route.routes[null];
                   //$ionicLoading.hide() ; 

                    $scope.$parent.hide();
                }
                else {
                    var _alert = { type: "danger", message: "The email or password you entered is incorrect. " }
                    $scope.loginAlerts.push(_alert);
                    $scope.$parent.hide();
                }

            }, function (error, status) {
                console.log(error);
                $rootScope.userModel.isLogIn = false;
                $scope.$parent.hide();
            });
        }


        function getVehicle(userid){
        console.log( "vehicle for " + userid ) ; 
        var url= 'http://foxsolutions.in/fox/api/foxGetUserVehicle/';
        $.ajax({
         type: "POST",
         url: url,
         data: {
                    userId: varUserId
               }, 
         crossDomain: true,
         cache: false,
         beforeSend: function(){},
         success: function(vehicle)
         {
            console.log('got it '); 
        if(vehicle)
        {
                console.log( 'got vehicle ' + vehicle ); 
                //localStorage.setItem("vehicleId", vehicle);
        }
        }

        
        
        });
        console.log( "vehicle is " + vehicle ) ; 
        return vehicle; 

        }
        function validate(loginData) {
            if (loginData.username == null || loginData.username == "") {
                var _alert = { type: "danger", message: "Enter user name. " }
                $scope.loginAlerts.push(_alert);
                return false;
            }
            else if (loginData.password == null || loginData.password == "") {
                var _alert = { type: "danger", message: "Enter password. " }
                $scope.loginAlerts.push(_alert);
                return false;
            }
        }

        $scope.showRegister = function()
        {
            $state.go('app.register');
        }
    })

    .controller('RegisterCtrl', function ($scope, $stateParams, $ionicLoading, Registration, $ionicPopup, $state, $ionicModal, $timeout) {
        $scope.user = {
            firstname: "", lastname: "", mobileno: "", emailid: "", birthdate: "", password: "", repassword: "", memberpin: "", rememberpin: "",
            address1: "", address2: "", city: "", pincode: "", state: "", country: ""
        };

        $scope.doRegister = function(user)
        {
            $scope.showProcessing();
            Registration.post(user).then(function (data) {
                console.log(data);
                if (data.id != "0")
                {
                    $scope.loading = $ionicLoading.show({
                        content: 'Thank you for Registering at iLoyalty.'
                    });
                    $timeout(function () {
                        $scope.loading.hide();
                        $state.go('app.login');
                    }, 2000);
                }
                $scope.$parent.hide();
            }, function (error, status) {
                $scope.$parent.hide();
            })
        }
    })

    .controller('ProfileCtrl', function ($scope, $rootScope, $localstorage) {
        $scope.profile = angular.copy($rootScope.userModel);
        var userModel = $localstorage.getObject('userModel');
        if ($rootScope.isEmptyObject(userModel) == false) {
            $scope.profile = userModel;
        }
    })
 .controller('CameraCtrl', function ($scope, $rootScope, $localstorage) {
        $scope.profile = angular.copy($rootScope.userModel);
        var userModel = $localstorage.getObject('userModel');
        if ($rootScope.isEmptyObject(userModel) == false) {
            $scope.profile = userModel;
        }
    })

.controller('GPSCtrl', function ($scope, $rootScope, $localstorage) {
        $scope.profile = angular.copy($rootScope.userModel);
        var userModel = $localstorage.getObject('userModel');
        if ($rootScope.isEmptyObject(userModel) == false) {
            $scope.profile = userModel;
        }
    })

.controller('VehicleCtrl', function ($scope, $rootScope, $localstorage) {
        $scope.profile = angular.copy($rootScope.userModel);
        var userModel = $localstorage.getObject('userModel');
        if ($rootScope.isEmptyObject(userModel) == false) {
            $scope.profile = userModel;
        }
    })
    

    

  ;

