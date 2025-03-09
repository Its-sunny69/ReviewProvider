import React, { useEffect, useState } from "react";
import "../CSS/code.css";
import ReactCalendarHeatmap from "react-calendar-heatmap";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {
  LineChart,
  Legend,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { store } from "../Store/realtimeDB";
import { AuthProvider, useAuth } from "../contexts/getUser";
import { doc, getDoc } from "firebase/firestore";
import dayjs from "dayjs";

function Graph() {
  const { id } = useAuth();
  const [userData, setUserData] = useState(null);
  const [sentimentData, setSentimentData] = useState([]);
  const [dateData, setDateData] = useState([]);

  useEffect(() => {
    if (id) {
      fetchSentiment();
    }
  }, [id]);

  const fetchSentiment = async () => {
    try {
      if (!id) return;
      const userRef = doc(store, "users", id);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const sentiment = userData.sentiments || {};

        // Generate all dates in the given range
        const startDate = dayjs("2025-01-01");
        const endDate = dayjs("2025-12-31");
        const allDates = [];

        for (
          let date = startDate;
          date.isBefore(endDate) || date.isSame(endDate);
          date = date.add(1, "day")
        ) {
          const formattedDate = date.format("YYYY-MM-DD");
          allDates.push({
            date: formattedDate,
            count:
              (sentiment[formattedDate]?.Good || 0) +
              (sentiment[formattedDate]?.Neutral || 0) +
              (sentiment[formattedDate]?.Bad || 0),
          });
        }

        // Set state with full date range
        setUserData(userData);
        setSentimentData(
          Object.entries(sentiment).map(([date, counts]) => ({
            date: dayjs(date).format("YYYY-MM-DD"),
            good: counts.Good || 0,
            neutral: counts.Neutral || 0,
            bad: counts.Bad || 0,
          }))
        );
        setDateData(allDates);
      } else {
        console.error("User document not found");
      }
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Calendar Heatmap */}
      <div className="w-2/5 flex justify-center my-10">
        <ReactCalendarHeatmap
          startDate={new Date("2025-01-01")}
          endDate={new Date("2025-12-31")}
          values={dateData}
          classForValue={(value) => {
            if (!value || value.count === 0) return "color-empty";
            if (value.count > 10) return "color-scale-10";
            if (value.count > 5) return "color-scale-5";
            if (value.count > 2) return "color-scale-2";
            return "color-scale-1";
          }}
          tooltipDataAttrs={(value) => ({
            "data-tooltip-id": "heatmap-tooltip",
            "data-tooltip-content": `Date: ${value.date}, Responses: ${
              value.count || 0
            }`,
          })}
        />
        <ReactTooltip id="heatmap-tooltip" />
      </div>

      <div className="w-full flex justify-center mt-10">
        <ResponsiveContainer width="80%" height={300}>
          <LineChart data={sentimentData}>
            <XAxis
              dataKey="date"
              tickFormatter={(date) => dayjs(date).format("MMM DD")}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="good"
              stroke="#4CAF50"
              strokeWidth={2}
              dot={{ r: 5 }}
              name="Good"
            />
            <Line
              type="monotone"
              dataKey="neutral"
              stroke="#9E9E9E"
              strokeWidth={2}
              dot={{ r: 5 }}
              name="Neutral"
            />
            <Line
              type="monotone"
              dataKey="bad"
              stroke="#F44336"
              strokeWidth={2}
              dot={{ r: 5 }}
              name="Bad"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Loading State */}
      <div className="mt-4">
        {userData ? <p>Data Loaded</p> : <p>Loading...</p>}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Graph />
    </AuthProvider>
  );
}
