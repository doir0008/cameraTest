angular.module('starter.controllers', [])

.controller("BaseController", function($scope, $firebaseStorage, $firebaseAuth) {
    
    // authenticate with firebase
    $scope.authObj = $firebaseAuth();
    $scope.authObj.$signInWithEmailAndPassword("username", "password").then(function(firebaseUser) {
        console.log("Signed in as:", firebaseUser.uid);
    }).catch(function(error) {
        console.error("Authentication failed:", error);
    });
    
    
    
    
    // grab the img tag, we're going to replace it later
    $scope.image = document.querySelector("#image");

    $scope.callCamera = function() {
        console.log("callCamera func ran");
        $scope.imgOptions = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: false,
            // encodingType: Camera.EncodingType.JPEG,
            encodingType: Camera.EncodingType.PNG,
            mediaType: Camera.MediaType.PICTURE,
            targetWidth: 320,
            targetHeight: 480,
            // cameraDirection: Camera.Direction.FRONT,
            cameraDirection: Camera.Direction.BACK,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };
        navigator.camera.getPicture($scope.imgSuccess, $scope.imgFail, $scope.imgOptions);
    };

    $scope.imgSuccess = function(imageData) {
        $scope.picData = "data:image/png;base64," + imageData;
        // update the src of the img tag to the picture taken
        $scope.image.src = $scope.picData;
		console.log("Image loaded into interface");
        $scope.rawImage = imageData;
        // $scope.encodedPic = encodeURIComponent($scope.picData);
		navigator.camera.cleanup();

        // random string generator
        var ranString = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

        // upload to firebase
        var storageRef = firebase.storage().ref("images/" + ranString + ".png");
        $scope.storage = $firebaseStorage(storageRef);
        // var uploadTask = $scope.storage.$putString($scope.rawImage, "base64", { contentType: "image/jpeg" });
        var uploadTask = $scope.storage.$putString($scope.rawImage, "base64");


        // track upload progress
        // uploadTask.$progress(function(snapshot) {
        //     var percentUploaded = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //     console.log(percentUploaded);
        // });

        // upload complete
        uploadTask.$complete(function(snapshot) {
            console.log("Upload completed successfully");
            console.log(snapshot.downloadURL);
        });

        // upload error
        // uploadTask.$error(function(error) {
        //     console.error(error);
        // });

        // An UploadTask implements a promise like interface. 
        // The callback is called when the upload is complete. 
        // The callback passes back an UploadTaskSnapshot.
        // uploadTask.then(function(snapshot) {
        //     console.log("Upload completed successfully");
        //     console.log(snapshot.downloadURL);
        // })
        // .catch(function(error) {
        //     console.log("ERROR!!!");
        //     console.log(error);
        // });
        // An UploadTask implements a promise like interface.
        // The callback is called when an error occurs.


    };

    $scope.imgFail = function(msg) {
        console.log("Failed to get image: " +  msg);
    };




});