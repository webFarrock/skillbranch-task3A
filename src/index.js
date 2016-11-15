import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'isomorphic-fetch';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const pcUrl = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';



let pc = {};

fetch(pcUrl)
    .then(async (res) => {
        pc = await res.json();


        app.get('/volumes', (req, res) => {

            let volumes = {};

            for (let key in pc.hdd){
                if(volumes[pc.hdd[key].volume]){
                    volumes[pc.hdd[key].volume] += pc.hdd[key].size;
                }else{
                    volumes[pc.hdd[key].volume] = pc.hdd[key].size;
                }


            }
            for (let key in volumes) {
                volumes[key] = volumes[key] + "B";
            }

            return res.status(200).json(volumes);
        });



        app.get('/', (req, res) => {
            return res.status(200).json(pc);
        });

        app.get('*', (req, res) => {

            let result = pc;
            let status = 200;
            const path = req.originalUrl.split('/').slice(1);

            path.forEach((i) => {

                if(result[i] !== undefined && result.constructor()[i] === undefined){
                    result = result[i];
                }else if(i){
                    result = 'Not Found';
                    status = 404;
                    //return res.status(404).send('Not Found');
                }
            });

            if(404 == status){
                return res.status(status).send(result);
            }else{
                return res.status(status).json(result);
            }


        });


    })
    .catch(err => {
        console.log('Чтото пошло не так:', err);
    });



/*

app.get('/users', isAdmin, async (req, res) => {
    const users = await User.find();
    return res.json(users);
});

app.get('/clear', async (req, res) => {
    await User.remove({});
    await Pet.remove({});
    return res.send('Ok');
});

app.get('/pets', async (req, res) => {
    const pets = await Pet.find().populate('owner');
    return res.json(pets);
})

app.post('/data', async (req, res) => {
    const data = req.body;
    if(!data.user) return res.status(400).send('user required');
    if(!data.pets) data.pets = [];

    const user = await User.findOne({
        name: data.user.name,
    });

    if(user) return res.status(400).send('user.name is exists');

    try{
        const result = await saveDataInDB(data);
        return res.json(result);
    }catch(err){
        return res.status(500).json(err);
    }

    //
    //

});
*/
app.listen(3000, () => {
    console.log('Your app listening on port 3000!');
});
