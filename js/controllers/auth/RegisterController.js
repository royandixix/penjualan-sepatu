app.controller("RegisterController", function($scope, $location, AuthService) {

    $scope.user = {};

    $scope.register = function() {
        AuthService.register($scope.user)
            .then(function() {
                alert("Registrasi berhasil! Silakan login.");
                $location.path('/login');
            })
            .catch(function(err) {
                alert(err.data ? err.data.message : 'Registrasi gagal. Coba lagi.');
            });
    };

});