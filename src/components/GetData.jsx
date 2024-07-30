import React from "react";
import { useNavigate } from "react-router-dom";
import { DataProvider, useData } from "../contexts/getDataContext.jsx";
function GetData() {
  const navigate = useNavigate();
  const { data, loading } = useData();

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log(data);

  function capitalizeFirstLetter(str) {
    if (typeof str !== 'string') return 'str is not a string'; // Ensure str is a string
    if (!str.length) return str; // Handle empty strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <div>
      <ul className="flex flex-wrap gap-10 my-16">
        {data.map((item, index) => (
          <li
            key={index}
            onClick={() =>
              navigate("/user-dashboard", {
                state: {
                  data: item[0],
                },
              })
            }
          >
            <div className="flex justify-center items-center flex-col shadow-md border hover:border-blue-600 py-8 px-12 rounded-md bg-blue-400 hover:bg-blue-200">
              {Object.entries(item).map(([key, value]) => (
                <p key={key} className="font-bold text-xl">
                  {/* {(value.firstname).charAt(0).toUpperCase() + (value.firstname).slice(1).toLowerCase()} */}
                  {capitalizeFirstLetter(value.firstname)}
                </p>
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
  );
}
