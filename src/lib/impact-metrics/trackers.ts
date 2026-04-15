// src/lib/impact-metrics/trackers.ts
import { generateClient } from 'aws-amplify/api';
import { createReview } from '@/graphql/mutations';
import { ModerationStatus } from '@/API';

const client = generateClient();

export const recordImpactEvent = async (
  businessId: string,
  type: 'VIEW' | 'CLICK' | 'REVIEW',
  reviewInput?: { rating: number; comment: string; userID: string }
) => {
  try {
    if (type === 'REVIEW' && reviewInput) {
      await client.graphql({
        query: createReview,
        variables: {
          input: {
            businessID: businessId,
            userID: reviewInput.userID,
            rating: reviewInput.rating,
            comment: reviewInput.comment,
            moderation_status: ModerationStatus.pending,
            editableUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          },
        },
      });
    } else {
      // VIEW and CLICK events are tracked client-side until an AnalyticsEvent
      // model is added to the schema
      const key = `impact_${type}_${businessId}`;
      const current = parseInt(localStorage.getItem(key) ?? '0', 10);
      localStorage.setItem(key, String(current + 1));
    }
    console.log(`[Impact] Recorded ${type} for business ${businessId}`);
  } catch (error) {
    console.error('[Impact] Failed to log event:', error);
  }
};
 