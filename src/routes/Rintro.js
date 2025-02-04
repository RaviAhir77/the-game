import { db } from '../db/Firebase';
import { collection, addDoc, serverTimestamp, updateDoc, doc, getDocs, query, where } from 'firebase/firestore';

const connection = collection(db, 'players');
const roomConnection = collection(db, 'rooms');

export const addPlayer = async (playerName) => {
    if (!playerName.trim()) return null;

    try {
        const docRef = await addDoc(connection, {
            name: playerName,
            status: 'waiting',
            score: 0,
            timeStamp: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding player:', error);
        return null;
    }
};

export const updatePlayer = async (playerId, newName) => {
    if (!newName || !playerId) return;
    try {
        await updateDoc(doc(db, 'players', playerId), { name: newName });
    } catch (error) {
        console.error('Error updating player:', error.message);
    }
};

export const findOrCreateRoom = async (playerId) => {
    try {
        const q = query(roomConnection, where('status', '==', 'waiting'));
        const querySnapshot = await getDocs(q);

        for (let docSnap of querySnapshot.docs) {
            let roomData = docSnap.data();

            if(roomData.player1 === playerId || roomData.player2 === playerId){
                return docSnap.id;
            }

            if (!roomData.player2) {
                await updateDoc(doc(db, 'rooms', docSnap.id), {
                    player2: playerId,
                    status: 'ongoing',
                    generatedNumber: Math.floor(Math.random() * 100) + 1,
                });
                return docSnap.id;
            }
        }

        const newRoom = await addDoc(roomConnection, {
            player1: playerId,
            player2: null,
            turn: playerId,
            status: 'waiting',
            lowest : 0,
            highest : 101,
            winner : null,
            generatedNumber: Math.floor(Math.random() * 100) + 1,
            timeStamp: serverTimestamp(),
        });

        console.log('number generated : ',newRoom.generatedNumber)

        return newRoom.id;
    } catch (error) {
        console.error('Error in findOrCreateRoom:', error);
        return null;
    }
};