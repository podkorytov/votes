$(function() {
    var socket = io();

    //Register
    var userHash = localStorage.getItem('user_hash');

    if (!userHash) {
        $.post('/register', function( data ) {
            userHash = JSON.parse(data).user_hash;

            localStorage.setItem('user_hash', userHash);
        });
    }

    //Status event
    socket.on('isActive', function (isActive) {
        if (isActive) {
            $('#win').hide();
            $('#c').removeClass('voting');
            $('#poll').show();
            $('#inactive').hide();
            $(".matrixConsole").hide();
        } else {
            $('#win').hide();
            $('#poll').hide();
            $('#inactive').show();
            $('#c').removeClass('voting');

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
                $(".matrixConsole").hide();

                var data =  JSON.parse(data);

                if (data.red > data.blue || data.red == data.blue) {
                    $('.neosPunch').show().delay(2000).fadeOut(function () {
                        $(".matrixConsole").show();
                        $(".matrixConsole").typed(typedParams);
                    });
                } else {
                    $('.crazySmith').show().delay(2000).fadeOut(function () {
                        $(".matrixConsole").show();
                        $(".matrixConsole").typed(typedParams);
                    });
                }
            });
        }
    });

    //What if I told you...
    $('#poll').on('click', function() {
        $('#c').addClass('voting');
    });
    $('#red').on('click', function() {
        socket.emit('vote', { user_hash: userHash, color : 'red'});
        fontColor = 'rgba(220, 50, 20, 1)';
    });
    $('#blue').on('click', function() {
        socket.emit('vote', { user_hash: userHash, color : 'blue'});
        fontColor = 'rgba(0, 255, 0, 1)';
    });

    //Win event
    socket.on('win', function (data) {
        if (data.win === true) {
            $('#win').show();
            $('#chart').hide();
            $("#inactive").hide();

            var typedParams = {
                strings: [
                    "I didn't say it would be easy, Neo. I just said it would be the truth.",
                    "It is done."
                ],
                typeSpeed: 100,
                startDelay: 250,
                backDelay: 3300,
                backSpeed: -50001,
                showCursor: false
            };

            $(".winConsole").show();
            $(".winConsole").typed(typedParams);
        }
    });

    //Matrix rain
    var c = document.getElementById("c");
    var ctx = c.getContext("2d");

    c.height = window.innerHeight;
    c.width = window.innerWidth;

    var gurmukhi = "੧੨੩੪੫੬੭੮੯੦ੳਅਰਤਯਪਸਦਗਹਜਕਲਙੜਚਵਬਨਮੲਥਫਸ਼ਧਘਝਖਲ਼ੜ੍ਹਛਭਣ";
    var sanskrit = "१२३४५६७८९अरतयपसदगहजकलङषचवबनमआथय़फशधघझखळक्षछभणऒ";
    var chinese = "田由甲申甴电甶男甸甹町画甼甽甾甿畀畁畂畃畄畅畆畇畈畉畊畋界畍畎畏畐畑";

    var characters = sanskrit.split("");
    var font_size = 18;
    var columns = c.width/font_size;    // number of columns for the rain
    var fontColor = 'rgba(0,0,0,0)';

    var drops = [];
    for (var x = 0; x < columns; x++) {
        drops[x] = 999999999;
    }

    window.addEventListener('resize', resizeCanvas, false);
    window.addEventListener('orientationchange', resizeCanvas, false);
    resizeCanvas();

    function resizeCanvas() {
        c.height = window.innerHeight;
        c.width = window.innerWidth;
    }

    function draw() {

        ctx.fillStyle = "rgba(0, 0, 0, 0.055)";
        ctx.fillRect(0, 0, c.width, c.height);

        ctx.fillStyle = fontColor;
        ctx.font = font_size + "px arial";

        for (var i = 0; i < drops.length; i++) {
            var text = characters[Math.floor(Math.random() * characters.length)];
            ctx.fillText(text, i * font_size, drops[i] * font_size);

            if (drops[i] * font_size > c.height && Math.random() > 0.975)
                drops[i] = -50;

            drops[i]++;
        }
    }

    setInterval(draw, 33);
});