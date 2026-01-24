import { useLocation, useNavigate } from "react-router-dom";
import '../styles/error.css'

export default function ErrorView({errorCode, ErrorMessage}){

    const navigate = useNavigate()
    const location = useLocation()
 
  const { code, message } = location.state || {
    code: 404,
    message: "Page not found",
  };

  console.log("This is the location", location)


    return(
       <div className="container">
      <div className="error-card">
        <h1 className="error-code">{code}</h1>
        <p className="error-message">{message}</p>
        <button className="submit-btn error-btn" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    </div>
    )
}