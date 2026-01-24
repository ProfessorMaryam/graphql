import { fetchGraphQL } from "../queries/GraphqlService"
import { useEffect, useState } from "react"

export default function HomeView() {
  const [userInfo, setUserInfo] = useState(null);

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
              id
            }
          }
        `;

        const data = await fetchGraphQL(query, token);
        setUserInfo(data);
      } catch (e) {
        console.error("Failed to fetch user:", e);
      }
    }

    getUserData();
  }, []);

  return <pre>{JSON.stringify(userInfo, null, 2)}</pre>;
}
