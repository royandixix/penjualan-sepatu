angular.module("sepatuStore").controller("CheckoutController", function ($scope, $http, $routeParams, $location) {

  const API_URL = "http://localhost:3000";

  $scope.product = null;
  $scope.selectedSize = null;
  $scope.selectedColor = null;
  $scope.qty = 1;
  $scope.liked = false;

  const COLOR_MAP = {
    Black:"#000000",White:"#ffffff",Grey:"#808080",Silver:"#C0C0C0",
    Red:"#ee1c25",Maroon:"#800000",Orange:"#ff7f27",Yellow:"#fff200",
    Beige:"#f5f5dc",Green:"#22b14c","Dark Green":"#004000",
    Olive:"#808000",Navy:"#000080",Blue:"#00a2e8",
    Cyan:"#00ffff",Purple:"#a349a4",Pink:"#ffaec9",
    Brown:"#880015",Tan:"#d2b48c",Gold:"#ffca18"
  };

  $scope.getHexColor = name => COLOR_MAP[name] || "#ddd";

  $scope.increaseQty = () => $scope.qty++;
  $scope.decreaseQty = () => { if ($scope.qty > 1) $scope.qty--; };

  $scope.selectSize = size => $scope.selectedSize = size;

  $scope.selectColor = color => {
    $scope.selectedColor = ($scope.selectedColor === color ? null : color);
  };

  function normalizeImage(p){
    if(p.image && !p.image.startsWith("http")){
      if(p.image.startsWith("/")) p.image = p.image.substring(1);
      p.image = API_URL + "/" + p.image;
    }
  }

  function normalizeSizes(p){
    try { p.sizes = JSON.parse(p.sizes || "[]"); }
    catch(e){ p.sizes = []; }
    if(!p.sizes.length) p.sizes = [38,39,40,41,42];
  }

  function normalizeColors(p){
    let map = {};
    if(p.colors){
      let data;
      try {
        data = typeof p.colors === "string" ? JSON.parse(p.colors) : p.colors;
      } catch(e){ data = []; }

      if(Array.isArray(data)){
        data.forEach(c => map[c] = (map[c] || 0) + 1);
      } else {
        map = data || {};
      }
    }
    p.colorMap = map;
  }

  function loadProduct(){
    const id = $routeParams.id;

    $http.get(API_URL + "/api/products/" + id)
      .then(res => {
        let p = res.data;

        p.likes = p.likes || 0;

        normalizeImage(p);
        normalizeSizes(p);
        normalizeColors(p);

        $scope.product = p;
      })
      .catch(() => alert("Gagal memuat produk"));
  }

  function validateOrder(){
    if(!$scope.product) return "Produk belum dimuat";
    if(!$scope.selectedSize) return "Pilih ukuran dulu!";
    if(!$scope.selectedColor) return "Pilih warna dulu!";
    if(!$scope.qty || $scope.qty < 1) return "Jumlah tidak valid";
    return null;
  }

  $scope.buyNow = function () {
    const user = JSON.parse(localStorage.getItem("authUser"));
    if(!user){
      alert("Silakan login terlebih dahulu!");
      $location.path("/login");
      return;
    }

    const error = validateOrder();
    if(error){ alert(error); return; }

    const order = {
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
      .then(() => {
        alert("Pesanan berhasil!");
        $location.path("/shop");
      })
      .catch(() => alert("Gagal menyimpan pesanan"));
  };

  $scope.likeProduct = function () {
    if(!$scope.product) return;

    $scope.liked = !$scope.liked;

    $scope.product.likes += $scope.liked ? 1 : -1;
    if($scope.product.likes < 0) $scope.product.likes = 0;

    $http.put(API_URL + "/api/products/" + $scope.product.id, $scope.product);
  };

  loadProduct();

});