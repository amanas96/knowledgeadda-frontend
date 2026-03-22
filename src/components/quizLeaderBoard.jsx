import React from "react";
import { Trophy, Clock, Award } from "lucide-react";

const rankColors = {
  0: "bg-yellow-400 text-yellow-900",
  1: "bg-gray-300 text-gray-800",
  2: "bg-amber-600 text-white",
};

const rankEmoji = { 0: "🥇", 1: "🥈", 2: "🥉" };

const Leaderboard = ({ data, type = "quiz" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Trophy size={48} className="mx-auto mb-3 opacity-30" />
        <p className="font-medium">No attempts yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((entry, i) => (
        <div
          key={entry.userId}
          className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
            i < 3
              ? "bg-gradient-to-r from-white to-yellow-50 border-yellow-100 shadow-sm"
              : "bg-white border-gray-100"
          }`}
        >
          {/* Rank */}
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
              rankColors[i] || "bg-gray-100 text-gray-600"
            }`}
          >
            {rankEmoji[i] || i + 1}
          </div>

          {/* Avatar + Name */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
              {entry.name?.charAt(0).toUpperCase()}
            </div>
            <p className="font-semibold text-gray-800 text-sm truncate">
              {entry.name}
            </p>
          </div>

          {/* Stats */}
          {type === "quiz" ? (
            <div className="flex items-center gap-4 flex-shrink-0 text-sm">
              <div className="text-center">
                <p className="font-bold text-gray-800">{entry.score}</p>
                <p className="text-[10px] text-gray-400 uppercase">Score</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-green-600">{entry.percentage}%</p>
                <p className="text-[10px] text-gray-400 uppercase">Accuracy</p>
              </div>
              <div className="text-center flex items-center gap-1 text-gray-500">
                <Clock size={12} />
                <span className="text-xs">{entry.timeTaken}s</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 flex-shrink-0 text-sm">
              <div className="text-center">
                <p className="font-bold text-gray-800">{entry.totalScore}</p>
                <p className="text-[10px] text-gray-400 uppercase">
                  Total Score
                </p>
              </div>
              <div className="text-center">
                <p className="font-bold text-green-600">
                  {entry.avgPercentage}%
                </p>
                <p className="text-[10px] text-gray-400 uppercase">Avg</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-blue-600">{entry.totalQuizzes}</p>
                <p className="text-[10px] text-gray-400 uppercase">Quizzes</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
