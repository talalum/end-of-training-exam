import { Component, Input } from '@angular/core';
import { ExamForm } from '../../models/exam-form.model';
import { checkMark, findLabel, resultLabel } from '../../services/share.service';
import {
  EMERGENCY_EVALUATION_CRITERIA,
  EMERGENCY_SCENARIOS,
  PART1_CHECKLIST,
  SKILL_EVALUATION_CRITERIA,
  TRAUMA_SKILLS,
} from '../../config/exam-config';

@Component({
  selector: 'app-exam-summary-card',
  standalone: true,
  templateUrl: './exam-summary-card.component.html',
  styleUrl: './exam-summary-card.component.scss',
})
export class ExamSummaryCardComponent {
  @Input({ required: true }) form!: ExamForm;

  readonly part1Items = PART1_CHECKLIST;
  readonly skillCriteria = SKILL_EVALUATION_CRITERIA;
  readonly scenarioCriteria = EMERGENCY_EVALUATION_CRITERIA;
  readonly skillIndexes = [0, 1] as const;

  readonly checkMark = checkMark;
  readonly resultLabel = resultLabel;

  skillLabel(skillId: string | null): string {
    return findLabel(TRAUMA_SKILLS, skillId);
  }

  scenarioLabel(scenarioId: string | null): string {
    return findLabel(EMERGENCY_SCENARIOS, scenarioId);
  }
}
