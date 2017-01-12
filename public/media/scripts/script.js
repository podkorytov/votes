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
            $('#poll').show();
            $('#inactive').hide();
        } else {
            $('#poll').hide();
            $('#inactive').show();
        }
    });

    //What if I told you...
    $('#red').on('click', function() {
        socket.emit('vote', { user_hash: userHash, color : 'red'});
        fontColor = 'rgba(220, 50, 20, 1)';
        console.log('red pill clicked');
    });

    $('#blue').on('click', function() {
        socket.emit('vote', { user_hash: userHash, color : 'blue'});
        fontColor = 'rgba(0, 255, 0, 1)';
        console.log('blue pill clicked');
    });

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

    $('#poll').on('click', function() {
        $('#c').addClass('voting');
    });

    $('#stop').on('click', function() {
        $('#c').removeClass('voting');
    });

    setInterval(draw, 33);
});