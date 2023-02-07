const express=require("express");

const router=express.Router();
const placeControllers=require("./places-controllers")


router.get('/:pid',placeControllers.getPlaceByPlaceId)
router.get('/user/:uid',placeControllers.getPlaceByUserId)
module.exports=router;
