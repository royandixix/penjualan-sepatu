var app = angular.module("sepatuStore", ["ngRoute"]);

/* ================= SANITIZATION ================= */
app.config(function ($compileProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(
    /^\s*(https?|local|data|chrome-extension):/
  );
});

/* ================= HASH PREFIX ================= */
app.config(function ($locationProvider) {
  $locationProvider.hashPrefix("");
});

/* ================= ROUTES ================= */
app.config(function ($routeProvider) {
  $routeProvider
    .when("/admin", { redirectTo: "/admin/login" })
    .when("/admin/", { redirectTo: "/admin/login" })

    /* ===== ADMIN AUTH ===== */
    .when("/admin/login", {
      templateUrl: "views/admin/auth/login.html",
      controller: "AdminLoginController",
    })
    .when("/admin/register", {
      templateUrl: "views/admin/auth/register.html",
      controller: "AdminRegisterController",
    })

    /* ===== ADMIN ===== */
    .when("/admin/dashboard", {
      templateUrl: "views/admin/dashboard.html",
      controller: "AdminDashboardController",
    })
    .when("/admin/products", {
      templateUrl: "views/admin/products/index.html",
      controller: "ProductsAdminController",
    })
    .when("/admin/products/create", {
      templateUrl: "views/admin/products/create.html",
      controller: "ProductsAdminController",
    })
    .when("/admin/products/edit/:id", {
      templateUrl: "views/admin/products/edit.html",
      controller: "ProductsAdminController",
    })
    .when("/admin/orders", {
      templateUrl: "views/admin/daftar-pesanan/index.html",
      controller: "AdminOrdersController",
    })
    .when("/admin/orders/:id", {
      templateUrl: "views/admin/daftar-pesanan/detail.html",
      controller: "AdminOrdersController",
    })

    /* ===== USER ===== */
    .when("/shop", {
      templateUrl: "views/user/shop/index.html",
      controller: "ShopController",
    })
    .when("/produk-populer", {
      templateUrl: "views/user/produk-populer/index.html",
      controller: "ProdukPopulerController",
    })
    .when("/cart", {
      templateUrl: "views/user/cart/index.html",
      controller: "CartController",
    })
    .when("/checkout/:id", {
      templateUrl: "views/user/checkout/index.html",
      controller: "CheckoutController",
    })

    /* ===== USER AUTH ===== */
    .when("/login", {
      templateUrl: "views/user/auth/login.html",
      controller: "LoginController",
    })
    .when("/register", {
      templateUrl: "views/user/auth/register.html",
      controller: "RegisterController",
    })

    /* ===== DEFAULT ===== */
    .otherwise({
      redirectTo: "/shop",
    });
});

/* ================= HTTP INTERCEPTOR ================= */
app.config(function ($httpProvider) {
  $httpProvider.interceptors.push(function ($q, $injector) {
    return {
      request: function (config) {
        var token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = "Bearer " + token;
        }
        return config;
      },

      responseError: function (rejection) {
        if (rejection.status === 401 || rejection.status === 403) {
          localStorage.removeItem("authUser");
          localStorage.removeItem("token");

          var $location = $injector.get("$location");
          $location.path("/admin/login");
        }
        return $q.reject(rejection);
      },
    };
  });
});

/* ================= ADMIN LAYOUT ================= */
app.controller("AdminLayoutCtrl", function ($scope, $window, $location) {
  function isMobile() {
    return $window.innerWidth <= 768;
  }

  $scope.sidebarOpen = !isMobile();

  $scope.toggleSidebar = function () {
    $scope.sidebarOpen = !$scope.sidebarOpen;
  };

  function updateActive() {
    $scope.activePath = $location.path() || "/";
  }

  updateActive();

  $scope.$on("$routeChangeSuccess", updateActive);

  angular.element($window).on("resize", function () {
    $scope.$apply(function () {
      $scope.sidebarOpen = !isMobile();
    });
  });
});

/* ================= RUN BLOCK ================= */
app.run(function ($rootScope, $location) {

  /* ===== NAVIGATION HELPER ===== */
  $rootScope.go = function (path) {
    $location.path(path);
  };

  var adminAuthRoutes = ["/admin/login", "/admin/register"];

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem("authUser"));
    } catch (e) {
      return null;
    }
  }

  function setFlags(path) {
    path = path || "/";
    var user = getUser();

    $rootScope.currentUser = user;
    $rootScope.isAdminPage = path.startsWith("/admin");
    $rootScope.isAdminAuthPage = adminAuthRoutes.includes(path);
  }

  /* INIT */
  setFlags($location.path());

  /* ROUTE GUARD */
  $rootScope.$on("$routeChangeStart", function (event) {
    var path = $location.path() || "";
    var user = getUser();

    /* ===== ADMIN PROTECTION ===== */
    if (path.startsWith("/admin") && !adminAuthRoutes.includes(path)) {
      if (!user) {
        event.preventDefault();
        $location.path("/admin/login");
        return;
      }

      if (user.role !== "admin") {
        event.preventDefault();
        $location.path("/shop");
        return;
      }
    }

    /* ===== ADMIN LOGIN REDIRECT ===== */
    if (adminAuthRoutes.includes(path)) {
      if (user && user.role === "admin") {
        event.preventDefault();
        $location.path("/admin/dashboard");
        return;
      }
    }

    setFlags(path);
  });

  /* ================= GOOGLE TRANSLATE FIX ================= */
  $rootScope.$on("$routeChangeSuccess", function () {
    var lang = localStorage.getItem("okko_lang");

    if (lang && lang !== "id") {
      setTimeout(function () {
        var select = document.querySelector(
          "#google_translate_element select"
        );
        if (select) {
          select.value = lang;
          select.dispatchEvent(new Event("change"));
        }
      }, 1000);
    }
  });

  /* ================= LOGOUT ================= */
  $rootScope.logout = function () {
    localStorage.removeItem("authUser");
    localStorage.removeItem("token");
    $rootScope.currentUser = null;
    $location.path("/admin/login");
  };
});