"use client";
import { Button } from "@/components/ui/button";
import { useAuth, useSession, useUser } from "@clerk/nextjs";
import { auth, currentUser, getAuth } from "@clerk/nextjs/server";
import axios from "axios";
import { useState } from "react";

export default function FetchArea() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  
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
