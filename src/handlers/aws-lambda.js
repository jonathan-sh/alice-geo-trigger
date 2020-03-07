const check = require('./checker');
const body_extractor = require('../util/body-extractor');

const handler = async (event) => 
{
    let response = getAwsLambdaResponseObject();
    try 
    {
        const body = body_extractor(event);

        if(body)
        {
            const match = check(body);
            if(match)
            {
                response.body = JSON.stringify(match);
            }
            else
            {
                response.statusCode = 204;
            }
        }
        else
        {
            response.statusCode = 400;
        }
    } 
    catch (error) 
    {
        response.statusCode = 500;
        response.body = JSON.stringify(error);
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