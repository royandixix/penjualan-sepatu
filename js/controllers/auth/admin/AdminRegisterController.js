angular.module("sepatuStore").controller("AdminRegisterController", function ($scope, $location, AuthService) {
    $scope.adminData = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    };

    $scope.successMsg = ""; // untuk pesan sukses

    $scope.register = function () {
        $scope.successMsg = ""; // reset pesan sukses setiap submit

        if (!$scope.adminData.name || !$scope.adminData.email || !$scope.adminData.password) {
            alert("Semua field wajib diisi!");
            return;
        }

      

        if ($scope.adminData.password !== $scope.adminData.confirmPassword) {
            alert("Password tidak cocok!");
            return;
        }

        const payload = {
            name: $scope.adminData.name,
            email: $scope.adminData.email,
            password: $scope.adminData.password,
        };

        AuthService.register(payload)
            .then(function (response) {
                if (response.data && response.data.user) {
                    // tampilkan pesan sukses di halaman
                    $scope.successMsg = "Register berhasil! Silakan login.";
                    // reset form
                    $scope.adminData = { name: "", email: "", password: "", confirmPassword: "" };
                    // optional: redirect otomatis setelah 2 detik
                    // setTimeout(() => {
                    //     $location.path("/admin/login");
                    //     $scope.$apply();
                    // }, 2000);
                } else if (response.data && response.data.message) {
                    alert(response.data.message);
                } else {
                    alert("Register gagal! Periksa server.");
                }
            })
            .catch(function (error) {
                if (error.data && error.data.message) {
                    alert(error.data.message);
                } else {
                    alert("Register gagal! Periksa koneksi server.");
                }
            });
    };
});