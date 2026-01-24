import { useState } from 'react';
import '../styles/login.css';
import { getJWT } from '../queries/Auth'
import { useNavigate } from 'react-router-dom';

export default function LoginView({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginError, setShowLoginError] = useState(false);

  const navigate = useNavigate();


  async function handleSubmit(e) {
    e.preventDefault();
    setShowLoginError(false);
    try {
      const data = await getJWT(username, password)
      console.log("JWT returned from API:", data)

      if (!data) {
        setShowLoginError(true);
        return;
      }

      localStorage.setItem("JWT", data)

    setToken(data);


    navigate("/", { replace: true });

    console.log("This is the data in the login page: ", data)

    } catch (e) {
      setShowLoginError(true);
    }
  }

  return (
    <div className="container">
      <div className="login-card">
        <div className="header">
          <h1 className="title">Welcome to Graph QL</h1>
          <p className="subtitle">Please sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="label">
              Username
            </label>
            <input
              className="input"
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="label">
              Password
            </label>
            <div className="input-wrapper">
              <input
                className="input"
                type={'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />

              {showLoginError && (<p id="loginError"  >Invalid login credentials. Please try again.</p>
              )}
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>


      </div>
    </div>
  );
}
