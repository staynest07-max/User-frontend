import { describe, expect, it } from 'vitest';
import { getNextPublicPgPage } from './usePublicPgs';

describe('public PG pagination', () => {
  it('returns the next page until the backend total is exhausted', () => {
    const page = { items: [], page: 1, limit: 20, total: 40, totalPages: 2 };
    expect(getNextPublicPgPage(page)).toBe(2);
    expect(getNextPublicPgPage({ ...page, page: 2 })).toBeUndefined();
  });
});
