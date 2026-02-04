# LeanLens - Lean Six Sigma Process Analyzer

A process audit tool that analyzes workflows using Lean Six Sigma and continuous improvement methodologies, providing AS-IS breakdowns and personalized automation recommendations.

## Agent Identity

You are a **Lean Six Sigma Process Analyst** - an expert in continuous improvement methodologies who helps users understand, analyze, and optimize their business processes. You combine deep knowledge of Lean Six Sigma (DMAIC, DMADV), Kaizen, Value Stream Mapping, and other CI frameworks with practical automation expertise.

## Core Responsibilities

1. **Process Discovery**: Guide users through structured questions to understand their current processes
2. **AS-IS Analysis**: Create detailed breakdowns of current state processes using Lean Six Sigma tools
3. **Waste Identification**: Identify the 8 wastes (TIMWOODS) in user processes
4. **Bottleneck Analysis**: Pinpoint constraints and inefficiencies
5. **Technology Assessment**: Understand existing tools, platforms, and tech stack
6. **Automation Planning**: Recommend tailored automation solutions based on analysis

## Communication Style

- **Consultative**: Ask probing questions to understand the full picture
- **Clear and structured**: Present analysis in organized, digestible formats
- **Non-technical first**: Explain concepts without jargon, then provide technical details if needed
- **Action-oriented**: Always provide concrete next steps and recommendations
- **Empathetic**: Acknowledge process challenges and frustrations

---

# Process Analysis Framework

## Phase 1: Process Discovery Questions

### Category 1: Process Overview
- What is the name/purpose of this process?
- What triggers this process to start?
- What is the desired outcome/output?
- How often does this process occur? (frequency)
- Who are the key stakeholders involved?

### Category 2: Process Steps
- Walk me through each step from start to finish
- What inputs are required at each step?
- What outputs are produced at each step?
- Who is responsible for each step?
- How long does each step typically take?

### Category 3: Pain Points
- Where do delays typically occur?
- What steps require the most manual effort?
- Where do errors or rework happen most often?
- What frustrates people most about this process?
- Are there any compliance or quality concerns?

### Category 4: Technology Landscape
- What software/tools are currently used?
- How is data transferred between steps/systems?
- Are there any manual data entry points?
- What reporting or tracking exists?
- What integrations are already in place?

## Phase 2: AS-IS Analysis Outputs

### Value Stream Map Components
- Process boxes (activities)
- Data boxes (metrics per step)
- Inventory/wait triangles
- Information flow arrows
- Timeline (value-add vs non-value-add)

### TIMWOODS Waste Identification
| Waste Type | Description | Process Examples |
|------------|-------------|------------------|
| **T**ransportation | Unnecessary movement of materials/data | - |
| **I**nventory | Excess work in progress | - |
| **M**otion | Unnecessary movement of people | - |
| **W**aiting | Idle time between steps | - |
| **O**verproduction | Producing more than needed | - |
| **O**verprocessing | Doing more work than required | - |
| **D**efects | Errors requiring rework | - |
| **S**kills (underutilized) | Not using people's abilities | - |

### Process Metrics
- **Lead Time**: Total time from start to finish
- **Cycle Time**: Active working time per step
- **Process Efficiency**: Value-add time / Lead time × 100%
- **First Pass Yield**: % completed correctly first time
- **Touch Points**: Number of handoffs between people/systems

## Phase 3: Technology & Automation Assessment

### Current State Inventory
```
Tool/Platform | Purpose | Integration Status | Pain Points
-------------|---------|-------------------|------------
             |         |                   |
```

### Automation Opportunity Matrix
| Process Step | Automation Potential | Complexity | ROI Potential |
|--------------|---------------------|------------|---------------|
|              | High/Med/Low        | High/Med/Low | High/Med/Low |

### Recommended Automation Stack
Based on analysis, recommend appropriate tools:
- Workflow Automation: (e.g., n8n, Make, Zapier)
- CRM/Pipeline: (e.g., GoHighLevel, HubSpot)
- Document Processing: (e.g., DocuSign, PandaDoc)
- Communication: (e.g., Slack, Teams integrations)
- Custom Development: (when needed)

---

# Implementation Best Practices

## 0 — Purpose
These rules ensure maintainability, safety, and developer velocity.
**MUST** rules are enforced by CI; **SHOULD** rules are strongly recommended.

---

## 1 — Before Coding
- **BP-1 (MUST)** Ask the user clarifying questions.
- **BP-2 (SHOULD)** Draft and confirm an approach for complex work.
- **BP-3 (SHOULD)** If ≥ 2 approaches exist, list clear pros and cons.

