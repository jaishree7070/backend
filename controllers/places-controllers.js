const HttpError = require("../models/http-error");
const { v4: uuid } = require('uuid');
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../assets/location");

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
        address: '20 W 34th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Emp. State Building',
        description: 'One of the most famous sky scrapers in the world!',
        imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
        address: '20 W 34th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u2'
    }
];

const getPlaceByPlaceId = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId;
    });
    if (!place) {
        throw new HttpError("could not find the page", 404);
    }
    res.json({ place });
}
const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const places = DUMMY_PLACES.filter(p => {
        return p.creator === userId;
    })
    if (!places || places.length === 0) {
        throw new HttpError("could not find the places of the user id", 404);
    }
    res.json({ places });
}

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError("Invalid Inputs Passed,Please check your data", 422))
    }
    const {
        title,
        description,
        creator,
        address,
    } = req.body;

    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    const createdPlace = {
        id: uuid(),
        title,
        description,
        creator,
        location: coordinates,
        address,
    };
    DUMMY_PLACES.unshift(createdPlace)
    res.status(201).json({ place: createdPlace }) //created a new
}

const updatePlace = (req, res, next) => {
    const { title, description } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError("Invalid Inputs Passed,Please check your data", 422)
    }
    const placeId = req.params.pid;

    const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) }
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACES[placeIndex] = updatedPlace;

    res.status(200).json({ place: updatedPlace }) //updated and nothing new(200)
}
const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;

    if (!DUMMY_PLACES.find(p => p.id === placeId)) {
        throw new HttpError("Could not find a place for the Id", 404)

    }
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id != placeId);

    res.status(200).json({ message: 'deletedPlace' }) //deleted and nothing new(200)

}
exports.getPlaceByPlaceId = getPlaceByPlaceId;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.deletePlace = deletePlace;
exports.updatePlace = updatePlace;

// "title":"new york",
// "description":"a city",
// "coordinates":{
//     "lat":40.70,
//     "lng":-740101,
// },
// "address":,
// "creator":
// "title":"new york",
// "description":"a city",
// "coordinates":{
//     "lat":40.70,
//     "lng":-740101
// },
// "creator":"u3"
// }

