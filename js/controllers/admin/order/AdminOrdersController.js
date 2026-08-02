var app = angular.module("sepatuStore");

app.controller("AdminOrdersController", function($scope, $http) {

    $scope.orders = [];
    $scope.searchOrder = "";
    $scope.filterStatus = "";

    // =================== GET ALL ORDERS ===================
    function loadOrders() {
        $http.get("http://localhost:3000/api/orders")
            .then(function(res) {
                $scope.orders = res.data || [];
            })
            .catch(function(err) {
                console.error("Gagal ambil data orders:", err);
                alert("Gagal mengambil data orders. Pastikan backend berjalan di port 3000.");
            });
    }

    loadOrders();

    // =================== COUNT BY STATUS ===================
    $scope.countByStatus = function(status) {
        if (!$scope.orders) return 0;
        return $scope.orders.filter(function(o) {
            return o.status === status;
        }).length;
    };

    // =================== VIEW ORDER DETAILS ===================
    $scope.viewOrder = function(order) {
        alert(
            'Detail Pesanan:\n\n' +
            'ID: ' + order.id + '\n' +
            'Nama: ' + (order.user_name || order.name || '-') + '\n' +
            'Email: ' + (order.user_email || '-') + '\n' +
            'Produk ID: ' + order.product_id + '\n' +
            'Jumlah: ' + order.qty + '\n' +
            'Total: Rp ' + parseInt(order.total).toLocaleString('id-ID') + '\n' +
            'Status: ' + order.status + '\n' +
            'Tanggal: ' + order.date
        );
    };

    // =================== UPDATE STATUS ===================
    $scope.updateStatus = function(order) {

        if (order.status !== 'Diproses') {
            alert('Status pesanan sudah ' + order.status + ', tidak bisa diubah.');
            return;
        }

        if (!confirm('Tandai pesanan ' + order.id + ' sebagai Selesai?')) return;

        $http.put("http://localhost:3000/api/orders/" + order.id + "/status", { status: 'Selesai' })
            .then(function(res) {
                order.status = 'Selesai';
                alert('Status berhasil diperbarui!');
            })
            .catch(function(err) {
                console.error("Update status error:", err);
                alert('Gagal memperbarui status. Pastikan backend aktif dan endpoint tersedia.');
            });
    };

});