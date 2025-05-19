import { json } from "stream/consumers";



export  function getAloneRoom(rooms,clinets){
    
    const roomlist = [...rooms.entries()].filter(([_,room])=> room.user.length === 1).map(([roomId,room])=> ({
        roomId,
        roomUsers: room.user
    }))
    
   clinets.forEach(element => {
       element.send(JSON.stringify({
        type: 'update_room',
        data: JSON.stringify(roomlist),
        id: 0,
    }))
        
     });
}

export function getWinners(winners,clinets) {
    const winns =  [...winners.entries()]
        .map(([name, wins]) => ({ name, wins }));

    return clinets.forEach(element => {
       element.send(JSON.stringify({
           type: 'update_winners',
           data: JSON.stringify(winns),
           id: 0,
       }))
        
     });

    // return ws.send(JSON.stringify({
    //     type: 'update_winners',
    //     data: JSON.stringify(winns),
    //     id: 0,
    // }))
    
}


export function createRoom(rooms,userr,index, games){
    const roomId = Date.now().toString();
    const newRoom = {
        user: [{
            name: userr,
            index : index,
        }]
    }
    const newGame = {
        idGame: roomId,
        players: [],
    }
    return ( rooms.set(roomId,newRoom), games.set(roomId,newGame));
}

export function addUser(rooms,user,roomId, userId){
        
    const room = rooms.get(roomId);
    if(room.user.filter(({name})=> name === user).length) return null;
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

export function turn(clinet,idplayer){
    return clinet.forEach(element => {
        element.send(JSON.stringify({
        type: 'turn',
        data: JSON.stringify({
            currentPlayer: idplayer,
        }),
        id: 0,
    }))
    })
}



