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
