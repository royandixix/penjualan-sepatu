var app = angular.module("sepatuStore");

app.service("OrderService", function($http) {
  const baseUrl = "http://localhost:3000/api/orders";

  // Ambil semua order
  this.getAll = function() {
    return $http.get(baseUrl);
  };

  // Ambil order berdasarkan ID
  this.getById = function(id) {
    return $http.get(`${baseUrl}/${id}`);
  };

  // Tambah order baru
  this.create = function(order) {
    return $http.post(baseUrl, order);
  };

  // Hapus order
  this.delete = function(id) {
    return $http.delete(`${baseUrl}/${id}`);
  };
});