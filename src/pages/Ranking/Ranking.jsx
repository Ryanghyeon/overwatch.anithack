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
        padding: "50px 20px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            marginBottom: "10px",
          }}
        >
          🏆 신고 랭킹
        </h1>

        <p
          style={{
            color: "#94a3b8",
            fontSize: "18px",
            marginBottom: "25px",
          }}
        >
          가장 많이 신고된 배틀태그 순위
        </p>

        <Link to="/">
          <button
            style={{
              backgroundColor: "#1e293b",
              color: "white",
              border: "none",
              padding: "12px 22px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            ← 홈으로
          </button>
        </Link>
      </div>

      <div
        style={{
          maxWidth: "850px",
          margin: "0 auto",
        }}
      >
        {ranking.map((player, index) => (
          <div
            key={player.id}
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#1e293b",
              padding: "22px",
              marginBottom: "18px",
              borderRadius: "14px",
              transition: "0.2s",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow =
                "0 10px 25px rgba(0,0,0,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 5px 15px rgba(0,0,0,0.2)";
            }}
          >
            <div
              style={{
                width: "70px",
                textAlign: "center",
                fontSize: "35px",
              }}
            >
              {index === 0 && "🥇"}
              {index === 1 && "🥈"}
              {index === 2 && "🥉"}
              {index > 2 && `#${index + 1}`}
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "24px",
                }}
              >
                {player.battletag}
              </h2>

              <p
                style={{
                  marginTop: "8px",
                  color: "#cbd5e1",
                  fontSize: "17px",
                }}
              >
                🚨 신고 {player.reportCount}회
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
