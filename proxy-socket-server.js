var socket = require('socket.io');
var WebSocket = require('ws');
var http = require('http');

var app = http.createServer();
var io = socket.listen(app.listen(8080, 'localhost'));

app.on('request', function (req, res) {
    res.statusCode = 404;
    res.end();
});

io.on('connection', function (socket) {
    var ws;
    socket.on('auth', function (params) {
        ws = new WebSocket('ws://192.168.5.3:8047');
        try {
            var tmpParams = JSON.parse(params);
            ws.on('message', function (message) {
                var conn = socket;
                console.log('ws on message id', conn.id);
                socket.emit('message', message);
            });
            ws.on('error', function (err) {
                socket.emit('error', err);
            });
            ws.on('open', function () {
                ws.send(params);
                var pingWsInterval = setInterval(function () {
                    ws.send('{"opt":"system.ping", "data":null}');
                    console.log('ping');
                }, 15000);
            });
        } catch (error) {
            this.emit('error', error);
        }
    });
    socket.on('message', function (params) {
        try {
            ws.send(params);
        } catch (error) {
            this.emit('error', error);
        }
    });
    socket.on('error', function (error) {
        this.emit(error);
    });
});