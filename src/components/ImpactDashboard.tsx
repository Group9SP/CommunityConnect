import { useEffect, useState } from 'react';
import { TrendingUp, Users, Award, Star } from 'lucide-react';
import { fetchImpactMetrics, type ImpactMetrics } from '@/lib/impact-metrics/aggregator';

export default function ImpactDashboard() {
  const [metrics, setMetrics] = useState<ImpactMetrics | null>(null);

  useEffect(() => {
    fetchImpactMetrics()
      .then(setMetrics)
      .catch(() => {
        // Fallback to placeholder values if API is unavailable
        setMetrics({
          totalBusinesses: 0,
          verifiedBusinesses: 0,
          howardAffiliatedBusinesses: 0,
          minorityOwnedBusinesses: 0,
          totalReviews: 0,
          economicEmpowermentScore: 0,
          communityReach: 0,
        });
      });
  }, []);

  const stats = [
    {
      icon: <Award className="h-7 w-7" />,
      label: 'Businesses Listed',
      value: metrics?.totalBusinesses ?? '—',
    },
    {
      icon: <Star className="h-7 w-7" />,
      label: 'Community Reviews',
      value: metrics?.totalReviews ?? '—',
    },
    {
      icon: <TrendingUp className="h-7 w-7" />,
      label: 'Empowerment Score',
      value: metrics ? `${metrics.economicEmpowermentScore}%` : '—',
    },
    {
      icon: <Users className="h-7 w-7" />,
      label: 'Community Reach',
      value: metrics?.communityReach ?? '—',
    },
  ];

  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Our Community Impact
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
          Real-time metrics demonstrating the economic empowerment of
          minority-owned and Howard-affiliated businesses.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center bg-white rounded-2xl shadow-sm p-6 space-y-3"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary">
                {stat.icon}
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
