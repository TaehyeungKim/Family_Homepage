import React from 'react';
import {Route, Routes, BrowserRouter as Router} from 'react-router-dom';
import RootPage from './pages/RootPage/Root'
import LoginPage from './pages/LoginPage/LoginPage';
import MainPage from './pages/MainPage/MainPage';
import CreatePage from './pages/CreatePage/CreatePage'
import ProfilePage from './pages/ProfilePage/ProfilePage'

import MainProxyPage from './pages/MainPage/MainProxyPage';

import { DataHandler } from './utils/DataHandler';

export const HandlerContext = React.createContext<any>(null);

function App() {


  return (
    <>
    <HandlerContext.Provider value = {new DataHandler()}>
    <Router>
      <Routes>
        <Route path = '/' element = {<RootPage/>}/>
        <Route path = '/login' element = {<LoginPage/>}/>
          <Route path = '/main' element = {<MainPage/>}>
            <Route path = 'create' element = {<CreatePage/>}/>
          </Route>
        <Route path = '/profile' element = {<ProfilePage/>}/>
        
        <Route path = '/main_proxy' element = {<MainProxyPage/>}/>
      </Routes>
    </Router>
    </HandlerContext.Provider> 
    </>
  );
}

export default App;
