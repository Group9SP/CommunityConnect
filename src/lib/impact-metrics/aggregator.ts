// src/lib/impact-metrics/aggregator.ts
import { generateClient } from 'aws-amplify/api';
import { listBusinessProfiles, listReviews } from '@/graphql/queries';

const client = generateClient();

export interface ImpactMetrics {
  totalBusinesses: number;
  verifiedBusinesses: number;
  howardAffiliatedBusinesses: number;
  minorityOwnedBusinesses: number;
  totalReviews: number;
  economicEmpowermentScore: number;
  communityReach: number;
}

export async function fetchImpactMetrics(): Promise<ImpactMetrics> {
  const [businessRes, reviewRes] = await Promise.all([
    client.graphql({ query: listBusinessProfiles, variables: { limit: 1000 }, authMode: 'apiKey' }),
    client.graphql({ query: listReviews, variables: { limit: 1000 }, authMode: 'apiKey' }),
  ]);

  const businesses = businessRes.data.listBusinessProfiles?.items ?? [];
  const reviews = reviewRes.data.listReviews?.items ?? [];

  const totalBusinesses = businesses.length;
  const verifiedBusinesses = businesses.filter(
    (b) => b?.verification_status === 'verified'
  ).length;
  const howardAffiliatedBusinesses = businesses.filter(
    (b) => b?.is_howard_affiliated
  ).length;
  const minorityOwnedBusinesses = businesses.filter(
    (b) => b?.is_minority_owned
  ).length;
  const totalReviews = reviews.length;

  // Economic empowerment score: verified + howard-affiliated businesses
  // weighted against total, scaled to 100
  const economicEmpowermentScore =
    totalBusinesses > 0
      ? Math.round(
          ((verifiedBusinesses + howardAffiliatedBusinesses) /
            (totalBusinesses * 2)) *
            100
        )
      : 0;

  // Community reach: unique businesses that have at least one review
  const businessesWithReviews = new Set(
    reviews.map((r) => r?.businessID).filter(Boolean)
  ).size;
  const communityReach = totalBusinesses + businessesWithReviews;
  

  return {
    totalBusinesses,
    verifiedBusinesses,
    howardAffiliatedBusinesses,
    minorityOwnedBusinesses,
    totalReviews,
    economicEmpowermentScore,
    communityReach,
  };
}
