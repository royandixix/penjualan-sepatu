angular.module('sepatuStore').controller('AdminLoginController',
function($scope, $location, AuthService) {

    // =============================
    // MODEL DATA FORM
    // =============================
    $scope.loginData = {
        email: "",
        password: ""
    };

    // =============================
    // FUNCTION LOGIN
    // =============================
    $scope.login = function() {

        // validasi input kosong
        if(!$scope.loginData.email || !$scope.loginData.password){
            alert("Email dan password wajib diisi!");
            return;
        }

        // kirim request ke backend
        AuthService.login($scope.loginData)

        .then(function(response){

            var user = response.data.user;
            var token = response.data.token;

            // cek apakah admin
            if(user.role !== "admin"){
                alert("Akun ini bukan admin!");
                return;
            }

            // simpan session login
            localStorage.setItem("authUser", JSON.stringify(user));
            localStorage.setItem("token", token);

            // redirect ke dashboard
            $location.path("/admin/dashboard");

        })

        .catch(function(error){

            if(error.data && error.data.message){
                alert(error.data.message);
            }else{
                alert("Login gagal. Periksa server.");
            }

        });

    };

    // =============================
    // PINDAH KE HALAMAN REGISTER
    // =============================
    $scope.goToRegister = function(){
        $location.path("/admin/register");
    };

});