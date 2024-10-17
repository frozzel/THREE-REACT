import './App.css'
import { Routes, Route } from "react-router-dom";
import Navbar from './components/navbar.jsx';
import Home from './pages/Home';
import Cube from './pages/Cube';
import Lines from './pages/Lines';
import Text from './pages/Text';
import TextTexture from './pages/TextTexture.jsx';
import  Models  from './pages/Models';  
function App() {
 


  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cube" element={<Cube />} />
        <Route path="/lines" element={<Lines />} />
        <Route path="/text" element={<Text />} />
        <Route path="/textTexture" element={<TextTexture />} />
        <Route path="/models" element={<Models />} />
      </Routes>
    </>
  )
}

export default App