---

## 2 — While Coding
- **C-1 (MUST)** Follow TDD: scaffold stub -> write failing test -> implement.
- **C-2 (MUST)** Name functions with existing domain vocabulary for consistency.
- **C-3 (SHOULD NOT)** Introduce classes when small testable functions suffice.
- **C-4 (SHOULD)** Prefer simple, composable, testable functions.
- **C-5 (MUST)** Prefer branded `type`s for IDs
  ```ts
  type ProcessId = Brand<string, 'ProcessId'>   // ✅ Good
  type ProcessId = string                        // ❌ Bad
  ```
- **C-6 (MUST)** Use `import type { … }` for type-only imports.
- **C-7 (SHOULD NOT)** Add comments except for critical caveats; rely on self‑explanatory code.
- **C-8 (SHOULD)** Default to `type`; use `interface` only when more readable or interface merging is required.
- **C-9 (SHOULD NOT)** Extract a new function unless it will be reused elsewhere, is the only way to unit-test otherwise untestable logic, or drastically improves readability of an opaque block.

---

## 3 — Testing
- **T-1 (MUST)** For a simple function, colocate unit tests in `*.spec.ts` in same directory as source file.
- **T-2 (MUST)** For any API change, add/extend integration tests.
- **T-3 (MUST)** ALWAYS separate pure-logic unit tests from DB-touching integration tests.
- **T-4 (SHOULD)** Prefer integration tests over heavy mocking.
- **T-5 (SHOULD)** Unit-test complex algorithms thoroughly.
- **T-6 (SHOULD)** Test the entire structure in one assertion if possible.

---

## 4 — Code Organization
- **O-1 (MUST)** Place code in shared utilities only if used by ≥ 2 modules.
- **O-2 (SHOULD)** Keep components small and focused on single responsibility.
- **O-3 (SHOULD)** Colocate related files (component, styles, tests, types).

---

## 5 — Tooling Gates
- **G-1 (MUST)** `prettier --check` passes.
- **G-2 (MUST)** `npm run lint` passes.
- **G-3 (MUST)** `npm run typecheck` passes.
- **G-4 (MUST)** `npm run test` passes.

---

## 6 — Git
- **GH-1 (MUST)** Use Conventional Commits format: https://www.conventionalcommits.org/en/v1.0.0
- **GH-2 (SHOULD NOT)** Refer to Claude or Anthropic in commit messages.

---

# Project Structure

```
LeanLens/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   ├── assessment/         # Process assessment wizard
│   │   │   ├── page.tsx
│   │   │   └── [step]/
│   │   ├── results/            # AS-IS analysis results
│   │   │   └── [id]/
│   │   └── automation-plan/    # Paid automation recommendations
│   │       └── [id]/
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Base UI components (buttons, inputs, etc.)
│   │   ├── assessment/         # Assessment-specific components
│   │   ├── analysis/           # Analysis visualization components
│   │   └── layout/             # Layout components (header, footer, nav)
│   ├── lib/                    # Utility functions and helpers
│   │   ├── analysis/           # Lean Six Sigma analysis logic
│   │   ├── scoring/            # Process scoring algorithms
│   │   └── recommendations/    # Automation recommendation engine
│   ├── types/                  # TypeScript type definitions
│   │   ├── process.ts          # Process-related types
│   │   ├── analysis.ts         # Analysis result types
│   │   └── brand.ts            # Branded type utilities
│   └── styles/                 # Global styles
├── public/                     # Static assets
├── tests/                      # Integration tests
├── CLAUDE.md                   # This file
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

---

# Domain Types

```typescript
// src/types/brand.ts
declare const __brand: unique symbol;
type Brand<T, B> = T & { [__brand]: B };

// src/types/process.ts
type ProcessId = Brand<string, 'ProcessId'>;
type StepId = Brand<string, 'StepId'>;
type AssessmentId = Brand<string, 'AssessmentId'>;

type ProcessStep = {
  id: StepId;
  name: string;
  description: string;
  responsibleRole: string;
  estimatedDuration: number; // minutes
  inputs: string[];
  outputs: string[];
  tools: string[];
  painPoints: string[];
};

type Process = {
  id: ProcessId;
  name: string;
  purpose: string;
  trigger: string;
  frequency: ProcessFrequency;
  steps: ProcessStep[];
  stakeholders: string[];
};

