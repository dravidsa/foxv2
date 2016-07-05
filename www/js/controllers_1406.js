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
        $scope.userModel.isLogIn = false ;

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
                    
                    $scope.userModel.isLogIn = true ;

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
                $scope.userModel.isLogIn = false ;
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
    console.log("in camera controller") ; 
        $scope.profile = angular.copy($rootScope.userModel);
        var userModel = $localstorage.getObject('userModel');
        if ($rootScope.isEmptyObject(userModel) == false) {
            $scope.profile = userModel;
        }
    })

.controller('GPSCtrl', function ($scope, $rootScope,socket, $localstorage) {
console.log( 'in GPS traceker controller ') ;         
  $scope.vehicle = 'veh001';
    $scope.mode = "specific" ; 

    latlongArr = [] ; 
    zoomLevel = 10; 

  $scope.getLocations  = function() { 

     latlongArr = [
            {
                
                "latitude": '18.641400',
                "longitude": '72.872200',
                
            }
        ,
            {
                "latitude": '18.964700',
                "longitude": '72.825800',
                
            }
        ,
            {
                
                "latitude": '18.523600',
                "longitude": '73.847800',
                
            }
    ];
    //console.log( " waiting for lat long ");
} 



    $scope.drawMap = function() { 
        console.log( " in drawmap ") ;     
        $scope.getLocations() ; 
        var mapOptions = {
            center: new google.maps.LatLng(latlongArr[0].latitude, latlongArr[0].longitude),
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);
        var infoWindow = new google.maps.InfoWindow();
        var lat_lng = new Array();
        var latlngbounds = new google.maps.LatLngBounds();
        for (i = 0; i < latlongArr.length; i++) {
            var data = latlongArr[i]
            var myLatlng = new google.maps.LatLng(data.latitude, data.longitude);
            lat_lng.push(myLatlng);
            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map
            });
            latlngbounds.extend(marker.position);
            (function (marker, data) {
                google.maps.event.addListener(marker, "click", function (e) {
                    infoWindow.setContent(data.description);
                    infoWindow.open(map, marker);
                });
            })(marker, data);
        }
        map.setCenter(latlngbounds.getCenter());
        map.fitBounds(latlngbounds);
 
        //***********ROUTING****************//
 
        //Initialize the Path Array
        var path = new google.maps.MVCArray();
 
        //Initialize the Direction Service
        var service = new google.maps.DirectionsService();
 
        //Set the Path Stroke Color
        var poly = new google.maps.Polyline({ map: map, strokeColor: '#4986E7' });
        console.log( 'zoom level is ' + map.getZoom()) ; 
 
        //Loop and Draw Path Route between the Points on MAP
        for (var i = 0; i < lat_lng.length; i++) {
            if ((i + 1) < lat_lng.length) {
                var src = lat_lng[i];
                var des = lat_lng[i + 1];
                path.push(src);
                poly.setPath(path);
                service.route({
                    origin: src,
                    destination: des,
                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                }, function (result, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                            path.push(result.routes[0].overview_path[i]);
                        }
                    }
                });
            }
        }
    }




  
  socket.on( "image", function(data) {
    console.log("here") ; 
    $scope.drawMap(); 

  }) ; 
  

})
	

.controller('VehicleCtrl', function ($scope, $rootScope, $localstorage) {
        $scope.profile = angular.copy($rootScope.userModel);
        var userModel = $localstorage.getObject('userModel');
        if ($rootScope.isEmptyObject(userModel) == false) {
            $scope.profile = userModel;
        }
    })

.controller('LogoutCtrl', function ($scope, $rootScope) {
      console.log ( "in logout controller") ; 
       
        $scope.foxLogout = function( ) {
        console.log('logging out now ') ; 
            
            $rootScope.userModel.isLogIn = false ; 
            $scope.userModel.isLogIn = false ; 
        }

          })



.controller("MainCtrl2", function($scope, ImageSearch, $ionicSlideBoxDelegate) {

    $scope.images = [];
        
    $scope.doSearch = function() {
        if(!$scope.search) return;
        console.log("search for ", $scope.search);  
        ImageSearch.getImages($scope.search).then(function(results) {
            console.dir(results.data.d.results);
            $scope.images = results.data.d.results;
            setTimeout(function() {
                $ionicSlideBoxDelegate.slide(0);
                $ionicSlideBoxDelegate.update();
                $scope.$apply();
            });
        });
    };
    
})


    .controller('ImageCtrl', function ($scope, $rootScope, $ionicSlideBoxDelegate) {
    console.log("in inmg controller" + $rootScope.userModel.isLogIn ) ; 

    // Set of Photos
    $scope.photos = [
        {src: 'http://farm9.staticflickr.com/8042/7918423710_e6dd168d7c_b.jpg', desc: 'Image 01'},
        {src: 'http://farm9.staticflickr.com/8449/7918424278_4835c85e7a_b.jpg', desc: 'Image 02'},
        {src: 'http://farm9.staticflickr.com/8457/7918424412_bb641455c7_b.jpg', desc: 'Image 03'},
        {src: 'http://farm9.staticflickr.com/8179/7918424842_c79f7e345c_b.jpg', desc: 'Image 04'},
        {src: 'http://farm9.staticflickr.com/8315/7918425138_b739f0df53_b.jpg', desc: 'Image 05'},
        {src: 'http://farm9.staticflickr.com/8461/7918425364_fe6753aa75_b.jpg', desc: 'Image 06'}
    ];
    console.log('enabling slider') ;
     //$ionicSlideBoxDelegate.enableSlide();
    setTimeout(function() {  
     
                $ionicSlideBoxDelegate.slide(0);
                $ionicSlideBoxDelegate.update();
               //$scope.$apply() ; 
     });
    // initial image index
    
});

    
    

  ;

