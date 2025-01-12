import logo from './logo.svg';
import './App.css';
import { AuthContextProvider, useAuth } from './context/authContext';
import { Auth } from './components/auth';

function App() {

  return (
    <AuthContextProvider>
    <div className='App'>
      <Auth />
      </div>
      </AuthContextProvider>
  );
}

export default App;
