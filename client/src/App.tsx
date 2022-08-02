import {useRef} from 'react';
import {Route, Routes, BrowserRouter as Router} from 'react-router-dom';
import RootPage from './pages/RootPage/Root'
import LoginPage from './pages/LoginPage/LoginPage';
import MainPage from './pages/MainPage/MainPage';
import CreatePage from './pages/CreatePage/CreatePage'
import ProfilePage from './pages/ProfilePage/ProfilePage'

import MainProxyPage from './pages/MainPage/MainProxyPage';


function App() {

  const userInfoData = useRef<any>();
  const profileImageData = useRef<any>();

  return (
    <>
    <Router>
      <Routes>
        <Route path = '/' element = {<RootPage/>}/>
        <Route path = '/login' element = {<LoginPage/>}/>
          <Route path = '/main' element = {<MainPage userInfoData={userInfoData} profileImageData={profileImageData}/>}>
            <Route path = 'create' element = {<CreatePage userInfoData={userInfoData} profileImageData={profileImageData}/>}/>
          </Route>
        <Route path = '/profile' element = {<ProfilePage userInfoData={userInfoData} profileImageData={profileImageData}/>}/>
        
        <Route path = '/main_proxy' element = {<MainProxyPage/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
