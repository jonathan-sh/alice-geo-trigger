const BUFFER_METERS = 10;
const cors = require('cors');
const express = require('express');
const buffer = require('@turf/buffer');
const helpers = require('@turf/helpers');
const bbox = require('@turf/bbox').default;
const objects = require('./data/geolocation.json');
const intersect = require('@turf/intersect').default;
const bboxToPolygon = require('@turf/bbox-polygon').default;
const app = express();
app.use(cors());

const get_simple_polygon_bufferized = (longitude, latitude) =>
{
    const point = helpers.point([longitude, latitude]);
    const buffered = buffer(point, BUFFER_METERS, {units: 'meters'});
    const symplify = bbox(buffered);
    const bbox_polygon = bboxToPolygon(symplify);

    return bbox_polygon;
}

const check = (longitude, latitude) =>
{
    const reference = get_simple_polygon_bufferized(longitude, latitude);
    for(it of objects)
    {
        const object = helpers.polygon(it.coordinates);
        const match = intersect(reference, object);
        if(match) return it;
    }
}


app.get(`/:longitude/:latitude`, (req, res) =>
{
    const longitude = req.params['longitude'];
    const latitude = req.params['latitude'];
    const match = check(longitude, latitude);
    if(match)
    {
        res.status(200).send({'msg': match.name});
    }
    else
    {
        res.status(204).send();
    }
});

app.get(`/:meters`, (req, res) =>
{
    const meters = parseFloat(req.params['meters']);
    const buff = Math.PI * Math.pow(meters, 2);
    const bbox = Math.pow(meters*2, 2);
    const diff = bbox - buff;
    const perc = (diff * 100) / buff;
    res.status(200).send({ buff, bbox, diff, perc });
});

app.listen(4212, () => console.log('server up 👍'))
