const router = require("express").Router();
const gameCtrl = require("../controllers/game.controller");
const verify = require('../utils/verifyToken');

router.get('/api/v1/games', gameCtrl.getAllGame)
router.get('/game/:id', gameCtrl.getGame)
router.post('/game/add', gameCtrl.addNewGame)

module.exports = router