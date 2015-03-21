var socket = require('socket.io');
var WebSocket = require('ws');

var conf = require('./lib/config');

var io = socket.listen(conf.get('port'), conf.get('host'));

io.on('connection', function (socket) {
    var ws;
    socket.on('auth', function (params) {
        ws = new WebSocket(conf.get('socket'));
        try {
            ws.on('message', function (message) {
                socket.emit('message', message);
            });
            ws.on('error', function (err) {
                socket.emit('error', err);
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