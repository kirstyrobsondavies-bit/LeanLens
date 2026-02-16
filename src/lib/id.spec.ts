import { describe, expect, test } from 'vitest';
import { createAssessmentId, createProcessId, createStepId } from './id';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('createProcessId', () => {
  test('returns a valid UUID v4 format', () => {
    const id = createProcessId();
    expect(id).toMatch(UUID_REGEX);
  });

  test('generates unique IDs on each call', () => {
    const ids = Array.from({ length: 100 }, () => createProcessId());
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(100);
  });
});

describe('createStepId', () => {
  test('returns a valid UUID v4 format', () => {
    const id = createStepId();
    expect(id).toMatch(UUID_REGEX);
  });

  test('generates unique IDs on each call', () => {
    const ids = Array.from({ length: 100 }, () => createStepId());
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(100);
  });
});

describe('createAssessmentId', () => {
  test('returns a valid UUID v4 format', () => {
    const id = createAssessmentId();
    expect(id).toMatch(UUID_REGEX);
  });

  test('generates unique IDs on each call', () => {
    const ids = Array.from({ length: 100 }, () => createAssessmentId());
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(100);
  });
});
