var socket = require('socket.io');
var Client = require('./client');
var app = require('http').createServer();
var WebSocket = require('ws');
var io = socket.listen(app.listen(8080, 'localhost'));
app.on('request', function (req, res) {
    res.statusCode = 404;
    res.end();
});
io.on('connection', function (socket) {
    console.info('socket client connected');
    socket.on('auth', function (params) {
        try {
            var tmpParams = JSON.parse(params);
            var client = Client.getClient(this.id);
            var ws = client.setSocket(new WebSocket('ws://192.168.5.3:8047'));
            client.set('token', tmpParams.data.token);
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
                    console.log('ping');
                }, 15000);
            });
        } catch (error) {
            this.emit('error', error);
        }
    });
    socket.on('message', function (params) {
        try {
            Client.getClient(this.id).getSocket().send(params);
        } catch (error) {
            this.emit('error', error);
        }
    });
    socket.on('error', function (error) {
        this.emit(error);
    });
    socket.on('disconnect', function () {
        console.log('client disconnected', this.id);
    });
});