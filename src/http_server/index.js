import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { WebSocketServer } from 'ws';
import reg from '../modules/reg.js';
import {getAloneRoom, getWinners, createRoom} from '../modules/module.js'

export const httpServer = http.createServer(function (req, res) {
    const __dirname = path.resolve(path.dirname(''));
    const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
    fs.readFile(file_path, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
});


const playerBD = new Map();
const rooms = new Map();
const winers = new Map();

const ws = new WebSocketServer({port: 3000});


ws.on('connection', (ws, req)   => {
    console.log(` new connect` );
    let user = '';

    ws.on("message", (message)=> {
        try{
            const parsed = JSON.parse(message.toString());
            console.log(parsed);
            
           switch (parsed.type){
            case 'reg': {
                reg(parsed,ws,playerBD);
                user = JSON.parse(parsed.data).name;
                
                getAloneRoom(rooms,ws);
                getWinners(winers,ws);
                
                break;
            };
            case 'create_room': {
                createRoom(rooms,user);
                console.log(rooms);
                
                getAloneRoom(rooms,ws);

            }
            default: {
                ws.send(JSON.stringify({
                    type: 'error',
                    data: JSON.stringify({
                        error: true,
                        errorText: 'Неизвестный тип сообщения',
                    }),
                    id: parsed.id,
                }))
            }
           }
           
        }catch{
            ws.send(JSON.stringify({
                type: 'error',
                data: JSON.stringify( {
                    error: true,
                    errorText: 'Ошибка разбора JSON',

                }),
                id: 0,
            }))
        }
    })
    
})
console.log('WebSocket listen on localhost:3000');