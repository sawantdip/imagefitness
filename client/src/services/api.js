export async function api(url, options = {}) {
  const response = await fetch('/api' + url, {
    ...options,
    credentials: 'same-origin',
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  });
  const data = await response
    .json()
    .catch(() => ({ error: 'Server returned an unexpected response.' }));
  if (!response.ok) {
    if (response.status === 401) window.dispatchEvent(new Event('admin-session-expired'));
    throw new Error(data.error || 'Request failed.');
  }
  return data;
}
