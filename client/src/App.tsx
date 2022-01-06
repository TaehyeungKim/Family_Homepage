import React from 'react';
import {Route, Routes, BrowserRouter as Router} from 'react-router-dom';
import RootPage from './pages/RootPage/Root'
import LoginPage from './pages/LoginPage/LoginPage'
import MainPage from './pages/MainPage/MainPage';
import CreatePage from './pages/CreatePage/CreatePage'
import ProfilePage from './pages/ProfilePage/ProfilePage'

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path = '/' element = {<RootPage/>}/>
        <Route path = '/login' element = {<LoginPage/>}/>
        <Route path = '/main' element = {<MainPage/>}/>
        <Route path = '/create' element = {<CreatePage/>}/>
        <Route path = '/profile' element = {<ProfilePage/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
