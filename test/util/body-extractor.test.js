const body_extractor = require('../../src/util/body-extractor');
const reference = { id:1, language:"p", longitude:-50.4370829, latitude:-21.2283083 };

test('extracting body for aws lambda handler', () =>
{
    const request = { body : JSON.stringify([reference]) };
    expect(body_extractor(request)).toEqual(reference);
});

test('extracting body for express handler', () =>
{
    const request = { body : [reference] };   
    expect(body_extractor(request)).toEqual(reference);
});