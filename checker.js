const BUFFER_METERS = 10;
const buffer = require('@turf/buffer');
const helpers = require('@turf/helpers');
const bbox = require('@turf/bbox').default;
const objects = require('./data/geolocation.json');
const intersect = require('@turf/intersect').default;
const bboxToPolygon = require('@turf/bbox-polygon').default;

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

module.exports = check;