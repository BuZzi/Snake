var Server = require('./server.js').Server, // Récupère l'objet Server
    Snake = require('./snake.js').Snake, // Récupère l'objet Snake
    Bonus = require('./bonus.js').Bonus; // Récupère l'objet Bonus

var s = new Server(); // Initialise l'objet Server
s.init(5000); // Initialise la connexion

var snakes = {}, // Tableau qui contient tous les snakes
    bonuses = {}; // Tableau de bonus

var nbBonus = 0; // Nombre de bonus mangé par le snake
// Events process
s.em.addListener('Server.newSnake', function (playerId) {
    var snake = new Snake(); // Créé un nouveau snake
    snake.init(playerId);

    snakes[playerId] = snake; // Rempli le tableau de snakes

});

// Ecoute si le client s'est deconnecté
s.em.addListener('Snake.disconnect', function (playerId) {
    console.log('Client disconnect');
    delete snakes[playerId];
});

// Ecoute si le snake à changé de direction
s.em.addListener('Snake.changeDirection', function (data) {
    snakes[data.id].setDirection(data.direction);
});

// Fonction qui est appelé en fonction du timer
var updateState = function () {
    //console.log('Update');

    // le i réfère à l'index
    for (i in snakes) {
        snakes[i].doStep();
    }

    checkColisions();
    s.update(snakes, bonuses);

};

/**
 * Fonction qui vérifie les colisions
 */
function checkColisions() {
    var snake;
    // colision des bonus
    for(var i in snakes) {
        snake = snakes[i]; // snake, notre snake courant
        for(var j in bonuses) {
            if(snake.hasColision(bonuses[j])) {
                snake.addLength(bonuses[j]); // augmentation de la longueur du serpent
                snake.goodies++; // On incrémente de 1 les goodies
                nbBonus++; // On incrémente le nombre de bonus
                if(nbBonus % 5 == 0) { // si le nombre de bonus est divisible par 5 (donc tous les 5 bonus)
                    // On créé un nouveau bonus qui sera 'spécial' et qui permettra de gagner 60 points d'un coup
                    // et d'augmenter la taille du snake de 6 elements
                    bonuses[j] = new Bonus();
                    bonuses[j].init();
                    bonuses[j].specialBonus();
                }else {
                    bonuses[j] = new Bonus();
                    bonuses[j].init();
                }

                // On casse l'itération en cours car un snake ne peut pas bouffer plusieurs bonus à la fois (performance)
                break;
            }
        }
    }

    // colisions avec les autres (nouvel onglet)
    var resetSnakes = [];
    for(var i in snakes) {
        snake = snakes[i]; // snake, notre snake courant
        for(var j in snakes) {
            for(var k in snakes[j].elements) { // on boucle sur tous les éléments du snake
                if (snakes[j].playerId == snake.playerId && k == snakes[j].elements.length - 1) { // Condition qui vérifie si c'est le même snake et si c'est sa tête
                    continue; // saute l'itération suivante
                }

                if(snake.hasColision(snakes[j].elements[k])) {
                    resetSnakes.push(snake);

                    if(snakes[j].playerId != snake.playerId) { // Si ce n'est pas le même snake
                        snakes[j].onKill(); // augmente le nombre de kill au snake
                    }
                }
            }
        }
    }

    // Mort du snake
    for (var i in resetSnakes) {
        resetSnakes[i].onDie();
    }
}

/**
 * Fonction qui remplie le tableau de bonus
 */
function createBonuses() {
    for(var i=0; i<1; i++) {
        bonuses[i] = new Bonus();
        bonuses[i].init();
    }
}

var tick = setInterval(updateState, 100); // timer pour rafraichir l'état d'affichage
createBonuses(); // on appelle la fonction qui remplie le tableau de bonus