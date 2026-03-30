app.controller("HeaderController", function ($scope, $rootScope, $location) {

  // Ambil user dari rootScope (sinkron dengan app.run)
  $scope.currentUser = $rootScope.currentUser;

  // Watch biar auto update kalau login/logout
  $scope.$watch(function () {
    return $rootScope.currentUser;
  }, function (newVal) {
    $scope.currentUser = newVal;
  });

  // Logout function
  $scope.logout = function () {
    localStorage.removeItem("authUser");
    localStorage.removeItem("token");

    $rootScope.currentUser = null;

    alert("Logout berhasil!");
    $location.path("/shop");
  };

});