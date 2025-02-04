import { db } from '../db/Firebase';
import { collection, addDoc, serverTimestamp, updateDoc, doc, getDocs, query, where } from 'firebase/firestore';

const playersRef = collection(db, 'players');
const roomsRef = collection(db, 'rooms');

export const addPlayer = async (playerName) => {
    if (!playerName.trim()) return null;

    try {
        const docRef = await addDoc(playersRef, {
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

export const findOrCreateRoom = async (playerId, playerName) => {
    if (!playerId || !playerName) return null;

    try {
        // ✅ Step 1: Check if the player is already in an active room
        const existingRoomQuery = query(roomsRef, where('status', 'in', ['waiting', 'ongoing']), 
            where('player1', '==', playerId));
        const existingRoomSnapshot = await getDocs(existingRoomQuery);

        if (!existingRoomSnapshot.empty) {
            return existingRoomSnapshot.docs[0].id; // ✅ Return the existing room ID
        }

        // ✅ Step 2: Find an available room with only one player
        const openRoomQuery = query(roomsRef, where('status', '==', 'waiting'));
        const openRooms = await getDocs(openRoomQuery);

        for (let room of openRooms.docs) {
            let roomData = room.data();

            if (!roomData.player2) {
                await updateDoc(doc(db, 'rooms', room.id), {
                    player2: playerId,
                    player2Name: playerName,
                    status: 'ongoing',
                    generatedNumber: Math.floor(Math.random() * 100) + 1,
                });
                return room.id;
            }
        }

        // ✅ Step 3: If no room is available, create a new one
        const newRoom = await addDoc(roomsRef, {
            player1: playerId,
            player1Name: playerName,
            player2: null,
            player2Name: null,
            turn: playerId,
            status: 'waiting',
            lowest: 0,
            highest: 101,
            winner: null,
            generatedNumber: Math.floor(Math.random() * 100) + 1,
            timeStamp: serverTimestamp(),
        });

        console.log('New room created:', newRoom.id);
        return newRoom.id;
    } catch (error) {
        console.error('Error in findOrCreateRoom:', error);
        return null;
    }
};
