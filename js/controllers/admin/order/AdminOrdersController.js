app.controller("AdminOrdersController", function($scope, $http) {

    $scope.orders = [];
    $scope.searchOrder = "";
    $scope.filterStatus = "";


    $http.get("backend/data/orders.json")
        .then(function(res) {
            $scope.orders = res.data || [];
        })
        .catch(function(err) {
            console.error("Gagal ambil data orders:", err);
        });

    $scope.countByStatus = function(status) {
        if (!$scope.orders) return 0;
        return $scope.orders.filter(function(o) {
            return o.status === status;
        }).length;
    };

    

    $scope.viewOrder = function(order) {
        alert('Detail Pesanan:\n\nID: ' + order.id + '\nPelanggan: ' + order.customer + '\nTotal: Rp ' + parseInt(order.total).toLocaleString('id-ID') + '\nStatus: ' + order.status + '\nTanggal: ' + order.date);
    };


    $scope.updateStatus = function(order) {

        if (order.status !== 'Diproses') {
            alert('Status pesanan sudah ' + order.status + ', tidak bisa diubah.');
            return;
        }

        // if (order.status != 'Diproses') {
        //     alert('Status pesanan suda ' + order.status + ',tidak bisa diubah.');
        //     return;
        // }


        if (!confirm('Tandai pesanan ' + order.id + ' sebagai Selesai?')) return;

        $http.put("backend/orders/" + order.id + "/status", { status: 'Selesai' })
            .then(function() {
                order.status = 'Selesai';
                alert('Status berhasil diperbarui!');
            })
            .catch(function(err) {
                console.error("Update status error:", err);
                alert('Gagal memperbarui status. Pastikan backend aktif.');
            });
    };

});