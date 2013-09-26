'use strict';

angular.module('createYourFirstJsAppApp')
  .controller('MainCtrl', function ($scope, $rootScope, AccessToken, Device) {
    // get the access token (you get it when you log in)
    var token = AccessToken.get().access_token;
    // create an authorized variable which is true when a token is set
    var authorized = !!token;
    // if the user is logged in then get all owned devices
    if (authorized) { $scope.devices = Device.query(); }

    // socket io connection
    var socket = io.connect('http://96.126.109.170:80');
    // connection funciton
    socket.on('connect', function() {
      socket.emit('subscribe', token);
    });
    // realtime update received
    socket.on('update', function (event) {
      $rootScope.$broadcast('lelylan:device:request:end', event.data);
      console.log('Received an update for the device', event.data.name);
      $scope.$apply() // refresh the UI
    });
});
