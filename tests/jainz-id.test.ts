import { describe, expect, it } from 'vitest';
import { formatJainZId, parseJainZId } from '@/lib/jainz-id';

describe('JainZ ID', () => {
  it('formats stable permanent IDs', () => { expect(formatJainZId(1, 2026)).toBe('JZB-2026-000001'); });
  it('parses valid IDs', () => { expect(parseJainZId('JZB-2026-000123')).toEqual({ year: 2026, sequence: 123 }); });
  it('rejects invalid IDs', () => { expect(parseJainZId('bad')).toBeNull(); });
});
