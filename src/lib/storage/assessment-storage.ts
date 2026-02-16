import type { Process, ProcessAssessment, AssessmentId, ProcessId } from '@/types/process';
import type { ProcessAnalysis } from '@/types/analysis';

const STORAGE_PREFIX = 'leanlens';

function getKey(type: 'assessment' | 'process' | 'analysis', id: string): string {
  return `${STORAGE_PREFIX}:${type}:${id}`;
}

function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const test = '__test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// Assessment CRUD
export function saveAssessment(assessment: ProcessAssessment): void {
  if (!isLocalStorageAvailable()) return;
  const key = getKey('assessment', assessment.id);
  const data = {
    ...assessment,
    createdAt: assessment.createdAt.toISOString(),
    updatedAt: assessment.updatedAt.toISOString(),
  };
  window.localStorage.setItem(key, JSON.stringify(data));
}

export function loadAssessment(id: AssessmentId): ProcessAssessment | null {
  if (!isLocalStorageAvailable()) return null;
  const key = getKey('assessment', id);
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;

  try {
    const data = JSON.parse(raw);
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  } catch {
    return null;
  }
}

export function deleteAssessment(id: AssessmentId): void {
  if (!isLocalStorageAvailable()) return;
  const key = getKey('assessment', id);
  window.localStorage.removeItem(key);
}

export function listSavedAssessments(): AssessmentId[] {
  if (!isLocalStorageAvailable()) return [];

  const assessmentIds: AssessmentId[] = [];
  const prefix = `${STORAGE_PREFIX}:assessment:`;

  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key?.startsWith(prefix)) {
      const id = key.slice(prefix.length) as AssessmentId;
      assessmentIds.push(id);
    }
  }

  return assessmentIds;
}

// Process CRUD
export function saveProcess(process: Process): void {
  if (!isLocalStorageAvailable()) return;
  const key = getKey('process', process.id);
  window.localStorage.setItem(key, JSON.stringify(process));
}

export function loadProcess(id: ProcessId): Process | null {
  if (!isLocalStorageAvailable()) return null;
  const key = getKey('process', id);
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function deleteProcess(id: ProcessId): void {
  if (!isLocalStorageAvailable()) return;
  const key = getKey('process', id);
  window.localStorage.removeItem(key);
}

// Analysis CRUD
export function saveAnalysis(analysis: ProcessAnalysis): void {
  if (!isLocalStorageAvailable()) return;
  const key = getKey('analysis', analysis.processId);
  window.localStorage.setItem(key, JSON.stringify(analysis));
}

export function loadAnalysis(processId: ProcessId): ProcessAnalysis | null {
  if (!isLocalStorageAvailable()) return null;
  const key = getKey('analysis', processId);
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function deleteAnalysis(processId: ProcessId): void {
  if (!isLocalStorageAvailable()) return;
  const key = getKey('analysis', processId);
  window.localStorage.removeItem(key);
}

// Clear all LeanLens data
export function clearAllData(): void {
  if (!isLocalStorageAvailable()) return;

  const keysToRemove: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      keysToRemove.push(key);
    }
  }

  for (const key of keysToRemove) {
    window.localStorage.removeItem(key);
  }
}
