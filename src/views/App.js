  import '../styles/App.css';
  import Login from'./LoginPage.js'
  import Home from'./HomePage.js'
  import Error from './ErrorPage.js'
  import {Routes, Route, Navigate} from 'react-router-dom';
  import { useState } from 'react';


  function App() {

    const [token, setToken] = useState(localStorage.getItem("JWT"))

    return (
      <> 
      {/* <Login /> */}
          <Routes>
          <Route path="/Login" element={ token ? <Navigate to ="/" replace/> : <Login setToken={setToken} />} />
          {/* both expect these state variables to be passed in to auto re-render the correct pages */}
          <Route path= "/Home" element = { token ? <Home token={token} setToken = {setToken}/> : <Navigate to="/Login" replace /> }/>
          <Route path= "/" element =  { token ? <Home token ={token} setToken = {setToken} /> : <Navigate to="/Login" replace /> }/>
          <Route path= "*" element= { <Error />}/> {/* wild card for all possible paths including nested paths*/}
        </Routes>
    </>   
    );
  }

  export default App;
