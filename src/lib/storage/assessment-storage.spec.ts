import { describe, expect, test, beforeEach, vi } from 'vitest';
import type { Process, ProcessAssessment, AssessmentId, ProcessId } from '@/types/process';
import type { ProcessAnalysis } from '@/types/analysis';
import {
  saveAssessment,
  loadAssessment,
  deleteAssessment,
  listSavedAssessments,
  saveProcess,
  loadProcess,
  deleteProcess,
  saveAnalysis,
  loadAnalysis,
  deleteAnalysis,
  clearAllData,
} from './assessment-storage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] || null,
  };
})();

// Set up global localStorage mock
vi.stubGlobal('localStorage', localStorageMock);

function createMockAssessment(id: AssessmentId): ProcessAssessment {
  return {
    id,
    processId: 'process-1' as ProcessId,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
    status: 'in_progress',
    currentStep: 2,
    answers: { question1: 'answer1' },
  };
}

function createMockProcess(id: ProcessId): Process {
  return {
    id,
    name: 'Test Process',
    purpose: 'Testing',
    trigger: 'Manual',
    frequency: 'daily',
    stakeholders: ['Team A'],
    steps: [],
  };
}

function createMockAnalysis(processId: ProcessId): ProcessAnalysis {
  return {
    processId,
    metrics: {
      leadTime: 100,
      cycleTime: 80,
      processEfficiency: 80,
      firstPassYield: 90,
      touchPoints: 3,
    },
    wastes: [],
    bottlenecks: [],
    automationOpportunities: [],
    overallScore: 85,
    recommendations: ['Test recommendation'],
  };
}

describe('Assessment Storage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('saveAssessment / loadAssessment', () => {
    test('saves and loads assessment correctly', () => {
      const assessment = createMockAssessment('assessment-1' as AssessmentId);
      saveAssessment(assessment);

      const loaded = loadAssessment('assessment-1' as AssessmentId);

      expect(loaded).not.toBeNull();
      expect(loaded?.id).toBe('assessment-1');
      expect(loaded?.processId).toBe('process-1');
      expect(loaded?.status).toBe('in_progress');
      expect(loaded?.currentStep).toBe(2);
    });

    test('preserves dates correctly', () => {
      const assessment = createMockAssessment('assessment-1' as AssessmentId);
      saveAssessment(assessment);

      const loaded = loadAssessment('assessment-1' as AssessmentId);

      expect(loaded?.createdAt).toBeInstanceOf(Date);
      expect(loaded?.updatedAt).toBeInstanceOf(Date);
      expect(loaded?.createdAt.getTime()).toBe(new Date('2024-01-01').getTime());
    });

    test('returns null for non-existent assessment', () => {
      const loaded = loadAssessment('non-existent' as AssessmentId);
      expect(loaded).toBeNull();
    });
  });

  describe('deleteAssessment', () => {
    test('removes assessment from storage', () => {
      const assessment = createMockAssessment('assessment-1' as AssessmentId);
      saveAssessment(assessment);

      deleteAssessment('assessment-1' as AssessmentId);

      const loaded = loadAssessment('assessment-1' as AssessmentId);
      expect(loaded).toBeNull();
    });
  });

  describe('listSavedAssessments', () => {
    test('returns empty array when no assessments', () => {
      const ids = listSavedAssessments();
      expect(ids).toEqual([]);
    });

    test('returns all saved assessment IDs', () => {
      saveAssessment(createMockAssessment('assessment-1' as AssessmentId));
      saveAssessment(createMockAssessment('assessment-2' as AssessmentId));

      const ids = listSavedAssessments();

      expect(ids).toHaveLength(2);
      expect(ids).toContain('assessment-1');
      expect(ids).toContain('assessment-2');
    });
  });
});

describe('Process Storage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('saveProcess / loadProcess', () => {
    test('saves and loads process correctly', () => {
      const process = createMockProcess('process-1' as ProcessId);
      saveProcess(process);

      const loaded = loadProcess('process-1' as ProcessId);

      expect(loaded).not.toBeNull();
      expect(loaded?.id).toBe('process-1');
      expect(loaded?.name).toBe('Test Process');
    });

    test('returns null for non-existent process', () => {
      const loaded = loadProcess('non-existent' as ProcessId);
      expect(loaded).toBeNull();
    });
  });

  describe('deleteProcess', () => {
    test('removes process from storage', () => {
      const process = createMockProcess('process-1' as ProcessId);
      saveProcess(process);

      deleteProcess('process-1' as ProcessId);

      const loaded = loadProcess('process-1' as ProcessId);
      expect(loaded).toBeNull();
    });
  });
});

describe('Analysis Storage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('saveAnalysis / loadAnalysis', () => {
    test('saves and loads analysis correctly', () => {
      const analysis = createMockAnalysis('process-1' as ProcessId);
      saveAnalysis(analysis);

      const loaded = loadAnalysis('process-1' as ProcessId);

      expect(loaded).not.toBeNull();
      expect(loaded?.processId).toBe('process-1');
      expect(loaded?.overallScore).toBe(85);
      expect(loaded?.recommendations).toEqual(['Test recommendation']);
    });

    test('returns null for non-existent analysis', () => {
      const loaded = loadAnalysis('non-existent' as ProcessId);
      expect(loaded).toBeNull();
    });
  });

  describe('deleteAnalysis', () => {
    test('removes analysis from storage', () => {
      const analysis = createMockAnalysis('process-1' as ProcessId);
      saveAnalysis(analysis);

      deleteAnalysis('process-1' as ProcessId);

      const loaded = loadAnalysis('process-1' as ProcessId);
      expect(loaded).toBeNull();
    });
  });
});

describe('clearAllData', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('removes all LeanLens data', () => {
    saveAssessment(createMockAssessment('assessment-1' as AssessmentId));
    saveProcess(createMockProcess('process-1' as ProcessId));
    saveAnalysis(createMockAnalysis('process-1' as ProcessId));

    clearAllData();

    expect(loadAssessment('assessment-1' as AssessmentId)).toBeNull();
    expect(loadProcess('process-1' as ProcessId)).toBeNull();
    expect(loadAnalysis('process-1' as ProcessId)).toBeNull();
  });

  test('does not remove non-LeanLens data', () => {
    localStorageMock.setItem('other-app:data', 'some value');
    saveAssessment(createMockAssessment('assessment-1' as AssessmentId));

    clearAllData();

    expect(localStorageMock.getItem('other-app:data')).toBe('some value');
  });
});
