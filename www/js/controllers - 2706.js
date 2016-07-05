angular.module('app.controllers', ["ion-datetime-picker"])

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

	
	//added by sandeep 
	
	.controller('DashCtrl', function($scope,ionicDatePicker , ionicTimePicker, $rootScope, socket, Images, $ionicSlideBoxDelegate) {
	
	console.log("in dashctrl"); 
	$scope.mode = "live" ; 
	$scope.currentDate = new Date();
	  var div = document.getElementById('imageDiv');console.log("got div "  + div ) ; 
	  
	  //div.style.visibility = 'hidden'; 
	  
	//start 
	 latlongArr = [] ; 
    zoomLevel = 10; 
	
	imgArr = [] ; 
	var counter = 1 ; 
	$scope.mode= "specific" ; 
	var new_image =  { src :'' , 
                      desc : '' } ; 
	$scope.photos =[] ; 
					  
					  
	$scope.getData = function() { 
	console.log("going for data") ; 
	  var div = document.getElementById('imageDiv');console.log("got div "  + div ) ; 
	  
	  div.style.visibility = 'visible'; 
	  
	  if (( $scope.vehicleId ==null ) || ( $scope.forDate == null ) || ( $scope.fromTime == null  ) || ( $scope.toTime == null ) ) 
		
		{ 
			$scope.errorMessage = "Vehicle id , date , From time and To time are mandatory " ; 
		console.log( "error here ") ; 
				return  ; 
  
			}
			else $scope.errorMessage = "Fetcing values for this time range " ; 
				  console.log("vid"  + $scope.vehicleId+"< for date>"+$scope.forDate+"< fromtime>" + $scope.fromTime.getHours()+"<"+$scope.toTime.getMinutes()+"<") ; 

	$scope.debugMessage = "calling showImages" ; 
	
	$scope.showImages(); 
	$scope.debugMessage = "calling showMap" ; 
	$scope.showMap() ; 
	
	
	
	}

    $scope.getImages = function() { 
    // Set of Photos
   
    $scope.ImageMessage = "Showing Images for Vehicle"; 
	
	
	
    /*
    $scope.photos = [
        {src: 'http://farm9.staticflickr.com/8042/7918423710_e6dd168d7c_b.jpg', desc: 'Image 01'},
        {src: 'http://farm9.staticflickr.com/8449/7918424278_4835c85e7a_b.jpg', desc: 'Image 02'},
        {src: 'http://farm9.staticflickr.com/8457/7918424412_bb641455c7_b.jpg', desc: 'Image 03'},
        {src: 'http://farm9.staticflickr.com/8179/7918424842_c79f7e345c_b.jpg', desc: 'Image 04'},
        {src: 'http://farm9.staticflickr.com/8315/7918425138_b739f0df53_b.jpg', desc: 'Image 05'},
        {src: 'http://farm9.staticflickr.com/8461/7918425364_fe6753aa75_b.jpg', desc: 'Image 06'}
    ];
	
	
	*/ 
	$scope.photos = []; 
	var month = $scope.forDate.getMonth() + 1 ; 
	var year = $scope.forDate.getYear() + 1900 ; 
	console.log( " month is " + month  + "year is " + year ) ; 
	var dt = $scope.forDate.getDate() + "-" + month  + "-" + year ; 
	console.log("dt is " + dt ) ; 
	
	//var vehicleData = { vehicleId : $scope.vehicleId , fromDate : $scope.forDate.getDay() + "-"  + " " + $scope.fromTime.getHours()+ ":"+ $scope.fromTime.getMinutes() , toDate : $scope.forDate + " " + $scope.toTime.getHours()+ ":"+ $scope.toTime.getMinutes()  } ;
	var vehicleData = { vehicleId : $scope.vehicleId , fromDate : dt + " " + $scope.fromTime.getHours()+ ":"+ $scope.fromTime.getMinutes() , toDate : dt+ " " + $scope.toTime.getHours()+ ":"+ $scope.toTime.getMinutes()  } ;
    console.log( " vehicle data is " + vehicleData.vehicleId ) ; 	
	    console.log( " vehicle data is " + vehicleData.fromDate ) ; 	
    console.log( " vehicle data is " + vehicleData.toDate ) ; 	

	
	Images.execute( vehicleData).then(function (data) { 
							var new_image ; 
                            console.log("got vehicle" + data.length  ) ; 
							for ( i = 0 ; i < data.length ; i ++ ) {
								new_image =  { src : "http://foxsolutions.in/fox/"+ data[i].event_file_name   , 
                      desc : '' } ; 
								$scope.photos.push(new_image); 
								//$scope.photos.push( " src : 'http://foxsolutions.in/fox/"+ data[i].event_file_name +"' , desc : 'TEST' " ) ;
								console.log("file is " + "http://foxsolutions.in/fox/"+data[i].event_file_name ) ; 
							}
							console.log("got photos " + $scope.photos.length) ;
								}) ; 
	var imagediv = document.getElementById('imageDiv');console.log("got div "  + div ) ; 
	  
	imagediv.style.visibility = 'visible'; 
    console.log('enabling slider') ;
    $ionicSlideBoxDelegate.enableSlide(); 
	
	 
    setTimeout(function() {  
     
                $ionicSlideBoxDelegate.slide(0);
                $ionicSlideBoxDelegate.update();
                $scope.$apply() ; 
     });
}
   
   $scope.showImages = function() { 

    if ( $scope.mode == "live" ) { 
    console.log( 'waiting for live images for vehicle '+ $scope.vehicleId );
    counter ++ ;
    

    socket.on( "image", function(data) { 
	
	console.log( " vehicle got it "  + data[0].vehicle_id ) ; 
	if ( (data[0].vehicle_id).toUpperCase() == ($scope.vehicleId).toUpperCase() ) { 
    console.log("here in images " + data.length ) ; 

    console.log ( "got notification" + data[0].user_img +"xx") ; 
    
         new_image.src = data[0].user_img  ; 
         new_image.desc = "Image " + counter ; 


        console.log( "lat long length is now before " + $scope.photos.length) ; 
      $scope.photos.push(new_image );
      console.log( "lat long length is now " + $scope.photos.length) ; 
	}
		else 
			console.log( "not the vehicle I want.got for  >" + data[0].vehicle_id  + "<") ; 
		
      //$scope.drawMap() ; 
     
  });
}
else  {
	$scope.debugMessage = " for specific mode in getImages " ; 
     $scope.getImages(); 
    console.log( "image arr is " + imgArr)  ; 

     //$scope.drawMap(); 
	} 
} 

    $scope.showMap = function() {
		if ( $scope.mode == "live" ) { 
    console.log( 'waiting for live' );


socket.on( "gps", function(data) {
    console.log("here" + data[0].vehicle_id ) ; 

    console.log ( "got notification" + data[0].latitude +"xx" +  data[0].longitude) ; 
    if ( (data[0].vehicle_id).toUpperCase() == ($scope.vehicleId).toUpperCase() ) {  
         var location = data[0] ; 
        console.log( "lat long length is now before " + latlongArr.length) ; 
      latlongArr.push(location );
      console.log( "lat long length is now " + latlongArr.length) ; 
         
      $scope.drawMap() ; 
	} 
	else console.log( " not the vehicle I want " + data[0].vehicle_id) ; 
	
  });
}
else  {
	
	$scope.GPSMessage = "Showing GPS information for Vehicle" ; 
     $scope.getLocations(); 
    console.log( "lat long arr is " + latlongArr)  ; 

     $scope.drawMap(); 
	} 
}

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
    console.log( " waiting for lat long ");
} 



	 $scope.drawMap = function() { 
        console.log( " in drawmap "+ latlongArr) ; 

        if ( latlongArr.length > 0 ) { 		
        //$scope.getLocations() ; 
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
}
	 
	
$scope.datePickerCallback = function (val) {
	console.log("in callback "); 
	
  if(typeof(val)==='undefined'){		
      console.log('Date not selected');
  }else{
      console.log('Selected date is : ', val);
	  
	  
  }
};


$scope.showSelectValue = function(vehicle)  {
	
	$scope.vehicleId = vehicle ; 
	console.log( "vehicle id is " + vehicle + "in scope " + $scope.vehicleId ) ; 
	
	
}

 $scope.setMode = function ( mode ) { 
 $scope.mode = mode ; 
 console.log ( " mode is " + $scope.mode + "vehicle is" + $scope.vehicleId  ) ; 
 var div = document.getElementById('timerange');

 if ( $scope.mode == "live" ) { 
 
// hide
div.style.visibility = 'hidden';
 //latlongArr = [] ; 
 $scope.photos = [] ; 
 //$scope.drawMap(); 
 $scope.GPSMessage =  "Waiting for LiveFeed for GPS co-ordinates.... " ; 
 $scope.ImageMessage = "Waiting for Live Images....  " ; 
 $scope.showImages() ; 
 $scope.showMap(); 
 
 
 } 
 else 
 {
	 div.style.visibility = 'visible';
	 
 }
 /*
 console.log("showing images ") ; 
 
 $scope.showImages(); 
 console.log("showing map ") ; 
 $scope.showMap(); 
 */
 
 }
	
	$scope.showDate  = function()  { 
	console.log("in showdate"); 
	
	 var ipObj1 = {
      callback: function (val) {  //Mandatory
        console.log('Return value from the datepicker popup is : ' +  new Date(val));
		val = new Date(val) + ""; 
		var dateArr= val.split(" ") ; 
	  $scope.forDate = dateArr[2]+'-'+dateArr[1]+'-'+dateArr[3] ; 
	  
      }, dateFormat : 'dd-mm-yyyy' 
     } 
    
      ionicDatePicker.openDatePicker(ipObj1);
    
	
	
	}
	
	;
	
	$scope.showFromTime = function() { 
	console.log("in from time "); 
	var ipFromTime  = {
    callback: function (val) {      //Mandatory
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
        var selectedTime = new Date(val * 1000);
        console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
		console.log ( " time is " + selectedTime.getUTCHours()+ ':' + selectedTime.getUTCMinutes() );
	  $scope.fromTime = selectedTime.getUTCHours()+ ':' + selectedTime.getUTCMinutes(); 
		
      }
    },
    inputTime: 50400,   //Optional
    format: 12,         //Optional
    step: 15,           //Optional
    setLabel: 'Select'    //Optional
  };

  ionicTimePicker.openTimePicker(ipFromTime);
};

	

	
	$scope.showToTime = function() {
		console.log("in to time "); 
		var ipToTime  = {
    callback: function (val) {      //Mandatory
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
        var selectedTime = new Date(val * 1000);
        console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
		console.log ( " time is " + selectedTime.getUTCHours()+ ':' + selectedTime.getUTCMinutes() );
	  $scope.toTime = selectedTime.getUTCHours()+ ':' + selectedTime.getUTCMinutes(); 
		
      }
    },
    inputTime: 50400,   //Optional
    format: 12,         //Optional
    step: 15,           //Optional
    setLabel: 'Select'    //Optional
  };

  ionicTimePicker.openTimePicker(ipToTime);
};


	
})
	
	
	
	
	
	
	
	// end 
	
     
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

 $scope.changeMode  = function( ) {  

console.log( "change mode to " ) ; 


 }


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
    console.log( " waiting for lat long ");
} 



    $scope.drawMap = function() { 
        console.log( " in drawmap "+ latlongArr) ;     
        //$scope.getLocations() ; 
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

  if ( $scope.mode == "live" ) { 
    console.log( 'waiting for live'+ latlongArr.length );


socket.on( "gps", function(data) {
    console.log("here" + data.length ) ; 

    console.log ( "got notification" + data[0].latitude +"xx" +  data[0].longitude) ; 
    
         var location = data[0] ; 
        console.log( "lat long length is now before " + latlongArr.length) ; 
      latlongArr.push(location );
      console.log( "lat long length is now " + latlongArr.length) ; 
         
      $scope.drawMap() ; 
     
  });
}
else  {
     $scope.getLocations(); 
    console.log( "lat long arr is " + latlongArr)  ; 

     $scope.drawMap(); 
} 
  

})
	

