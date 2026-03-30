app.controller("ShopController", function ($scope, $http, $location) {
  const API_URL = "http://localhost:3000";
  $scope.products = [];
  $scope.cart = JSON.parse(localStorage.getItem("cart") || "[]");
  $http
    .get(API_URL + "/api/products")
    .then(function (res) {
      $scope.products = res.data.map(function (p) {
        if (p.image) {
          if (p.image.startsWith("http")) return p;
          if (p.image.startsWith("/")) p.image = p.image.substring(1);
          p.image = API_URL + "/" + p.image;
        } else {
          p.image = API_URL + "/assets/images/no-image.png";
        }
        return p;
      });
      console.log("Products loaded:", $scope.products);
    })
    .catch(function (err) {
      console.error("Error load products:", err);
    });
  $scope.addToCart = function (product) {
    const user = JSON.parse(localStorage.getItem("authUser"));
    if (!user) {
      alert("Silakan login terlebih dahulu!");
      $location.path("/login");
      return;
    }
    let found = $scope.cart.find(function (i) {
      return i.id === product.id;
    });
    if (found) {
      found.qty++;
    } else {
      $scope.cart.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        image: product.image,
        price: parseFloat(product.price),
        qty: 1,
      });
    }
    localStorage.setItem("cart", JSON.stringify($scope.cart));
    $location.path("/cart");
  };
  $scope.getTotal = function () {
    let total = 0;
    $scope.cart.forEach(function (i) {
      total += i.price * i.qty;
    });
    return total;
  };
  $scope.checkout = function () {
    if ($scope.cart.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }
    let order = {
      id: "ORD-" + Date.now(),
      customer: "Guest",
      email: "guest@email.com",
      total: $scope.getTotal(),
      status: "Diproses",
      date: new Date().toISOString().slice(0, 10),
      items: angular.copy($scope.cart),
    };
    console.log("Order:", order);
    alert("Pesanan berhasil dibuat!");
    localStorage.removeItem("cart");
    $scope.cart = [];
  };
  $scope.goToCheckout = function (id) {
    $location.path("/checkout/" + id);
  };
});
