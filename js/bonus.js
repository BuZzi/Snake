this.isSpecialBonus = false;
/**
 * Constructeur
 */
exports.Bonus = Bonus = function () {
    this.STAGE_WIDTH = 50-1;
    this.STAGE_HEIGHT = 50-1;
};

/**
 * Fonction d'initialisation
 */
Bonus.prototype.init = function () {
    this.isSpecialBonus = false;
    this.x = Math.floor(Math.random() * this.STAGE_WIDTH);
    this.y = Math.floor(Math.random() * this.STAGE_HEIGHT);
}

/**
 * Fonction qui permet de définir si un bonus spécial a été créé (important pour client.js)
 */
Bonus.prototype.specialBonus = function () {
    this.isSpecialBonus = true;
}