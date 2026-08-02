angular.module("sepatuStore")
.controller("LoginController", function ($scope, $http, $location) {

  console.log("LoginController loaded ✅");

  const API_URL = "http://localhost:3000";

  $scope.user = {};

  $scope.login = function () {
    if (!$scope.user.email || !$scope.user.password) {
      alert("Email dan password wajib diisi");
      return;
    }

    $http.post(API_URL + "/api/login", {
      email: $scope.user.email,
      password: $scope.user.password,
    })
    .then(function (res) {
      localStorage.setItem("authUser", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      alert("Login berhasil!");
      $location.path("/shop");
    })
    .catch(function (err) {
      console.error(err);
      alert("Login gagal");
    });
  };

});