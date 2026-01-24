import '../styles/App.css';
import Login from'./LoginPage.js'
import Home from'./HomePage.js'
import Error from './ErrorPage.js'
import {Routes, Route, Link, Navigate} from 'react-router-dom';
import { useState } from 'react';


function App() {

  const [token, setToken] = useState(localStorage.getItem("JWT"))

  return (
    <> 
    {/* <Login /> */}
   
        <Routes>
        <Route path="/Login" element={ token ? <Navigate to ="/" replace/> : <Login setToken={setToken} />} />
        <Route path= "/Home" element = { token ? <Home /> : <Navigate to="/Login" replace /> }/>
        <Route path= "/" element =  { token ? <Home /> : <Navigate to="/Login" replace /> }/>
        <Route path= "*" element= { <Error />}/>
       </Routes>
   </>

   
      

   
  );
}

export default App;
