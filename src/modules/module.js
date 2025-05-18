import { json } from "stream/consumers";



export  function getAloneRoom(rooms,ws){
    
    const roomlist = [...rooms.entries()].map(([roomId,room])=> ({
        roomId,
        roomUsers: room.user
    }))
    console.log(roomlist);
    
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


export function createRoom(rooms,userr){
    const roomId = Date.now().toString();
    const newRoom = {
        user: [{
            name: userr,
            index: 0,
        }]
    }
    return  rooms.set(roomId,newRoom);
}

