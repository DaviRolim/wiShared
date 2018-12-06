const express = require('express');

const validationUtil = require('../util/validations')
const homeController = require('../controllers/home');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /homewishs
router.get('/wishs', isAuth, homeController.getWishes);

// POST /homewish
router.post('/wish', isAuth, validationUtil.saveOrUpdateWish, homeController.createWish);

router.get('/wish/:wishId', isAuth, homeController.getWish);

router.put('/wish/:wishId',isAuth, validationUtil.saveOrUpdateWish, homeController.updateWish);

router.delete('/wish/:wishId', isAuth, homeController.deleteWish);

module.exports = router;
