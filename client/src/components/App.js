import {useState, useEffect} from 'react';
import './App.css';
import Registration from './reg/Registration';

const baseUrl = 'http://localhost:5000/api/auth';

function App() {
  const [isAuth, setIsAuth] = useState(true);
  const [login, setLogin] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${baseUrl}/auth`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await res.json();
      if (data.user) {        
        setIsAuth(false);
        setLogin(data.user.login);
      }
      setIsLoading(false);
    })()
  }, [isAuth, login])

  return (
    <div className="App">
      {!isLoading && isAuth && <Registration/>}
      {!isLoading && !isAuth && 
        <div>Приветствую, {login}</div>
      }
    </div>
  );
}

export default App;
