import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import './Ranking.css';

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
    <div className="ranking-wrapper">
      <div className="ranking-header">
        <h1 className="ranking-title">🏆 신고 랭킹</h1>
        <p className="ranking-subtitle">가장 많이 신고된 배틀태그 순위</p>

        <Link to="/">
          <button className="btn-home">← 홈으로</button>
        </Link>
      </div>

      <div className="ranking-list">
        {ranking.map((player, index) => (
          <div key={player.id} className="ranking-card">
            <div className="ranking-medal">
              {index === 0 && "🥇"}
              {index === 1 && "🥈"}
              {index === 2 && "🥉"}
              {index > 2 && `#${index + 1}`}
            </div>

            <div className="ranking-info">
              <h2 className="battletag-name">{player.battletag}</h2>
              <p className="report-count">🚨 신고 {player.reportCount}회</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}