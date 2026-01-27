import { fetchGraphQL } from "../queries/GraphqlService";
import { useEffect, useState } from "react";
import { deleteJWT } from "../queries/Auth";
import "../styles/home.css";

export default function HomeView({setToken}) {
  const [userInfo, setUserInfo] = useState(null);
  const [xpInfo, setXpInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("JWT");

    if (!token || token.split(".").length !== 3) {
      console.error("Bad token:", token);
      return;
    }

    async function getUserData() {
      try {
        const query = `
        {
          user {
            firstName
            lastName  
            login
            email
            auditRatio
            auditsAssigned
          }
        }`;

        const data = await fetchGraphQL(query, token);
        setUserInfo(data.data.user[0]);
      } catch (e) {
        console.error("Failed to fetch user:", e);
      }
    }

    async function getXpData(){
      try{
  const query = `
query {
  transaction(
    where: {
      type: { _eq: "xp" }
      _and: [
        { path: { _like: "%/bh-module/%" } }
        { path: { _nlike: "%/piscine-js/%" } }
      ]
    }
    order_by: { createdAt: asc }
  ) {
    amount
    createdAt
    path
  
  }
}
`;

const data = await fetchGraphQL(query, token);

console.log("This is the XP: ", data)

setXpInfo(data.data.transaction);


      }catch(e){

                console.error("Failed to fetch XP:", e);

      }
    }

    getUserData();
    getXpData();
  }, []);

 async function handleLogout(e) {
  e.preventDefault();
  try {
    await deleteJWT();
    setToken(null);
  } catch (e) {
    console.error("Error deleting the JWT: ", e);
  }
}


  if (!userInfo) return <p className="loading">Loading profile...</p>;

return (
  <div className="page">

    <div className="profile-card">

    <div className="profile-header">
  <div className="left-header">
    <div className="avatar">
      {userInfo.firstName[0]}
    </div>

    <div className="identity">
      <h2>
        {userInfo.firstName} {userInfo.lastName} ({userInfo.login})
      </h2>
      <span>{userInfo.email}</span>
    </div>
  </div>

  <button className="logout-btn" onClick={handleLogout}>
    Logout
  </button>
</div>


      <div className="profile-stats">
        <div className="stat">
          <p>Audit Ratio</p>
          <h3>{userInfo.auditRatio.toFixed(1)}</h3>
        </div>

        <div className="stat">
          <p>Audits Assigned</p>
          <h3>{userInfo.auditsAssigned}</h3>
        </div>
      </div>

      {/* XP TRANSACTIONS */}
      <div className="xp-section">
        <h4>XP Transactions</h4>

        {!xpInfo && <p className="xp-loading">Loading XP...</p>}

        {xpInfo && xpInfo.map((tx, i) => (
          <div className="xp-row" key={i}>
            <div className="xp-left">
              <span className="xp-name">
                {tx.path.split("/").pop()}
              </span>
              <span className="xp-date">
                {new Date(tx.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="xp-right">
              +{(tx.amount / 1000).toFixed(0)} KB
            </div>
          </div>
        ))}
      </div>

    </div>

  </div>
);

}