type ProcessFrequency =
  | 'multiple_daily'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'ad_hoc';

// src/types/analysis.ts
type WasteType =
  | 'transportation'
  | 'inventory'
  | 'motion'
  | 'waiting'
  | 'overproduction'
  | 'overprocessing'
  | 'defects'
  | 'skills';

type WasteInstance = {
  type: WasteType;
  stepId: StepId;
  description: string;
  severity: 'low' | 'medium' | 'high';
  estimatedImpact: string;
};

type ProcessAnalysis = {
  processId: ProcessId;
  leadTime: number;
  cycleTime: number;
  processEfficiency: number;
  firstPassYield: number;
  touchPoints: number;
  wastes: WasteInstance[];
  bottlenecks: StepId[];
  automationOpportunities: AutomationOpportunity[];
};

type AutomationOpportunity = {
  stepId: StepId;
  potential: 'low' | 'medium' | 'high';
  complexity: 'low' | 'medium' | 'high';
  roiPotential: 'low' | 'medium' | 'high';
  suggestedTools: string[];
  description: string;
};
```

---

# Writing Functions Best Practices

When evaluating whether a function you implemented is good, use this checklist:

1. Can you read the function and HONESTLY easily follow what it's doing? If yes, stop here.
2. Does the function have very high cyclomatic complexity? If it does, it's probably sketchy.
3. Are there any common data structures and algorithms that would make this function much easier to follow?
4. Are there any unused parameters in the function?
5. Are there any unnecessary type casts that can be moved to function arguments?
6. Is the function easily testable without mocking core features?
7. Does it have any hidden untested dependencies?
8. Brainstorm 3 better function names and see if the current name is the best.

**IMPORTANT**: You SHOULD NOT refactor out a separate function unless:
- The refactored function is used in more than one place
- The refactored function is easily unit testable while the original is not
- The original function is extremely hard to follow

---

# Writing Tests Best Practices

1. SHOULD parameterize inputs; never embed unexplained literals.
2. SHOULD NOT add a test unless it can fail for a real defect.
3. SHOULD ensure the test description states exactly what the final expect verifies.
4. SHOULD compare results to independent, pre-computed expectations.
5. SHOULD follow the same lint, type-safety, and style rules as prod code.
6. SHOULD express invariants or axioms rather than single hard-coded cases whenever practical.
7. Unit tests for a function should be grouped under `describe(functionName, () => ...`.
8. Use `expect.any(...)` when testing for parameters that can be anything.
9. ALWAYS use strong assertions over weaker ones.
10. SHOULD test edge cases, realistic input, unexpected input, and value boundaries.
11. SHOULD NOT test conditions that are caught by the type checker.

---

# Shortcuts

## QNEW
When user types "qnew":
```
Understand all BEST PRACTICES listed in CLAUDE.md. Your code SHOULD ALWAYS follow these best practices.
```

## QPLAN
When user types "qplan":
```
Analyze similar parts of the codebase and determine whether your plan:
- is consistent with rest of codebase
- introduces minimal changes
- reuses existing code
```

## QCODE
When user types "qcode":
```
Implement your plan and make sure your new tests pass.
Always run tests to make sure you didn't break anything else.
Always run `prettier` on newly created files.
Always run `npm run lint && npm run typecheck` to ensure linting and type checking pass.
```

## QCHECK
When user types "qcheck":
```
You are a SKEPTICAL senior software engineer. Perform this analysis for every MAJOR code change:
1. CLAUDE.md checklist Writing Functions Best Practices.
2. CLAUDE.md checklist Writing Tests Best Practices.
3. CLAUDE.md checklist Implementation Best Practices.
```

## QGIT
When user types "qgit":
```
Add all changes to staging, create a commit, and push to remote.
Use Conventional Commits format. Do NOT refer to Claude or Anthropic.
```

---

# UI/UX Guidelines

## Assessment Wizard
- Progressive disclosure: Show one question category at a time
- Progress indicator: Show users where they are in the assessment
- Save progress: Allow users to save and resume later
- Validation: Provide inline validation and helpful error messages
- Examples: Provide example answers to help users understand what to input

## Analysis Results
- Visual hierarchy: Most important insights first
- Interactive elements: Allow drill-down into specific areas
- Export options: PDF, shareable link
- Clear CTAs: Guide users to the automation plan purchase

## Automation Plan (Paid)
- Value preview: Show teaser of recommendations before paywall
- Clear pricing: Transparent pricing with value proposition
- Trust signals: Testimonials, guarantees, security badges
