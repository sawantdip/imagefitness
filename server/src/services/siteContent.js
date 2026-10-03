// Existing portfolios receive their current contact location as their first branch.
// Explicit empty arrays are preserved, allowing administrators to hide this section.
export function withBranches(content) {
  if (Array.isArray(content.branches)) return content;
  return {
    ...content,
    branches: [
      {
        name: content.address || 'Main branch',
        address: content.address || '',
        phone: content.phone || '',
        hours: content.hours || '',
        sunday: content.sunday || '',
        description: '',
        mapUrl: '',
        image: '',
      },
    ],
  };
}
