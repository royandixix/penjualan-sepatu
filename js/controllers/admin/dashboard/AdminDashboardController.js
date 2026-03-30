app.controller('AdminDashboardController', function($scope, $timeout) {
    $scope.today = new Date();
    
    $scope.summaryCards = [
        { label: 'Pendapatan', value: 'Rp 12.450.000', icon: 'fa-sack-dollar', color: 'primary' },
        { label: 'Pesanan', value: '128', icon: 'fa-cart-shopping', color: 'success' },
        { label: 'Total Produk', value: '45', icon: 'fa-boxes-stacked', color: 'info' },
        { label: 'Pengguna Aktif', value: '1.024', icon: 'fa-user-check', color: 'warning' }
   
    ];

    $scope.categories = [
        { name: 'Lari (Running)', percent: 75, color: 'primary' },
        { name: 'Sneakers', percent: 40, color: 'success' },
        { name: 'Formal', percent: 25, color: 'info' }
    ];

    $timeout(function() {
        const ctx = document.getElementById('mainSalesChart').getContext('2d');
        
        if (window.myChart) {   
            window.myChart.destroy();
        }

        window.myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
                datasets: [{
                    label: 'Pendapatan',
                    data: [420, 580, 850, 720, 910, 540, 980],
                    backgroundColor: '#3b82f6',
                    borderRadius: 10,
                    hoverBackgroundColor: '#2563eb',
                    barThickness: 25
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#111827',
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return ' Pendapatan: Rp ' + context.raw + '.000';
                            }
                        }
                    }
                },
                scales: {
                    x: { 
                        grid: { display: false }, 
                        border: { display: false },
                        ticks: { color: '#9ca3af', font: { size: 12 } }
                    },
                    y: { 
                        grid: { color: '#f1f5f9', drawBorder: false }, 
                        border: { display: false },
                        ticks: { color: '#9ca3af', font: { size: 12 } }
                    }
                }
            }
        });
    }, 100);
});