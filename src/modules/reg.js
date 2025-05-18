/**
 * 
 * @param {object} parsed  - Распарсенное сообщение от клиента
 * @param {WebSocket} ws - WebSocket соединение
 * @param {Map<string, string>} playerBD - In-memory база данных: name => password
 */

export default function reg(parsed, ws, playerBD){
     const {name, password} = JSON.parse(parsed.data);
   if (typeof name !== 'string' || typeof password !== 'string') {
                    console.log('first');
                    
                    return ws.send(JSON.stringify({
                        type: 'reg',
                        data: {
                            name,
                            index: null,
                            error: true,
                            errorText: 'Неверный формат данных',
                        },
                        id: parsed.id,
                    }));
                }

                const isPassword = playerBD.get(name);

                if(!isPassword){
                    playerBD.set(name,password);
                   return ws.send(JSON.stringify({
                    type: 'reg',
                    data: JSON.stringify({
                        name,
                        index: [...playerBD.keys()].indexOf(name),
                        error: false,
                        errorText: ''
                    }),
                    id: parsed.id,
                   }))
                }else{
                    if(isPassword === password){
                        return ws.send(JSON.stringify({
                    type: 'reg',
                    data: JSON.stringify({
                        name,
                        index: [...playerBD.keys()].indexOf(name),
                        error: false,
                        errorText: ''
                    }),
                    id: parsed.id,
                   }))
                    }else{
                        return ws.send(JSON.stringify({
                               type: 'reg',
                            data: JSON.stringify({
                                name,
                                index: null,
                                error: true,
                                errorText: 'invalid password',
                            }),
                            id: parsed.id,
                        }))
                    }
                }
                

}