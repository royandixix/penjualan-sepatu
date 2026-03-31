app.controller("HeaderController", function ($scope, $rootScope, $location) {
  $scope.currentUser = $rootScope.currentUser;

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch (e) {
      return [];
    }
  }

  function getWishlist() {
    try {
      return JSON.parse(localStorage.getItem("wishlist")) || [];
    } catch (e) {
      return [];
    }
  }

  function updateCounts() {
    $scope.cartCount = getCart().length;
    $scope.wishlistCount = getWishlist().length;
  }

  updateCounts();

  $scope.$watch(
    function () {
      return $rootScope.currentUser;
    },
    function (n) {
      $scope.currentUser = n;
    },
  );

  $scope.$watch(
    function () {
      return localStorage.getItem("cart");
    },
    function () {
      updateCounts();
    },
  );

  $scope.$watch(
    function () {
      return localStorage.getItem("wishlist");
    },
    function () {
      updateCounts();
    },
  );

  $scope.logout = function () {
    localStorage.removeItem("authUser");
    localStorage.removeItem("token");
    $rootScope.currentUser = null;
    updateCounts();
    alert("Logout berhasil!");
    $location.path("/shop");
  };
});
