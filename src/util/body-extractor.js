const _ = require('lodash');

const extractor = (item) =>
{
    try 
    {
        item = JSON.parse((item['body']));         
    } 
    catch (error) 
    {
        item = _.get(item, ['body'], {});
    }
 
    const body = _.get(item, 0, {});
    const { id, language, latitude, longitude } = body;

    if( id && language && latitude && longitude )
    {
        return body;
    }
};

module.exports = extractor;