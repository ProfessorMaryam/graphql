import { fetchGraphQL } from "../queries/GraphqlService";
import { useEffect, useState } from "react";
import { deleteJWT } from "../queries/Auth";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  LogOut,
  Zap,
  Activity,
  Users,
  CheckCircle,
  
} from "lucide-react";



import "../styles/home.css";

export default function HomeView({ setToken }) {

  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [xpInfo, setXpInfo] = useState(null);
  const [skillInfo, setSkillInfo] = useState(null);

  const [hoverPoint, setHoverPoint] = useState(null);


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
            createdAt
            id
           events(order_by: { level: desc }, limit: 1) {
      level
    }
           
          }
        }`;

        const data = await fetchGraphQL(query, token);
        setUserInfo(data.data.user[0]);
      } catch (e) {
        console.error("Failed to fetch user:", e);
      }
    }


    // this is for each project and the XP you gain from it

    async function getXpData() {
      try {
        const query = `
query {
  transaction(
    where: {
      type: { _eq: "xp" }
      _and: [
        { path: { _like: "%/bh-module/%" } }
        { path: { _nlike: "%/piscine-js/%" } }
        { path: { _nlike: "%/piscine-rust/%" } }

      ]
      
      
    }
    order_by: { createdAt: desc }
  ) {
    amount
    createdAt
    path
  
  }
}
`;

        const data = await fetchGraphQL(query, token);
        setXpInfo(data.data.transaction);

      } catch (e) {
        console.error("Failed to fetch XP:", e);
      }
    }

   async function getSkillsData(){
  try{
    const query = `query {
      user {
        transactions(
          where: { type: { _in : ["skill_go", "skill_js", "skill_prog", "skill_front-end", "skill_back-end"] } }
          order_by: [{ type: asc }, { amount: desc }]
          distinct_on: type
        ) {
          type
          amount
        }
      }
    }`;

    const data = await fetchGraphQL(query , token);
    setSkillInfo(data.data.user[0].transactions);

  }catch (e){
    console.error("Failed to fetch Skills:", e);
  }
}



    getUserData();
    getXpData();
    getSkillsData();
  }, []);

  async function handleLogout(e) {
    e.preventDefault();
    try {
      await deleteJWT();
      setToken(null);
      navigate("/Login", { replace: true });

    } catch (e) {
      console.error("Error deleting the JWT: ", e);
    }
  }

  if (!userInfo) {
    return (
      <div className="page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading profile...</p>
        </div>
      </div>
    );
  }

  const joinedDate = new Date(userInfo.createdAt).toLocaleDateString();
  const level = userInfo.events?.[0]?.level ?? 0;
  const totalXP = xpInfo ? xpInfo.reduce((sum, tx) => sum + tx.amount, 0) : 0;



  // preparing for the skills 

  /* ---------------- SKILLS RADAR ---------------- */

const skills = skillInfo
  ? skillInfo.map(s => ({
      name: s.type.replace("skill_", ""),
      value: s.amount,
    }))
  : [];

const radarSize = 260;
const radarCenter = radarSize / 2;
const radarRadius = radarCenter - 30;

const maxSkill = Math.max(...skills.map(s => s.value), 1);

const radarPoints = skills.map((s, i) => {
  const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
  const r = (s.value / maxSkill) * radarRadius;

  return {
    ...s,
    x: radarCenter + r * Math.cos(angle),
    y: radarCenter + r * Math.sin(angle),
    lx: radarCenter + (radarRadius + 16) * Math.cos(angle),
    ly: radarCenter + (radarRadius + 16) * Math.sin(angle),
  };
});

const radarPolygon = radarPoints.map(p => `${p.x},${p.y}`).join(" ");

  


  // BOOOOOOMMMM

  const xpChartData = xpInfo
  ? [...xpInfo]
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .reduce((acc, tx) => {
        const lastXP = acc.length ? acc[acc.length - 1].xp : 0;
        acc.push({
          date: new Date(tx.createdAt).toLocaleDateString(),
          xp: lastXP + tx.amount / 1000,
        });
        return acc;
      }, [])
  : []; 

  const width = 700;
const height = 220;
const padding = 30;

const maxXP = Math.max(...xpChartData.map(d => d.xp), 1);

const points = xpChartData.map((d, i) => {
  const x = padding + (i / (xpChartData.length - 1 || 1)) * (width - padding * 2);
  const y = height - padding - (d.xp / maxXP) * (height - padding * 2);
  return `${x},${y}`;
}).join(" ");

  

  return (
    <div className="page">
      <div className="dashboard-container">

        {/* Hero Profile Section */}
        <div className="profile-hero">
          <div className="hero-background"></div>
          <div className="hero-content">
            <div className="avatar-section">
              <div className="avatar-wrapper">
                <div className="avatar">
                  {userInfo.firstName?.[0] ?? "U"}
                </div>
                <div className="avatar-ring"></div>
              </div>
              <div className="level-badge">
                <span className="level-number">{level}</span>
                <span className="level-label">Level</span>
              </div>
            </div>

            <div className="user-info">
              <h1 className="user-name">
                {userInfo.firstName} {userInfo.lastName}
              </h1>
              <p className="user-login">@{userInfo.login}</p>
              <p className="user-email">{userInfo.email}</p>

              <div className="meta-tags">
                <span className="meta-tag">
                  <Calendar size={14} />
                  Joined {joinedDate}
                </span>

              </div>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>

          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card accent-green">
            <div className="stat-icon">
              <Zap size={24} />
            </div>

            <div className="stat-content">
              <p className="stat-label">Total XP</p>
              <h3 className="stat-value">{(totalXP / 1000).toFixed(1)} KB</h3>
            </div>
          </div>

          <div className="stat-card accent-blue">
            <div className="stat-icon">
              <Activity size={24} />
            </div>

            <div className="stat-content">
              <p className="stat-label">Audit Ratio</p>
              <h3 className="stat-value">{userInfo.auditRatio.toFixed(1)}</h3>
            </div>
          </div>

          <div className="stat-card accent-purple">
            <div className="stat-icon">
              <Users size={24} />
            </div>

            <div className="stat-content">
              <p className="stat-label">Audits Assigned</p>
              <h3 className="stat-value">{userInfo.auditsAssigned}</h3>
            </div>
          </div>


        </div>


{/* XP Progress SVG Graph */}
<div className="transactions-card">
  <div className="card-header">
    <h2 className="card-title">XP Progress Over Time</h2>
  </div>

  <svg viewBox={`0 0 ${width} ${height}`} className="xp-graph">

    {/* Y Axis */}
    {[0, 0.25, 0.5, 0.75, 1].map((v, i) => {
      const y = height - padding - v * (height - padding * 2);
      return (
        <g key={i}>
          <line
            x1={padding}
            y1={y}
            x2={width - padding}
            y2={y}
            stroke="currentColor"
            opacity="0.08"
          />
          <text
            x={padding - 8}
            y={y + 4}
            textAnchor="end"
            fontSize="6"
            fill="currentColor"
            opacity="0.6"
          >
            {(maxXP * v).toFixed(0)} XP
          </text>
        </g>
      );
    })}

    {/* X Axis */}
    {xpChartData.map((d, i) => {
      if (i % Math.ceil(xpChartData.length / 6) !== 0) return null;

      const x = padding + (i / (xpChartData.length - 1 || 1)) * (width - padding * 2);
      return (
        <text
          key={i}
          x={x}
          y={height - padding + 14}
          textAnchor="middle"
          fontSize="8"
          fill="currentColor"
          opacity="0.6"
        >
          {d.date}
        </text>
      );
    })}

    {/* Line */}
    <polyline
      points={points}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Points */}
    {xpChartData.map((d, i) => {
      const x = padding + (i / (xpChartData.length - 1 || 1)) * (width - padding * 2);
      const y = height - padding - (d.xp / maxXP) * (height - padding * 2);

      return (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={hoverPoint?.i === i ? 6 : 4}
          fill="currentColor"
          style={{ cursor: "pointer" }}
          onMouseEnter={() => setHoverPoint({ ...d, x, y, i })}
          onMouseLeave={() => setHoverPoint(null)}
        />
      );
    })}

    {/* Tooltip */}
    {hoverPoint && (
      <g>
        <rect
          x={hoverPoint.x - 45}
          y={hoverPoint.y - 42}
          rx="6"
          ry="6"
          width="90"
          height="32"
          fill="black"
          opacity="0.75"
        />
        <text
          x={hoverPoint.x}
          y={hoverPoint.y - 22}
          textAnchor="middle"
          fontSize="11"
          fill="white"
        >
          {hoverPoint.date}
        </text>
        <text
          x={hoverPoint.x}
          y={hoverPoint.y - 10}
          textAnchor="middle"
          fontSize="11"
          fill="white"
        >
          {hoverPoint.xp.toFixed(1)} XP
        </text>
      </g>
    )}

  </svg>
</div>


{/* Skills Radar */}
<div className="transactions-card">
  <div className="card-header">
    <h2 className="card-title">Skills Overview</h2>
  </div>

  <div className="skills-content">
    <div className="radar-container">
      <svg width={radarSize} height={radarSize} className="radar-chart">

        {[0.2, 0.4, 0.6, 0.8, 1].map((v, i) => (
          <circle
            key={i}
            cx={radarCenter}
            cy={radarCenter}
            r={radarRadius * v}
            fill="none"
            stroke="currentColor"
            opacity="0.1"
            strokeWidth="1"
          />
        ))}

        {radarPoints.map((p, i) => (
          <line
            key={i}
            x1={radarCenter}
            y1={radarCenter}
            x2={p.lx}
            y2={p.ly}
            stroke="currentColor"
            opacity="0.2"
            strokeWidth="1"
          />
        ))}

        <polygon
          points={radarPolygon}
          fill="url(#radarGradient)"
          opacity="0.4"
          stroke="#22c55e"
          strokeWidth="2.5"
        />

        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {radarPoints.map((p, i) => (
          <circle 
            key={i} 
            cx={p.x} 
            cy={p.y} 
            r="5" 
            fill="#22c55e"
            stroke="#fff"
            strokeWidth="2"
          />
        ))}

        {radarPoints.map((p, i) => (
          <text
            key={i}
            x={p.lx}
            y={p.ly}
            textAnchor="middle"
            fontSize="12"
            fill="currentColor"
            fontWeight="600"
            opacity="0.8"
          >
            {p.name}
          </text>
        ))}

      </svg>
    </div>

    <div className="skills-list">
      {skills.map((skill, i) => {
        const percentage = ((skill.value / maxSkill) * 100).toFixed(0);
        return (
          <div className="skill-item" key={i}>
            <div className="skill-info">
              <span className="skill-name">{skill.name}</span>
              <span className="skill-value">{skill.value.toFixed(1)}</span>
            </div>
            <div className="skill-bar-container">
              <div 
                className="skill-bar" 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</div>




        {/* XP Transactions Section */}
        <div className="transactions-card">
          <div className="card-header">
            <h2 className="card-title">
              Recent XP Transactions
            </h2>
          </div>

          <div className="transactions-list">
            {!xpInfo && (
              <div className="transactions-loading">
                <div className="loading-spinner small"></div>
                <p>Loading transactions...</p>
              </div>
            )}

            {xpInfo && xpInfo.length === 0 && (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p>No transactions found</p>
              </div>
            )}

            {xpInfo && xpInfo.map((tx, i) => {
              const projectName = tx.path.split("/").pop();
              const xpAmount = (tx.amount / 1000).toFixed(1);
              const date = new Date(tx.createdAt);
              const formattedDate = date.toLocaleDateString();
              const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div className="transaction-row" key={i}>
                  <div className="transaction-icon">
                    <CheckCircle size={18} />
                  </div>


                  <div className="transaction-details">
                    <div className="transaction-name">{projectName}</div>
                    <div className="transaction-meta">
                      <span className="transaction-date">{formattedDate}</span>
                      <span className="transaction-time">{formattedTime}</span>
                    </div>
                  </div>

                  <div className="transaction-amount">
                    <span className="amount-value">+{xpAmount} KB</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );

}