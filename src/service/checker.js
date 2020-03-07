const BUFFER_METERS = 10;
const buffer = require('@turf/buffer');
const helpers = require('@turf/helpers');
const bbox = require('@turf/bbox').default;
const doIntersect = require('@turf/intersect').default;
const bboxToPolygon = require('@turf/bbox-polygon').default;
const souce_geometries = require('../data/geolocation.json');
const geometries = souce_geometries.map(it => 
                                   {
                                        let item = helpers.polygon(it.coordinates);
                                        item.id = it.id;
                                        item.msg = it.msg;
                                        return item;
                                   });
const ONE_MINUTE = 0;

const get_simple_polygon_bufferized = (longitude, latitude) =>
{
    const point = helpers.point([longitude, latitude]);
    const buffered = buffer(point, BUFFER_METERS, {units: 'meters'});
    const symplify = bbox(buffered);
    const bbox_polygon = bboxToPolygon(symplify);
    
    return bbox_polygon;
}

const check_intersect = (reference) =>
{
    const found = geometries.filter(it => doIntersect(reference, it));

    if(found.length > 0) return found;
}

let actions = {};
const check_delay_event = (id, intersections) =>
{
    let ids = intersections.map(it => it.id).sort();
    ids.push(id);
    const hash = ids.toString().split(",").join("_");
    const time = new Date().getTime();

    if(!actions[hash] || (actions[hash] && actions[hash].time < time - ONE_MINUTE))
    {
        actions[hash] = { time };
        return 1;
    }
    else
    {
        return 0;
    }
}

const check = (request) =>
{
    const { id, language, latitude, longitude } = request;
    const reference = get_simple_polygon_bufferized(longitude, latitude);
    const intersections = check_intersect(reference);

    if(intersections && check_delay_event(id, intersections))
    {
        return intersections.map(it => it.msg[language]);
    }   
}

module.exports = check;