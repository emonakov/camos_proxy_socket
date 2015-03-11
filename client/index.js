var Client = (function () {
    var users = {};

    function Client() {
    }

    Client.prototype.set = function (key, val) {
        this[key] = val;
        return this;
    };
    Client.prototype.get = function (key) {
        return this[key] || false;
    };
    Client.prototype.setSocket = function (ws) {
        this.ws = ws;
        return this.ws;
    };
    Client.prototype.getSocket = function () {
        if (this.hasOwnProperty('ws')) {
            return this.ws;
        }
        return false;
    };

    function createInstance() {
        return new Client();
    }

    return {
        getClient: function (id) {
            if (!users[id]) {
                users[id] = createInstance();
            }
            return users[id];
        },
        removeClient: function(id) {
            delete users[id];
        }
    };
})();

module.exports = Client;