.controller('VehicleCtrl', function ($scope, $rootScope, $localstorage) {
        $scope.profile = angular.copy($rootScope.userModel);
        var userModel = $localstorage.getObject('userModel');
        if ($rootScope.isEmptyObject(userModel) == false) {
            $scope.profile = userModel;
        }
    })

.controller('LogoutCtrl',  function ($scope, $location,$rootScope,$state) {
      console.log ( "in logout controller") ; 
       
        $scope.foxLogout = function( ) {
        console.log('logging out now ') ; 
            
            $rootScope.userModel.isLogIn = false ; 
            $scope.userModel.isLogIn = false ; 
			//$location.path('/login') ; 
            //$state.go("app.login") ; 
            $state.go('tabsController.login'); 
        }

          })

    .controller('ImageCtrl', function ($scope, $rootScope, socket, Images,$ionicSlideBoxDelegate) {
    console.log("in inmg controller" + $rootScope.userModel.isLogIn ) ; 
    imgArr = [] ; 
 var counter = 1 ; 
 $scope.mode= "specific" ; 
 var new_image =  { src :'' , 
                      desc : '' } ; 
                      $scope.photos =[] ; 

	/*			  
    $scope.getImages = function() { 
    // Set of Photos
	
	console.log( " in get image ");
   
    
   
    $scope.photos = [
        {src: 'http://farm9.staticflickr.com/8042/7918423710_e6dd168d7c_b.jpg', desc: 'Image 01'},
        {src: 'http://farm9.staticflickr.com/8449/7918424278_4835c85e7a_b.jpg', desc: 'Image 02'},
        {src: 'http://farm9.staticflickr.com/8457/7918424412_bb641455c7_b.jpg', desc: 'Image 03'},
        {src: 'http://farm9.staticflickr.com/8179/7918424842_c79f7e345c_b.jpg', desc: 'Image 04'},
        {src: 'http://farm9.staticflickr.com/8315/7918425138_b739f0df53_b.jpg', desc: 'Image 05'},
        {src: 'http://farm9.staticflickr.com/8461/7918425364_fe6753aa75_b.jpg', desc: 'Image 06'}
    ];
	
	
	
	var vehicleData = { vehicle_id : 'VEH001' , fromTime : '21-JUN-16 01:00', toTime : '21-JUN-16 23:00'  } ; 
	
	
	Images.execute( vehicleData).then(function (data) { 
                            console.log("got vehicle" + data ) ; 
	}) ; 
	
	
    console.log('enabling slider') ;
     //$ionicSlideBoxDelegate.enableSlide();
    setTimeout(function() {  
     
                $ionicSlideBoxDelegate.slide(0);
                $ionicSlideBoxDelegate.update();
               //$scope.$apply() ; 
     });
	 */
}
   /*

    if ( $scope.mode == "live" ) { 
    console.log( 'waiting for live images '+ $scope.photos.length );
    counter ++ ;

    socket.on( "image", function(data) {
    console.log("here in images " + data.length ) ; 

    console.log ( "got notification" + data[0].user_img +"xx") ; 
    
         new_image.src = data[0].user_img  ; 
         new_image.desc = "Image " + counter ; 


        console.log( "lat long length is now before " + $scope.photos.length) ; 
      $scope.photos.push(new_image );
      console.log( "lat long length is now " + $scope.photos.length) ; 
         
      //$scope.drawMap() ; 
     
  });
}
else  {
     $scope.getImages(); 
    console.log( "image arr is " + imgArr)  ; 

     //$scope.drawMap(); 
} 
*/
});

    
    

  ;

