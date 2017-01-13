var socket = io();

//Status event
socket.on('isActive', function (isActive) {
    if (isActive) {
        $('#chart').show();
        $('#inactive').hide();
        $(".matrixConsole").hide();
    } else {
        $('#chart').hide();
        $('#inactive').show();
        $(".matrixConsole").show();

        var typedParams = {
            strings: [
                "Wake up, Neo...",
                "The Matrix has you...",
                "Follow the white rabbit.",
                "Zaydi na Vsemayki.ru i kupi futbolku!",
                "Knock, knock, Neo.^3000",
                "What is real? How do you define real?^2457",
                "Don't think you are, know you are.^5798",
                "Believe the unbelievable.^2579",
                "There is no spoon.^3478",
                "What is The Matrix?^6785",
                "Free your mind.^5227",
                "Neo, I believe…^7865",
                "Keep the weight forward!^4556",
                "Everything that has a beginning has an end.^8666"
            ],
            typeSpeed: 100,
            startDelay: 250,
            backDelay: 3300,
            backSpeed: -50001,
            showCursor: false
        };

        $.get('/votes', function( data ) {
            var data =  JSON.parse(data);

            if (data.red > data.blue || data.red == data.blue) {
                $('.neosPunch').show().delay(2000).fadeOut(function () {
                    $(".matrixConsole").typed(typedParams);
                });
            } else {
                $('.crazySmith').show().delay(2000).fadeOut(function () {
                    $(".matrixConsole").typed(typedParams);
                });
            }
        });
    }
});

var ctx = $("#myChart");

Chart.defaults.global.defaultFontColor = "#0f0";
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Reality", "Matrix"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 2
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        },
        legend: {
            labels: {
            }
        },
        title: {
            display: true,
            text: 'Reality VS. Matrix',
        }
    }
});

//Votes data event
socket.on('votes', function (data) {
    myChart.data.datasets[0].data = [data.red, data.blue];
    myChart.update();
});

//Win event
socket.on('win', function (data) {
    if (data.win === true) {
        $('#chart').hide();
        $('#win').show();
    }
});