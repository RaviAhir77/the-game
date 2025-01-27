import { useState } from 'react'
// import './App.css'
import NumPage from './components/NumPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NumPage/>
    </>
  )
}

export default App
