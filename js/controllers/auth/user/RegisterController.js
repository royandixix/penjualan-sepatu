app.controller("RegisterController", function ($scope, $http, $location) {
  const API_URL = "http://localhost:3000";
  $scope.user = {};
  $scope.register = function () {
    if (!$scope.user.name || !$scope.user.email || !$scope.user.password) {
      alert("Semua field wajib diisi!");
      return;
    }
    if ($scope.user.password !== $scope.user.confirmPassword) {
      alert("Konfirmasi password tidak sama!");
      return;
    }
    $http
      .post(API_URL + "/api/register", {
        name: $scope.user.name,
        email: $scope.user.email,
        password: $scope.user.password,
      })
      .then(function (res) {
        alert(res.data.message || "Register berhasil!");
        $location.path("/login");
      })
      .catch(function (err) {
        console.error("Register error:", err);
        alert(
          err.data && err.data.message ? err.data.message : "Gagal register",
        );
      });
  };
});
