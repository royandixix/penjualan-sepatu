var app = angular.module("sepatuStore");

app.controller("CheckoutController", function ($scope, $http, $routeParams, $location) {

  var API_URL = "http://localhost:3000";

  $scope.product = null;
  $scope.selectedSize = null;
  $scope.selectedColor = null;
  $scope.qty = 1;
  $scope.liked = false;

  var COLOR_MAP = {
    Black:"#000000",White:"#ffffff",Grey:"#808080",Silver:"#C0C0C0",
    Red:"#ee1c25",Maroon:"#800000",Orange:"#ff7f27",Yellow:"#fff200",
    Beige:"#f5f5dc",Green:"#22b14c","Dark Green":"#004000",
    Olive:"#808000",Navy:"#000080",Blue:"#00a2e8",
    Cyan:"#00ffff",Purple:"#a349a4",Pink:"#ffaec9",
    Brown:"#880015",Tan:"#d2b48c",Gold:"#ffca18"
  };

  $scope.getHexColor = function(name){
    return COLOR_MAP[name] || "#ddd";
  };

  $scope.increaseQty = function(){
    $scope.qty++;
  };

  $scope.decreaseQty = function(){
    if($scope.qty > 1){
      $scope.qty--;
    }
  };

  $scope.selectSize = function(size){
    $scope.selectedSize = size;
  };

  $scope.selectColor = function(color){
    if($scope.selectedColor === color){
      $scope.selectedColor = null;
    } else {
      $scope.selectedColor = color;
    }
  };

  function normalizeImage(p){
    if(p.image && !p.image.startsWith("http")){
      if(p.image.startsWith("/")){
        p.image = p.image.substring(1);
      }
      p.image = API_URL + "/" + p.image;
    }
  }

  function normalizeSizes(p){
    try {
      if(typeof p.sizes === "string"){
        p.sizes = JSON.parse(p.sizes);
      }
    } catch(e){
      p.sizes = [];
    }

    if(!Array.isArray(p.sizes) || !p.sizes.length){
      p.sizes = [38,39,40,41,42];
    }
  }

  function normalizeColors(p){
    var map = {};

    try {
      var data = typeof p.colors === "string" ? JSON.parse(p.colors) : p.colors;

      if(Array.isArray(data) && data.length){
        data.forEach(function(c){
          map[c] = 1;
        });
      } else if(typeof data === "object" && data !== null){
        map = data;
      }
    } catch(e){
      map = {};
    }

    if(Object.keys(map).length === 0){
      map = {
        Black:1,
        White:1
      };
    }

    p.colorMap = map;
  }

  function loadProduct(){
    var id = $routeParams.id;

    $http.get(API_URL + "/api/products/" + id)
      .then(function(res){
        var p = res.data;

        p.likes = p.likes || 0;

        normalizeImage(p);
        normalizeSizes(p);
        normalizeColors(p);

        $scope.product = p;
      })
      .catch(function(){
        alert("Gagal memuat produk");
      });
  }

  function validateOrder(){
    if(!$scope.product) return "Produk belum dimuat";
    if(!$scope.selectedSize) return "Pilih ukuran dulu!";
    if(!$scope.selectedColor) return "Pilih warna dulu!";
    if(!$scope.qty || $scope.qty < 1) return "Jumlah tidak valid";
    return null;
  }

  $scope.buyNow = function(){
    var user = JSON.parse(localStorage.getItem("authUser"));

    if(!user){
      alert("Silakan login terlebih dahulu!");
      $location.path("/login");
      return;
    }

    var error = validateOrder();
    if(error){
      alert(error);
      return;
    }

    var order = {
      id: "ORD-" + Date.now(),
      user_name: user.name,
      user_email: user.email,
      product_id: $scope.product.id,
      name: $scope.product.name,
      price: $scope.product.price,
      size: $scope.selectedSize,
      color: $scope.selectedColor,
      qty: $scope.qty,
      total: $scope.product.price * $scope.qty,
      date: new Date().toISOString(),
      status: "Diproses"
    };

    $http.post(API_URL + "/api/orders", order)
      .then(function(){
        alert("Pesanan berhasil!");
        $location.path("/shop");
      })
      .catch(function(){
        alert("Gagal menyimpan pesanan");
      });
  };

  $scope.likeProduct = function(){
    if(!$scope.product) return;

    $scope.liked = !$scope.liked;

    $scope.product.likes += $scope.liked ? 1 : -1;

    if($scope.product.likes < 0){
      $scope.product.likes = 0;
    }

    $http.put(API_URL + "/api/products/" + $scope.product.id, $scope.product);
  };

  loadProduct();

});