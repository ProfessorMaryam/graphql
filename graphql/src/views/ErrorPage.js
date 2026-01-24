import { useLocation, useNavigate } from "react-router-dom"

export default function ErrorView({errorCode, ErrorMessage}){

    const navigate = useNavigate()
    const location = useLocation()
 
  const { code, message } = location.state || {
    code: 404,
    message: "Page not found",
  };

  console.log("This is the location", location)


    return(
         <div style={{ padding: "40px" }}>
      <h1>{code}</h1>
      <p>{message}</p>

      <button onClick={() => navigate("/")}>Go Home</button>
    </div>
    )
}