"use client";
import { useAuth, } from "@clerk/nextjs";


import { useState } from "react";

export default function FetchArea() {
  const { getToken } = useAuth();
  
  const [data, setData] = useState(null);
  
  const fetchData = async () => {
    
    const token = await getToken();

    console.log("token", token);

    try {
      const response = await fetch("http://localhost:8000", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      setData(result);

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <button onClick={()=>fetchData()}>Fetch Protected Data</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
