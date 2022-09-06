import { spawn } from 'child_process';
import express from "express";
import { get } from 'http';
import hash from 'object-hash';
import config from "../config.json" assert {type: "json"};

const router = express.Router();
var cnpoemList = [];
var enpoemList = [];
var running = false;

checkList();

router.route("/client/auth/poem").post(async(req, res) => {
    if(req.headers['token'] == null || req.headers['token'] !== config.poem.token){
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    const lang = req.body.language ==='zh-CN'?"cn":"en";
    res.send(getPoem());
    
});

async function checkList(){
    if(!running){
        running = true;
        while(cnpoemList.length < 20){
            const client = spawn('python', ['./tensorflow_poems/compose_poem.py']);
            client.stdout.on('data', (data) => {
                const poem = data.toString().split("\n")[0];
                if(poem !== ''){
                    cnpoemList.push(poem);
                }
            });
            await new Promise(r => setTimeout(r, 2000));
        }
        running = false;
    }
    
    console.log(cnpoemList);
    console.log("Done" + cnpoemList.length);
}


function getPoem(){
    const poem = cnpoemList.shift();
    checkList();
    return poem;
}

export default router;