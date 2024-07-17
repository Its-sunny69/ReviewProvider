import React from "react";
import { useNavigate } from "react-router-dom";
import { DataProvider, useData } from '../contexts/getDataContext.jsx'
function GetData() {
  const navigate = useNavigate();
  const { data, loading } = useData();

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  console.log(data)


  return (
    <div>
      <ul className="border border-black flex flex-wrap gap-10 my-16">
        {data.map((item, index) => (
          <li key={index} onClick={() => navigate('/user-dashboard', {
            state: {
              data: item[0]
            }
          })}>
            <div className="flex justify-center items-center flex-col border-2 shadow-sm py-8 px-12 rounded-md shadow-black">
              <div></div>
              {Object.entries(item).map(([key, value]) => (
                <p key={key} className="font-bold text-xl">{value.firstname}</p>
              ))}
            </div>
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

export default function App() {
  return (
    <DataProvider>
      <GetData />
    </DataProvider>
  )
};
