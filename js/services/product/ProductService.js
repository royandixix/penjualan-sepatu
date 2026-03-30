var app = angular.module("sepatuStore");
app.service("ProductService", function ($http) {
  const baseUrl = "http://localhost:3000/api/products";
  this.getAll = function () {
    return $http.get(baseUrl);
  };
  this.getById = function (id) {
    return $http.get(baseUrl + "/" + id);
  };
  this.save = function (product, file) {
    const formData = new FormData();
    for (let key in product) {
      if (key === "sizes" || key === "colors") {
        formData.append(key, JSON.stringify(product[key] || []));
      } else {
        formData.append(key, product[key]);
      }
    }
    if (file) {
      formData.append("image", file);
    }
    if (product.id) {
      return $http.put(baseUrl + "/" + product.id, formData, {
        headers: { "Content-Type": undefined },
      });
    } else {
      return $http.post(baseUrl, formData, {
        headers: { "Content-Type": undefined },
      });
    }
  };
  this.delete = function (id) {
    return $http.delete(baseUrl + "/" + id);
  };
});
