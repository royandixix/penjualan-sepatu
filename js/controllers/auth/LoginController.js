app.controller("LoginController", function($scope, $location, AuthService) {

    $scope.loginData = {};

    $scope.login = function() {
        AuthService.login($scope.loginData)
            .then(function(res) {
                AuthService.saveAuth(res.data);

                // Cek role → redirect ke tempat yang sesuai
                const role = res.data.role;
                if (role === 'admin') {
                    $location.path('/admin/dashboard');
                } else {
                    $location.path('/shop');
                }
            })
            .catch(function(err) {
                alert(err.data ? err.data.message : 'Login gagal. Periksa email dan password.');
            });
    };

});