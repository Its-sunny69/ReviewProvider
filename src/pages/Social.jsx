import React, { useEffect } from "react";

function Social() {
  async function fetchTweet() {
    try {
      const response = await fetch(
        "http://localhost:5000/tweet/1906757915735908455"
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching tweet:", error);
    }
  }

  useEffect(() => {
    fetchTweet();
  }, []);

  return <></>;
}

export default Social;
