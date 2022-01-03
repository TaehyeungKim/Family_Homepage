import React from 'react';
import {Route, Routes, BrowserRouter as Router} from 'react-router-dom';
import RootPage from './pages/RootPage/Root'
import LoginPage from './pages/LoginPage/Loginpage'
import MainPage from './pages/MainPage/MainPage';
import CreatePage from './pages/CreatePage/CreatePage'

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path = '/' element = {<RootPage/>}/>
        <Route path = '/login' element = {<LoginPage/>}/>
        <Route path = '/main' element = {<MainPage/>}/>
        <Route path = '/create' element = {<CreatePage/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
