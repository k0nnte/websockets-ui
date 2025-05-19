import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { WebSocketServer } from 'ws';
import reg from '../modules/reg.js';
import {getAloneRoom, getWinners, createRoom, addUser, create_game, turn} from '../modules/module.js'

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
const games = new Map();

const ws = new WebSocketServer({port: 3000});
const clients = ws.clients;

ws.on('connection', (ws, req)   => {
    console.log(` new connect` );
    let user = '';
    

    ws.on("message", (message)=> {
        try{
            const parsed = JSON.parse(message.toString());
           switch (parsed.type){
            case 'reg': {
                reg(parsed,ws,playerBD);
                user = JSON.parse(parsed.data).name;
                getAloneRoom(rooms,clients);
                getWinners(winers,clients);
                
                break;
            };
            case 'create_room': {
                
                
                createRoom(rooms,user, [...playerBD.keys()].indexOf(user), games);
                

                create_game(ws,rooms.keys().next().value,[...playerBD.keys()].indexOf(user));
                getAloneRoom(rooms,clients);
                break;

            }
            case 'add_user_to_room': {
            
                const {indexRoom} = JSON.parse(parsed.data);
               const a = addUser(rooms,user,indexRoom, [...playerBD.keys()].indexOf(user));
               if(a === null) break; 
                rooms.set(indexRoom,a);
                 create_game(ws,rooms.keys().next().value,[...playerBD.keys()].indexOf(user));
                getAloneRoom(rooms,clients);
                break;
            }
            case 'add_ships': {
                const {indexPlayer, ships, gameId} = JSON.parse(parsed.data);
                const game = games.get(gameId);
                game.players.push({indexPlayer, ships});
                games.set(gameId,game);
                
                if(game.players.length === 2){
                    clients.forEach(element => element.send(JSON.stringify({
                        type: 'start_game',
                        data: JSON.stringify({
                            ships: ships,
                            currentPlayerIndex: indexPlayer,
                        }),
                        id: 0,
                    })))
                    turn(clients,indexPlayer);
                }
                
                
                break;
            }
            case 'turn': {
               
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
    ws.on('close', () => {
        console.log(` user ${user} disconnect` );
         for (const [gameId, game] of games.entries()) {
            if (game.players && Array.isArray(game.players)) {
                game.players = game.players.filter(p => p.indexPlayer !== [...playerBD.keys()].indexOf(user));
                if (game.players.length === 0) {
                    games.delete(gameId);
                } else {
                    games.set(gameId, game);
                }
            }
            
        }
        playerBD.delete(user);
        for (const [roomId, room] of rooms.entries()) {
            if (room.user && Array.isArray(room.user)) {
                room.user = room.user.filter(u => u.name !== user);
                if (room.user.length === 0) {
                    rooms.delete(roomId);
                } else {
                    rooms.set(roomId, room);
                }
            }
            
            
        }
       
    });

});

console.log('WebSocket listen on localhost:3000');