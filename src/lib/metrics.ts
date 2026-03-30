// src/lib/metrics.ts
// Utility for tracking engagement events (profile views, click-throughs, etc.)

import { Amplify } from 'aws-amplify';
import { API } from 'aws-amplify';


// Event types for engagement and impact KPIs
export type EngagementEventType =
  | 'profile_view'
  | 'website_click'
  | 'review_submitted'
  | 'repeat_visitor';


export interface EngagementEvent {
  businessID: string;
  userID?: string;
  type: EngagementEventType;
  timestamp?: string;
}

// --- KPI Aggregation ---
export interface ImpactKPIs {
  totalProfileViews: number;
  totalWebsiteClicks: number;
  totalReviews: number;
  averageReviewRating: number;
  verifiedBusinesses: number;
  repeatVisitors: number;
  uniqueUsers: number;
  businessesWithIncreasedEngagement: number;
}

// Send event to backend (replace with actual API call or GraphQL mutation)
export async function trackEngagementEvent(event: EngagementEvent) {
  try {
    // TODO: Replace with actual API endpoint or GraphQL mutation
    // Example: await API.post('metricsApi', '/track', { body: event });
    console.log('Tracking engagement event:', event);
    // Placeholder: store in localStorage for now
    const events = JSON.parse(localStorage.getItem('engagementEvents') || '[]');
    events.push({ ...event, timestamp: new Date().toISOString() });
    localStorage.setItem('engagementEvents', JSON.stringify(events));
  } catch (err) {
    console.error('Failed to track engagement event', err);
  }
}

// Aggregate metrics from stored events and reviews
export function aggregateImpactKPIs(
  events: EngagementEvent[],
  reviews: { rating: number; businessID: string; userID?: string }[],
  verifiedBusinessIds: string[]
): ImpactKPIs {
  const totalProfileViews = events.filter(e => e.type === 'profile_view').length;
  const totalWebsiteClicks = events.filter(e => e.type === 'website_click').length;
  const totalReviews = reviews.length;
  const averageReviewRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      : 0;
  const verifiedBusinesses = verifiedBusinessIds.length;
  // Repeat visitors: users with >1 profile_view event
  const userViewCounts: Record<string, number> = {};
  events.forEach(e => {
    if (e.type === 'profile_view' && e.userID) {
      userViewCounts[e.userID] = (userViewCounts[e.userID] || 0) + 1;
    }
  });
  const repeatVisitors = Object.values(userViewCounts).filter(count => count > 1).length;
  // Unique users: distinct userIDs in any event
  const uniqueUsers = new Set(events.map(e => e.userID).filter(Boolean)).size;
  // Businesses with increased engagement: businesses with >X events (e.g., 10)
  const businessEventCounts: Record<string, number> = {};
  events.forEach(e => {
    businessEventCounts[e.businessID] = (businessEventCounts[e.businessID] || 0) + 1;
  });
  const businessesWithIncreasedEngagement = Object.values(businessEventCounts).filter(count => count > 10).length;
  return {
    totalProfileViews,
    totalWebsiteClicks,
    totalReviews,
    averageReviewRating,
    verifiedBusinesses,
    repeatVisitors,
    uniqueUsers,
    businessesWithIncreasedEngagement,
  };
}
