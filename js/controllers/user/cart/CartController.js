app.controller("CartController", function ($scope, $location, $http) {
  const API_URL = "http://localhost:3000";
  $scope.cart = JSON.parse(localStorage.getItem("cart") || "[]");
  $scope.cart.forEach(function (item) {
    if (!item.qty) {
      item.qty = 1;
    }
  });
  $scope.updateCart = function () {
    localStorage.setItem("cart", JSON.stringify($scope.cart));
  };
  $scope.removeItem = function (index) {
    if (index >= 0 && index < $scope.cart.length) {
      $scope.cart.splice(index, 1);
      $scope.updateCart();
    }
  };
  $scope.changeQty = function (item, delta) {
    if (!item.qty) item.qty = 1;
    item.qty += delta;
    if (item.qty < 1) {
      item.qty = 1;
    }
    $scope.updateCart();
  };
  $scope.getTotal = function () {
    return $scope.cart.reduce(function (total, item) {
      return total + Number(item.price) * Number(item.qty);
    }, 0);
  };
  $scope.checkoutCart = function () {
    const user = JSON.parse(localStorage.getItem("authUser"));
    if (!user) {
      alert("Silakan login terlebih dahulu!");
      $location.path("/login");
      return;
    }
    if ($scope.cart.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }
    $scope.cart.forEach(function (item) {
      const order = {
        id: "ORD-" + Date.now(),
        product_id: item.id,
        name: item.name,
        price: Number(item.price),
        size: item.size || "-",
        qty: item.qty,
        total: item.price * item.qty,
        date: new Date().toISOString().slice(0, 10),
        status: "Diproses",
      };
      $http.post(API_URL + "/api/orders", order);
    });
    alert("Checkout berhasil!");
    localStorage.removeItem("cart");
    $scope.cart = [];
    $location.path("/shop");
  };
});
