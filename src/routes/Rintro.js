import { db } from "../db/Firebase";
import {collection,addDoc,serverTimestamp, updateDoc,doc,getDocs,query,where} from 'firebase/firestore';

const connection = collection(db,'players');
const roomConnection = collection(db,'rooms')

export const addPlayer = async(playerName) => {
    if(!playerName.trim()) return null;

    try{
        const docRef = await addDoc(connection,{
            name : playerName,
            status : 'waiting',
            score : 0,
            timeStamp : serverTimestamp()
        })

        console.log('player added with id', docRef.id)
        return docRef.id
    }catch(error){
        console.log('catch block error in addPlayer route',error);
        return null
    }
}

export const updatePlayer = async(playerId,newName) => {
    if(!newName || !playerId) return

    try{
        const docRef = doc(db,'players',playerId)
        await updateDoc(docRef,{name : newName});
        console.log('player name is update : ', newName)
    }catch(error){
        console.log('catch block update player : ' ,error.message);
    }
};

export const findOrCreateRoom = async(playerId) => {
    try{
        const q = query(roomConnection,where('status','==','waiting'));
        const querySnapshot = await getDocs(q);

        for(let docSnap of querySnapshot.docs){
            let roomData = docSnap.data()

            if(!roomData.playe2){
                await updateDoc(doc(db,'rooms',docSnap.id),{
                    player2 : playerId,
                    status : 'ongoing'
                })
                return docSnap.id;
            }
        }

        const newRoom = await addDoc(roomConnection,{
            player1 : playerId,
            player2 : null,
            turn : playerId,
            status : 'waiting',
            timeStamp : serverTimestamp()
        })

        return newRoom.id
    }catch(error){
        console.error('error in finding/creating room in route :',error)
        return null
    }
}