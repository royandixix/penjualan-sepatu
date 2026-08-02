app.controller("CartController", function ($scope, $location, $http) {
  const API_URL = "http://localhost:3000";

  // 🛒 Load cart dari localStorage
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
  $scope.isLoading = false;

  // 💾 Update cart
  $scope.updateCart = function () {
    localStorage.setItem("cart", JSON.stringify($scope.cart));
  };

  // ❌ Hapus item
  $scope.removeItem = function (index) {
    if (index >= 0 && index < $scope.cart.length) {
      $scope.cart.splice(index, 1);
      $scope.updateCart();
    }
  };

  // 🔢 Ubah qty
  $scope.changeQty = function (item, delta) {
    if (!item.qty) item.qty = 1;
    item.qty += delta;

    if (item.qty < 1) item.qty = 1;

    $scope.updateCart();
  };

  // 💰 Hitung total
  $scope.getTotal = function () {
    return $scope.cart.reduce(function (total, item) {
      if (!item.price || !item.qty) return total;
      return total + Number(item.price) * Number(item.qty);
    }, 0);
  };

  // 💸 Format rupiah
  $scope.formatRupiah = function (amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount || 0);
  };

  // 🚀 CHECKOUT (IMPROVED)
  $scope.checkoutCart = function () {
    const user = JSON.parse(localStorage.getItem("authUser"));

    // 🔒 Validasi login
    if (!user) {
      alert("Silakan login terlebih dahulu!");
      $location.path("/login");
      return;
    }

    // 🛒 Validasi cart
    if (!$scope.cart || $scope.cart.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }

    // ⛔ Anti double klik
    if ($scope.isLoading) return;
    $scope.isLoading = true;

    // 🔍 Validasi item
    const invalidItem = $scope.cart.find(function (item) {
      return !item.id || !item.price || !item.qty;
    });

    if (invalidItem) {
      alert("Ada item tidak valid di keranjang!");
      $scope.isLoading = false;
      return;
    }

    // 📦 Format 1 order (bukan per item)
    const order = {
      id: "ORD-" + Date.now(),
      user_id: user.id || null,
      items: $scope.cart.map(function (item) {
        return {
          product_id: item.id,
          name: item.name,
          price: Number(item.price),
          qty: Number(item.qty),
          size: item.size || "-",
          total: Number(item.price) * Number(item.qty),
        };
      }),
      total_amount: $scope.getTotal(),
      total_items: $scope.cart.length,
      date: new Date().toISOString(),
      status: "Diproses",
    };

    // 📡 Kirim ke backend
    $http.post(API_URL + "/api/orders", order)
      .then(function () {
        alert("Checkout berhasil!");

        // 🧹 Reset cart
        localStorage.removeItem("cart");
        $scope.cart = [];

        // 🔄 Redirect
        $location.path("/shop");
      })
      .catch(function (err) {
        console.error(err);
        alert("Checkout gagal!");
      })
      .finally(function () {
        $scope.isLoading = false;
      });
  };
});