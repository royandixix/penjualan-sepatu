app.controller("LoginController", function ($scope, $http, $location) {
  const API_URL = "http://localhost:3000";
  $scope.user = {};
  $scope.login = function () {
    if (!$scope.user.email || !$scope.user.password) {
      alert("Email dan password wajib diisi");
      return;
    }
    $http
      .post(API_URL + "/api/login", {
        email: $scope.user.email,
        password: $scope.user.password,
      })
      .then(function (res) {
        localStorage.setItem("authUser", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        alert(res.data.message || "Login berhasil!");
        $location.path("/shop");
      })
      .catch(function (err) {
        console.error("Login error:", err);
        alert(err.data && err.data.message ? err.data.message : "Login gagal");
      });
  };
});
