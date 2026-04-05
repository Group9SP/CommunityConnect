import React from "react";
import { Star } from "lucide-react";

// Helper to count reviews by star
function getStarCounts(reviews: any[]) {
  const counts = [0, 0, 0, 0, 0];
  reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) counts[r.rating - 1]++;
  });
  return counts;
}

export const ReviewStarChart: React.FC<{ reviews: any[] }> = ({ reviews }) => {
  const counts = getStarCounts(reviews);
  const total = reviews.length || 1;
  return (
    <div className="space-y-1 w-48">
      {[5, 4, 3, 2, 1].map(star => (
        <div key={star} className="flex items-center gap-2 text-sm">
          <span className="w-8 flex items-center">
            {star} <Star className="h-4 w-4 ml-1 text-yellow-400 fill-yellow-400" />
          </span>
          <div className="flex-1 bg-muted rounded h-2 overflow-hidden">
            <div
              className="bg-accent h-2 rounded"
              style={{ width: `${(counts[star - 1] / total) * 100}%` }}
            />
          </div>
          <span className="w-6 text-right">{counts[star - 1]}</span>
        </div>
      ))}
    </div>
  );
};
