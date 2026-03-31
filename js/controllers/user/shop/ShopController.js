app.controller(
  "ShopController",
  function ($scope, $http, $location, $rootScope) {
    const API_URL = "http://localhost:3000";

    function getCart() {
      try {
        return JSON.parse(localStorage.getItem("cart")) || [];
      } catch (e) {
        return [];
      }
    }

    function saveCart(cart) {
      localStorage.setItem("cart", JSON.stringify(cart));
      $rootScope.$broadcast("cartUpdated");
    }

    function showToast(msg) {
      const toast = document.getElementById("cartToast");
      if (!toast) return;
      toast.innerHTML = '<i class="fa-solid fa-check me-2"></i>' + msg;
      toast.style.opacity = "1";
      toast.style.transform = "translateX(-50%) translateY(0)";
      clearTimeout(toast._timer);
      toast._timer = setTimeout(function () {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(20px)";
      }, 2000);
    }

    $scope.products = [];
    $scope.cart = getCart();

    $http.get(API_URL + "/api/products").then(function (res) {
      $scope.products = res.data.map(function (p) {
        if (p.image) {
          if (!p.image.startsWith("http")) {
            if (p.image.startsWith("/")) p.image = p.image.substring(1);
            p.image = API_URL + "/" + p.image;
          }
        } else {
          p.image = API_URL + "/assets/images/no-image.png";
        }
        return p;
      });
    });

    $scope.flyToCart = function (e) {
      const cart = document.getElementById("cartIcon");
      const card = e.currentTarget.closest(".product-card");
      const img = card ? card.querySelector(".product-img") : null;
      if (!img || !cart) return;

      const imgRect = img.getBoundingClientRect();
      const cartRect = cart.getBoundingClientRect();

      const clone = img.cloneNode(true);
      clone.classList.add("fly-clone");

      const startX = imgRect.left + imgRect.width / 2;
      const startY = imgRect.top + imgRect.height / 2;
      const endX = cartRect.left + cartRect.width / 2;
      const endY = cartRect.top + cartRect.height / 2;

      Object.assign(clone.style, {
        top: startY + "px",
        left: startX + "px",
        width: "36px",
        height: "36px",
        borderRadius: "8px",
        transform: "translate(-50%,-50%) scale(1)",
        opacity: "1",
      });

      document.body.appendChild(clone);

      setTimeout(function () {
        clone.style.top = endY - 40 + "px";
        clone.style.left = endX + "px";
        clone.style.width = "10px";
        clone.style.height = "10px";
        clone.style.opacity = "0.2";
        clone.style.transform =
          "translate(-50%,-50%) scale(0.2) rotate(180deg)";
      }, 30);

      setTimeout(function () {
        clone.remove();
        cart.classList.add("cart-bounce");
        setTimeout(function () {
          cart.classList.remove("cart-bounce");
        }, 400);
      }, 700);
    };

    $scope.addToCart = function (product) {
      const user = JSON.parse(localStorage.getItem("authUser"));
      if (!user) {
        showToast("Silakan login terlebih dahulu!");
        $location.path("/login");
        return;
      }

      const found = $scope.cart.find(function (i) {
        return i.id === product.id;
      });

      if (found) {
        found.qty += 1;
      } else {
        $scope.cart.push({
          id: product.id,
          name: product.name,
          brand: product.brand,
          image: product.image,
          price: Number(product.price),
          qty: 1,
        });
      }

      saveCart($scope.cart);
      showToast("Produk ditambahkan ke keranjang ✓");
    };

    $scope.goToCheckout = function (id) {
      $location.path("/checkout/" + id);
    };
  },
);
