var socket = require('socket.io');
var WebSocket = require('ws');
var app = require('http').createServer();
var conf = require('./lib/config');

var io = socket.listen(app.listen(conf.get('port'), conf.get('host')));
app.on('request', function (req, res) {
    res.statusCode = 404;
    res.end();
});
io.on('connection', function (socket) {
    var ws;
    socket.on('message', function (params) {
        try {
            var data = JSON.parse(params);
            if (data.opt === "user.auth.token") {
                ws = new WebSocket(conf.get('socket'));
                ws.on('message', function (message) {
                    socket.emit('message', message);
                });
                ws.on('open', function () {
                    ws.send(params);
                    var pingWsInterval = setInterval(function () {
                        ws.send('{"opt":"system.ping", "data":null}');
                    }, 15000);
                    socket.on('disconnect', function () {
                        clearInterval(pingWsInterval);
                    });
                });
            } else {
                ws.send(params);
            }
        } catch (error) {
            this.emit('error', error);
        }
    });
    socket.on('error', function (error) {
        this.emit(error);
    });
});