import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../db/Firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import '../css/NumPage.css';

const NumPage = () => {
    const { roomId, playerId } = useParams();
    const navigate = useNavigate();
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
                
                if (data.turn) {
                    setMyTurn(data.turn === playerId);
                }

                const playerNames = {
                    [data.player1]: data.player1Name || "player 1",
                    [data.player2]: data.player2Name || "player 2"
                };

                if (data.winner) {
                    setAlert(`${playerNames[data.winner]} wins! 🎉`);
                
                    setTimeout(() => {
                        navigate('/');  
                    }, 5000);
                } 
                
            }
        });

        return () => unsubscribe();
    }, [roomId, playerId, navigate]);

    const numberHandler = async (guess) => {
        if (!isMyTurn || !gameData) return;

        const roomRef = doc(db, 'rooms', roomId);
        const generatedNum = gameData.generatedNumber;
        // let newLowest = lowest;
        // let newHighest = highest;
        let winner = null;
        let newStatus = gameData.status;

        if (generatedNum < guess) {
            setHighest(guess)
            // newHighest = guess;
            setAlert('Select a lower number');
        } else if (generatedNum > guess) {
            setLowest(guess)
            // newLowest = guess;
            setAlert('Select a higher number');
        } else {
            winner = playerId;
            newStatus = 'finished';
            setAlert('You win! 🎉');
        }

        const nextTurn = gameData.player1 === playerId ? gameData.player2 : gameData.player1;

        await updateDoc(roomRef, {
            [`playerGuess.${playerId}`]: guess,
            // lowest: newLowest,
            // highest: newHighest,
            winner: winner,
            turn: winner ? null : nextTurn,
            status: newStatus
        });
    };

    return (
        <div className='NumPage'>
            <h1>{alert}</h1>
            {gameData && !gameData.winner && <h2>{isMyTurn ? 'Your Turn!' : "Opponent's Turn"}</h2>}

            {gameData?.winner ? (
                <div>
                    <h2>Game Over</h2>
                    <button onClick={() => navigate('/')} className="play-again-btn">
                        Home Page
                    </button>
                    <p>Redirecting in 5 seconds...</p>
                </div>
            ) : (
                [...Array(10)].map((_, row) => (
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
                ))
            )}
            <div>Highest: {highest}</div>
            <div>Lowest: {lowest}</div>
        </div>
    );
};

export default NumPage;
