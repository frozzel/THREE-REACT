import { Link } from 'react-router-dom';

export default function navbar() {
  return (
    <nav id="scene-container">
    <div className='logo'>
        <h3>three.js tutorial</h3>
    </div>
    <ul>
        <li> <Link to="/">Home</Link></li>
        <li><Link to="/cube" >Cube</Link></li>
        <li><Link to="/lines" >Lines</Link></li>
        <li><Link to="/text" >Text</Link></li>
    </ul>
   
</nav>
  )
}
