const body_extractor = require('../util/body-extractor');
const body_parser = require('body-parser');
const check = require('../service/checker');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 4212;
app.use(cors());
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended:true}));

app.post('/', (req, res) =>
{
    try 
    {
        const body = body_extractor(req);
        if(body)
        {
            const match = check(body);
            if(match)
            {
                res.status(200).send(match);
            }
            else
            {
                res.status(204).send();
            }
        }
        else
        {
            res.status(400).send();
        }
    } 
    catch (error) 
    {
        res.status(500).send(error);
    }
   
});

app.listen(port, () => console.log(`server up on this port: ${port}. 👍`))

