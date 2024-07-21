import './App.css';
import Nav from './components/navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/body';
import Service from './components/service';
import Login1 from './components/auth/Login'

function App() {
  return (
    <>
    <Router>
    <Nav/>

        <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/service' element={<Service/>} />
                <Route path='/sign in' element={<Login1/>}></Route>

            </Routes>

    </Router>
    </>
  );
}

export default App;
