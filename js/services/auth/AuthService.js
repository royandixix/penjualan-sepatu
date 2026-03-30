angular.module('sepatuStore').service('AuthService', function($http, $location) {

    const API_URL = "http://localhost:3000/api";

    // ================= LOGIN =================
    this.login = function(data) {
        return $http({
            method: 'POST',
            url: API_URL + "/login",
            data: data,
            headers: { 'Content-Type': 'application/json' }
        }).then(function(res) {
            if (res.data && res.data.user && res.data.token) {
                localStorage.setItem("authUser", JSON.stringify(res.data.user));
                localStorage.setItem("token", res.data.token);
            }
            return res;
        });
    };

    this.register = function(data) {
        return $http({
            method: 'POST',
            url: API_URL + "/register",
            data: data,
            headers: { 'Content-Type': 'application/json' }
        }).then(function(res) {
            // Opsional: simpan user langsung setelah register
            // localStorage.setItem("authUser", JSON.stringify(res.data.user));
            // localStorage.setItem("token", res.data.token);
            return res;
        });
    };

    this.logout = function() {
        localStorage.removeItem("authUser");
        localStorage.removeItem("token");
        $location.path('/admin/login');
    };

    this.getCurrentUser = function() {
        try {
            return JSON.parse(localStorage.getItem("authUser"));
        } catch (e) {
            return null;
        }
    };

    this.isLoggedIn = function() {
        return !!localStorage.getItem("authUser");
    };

});