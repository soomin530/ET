import logo from './logo.svg';
import '../src/css/App.css';
import Login from './components/Login';
import DashBoard from './components/DashBoard';
import { AuthContext, AuthProvider } from './components/AuthContext';
import { useContext } from 'react';
import { BrowserRouter } from 'react-router';

// 1. 컴포넌트 분리하여 하위 컴포넌트에서 useContext 이용하는 방법
function App(){
  
  return(
    <BrowserRouter>
      <DashBoard/>
    </BrowserRouter>
  )
}



export default App;
