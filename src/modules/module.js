import { json } from "stream/consumers";



export  function getAloneRoom(rooms,ws){
    
    const roomlist = [...rooms.entries()].filter(([_,room])=> room.user.length === 1).map(([roomId,room])=> ({
        roomId,
        roomUsers: room.user
    }))
    
   return ws.send(JSON.stringify({
        type: 'update_room',
        data: JSON.stringify(roomlist),
        id: 0,
    }))
}

export function getWinners(winners,ws) {
    const winns =  [...winners.entries()]
        .map(([name, wins]) => ({ name, wins }));

    return ws.send(JSON.stringify({
        type: 'update_winners',
        data: JSON.stringify(winns),
        data: 0,
    }))
}


export function createRoom(rooms,userr,index){
    const roomId = Date.now().toString();
    const newRoom = {
        user: [{
            name: userr,
            index : index,
        }]
    }
    return  rooms.set(roomId,newRoom);
}

export function addUser(rooms,user,roomId, userId){
        
    const room = rooms.get(roomId);
      room.user.push({
        name: user,
        index : userId,
    });
    return room;
    
}

export function create_game(ws,roomId,userId){
    
    return ws.send(JSON.stringify({
        type: 'create_game',
        data: JSON.stringify({
            idGame:  roomId,
            idPlayer: userId,

        }),
        id: 0,
    }))

}



