import { Link } from 'react-router-dom';

export default function navbar() {
  return (
    <nav id="scene-container">
    <div className='logo'>
        <h3>three.js tutorial</h3>
    </div>
    <ul>
        <li> <Link to="/" style={{ textDecoration: 'none' }}>Home</Link></li>
        <li><Link to="/cube" style={{ textDecoration: 'none' }}>Cube</Link></li>
        <li><Link to="/lines" style={{ textDecoration: 'none' }}>Lines</Link></li>
        <li><Link to="/text" style={{ textDecoration: 'none' }}>Text</Link></li>
        <li><Link to="/textTexture" style={{ textDecoration: 'none' }}>Texture</Link></li>
        <li><Link to="/models" style={{ textDecoration: 'none' }}>Models</Link></li>
        <li><Link to="/control" style={{ textDecoration: 'none' }}>Control</Link></li>
    </ul>
   
</nav>
  )
}
