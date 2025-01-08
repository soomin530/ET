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
    // <AuthProvider>
    //   <AppComponent />
    // </AuthProvider>
    <BrowserRouter>
      <DashBoard/>
    </BrowserRouter>
  )
}

// function AppComponent() {

//   // 로그인을 했다면 DashBoard 렌더링
//   // 로그인을 안했다면 Login 렌더링
//   // -> 조건 : 로그인 여부
//   // ->        로그인을 했는지 안했는지를 기억해줄 상태값 (user)
//   // ->        user 상태에는 로그인 한 사람에 대한 정보를 세팅.
//   // ->        전역 관리를 해야함 -> user라는 상태는 App에서 뿐만아니라
//   // ->        App의 자식(하위) 컴포넌트에서도 이용가능해야함.
//   //           -> Context API 사용 해야함!!

//   const { user } = useContext(AuthContext);

//   return (
//     <>
//       { user ? 
//       (
//         <div className='body-container'>
//           <BrowserRouter>
//            <DashBoard />
//           </BrowserRouter>
//         </div>
//       )  : (
//         <div className='login-section'>
//           <Login />
//         </div>
//       )
//     }
//     </>
//   );
// }

export default App;
