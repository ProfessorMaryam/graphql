export async function getJWT(username, password){
  const credentials = btoa(`${username}:${password}`);
    const res = await fetch ("https://learn.reboot01.com/api/auth/signin", 
       {method : "POST", 
        headers : {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/json",

        }
       })

        if (!res.ok) {
    throw new Error("THIS IS THE JWT ERROR ", res.text);
    
  }

  const data = await res.json();

  //console.log("This is the data from the getJWT function ",  data) // just to see the format

  return data
}

export async function deleteJWT(){
  localStorage.removeItem("JWT");
}