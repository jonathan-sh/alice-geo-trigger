const check = require('./checker');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

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
