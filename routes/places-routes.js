const express = require("express");

const router = express.Router();
const placeControllers = require("../controllers/places-controllers")
const { check } = require("express-validator")

router.get('/:pid', placeControllers.getPlaceByPlaceId)

router.get('/user/:uid', placeControllers.getPlacesByUserId)

router.patch('/:pid',
    [check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    ],
    placeControllers.updatePlace)

router.delete('/:pid', placeControllers.deletePlace)

router.post('/',
    [check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty(),
    ],
    placeControllers.createPlace)
module.exports = router;
