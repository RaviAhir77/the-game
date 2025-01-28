import React, { useEffect, useState,useRef } from 'react'

const IntroPage = () => {
    
    const [name,setName] = useState('')
    const nameRef = useRef(null)
    
    useEffect(() => {
        const getName = localStorage.getItem('player-name');
        console.log(name)
        if(getName){
            setName(getName)
        }
    },[])

    const handleName = () => {
        const newName = nameRef.current.value
        if(newName.trim()){
            setName(newName)
            localStorage.setItem('player-name',newName);
            nameRef.current.value = ''
        }

    }

    const HandleChange = () => {
        localStorage.removeItem('player-name')
        setName(null)
    }

  return (
    <div className='IntroPage'>

       {!name ? ( 
            <>
                <input type="text" ref={nameRef} placeholder='Enter Name ...'/>
                <button onClick={handleName}>Set Name</button>
            </>
        ) : (
            <div className='name-display'>
                <p> Player Name : {name}</p>
                <button onClick={HandleChange}>Change Name</button>
            </div>
        )}

        
    </div>
  ) 
}

export default IntroPage