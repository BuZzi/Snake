// Récupère l'objet express, http, events, io
var express = require('express'),
    http = require('http'), // -
    events = require('events'),
    io = require('socket.io'),
    app = express(); // -

/**
 * Constructeur
 */
exports.Server = Server = function () {
    this.clientId = 1;
};

/**
 * Fonction qui créé le serveur puis initialise la connexion
 * @param port : le port utilisé
 */
Server.prototype.init = function (port) {
    this.server = http.createServer(app); // Créé le serveur
    app.use(express.static(__dirname + '/../public')); // Les fichiers qui seront accessibles par le client (public)
    this.server.listen(port); // Ecoute le port
    this.startSockets();
    this.em = new events.EventEmitter();
    console.log('Listening port : ' + port);
};

/**
 * Fonction qui démarre les sockets
 */
Server.prototype.startSockets = function () {
    this.socket = io.listen(this.server); // On demande au socket qu'on a initialisé plus haut d'écouter notre serveur

    // configure nos variables pour notre socket
    this.socket.configure(function() {
        this.socket.set('log level', 1);

    }.bind(this)); // bind() permet de trouver l'objet parent

    // Créé la route snake, attends l'évènement de connexion (joueur qui se connecte à l'url)
    this.socket.of('/snake').on('connection', function(client) {
        client.snakeId = this.clientId;
        this.clientId++;

        client.emit('response', {snakeId: client.snakeId}); // Le serveur envoi une réponse au client
        this.em.emit('Server.newSnake', client.snakeId); // Envoi un évènement
        console.log('Client connect');


        client.on('Snake.requestDirection', function (data) {
            this.em.emit('Snake.changeDirection', {
                id: client.snakeId,
                direction: data.direction
            });
        }.bind(this));

        client.on('disconnect', function () {
            this.em.emit('Snake.disconnect', client.snakeId);
        }.bind(this));
    }.bind(this));
};

/**
 * Fonction qui envoi les mises à jour
 * @param snakes
 * @param bonuses
 */
Server.prototype.update = function (snakes, bonuses) {
    this.socket.of('/snake').emit('update', snakes, bonuses);
}