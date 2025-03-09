import { store } from "../Store/realtimeDB";
import dayjs from "dayjs";
import { doc, updateDoc, getDoc } from "firebase/firestore";
export function capitalizeFirstLetter(str) {
  if (typeof str !== "string") return "str is not a string";
  if (!str.length) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export async function fetchReviewCategory(review) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reviews: review }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching review category:", error);
    return null;
  }
}

export async function updateSentimentCount(data, id) {
  if (!id || !data?.results) return;

  const results = data.results;
  const today = dayjs().format("YYYY-MM-DD"); // Get today's date as YYYY-MM-DD

  // Count "Good", "Bad", and "Neutral" reviews
  const counts = results.reduce(
    (acc, { sentiment }) => {
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    },
    { Good: 0, Bad: 0, Neutral: 0 }
  );

  try {
    const userRef = doc(store, "users", id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error("User document not found");
      return;
    }

    const userData = userSnap.data();
    const existingSentiments = userData.sentiments || {};

    // Merge new sentiment counts with existing data for today
    const updatedCounts = {
      Good: (existingSentiments[today]?.Good || 0) + counts.Good,
      Bad: (existingSentiments[today]?.Bad || 0) + counts.Bad,
      Neutral: (existingSentiments[today]?.Neutral || 0) + counts.Neutral,
    };

    // Update Firestore with new counts
    await updateDoc(userRef, {
      [`sentiments.${today}`]: updatedCounts,
    });

    toast.success("Review counts updated successfully", {
      position: "top-center",
      duration: 2000,
    });
  } catch (error) {
    console.error("Error updating Firestore:", error);
    toast.error("Error updating review counts", {
      position: "top-center",
      duration: 2000,
    });
  }
}
