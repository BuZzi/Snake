/**
 * Constructeur
 */
exports.Snake = Snake = function () {
    this.SNAKE_LENGTH = 8;
    this.STAGE_WIDTH = 50-1;
    this.STAGE_HEIGHT = 50-1;
};

/**
 * Fonction d'initialisation
 * @param : playerId : l'ID du joueur
 */
Snake.prototype.init = function (playerId) {
    this.playerId = playerId;
    this.kills = 0;
    this.deaths = 0;
    this.goodies = 0;
    this.score = 0;
    this.currentLength = this.SNAKE_LENGTH;
    this.elements = []; // on créé un élément
    this.direction = 'right';

    var rand = Math.floor(Math.random() * this.STAGE_WIDTH);
    // remplit les éléments
    for (var i=this.SNAKE_LENGTH; i>0; i--) {
        this.elements.push({x: -i, y: rand}) // push ajoute un élément à la fin du tableau
    }
};

/**
 * Fonction qui reset le snake lorsqu'il meurt
 */
Snake.prototype.reset = function () {
    this.currentLength = this.SNAKE_LENGTH; // on reset à sa taille d'origine
    this.direction = 'right';
    this.elements = []; // On recréé un tableau d'éléments (mise à 0)
    var rand = Math.floor(Math.random() * this.STAGE_HEIGHT);
    // remplit les éléments
    for (var i=this.SNAKE_LENGTH; i>0; i--) {
        this.elements.push({x: -i, y: rand}) // push ajoute un élément à la fin du tableau
    }
};

/**
 *
 */
Snake.prototype.doStep = function () {
    var length = this.elements.length - 1;
    for (var i=0; i<length; i++) {
        this.moveBlock(i);
    }
    this.moveHead();
};

/**
 *  Fonction qui permet de bouger les éléments du snake
 * @param i
 */
Snake.prototype.moveBlock = function (i) {
    this.elements[i].x = this.elements[i + 1].x;
    this.elements[i].y = this.elements[i + 1].y;
};

/**
 * Fonction qui gère comment la tête du snake va réagir à la direction demandé
 */
Snake.prototype.moveHead = function () {
    var length = this.elements.length;
    var head = this.elements[length - 1];

    switch (this.direction) {
        case 'right':
            head.x++;
            break;

        case 'left':
            head.x--;
            break;

        case 'up':
            // On commence en haut à gauche
            head.y--;
        break;

        case 'down':
            // On commence en haut à gauche
            head.y++;
        break;
    }

    // Gestion du Hors stage
    if (head.x > this.STAGE_WIDTH) {
        head.x = 0;
    }
    else if (head.x < 0) {
        head.x = this.STAGE_WIDTH;
    }
    if (head.y > this.STAGE_WIDTH) {
        head.y = 0;
    }
    else if (head.y < 0) {
        head.y = this.STAGE_WIDTH;
    }
};

/**
 *  Fonction de gestion de la direction du snake
 * @param direction
 */
Snake.prototype.setDirection = function (direction) {
    // Si le client demande à son snake de faire demi tour sur lui même on l'empêche
    if (direction == 'right' && this.direction == 'left' || direction == 'up' && this.direction == 'down' || direction == 'left' && this.direction == 'right' || direction == 'down' && this.direction == 'up' ) {

    }else { // sinon il peut bouger dans la direction demandée
        this.direction = direction;
    }
};

/**
 *  Fonction de gestion des colisions
 * @param item
 * @return {Boolean}
 */
Snake.prototype.hasColision = function (item) {
    var head = this.elements[this.elements.length - 1]; // on défini la tête
    if (head.x == item.x && head.y == item.y) { // Si la tête de ton snake à touché l'item
        return true; // il y a colision
    }
    return false; // il n'y a pas colision
};

/**
 * Fonction qui augmente la taille de ton snake
 * @param thisBonus : le type de bonus
 */
Snake.prototype.addLength = function(thisBonus) {
    if(thisBonus.isSpecialBonus == true) {
        var nbLength = 6;
        this.onSpecialBonus();
    }else{
        var nbLength = 1;
    }
    var snakeQueue = this.elements[0];
    this.currentLength += nbLength; // on incrémente sa taille courante
    this.elements.unshift({ // unshift ajoute un élément au début du tableau
        x : snakeQueue.x,
        y : snakeQueue.y
    });
};

/**
 * Fonction qui lorsque le snake à mangé un bonus, lui ajoute un score bonus et une taille bonus
 */
Snake.prototype.onSpecialBonus = function () {
    this.score += 60;
}

/**
 * Fonction de gestion des kills (lorsque ton snake tue un ennemi)
 */
Snake.prototype.onKill = function() {
    this.kills++;
    this.score += 20; // on incrémente de 20 son score
};

/**
 *  Fonction qui gère la mort de ton snake
 */
Snake.prototype.onDie = function () {
    this.deaths++; // on incrémente de 1 ses stats de mort
    this.score = 0; // On remet à 0 son score
    this.reset();
}