export type PassFail = 'pass' | 'fail' | null;
export type FormStatus = 'draft' | 'sent';

/** true = בוצע, false = לא בוצע, undefined/missing = טרם סומן. */
export interface ChecklistState {
  [itemId: string]: boolean | undefined;
}

export interface SkillEvaluation {
  skillId: string | null;
  evaluation: ChecklistState;
  notes: string;
}

export interface ExamForm {
  id: string;
  createdAt: number;
  updatedAt: number;
  status: FormStatus;

  examineeName: string;
  dutyNumber: string;
  branch: string;
  examinerName: string;
  examDate: string;

  part1: {
    checklist: ChecklistState;
    notes: string;
    result: PassFail;
  };

  part2: {
    skills: [SkillEvaluation, SkillEvaluation];
    notes: string;
    result: PassFail;
  };

  part3: {
    scenarioId: string | null;
    checklist: ChecklistState;
    notes: string;
  };
}

export interface ChecklistItem {
  id: string;
  label: string;
}

export function createBlankExamForm(): ExamForm {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    status: 'draft',
    examineeName: '',
    dutyNumber: '',
    branch: '',
    examinerName: '',
    examDate: new Date().toISOString().slice(0, 10),
    part1: { checklist: {}, notes: '', result: null },
    part2: {
      skills: [
        { skillId: null, evaluation: {}, notes: '' },
        { skillId: null, evaluation: {}, notes: '' },
      ],
      notes: '',
      result: null,
    },
    part3: { scenarioId: null, checklist: {}, notes: '' },
  };
}
