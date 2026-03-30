app.controller('AdminLayoutCtrl', function($scope, $location, AuthService) {

    // ===== CEK LOGIN ADMIN =====
    var user = AuthService.getCurrentUser();
    if (!user) {
        // Kalau belum login, redirect ke halaman login
        $location.path('/admin/login');
        return;
    }

    // ===== SIDEBAR =====
    $scope.sidebarOpen = true;

    $scope.toggleSidebar = function() {
        $scope.sidebarOpen = !$scope.sidebarOpen;
    };

});