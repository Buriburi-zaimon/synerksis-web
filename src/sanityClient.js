import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: '26cwh55d', // Replace this with the actual ID from your Sanity Studio
  dataset: 'production',
  useCdn: true, // `true` gives fast, edge-cached responses
  apiVersion: '2024-01-01',
});