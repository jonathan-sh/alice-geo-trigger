const intersect = require('@turf/intersect');
const helpers = require('@turf/helpers');
const buffer = require('@turf/buffer');
const objects = require('./geolocation.json');
const express = require('express');
let app = express();



const check = (longitude, latitude) =>
{
    const point = helpers.point([longitude, latitude]);
    const buffered = buffer(point, 1, {units: 'meters'});
    for(it of objects)
    {
        const object = helpers.polygon(it.coordinates);
        const match = intersect.default(buffered, object);
        if(match)
        {
            console.log("found in "+ it.name);
        }

    }
}

app.get(`/:longitude/:latitude`, (req, res) =>
{
    const longitude = req.params['longitude'];
    const latitude = req.params['latitude'];
    check(longitude, latitude);
    res.status(200);
});

app.listen(4212, () =>
{
    console.log('yeeeeeeeee👍');
});