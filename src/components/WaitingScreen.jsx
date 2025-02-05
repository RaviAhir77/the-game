import React, { useEffect, useState } from 'react'
import { db } from '../db/Firebase';
import {doc,onSnapshot}from 'firebase/firestore';
import NumPage from './NumPage'


const WaitingScreen = ({roomId,playerId}) => {
  const [status,setStatus] = useState('waiting');

  useEffect(() => {
    const roomRef = doc(db,'rooms',roomId);
    const unsubscribe = onSnapshot(roomRef,(snapshot) => {
      if(snapshot.exists()){
        const data = snapshot.data();
        setStatus(data.status)
      }
    })

    return () => unsubscribe()
  },[roomId]);


  return (
    <div className='WaitingScreen'>
      {status === 'ongoing' || status === 'finished' ? (
        <>
        <NumPage roomId={roomId} playerId={playerId}/> 
        {status === 'finished' && <button onClick={() => window.location.reload()}>start new Game</button>}
        </>
      ) : (
        <h2>waiting for a player 2 ...</h2>
      )}
    </div>
  )
}

export default WaitingScreen