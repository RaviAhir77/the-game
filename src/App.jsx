import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IntroPage from './components/IntroPage';
import NumPage from './components/NumPage';

function App() {
  return (
    <Router basename='/the-game'>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/game/:roomId/:playerId" element={<NumPage />} />
      </Routes>
    </Router>
  );
}

export default App;