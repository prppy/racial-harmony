import logo from './logo.svg';
import './App.css';
import { AuthContextProvider, useAuth } from './context/authContext';
import { Auth } from './Authentication/auth';


const MainLayout = () => {
  const { user, isAuthenticated, logout} = useAuth();

  return (
    <div className='App'>
     <>
        {user ? <h1>Welcome {user.name}</h1> : <Auth />}
       </>
      {user && <button onClick={logout}>Logout</button>}
    </div>
  );
}

function App() {

  return (
    <AuthContextProvider>
      <MainLayout />
    
      </AuthContextProvider>
  );
}

export default App;
