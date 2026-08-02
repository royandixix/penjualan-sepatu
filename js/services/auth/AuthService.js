angular.module('sepatuStore')
.service('AuthService', function($http, $location) {

    const API_URL = "http://localhost:3000/api";

    this.login = function(data) {
        return $http.post(API_URL + "/login", data)
        .then(function(res) {

            if (res.data && res.data.token) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("authUser", JSON.stringify(res.data.user));
            }

            return res;
        });
    };

    this.register = function(data) {
        return $http.post(API_URL + "/register", data);
    };

    this.logout = function() {
        localStorage.removeItem("authUser");
        localStorage.removeItem("token");
        $location.path('/login');
    };

    this.getToken = function() {
        return localStorage.getItem("token");
    };

    this.getCurrentUser = function() {
        try {
            return JSON.parse(localStorage.getItem("authUser"));
        } catch (e) {
            return null;
        }
    };

    this.isLoggedIn = function() {
        return !!this.getToken();
    };

});