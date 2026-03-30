var app = angular.module("sepatuStore");

app.controller(
  "ProdukPopulerController",
  function ($scope, ProductService, $location) {
    var BASE_URL = "http://localhost:3000/";
    $scope.produkPopuler = [];
    $scope.loading = false;
    $scope.selectedSize = null;
    $scope.selectedColor = null;
    $scope.loadProdukPopuler = function () {
      $scope.loading = true;
      ProductService.getAll()
        .then(function (res) {
          var data = res.data || [];
          $scope.produkPopuler = data
            .filter(function (p) {
              return (
                p.isPopular === true ||
                p.isPopular === 1 ||
                p.isPopular === "true" ||
                p.isPopular === "1"
              );
            })
            .map(function (p) {
              if (
                p.image &&
                !p.image.startsWith("http") &&
                !p.image.startsWith("data:")
              ) {
                if (p.image.startsWith("/")) p.image = p.image.substring(1);
                p.image = BASE_URL + p.image;
              }
              try {
                if (typeof p.colors === "string")
                  p.colors = JSON.parse(p.colors);
              } catch (e) {
                p.colors = [];
              }
              try {
                if (typeof p.sizes === "string") p.sizes = JSON.parse(p.sizes);
              } catch (e) {
                p.sizes = [];
              }
              return p;
            });
        })
        .catch(function (err) {
          console.error(err);
        })
        .finally(function () {
          $scope.loading = false;
        });
    };
    $scope.loadProdukPopuler();
    $scope.goToCheckout = function (id) {
      $location.path("/checkout/" + id);
    };
    $scope.selectSize = function (size) {
      $scope.selectedSize = size;
    };
    $scope.selectColor = function (color) {
      $scope.selectedColor = color;
    };
    $scope.resetFilter = function () {
      $scope.selectedSize = null;
      $scope.selectedColor = null;
    };
    $scope.filterProdukPopuler = function (item) {
      if ($scope.selectedSize) {
        if (!item.sizes || !item.sizes.includes(String($scope.selectedSize)))
          return false;
      }
      if ($scope.selectedColor) {
        if (!item.colors || !item.colors.includes($scope.selectedColor))
          return false;
      }
      return true;
    };
    $scope.getAvailableColors = function () {
      var colors = {};
      $scope.produkPopuler.forEach(function (p) {
        (p.colors || []).forEach(function (c) {
          colors[c] = true;
        });
      });
      return Object.keys(colors);
    };
    $scope.getAvailableSizes = function () {
      var sizes = {};
      $scope.produkPopuler.forEach(function (p) {
        (p.sizes || []).forEach(function (s) {
          sizes[s] = true;
        });
      });
      return Object.keys(sizes).sort(function (a, b) {
        return a - b;
      });
    };
    $scope.getColorHex = function (color) {
      var map = {
        Black: "#000000",
        White: "#ffffff",
        Grey: "#808080",
        Silver: "#C0C0C0",
        Red: "#ee1c25",
        Maroon: "#800000",
        Orange: "#ff7f27",
        Yellow: "#fff200",
        Beige: "#f5f5dc",
        Green: "#22b14c",
        "Dark Green": "#004000",
        Olive: "#808000",
        Navy: "#000080",
        Blue: "#00a2e8",
        Cyan: "#00ffff",
        Purple: "#a349a4",
        Pink: "#ffaec9",
        Brown: "#880015",
        Tan: "#d2b48c",
        Gold: "#ffca18",
      };
      return map[color] || "#ddd";
    };
  },
);
