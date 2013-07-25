var canvas,
    context,
    server,
    snakeId,
    STAGE_WIDTH = 50,
    STAGE_HEIGHT = 50,
    BLOCK_WIDTH = 10,
    BLOCK_HEIGHT = 10;

/**
 * Function qui gère la connexion entre le client et le server
 */
function connect() {
    server = io.connect('http://localhost:5000/snake');

    // Lorsqu'un client se connecte, on créé un iD snake
    server.on('response', function (data) {
        //console.log('Snake id response : ' + data.snakeId);
        snakeId = data.snakeId;
    });

    // Lorsque le serveur à appelé la fonction update, on appelle les fonctions suivantes
    server.on('update', function (snakes, bonuses) {
        drawCanvas(snakes, bonuses);
        drawScoreboard(snakes);
    });
}

/**
 * Fonction qui écoute sur quelle touche du clavier le client à agit
 */
function listenKeys() {
    var direction; // la direction voulue

    $(document).keydown(function (e) {
        var key = e.keyCode;
        switch (key) {
            case 37: // left (flèche de gauche)
                direction = 'left';
            break;
            case 38: // up (flèche du haut)
                direction = 'up'
            break;
            case 39: // right (flèche de droite)
                direction = 'right';
            break;
            case 40: // bottom (flèche du bas)
                direction = 'down';
            break;
        }
        //console.log('Ma nouvelle direction : ' + direction);
        server.emit('Snake.requestDirection', {direction: direction});
    });
}

/**
 * Fonction qui dessine sur notre canvas.
 * @param snakes
 * @param bonuses
 */
function drawCanvas(snakes, bonuses) {
    context.fillStyle = '#fff'; // couleur du fond du canvas
    // On dessine nos carré de la scène
    for (var i=0; i<STAGE_WIDTH; i++) {
        for (var j=0; j<STAGE_HEIGHT; j++) {
            context.fillRect(i * BLOCK_WIDTH, j * BLOCK_HEIGHT, BLOCK_WIDTH - 1, BLOCK_HEIGHT - 1); // borders, (x, y, w, h)
        }
    }

    // On dessine nos bonuses
    for (i in bonuses) {
        if(bonuses[i].isSpecialBonus == true) { // Si c'est un bonus spécial
            // On change la couleur du bonus et on change la couleur de l'ombre du plateau de jeu
            context.fillStyle = '#8D22BF';
            $('#stage').css({
                "-moz-box-shadow": "0px 0px 25px #8D22BF",
                "-webkit-box-shadow": "0px 0px 25px #8D22BF",
                "box-shadow": "0px 0px 25px #8D22BF",
                "margin-top": "20px"
            });
        }else { // sinon
            context.fillStyle = '#0000FF';
            $('#stage').css({
                "-moz-box-shadow": "0px 0px 25px #000000",
                "-webkit-box-shadow": "0px 0px 25px #000000",
                "box-shadow": "0px 0px 25px #000000",
                "margin-top": "20px"
            });
        }
        context.fillRect(bonuses[i].x * BLOCK_WIDTH, bonuses[i].y * BLOCK_HEIGHT, BLOCK_WIDTH - 1, BLOCK_HEIGHT - 1);
    }

    // On dessine les snakes
    for (i in snakes) {
        var snake = snakes[i];
        var snakeLength = snake.elements.length;

        for (var j=0; j<snakeLength; j++) {
            var element = snake.elements[j],
                x = element.x * BLOCK_WIDTH,
                y = element.y * BLOCK_HEIGHT;

            if (snake.playerId == snakeId) {
                // Mon joueur
                context.fillStyle = 'rgba(255, 0, 0, ' + ( j*snakeLength/100+.1) + ')';
            }
            else {
                // les ennemis
                context.fillStyle = '#000';
            }

            context.fillRect(x, y, BLOCK_WIDTH-1, BLOCK_HEIGHT - 1);

        }
    }
}

/**
 * Fonction qui dessine le tableau des scores
 * @param snakes
 */
function drawScoreboard (snakes) {
    // définie la base du tableau des scores
    var html = '<table>' +
                    '<tr>' +
                        '<th>Player</th>' +
                        '<th>Kills</th>' +
                        '<th>Goodies</th>' +
                        '<th>Deaths</th>' +
                        '<th>Score</th>' +
                    '</tr>'
                ;
    // pour chaques snakes on défini ses items de score
    for (i in snakes) {
        var snake = snakes[i];

        html += '<tr>' +
                    '<td>' + snake.playerId + '</td>' +
                    '<td>' + snake.kills + '</td>' +
                    '<td>' + snake.goodies + '</td>' +
                    '<td>' + snake.deaths + '</td>' +
                    '<td>' + snake.score + '</td>' +
                '</tr>';
    }

    html += '</table>';

    // Ajoute tout ca dans le DOM
    $('#thisPlayerId span').empty().prepend(snake.playerId);
    $('#scoreTable').empty().append(html);
}

$(function () {
    canvas = $('#stage');
    context = canvas.get(0).getContext('2d'); // On récupère notre contexte 2d (on peut donc écrire, dessiner dessus etc...)

    connect();
    listenKeys();

});