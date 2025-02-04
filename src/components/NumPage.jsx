import React, { useEffect, useState } from 'react';
import { db } from '../db/Firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import '../css/NumPage.css';

const NumPage = ({ roomId, playerId }) => {
    const [number, setNumber] = useState(null);
    const [lowest, setLowest] = useState(0);
    const [highest, setHighest] = useState(101);
    const [alert, setAlert] = useState('Guess the Number');
    const [gameData, setGameData] = useState(null);
    const [isMyTurn, setMyTurn] = useState(false);

    useEffect(() => {
        if (!roomId) return;

        const roomRef = doc(db, 'rooms', roomId);
        const unsubscribe = onSnapshot(roomRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                setGameData(data);
                setMyTurn(data.turn === playerId);

                const playerNames = {
                    [data.player1] : data.player1Name || "player 1",
                    [data.player2] : data.player2Name || "player 2"
                }

                if (data.winner) {
                    setAlert(`${playerNames[data.winner]} wins!`);
                } else if (data.lastGuess) {
                    setLowest(data.lowest);
                    setHighest(data.highest);
                }
            }
        });

        return () => unsubscribe();
    }, [roomId, playerId]);

    const numberHandler = async (guess) => {
        if (!isMyTurn || !gameData) return;

        const roomRef = doc(db, 'rooms', roomId);
        const generatedNum = gameData.generatedNumber;
        let newLowest = lowest;
        let newHighest = highest;
        let winner = null;

        if (generatedNum < guess) {
            newHighest = guess;
            setHighest(guess)
            setAlert('Select a lower number');
        } else if (generatedNum > guess) {
            newLowest = guess;
            setLowest(guess)
            setAlert('Select a higher number');
        } else {
            winner = playerId;
            setAlert('You win!');
        }

        await updateDoc(roomRef, {
            [`playerGuess.${playerId}`]: guess,
            lowest: newLowest,
            highest: newHighest,
            winner: winner,
            turn: gameData.turn === gameData.player1 ? gameData.player2 : gameData.player1,
        });

        setNumber(null);
    };

    return (
        <div className='NumPage'>
            <h1>{alert}</h1>
            {gameData && !gameData.winner && <h2>{isMyTurn ? 'Your Turn!' : "Opponent's Turn"}</h2>}

            {[...Array(10)].map((_, row) => (
                <div className='chunks' key={row}>
                    {[...Array(10)].map((_, col) => {
                        const num = row * 10 + col + 1;
                        return (
                            <button
                                key={num}
                                className={`num-button ${num > lowest && num < highest ? 'highlight' : 'normal'}`}
                                onClick={() => numberHandler(num)}
                                disabled={!isMyTurn || gameData?.winner}
                            >
                                {num}
                            </button>
                        );
                    })}
                </div>
            ))}
            <div>Highest: {highest}</div>
            <div>Lowest: {lowest}</div>
        </div>
    );
};

export default NumPage;