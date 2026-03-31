app.controller("CartController", function ($scope, $location, $http) {
  const API_URL = "http://localhost:3000";

  function loadCart() {
    try {
      const c = JSON.parse(localStorage.getItem("cart")) || [];
      c.forEach(function (i) {
        if (!i.qty || i.qty < 1) i.qty = 1;
      });
      return c;
    } catch (e) {
      return [];
    }
  }

  $scope.cart = loadCart();

  $scope.updateCart = function () {
    localStorage.setItem("cart", JSON.stringify($scope.cart));
  };

  $scope.removeItem = function (i) {
    if (i >= 0 && i < $scope.cart.length) {
      $scope.cart.splice(i, 1);
      $scope.updateCart();
    }
  };

  $scope.changeQty = function (i, d) {
    if (!i.qty) i.qty = 1;
    i.qty += d;
    if (i.qty < 1) i.qty = 1;
    $scope.updateCart();
  };

  $scope.getTotal = function () {
    return $scope.cart.reduce(function (t, i) {
      if (!i.price || !i.qty) return t;
      return t + Number(i.price) * Number(i.qty);
    }, 0);
  };

  $scope.formatRupiah = function (a) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(a || 0);
  };

  $scope.checkoutCart = function () {
    const u = JSON.parse(localStorage.getItem("authUser"));

    if (!u) {
      alert("Silakan login terlebih dahulu!");
      $location.path("/login");
      return;
    }

    if ($scope.cart.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }

    const r = $scope.cart
      .map(function (i) {
        if (!i.id || !i.price || !i.qty) return null;

        const o = {
          id: "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
          user_id: u.id || null,
          product_id: i.id,
          name: i.name,
          price: Number(i.price),
          size: i.size || "-",
          qty: Number(i.qty),
          total: Number(i.price) * Number(i.qty),
          date: new Date().toISOString().slice(0, 10),
          status: "Diproses",
        };

        return $http.post(API_URL + "/api/orders", o);
      })
      .filter(function (x) {
        return x !== null;
      });

    Promise.all(r)
      .then(function () {
        alert("Checkout berhasil!");
        localStorage.removeItem("cart");
        $scope.cart = [];
        $location.path("/shop");
      })
      .catch(function () {
        alert("Checkout gagal!");
      });
  };
});
