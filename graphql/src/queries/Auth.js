export async function getJWT(username, password){
    const credentials = `${username}:${password}`
    const res = await fetch ("https://learn.reaboot01.com/api/auth/signin/", 
       {method : "POST", 
        headers : {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/json",

        }
       })

        if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  const data = await res.json();

  console.log("This is the data from the getJWT function ",  data) // just to see the format

  return data 
}