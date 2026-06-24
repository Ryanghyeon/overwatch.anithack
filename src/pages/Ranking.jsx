import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { db } from "../firebase/firebase";

import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

export default function Ranking() {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    loadRanking();
  }, []);

  const loadRanking = async () => {
    try {
      const q = query(
        collection(db, "battletags"),
        orderBy("reportCount", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRanking(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "white",
        padding: "50px",
      }}
    >
      <h1>신고 랭킹</h1>
<h1>신고 랭킹</h1>

<Link to="/">
  <button>🏠 홈으로</button>
</Link>
      <br />

      {ranking.map((player, index) => (
        <div
          key={player.id}
          style={{
            backgroundColor: "#1e293b",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "10px",
          }}
        >
          <h3>
            #{index + 1} {player.battletag}
          </h3>

          <p>
            신고 횟수 : {player.reportCount}
          </p>
          
        </div>
        
      ))}
    </div>
    
  );
}