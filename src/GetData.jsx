import React, { useState } from "react";
import app from "./Store/realtimeDB";
import { getDatabase, ref, set, onValue, push, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
function GetData() {
  const navigate = useNavigate()
  let [data, setData] = useState([]);
  const fetchData = async () => {
    const db = getDatabase(app);
    const dbRef = ref(db, `Database`);
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
      <ul className="flex flex-wrap gap-10 p-10">
        {data.map((item, index) => {
          console.log(item)
          return (
            <li key={index} onClick={()=>navigate('/user-dashboard')}>
              <div className="flex justify-center items-center flex-col border-2 shadow-sm w-52 h-52 shadow-black">
                <p className="font-bold text-xl">{item['-O1XoSCS3D2Ej5glavUf'].firstname}</p>
              </div>
            </li>
          )
        })}
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
