const configuredApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

function normalizeBaseUrl(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error('EXPO_PUBLIC_API_BASE_URL must be a valid absolute URL');
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('EXPO_PUBLIC_API_BASE_URL must use http or https');
  }

  return url.toString().replace(/\/$/, '');
}

export function getApiBaseUrl(): string {
  if (!configuredApiBaseUrl) {
    throw new Error(
      'EXPO_PUBLIC_API_BASE_URL is not configured. Copy .env.example to a local environment file.'
    );
  }
  return normalizeBaseUrl(configuredApiBaseUrl);
}
