import React, { useEffect, useState, useRef } from 'react';
import { addPlayer, updatePlayer,findOrCreateRoom } from '../routes/Rintro';
import WaitingScreen from './WaitingScreen';

const IntroPage = () => {
    const [name, setName] = useState('');
    const [playerId, setPlayerId] = useState(null);
    const [roomId,setRoomId] = useState(null);
    const [alert,setAlert] = useState('')
    const nameRef = useRef(null);

    useEffect(() => {
        const storedName = localStorage.getItem('player-name');
        const storedPlayerId = localStorage.getItem('player-id');

        console.log('Stored Player ID:', storedPlayerId);
        console.log('Stored Name:', storedName);

        if (storedName) setName(storedName);
        if (storedPlayerId) setPlayerId(storedPlayerId);
    }, []);

    const handleName = async () => {
        const newName = nameRef.current.value.trim();
        if (!newName) return;

        if (!playerId) {
            // Create a new player if no player ID exists
            const newPlayerId = await addPlayer(newName);
            if (newPlayerId) {
                setPlayerId(newPlayerId);
                localStorage.setItem('player-id', newPlayerId);
            }
        } else {
            console.log('Updating existing player:', playerId);
            const updated = await updatePlayer(playerId, newName);
            if (updated) {
                console.log('Player name updated successfully!');
            } else {
                console.warn("Failed to update player, ID might be invalid.");
            }
        }

        setName(newName);
        localStorage.setItem('player-name', newName);
        nameRef.current.value = '';
    };

    const handleChange = () => {
        setName('');
        nameRef.current.value = '';
    };

    const handleRoom = async() => {
        if(!playerId){
            setAlert('please Enter Name');
            return
        }

        const room = await findOrCreateRoom(playerId,name);
        if(room){
            setRoomId(room);
            console.log(`joined room : ${room}`)
        }

    }

    return (
        <div className='IntroPage'>
            {!name &&<h3>{alert}</h3>}
            {!name ? (
                <>
                    <input type="text" ref={nameRef} placeholder='Enter Name ...' />
                    <button onClick={handleName}>Set Name</button>
                </>
            ) : (
                <div className='name-display'>
                    <p>Player Name: {name}</p>
                    <button onClick={handleChange}>Change Name</button>
                </div>
            )}

            <div className="game-join">
                {!roomId ? (
                    <button className='play-with-random' onClick={handleRoom}>Play with Random</button>
                ) : (
                    <WaitingScreen roomId={roomId} playerId={playerId}/>
                )}
            </div>
        </div>
    );
};

export default IntroPage;
