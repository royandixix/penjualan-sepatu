angular.module("sepatuStore")
.controller("RegisterController", function ($scope, $http, $location) {

  const API_URL = "http://localhost:3000";

  $scope.user = {};

  $scope.showPassword = false;
  $scope.showConfirm = false;

  $scope.togglePassword = function () {
    $scope.showPassword = !$scope.showPassword;
  };

  $scope.toggleConfirm = function () {
    $scope.showConfirm = !$scope.showConfirm;
  };

  $scope.register = function () {

    if (!$scope.user.name || !$scope.user.email || !$scope.user.password) {
      alert("Semua field wajib diisi!");
      return;
    }

   

    if ($scope.user.password !== $scope.user.confirmPassword) {
      alert("Konfirmasi password tidak sama!");
      return;
    }

    $http.post(API_URL + "/api/register", {
      name: $scope.user.name,
      email: $scope.user.email,
      password: $scope.user.password,
    })
    .then(function (res) {
      alert(res.data.message || "Register berhasil!");
      $scope.user = {};
      $location.path("/login");
    })
    .catch(function (err) {
      console.error(err);
      if (err.data && err.data.message) {
        alert(err.data.message);
      } else {
        alert("Gagal register");
      }
    });

  };

}); 