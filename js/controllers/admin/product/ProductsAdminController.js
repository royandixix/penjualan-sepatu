var app = angular.module("sepatuStore");

app.controller(
  "ProductsAdminController",
  function ($scope, $routeParams, $location, $timeout, ProductService) {

    var BASE_URL = window.API_URL || "http://localhost:3000/";

    $scope.products = [];

    $scope.product = {
      id: null,
      name: "",
      category: "",
      brand: "",
      gender: "",
      description: "",
      price: 0,
      stock: 0,
      sizes: [],
      colorMap: {},
      image: "",
      isActive: true,
      isPopular: false,
      supplierName: "",
      supplierAddress: "",
      supplierQty: 0,
    };

    $scope.availableColors = [
      "Black","White","Grey","Silver","Red","Maroon","Orange","Yellow",
      "Beige","Green","Dark Green","Olive","Navy","Blue","Cyan",
      "Purple","Pink","Brown","Tan","Gold",
    ];

    $scope.isEdit = false;
    $scope.newSizeInput = "";
    $scope.selectedFile = null;
    $scope.loading = false;

    /* ================= INIT ================= */
    $scope.init = function () {
      $scope.product.sizes = $scope.product.sizes || [];
      $scope.product.colorMap = angular.isObject($scope.product.colorMap)
        ? $scope.product.colorMap
        : {};

      $scope.loadProducts();

      if ($routeParams.id) {
        $scope.isEdit = true;
        $scope.loadProduct($routeParams.id);
      }
    };

    /* ================= COLOR ================= */
    $scope.addColorCount = function (color) {
      if (!$scope.product.colorMap) $scope.product.colorMap = {};
      if (!$scope.product.colorMap[color]) $scope.product.colorMap[color] = 0;
      $scope.product.colorMap[color]++;
    };

    $scope.removeColorCount = function (color) {
      if (!$scope.product.colorMap[color]) return;

      if ($scope.product.colorMap[color] > 1) {
        $scope.product.colorMap[color]--;
      } else {
        delete $scope.product.colorMap[color];
      }
    };

    $scope.hasColors = function () {
      if (!$scope.product.colorMap) return false;
      return Object.values($scope.product.colorMap).some(c => c > 0);
    };

    /* ================= LOAD PRODUCT ================= */
    $scope.loadProduct = function (id) {
      ProductService.getById(id).then(function (res) {

        var data = res.data || {};

        $scope.product = Object.assign({}, $scope.product, data);

        $scope.product.price = parseFloat($scope.product.price) || 0;
        $scope.product.stock = parseInt($scope.product.stock, 10) || 0;

        // 🔥 FIX SIZE
        if (typeof $scope.product.sizes === "string") {
          try {
            $scope.product.sizes = JSON.parse($scope.product.sizes);
          } catch (e) {
            $scope.product.sizes = [];
          }
        }

        // 🔥 FIX COLOR MAP
        $scope.product.colorMap = {};

        if (data.colors) {
          var colorData;

          try {
            colorData = typeof data.colors === "string"
              ? JSON.parse(data.colors)
              : data.colors;
          } catch (e) {
            colorData = [];
          }

          if (Array.isArray(colorData)) {
            colorData.forEach(function (c) {
              $scope.product.colorMap[c] =
                ($scope.product.colorMap[c] || 0) + 1;
            });
          }
        }

        // 🔥 FIX IMAGE
        if (
          $scope.product.image &&
          !$scope.product.image.includes("http") &&
          !$scope.product.image.startsWith("data:")
        ) {
          $scope.product.image = BASE_URL + $scope.product.image;
        }

      });
    };

    /* ================= CONVERT COLOR ================= */
    function mapColorToArray(colorMap) {
      var arr = [];
      for (var color in colorMap) {
        for (var i = 0; i < colorMap[color]; i++) {
          arr.push(color);
        }
      }
      return arr;
    }

    /* ================= SAVE ================= */
    $scope.saveProduct = function () {

      if ($scope.loading) return;

      if ($scope.productForm && $scope.productForm.$invalid) {
        alert("Form belum lengkap!");
        return;
      }

      var dataToSave = angular.copy($scope.product);

      // 🔥 convert colorMap → array
      dataToSave.colors = mapColorToArray($scope.product.colorMap);

      if (!dataToSave.name || dataToSave.price <= 0) {
        alert("Lengkapi Nama dan Harga!");
        return;
      }

      $scope.loading = true;

      ProductService.save(dataToSave, $scope.selectedFile)
        .then(function () {
          alert("Produk berhasil disimpan");
          $location.path("/admin/products");
        })
        .finally(function () {
          $scope.loading = false;
        });
    };

    /* ================= COLOR HEX ================= */
    $scope.getHexColor = function (name) {
      var colors = {
        Black:"#000", White:"#fff", Grey:"#808080", Silver:"#C0C0C0",
        Red:"#ee1c25", Maroon:"#800000", Orange:"#ff7f27",
        Yellow:"#fff200", Beige:"#f5f5dc", Green:"#22b14c",
        "Dark Green":"#004000", Olive:"#808000", Navy:"#000080",
        Blue:"#00a2e8", Cyan:"#00ffff", Purple:"#a349a4",
        Pink:"#ffaec9", Brown:"#880015", Tan:"#d2b48c", Gold:"#ffca18"
      };
      return colors[name] || "#ddd";
    };

    /* ================= SIZE ================= */
    $scope.addCustomSize = function () {
      if (!$scope.newSizeInput) return;

      if (!$scope.product.sizes.includes($scope.newSizeInput)) {
        $scope.product.sizes.push($scope.newSizeInput);
      }

      $scope.newSizeInput = "";
    };

    $scope.removeSize = function (index) {
      $scope.product.sizes.splice(index, 1);
    };

    /* ================= LOAD ALL ================= */
    $scope.loadProducts = function () {
      ProductService.getAll().then(function (res) {
        $scope.products = res.data || [];
      });
    };

    /* ================= UNIQUE ================= */
    $scope.getUniqueValues = function (field) {
      var seen = {};
      return ($scope.products || [])
        .map(p => (p[field] || "").trim())
        .filter(val => val && !seen[val] && (seen[val] = true));
    };

    /* ================= NAV ================= */
    $scope.cancel = function () {
      $location.path("/admin/products");
    };

    /* ================= IMAGE ================= */
    $scope.previewFile = function (files) {
      var file = files && files[0];
      if (!file) return;

      $scope.selectedFile = file;

      var reader = new FileReader();
      reader.onload = function (e) {
        $timeout(function () {
          $scope.product.image = e.target.result;
        });
      };
      reader.readAsDataURL(file);
    };

    $scope.init();
  }
);