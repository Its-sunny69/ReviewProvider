import React, { useState } from "react";
import app from "./Store/realtimeDB";
import { getDatabase, ref, set, onValue, push, get } from "firebase/database";
function GetData() {
  let [data, setData] = useState([]);
  const fetchData = async () => {
    const db = getDatabase(app);
    const dbRef = ref(db, "Database/Space");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      setData(Object.values(snapshot.val()));
    } else {
      console.log("Fetch failed");
    }
  };

  console.log(data);
  return (
    <div>
      <button onClick={fetchData}>Get Data</button>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            <RenderQuestions questions={item.reviewQ.questions} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function RenderQuestions({ questions }) {
  return (
    <div>
      {" "}
      <ul>
        {Object.entries(questions).map(([key, value]) => (
          <li key={key}>{value}</li>
        ))}
      </ul>
    </div>
  );
}

export default GetData;
