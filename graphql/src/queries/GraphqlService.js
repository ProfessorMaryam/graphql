export async function fetchGraphQL(query, token){
    const res = await fetch (    "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
{
    method : "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }, 

      body : JSON.stringify({query}),
})

const data = await res.json();

  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  console.log("This is the data from the graph ql fetch: ", data) // just to see the format

  return data;

}