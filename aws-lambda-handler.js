const check = require('./checker');
const parans = 'queryStringParameters';

const handler = async (event) => 
{
    let response = getAwsLambdaResponseObject();
    try 
    {
        const id = event[parans]['id'];
        const language = event[parans]['language'];
        const latitude  = event[parans]['latitude'];
        const longitude = event[parans]['longitude'];
        const match = check(id, language, longitude, latitude);
        if(match)
        {
            response.body = JSON.stringify(match);
        }
        else
        {
            response.statusCode = 204;
        }
    } 
    catch (error) 
    {
        response.statusCode = 204;
        response.body = {};
    }

    return response;
};

const getAwsLambdaResponseObject = () =>
{
    const response =
    {
        statusCode: 200,
        headers: 
        { 
            'Content-Type': 'application/json',
            'Cache-Control': 'max-age=0, no-cache',
            'Pragma': 'no-cache',
            'Connection': 'keep-alive',
            'Expires':new Date().toGMTString(),
            'Last-Modified':new Date().toGMTString()
        }
    };

    return response;
};

exports.handler = handler;