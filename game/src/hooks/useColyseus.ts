import {Client} from 'colyseus.js'
import {reactive, Ref, watchEffect} from "vue";
import {createProxy, loop, types} from "lingo3d-vue";
export default (dummyRef:Ref<types.Dummy | undefined>)=>{
    const client = new Client('ws://localhost:2567')
    const dummyProxyRecord = reactive<Record<string, types.Dummy>>({})
    watchEffect( async cleanup=>{
        const dummy = dummyRef.value
        if(!dummy) return
        const room  = await client.joinOrCreate<any>('my_room')

        room.state.players.onAdd = (player:any,sessionId:string)=>{
            console.log('player joined',sessionId)
            const isMe = room.sessionId === sessionId
            if(isMe){
                console.log('i am',sessionId)
                return
            }

            const dummyProxy = createProxy<types.Dummy>()
            dummyProxyRecord[sessionId] = dummyProxy

            player.onChange = ()=>{
                Object.assign(dummyProxy,player)
            }
        }
        room.state.players.onRemove = (player:any,sessionId:string)=>{
            console.log('player left',sessionId)
            delete dummyProxyRecord[sessionId]
        }
        const handle = loop(()=>{
            const {x,y,z,rotationX,rotationY,rotationZ,animation } = dummy

            room.send('updateplayer',{x,y,z,rotationX,rotationY,rotationZ,animation})
        })
        cleanup(()=>{
            handle.cancel()
        })

    })
    return dummyProxyRecord
}