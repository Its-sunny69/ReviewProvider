import React from "react";
import { useNavigate } from "react-router-dom";
import { DataProvider, useData } from "../contexts/getDataContext.jsx";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function GetData() {
  const navigate = useNavigate();
  const { data, loading } = useData();
  console.log(data);
  if (loading) {
    return (
      <SkeletonTheme baseColor="#c3c3c3" highlightColor="#e7e7e7">
        <p>
          <Skeleton width={150} height={100} />
        </p>
      </SkeletonTheme>
    );
  }

  //console.log(data);

  function capitalizeFirstLetter(str) {
    if (typeof str !== "string") return "str is not a string"; // Ensure str is a string
    if (!str.length) return str; // Handle empty strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  if (data.length === 0) {
    return (
      <p className="text-lg my-16 font-bold text-slate-400 drop-shadow-sm">
        No space created yet...
      </p>
    );
  }

  return (
    <div>
      <ul className="flex flex-wrap sm:justify-left items-center sm:gap-10 gap-4 my-16">
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
            <div className="bg-blue-400 flex flex-col items-center justify-center hover:bg-blue-50 shadow-lg border border-gray-200 hover:border-blue-400 rounded-xl px-20 py-6 transition-all duration-300 cursor-pointer">
              {Object.entries(item).map(([key, value]) => (
                <div key={key} className="mb-2 text-center">
                  <p className="text-gray-800 font-semibold text-lg">
                    {capitalizeFirstLetter(value.firstname)}
                  </p>
                </div>
              ))}
            </div>
          </li>
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
