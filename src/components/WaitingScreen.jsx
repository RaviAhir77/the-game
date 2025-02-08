import React, { useEffect, useState } from 'react'
import { db } from '../db/Firebase';
import {doc,onSnapshot}from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import NumPage from './NumPage'


const WaitingScreen = ({roomId,playerId}) => {
  const navigater = useNavigate()
  const [status,setStatus] = useState('waiting');

  useEffect(() => {
    const roomRef = doc(db,'rooms',roomId);
    const unsubscribe = onSnapshot(roomRef,(snapshot) => {
      if(snapshot.exists()){
        const data = snapshot.data();
        setStatus(data.status)
        if(data.status === 'ongoing'){
          navigater(`/game/${roomId}/${playerId}`)
        }
      }
    })

    return () => unsubscribe()
  },[roomId]);


  return (
    <div className='WaitingScreen'>
        <h2>waiting for a player 2 ...</h2>
    </div>
  )
}

export default WaitingScreen