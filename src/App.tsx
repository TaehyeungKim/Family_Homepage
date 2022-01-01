import React from 'react';
import {Route, Routes, BrowserRouter as Router} from 'react-router-dom';
import RootPage from './pages/RootPage/Root'
import LoginPage from './pages/LoginPage/Loginpage'
import MainPage from './pages/MainPage/MainPage';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path = '/' element = {<RootPage/>}/>
        <Route path = '/login' element = {<LoginPage/>}/>
        <Route path = '/main' element = {<MainPage/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
