import React, { useEffect, useState } from "react";
import { getGlobalLeaderboard } from "../../api/quizApi";
import Leaderboard from "../../components/quizLeaderBoard";
import { Trophy } from "lucide-react";

const GlobalLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getGlobalLeaderboard();
        setLeaderboard(data.leaderboard);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy size={32} className="text-yellow-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Global Leaderboard
          </h1>
          <p className="text-gray-500 mt-2">
            Top performers across all quizzes
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <Leaderboard data={leaderboard} type="global" />
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalLeaderboard;
