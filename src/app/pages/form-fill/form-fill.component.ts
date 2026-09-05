import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExamForm, PassFail } from '../../models/exam-form.model';
import { ExamsRepository } from '../../services/exams-repository';
import { ShareService } from '../../services/share.service';
import { DEMO_MODE, ROUTE_BASE } from '../../tokens';
import {
  EMERGENCY_EVALUATION_CRITERIA,
  EMERGENCY_SCENARIOS,
  PART1_CHECKLIST,
  SKILL_EVALUATION_CRITERIA,
  TRAUMA_SKILLS,
} from '../../config/exam-config';

interface ValidationError {
  key: string;
  label: string;
}

@Component({
  selector: 'app-form-fill',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './form-fill.component.html',
  styleUrl: './form-fill.component.scss',
})
export class FormFillComponent implements OnInit {
  readonly part1Items = PART1_CHECKLIST;
  readonly skillOptions = TRAUMA_SKILLS;
  readonly skillCriteria = SKILL_EVALUATION_CRITERIA;
  readonly scenarioOptions = EMERGENCY_SCENARIOS;
  readonly scenarioCriteria = EMERGENCY_EVALUATION_CRITERIA;
  readonly skillIndexes = [0, 1] as const;

  protected routeBase = inject(ROUTE_BASE);
  protected isDemo = inject(DEMO_MODE);

  model!: ExamForm;
  savedMessage = signal<string | null>(null);
  validationMessage = signal<string | null>(null);
  invalidFieldKeys = signal<ReadonlySet<string>>(new Set());

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: ExamsRepository,
    private share: ShareService
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.model = (await this.storage.getById(id)) ?? this.storage.createBlank();
      this.model.dutyNumber ??= '';
      this.model.branch ??= '';
    } else {
      this.model = this.storage.createBlank();
      await this.storage.save(this.model);
      this.router.navigate([`${this.routeBase}/form`, this.model.id], { replaceUrl: true });
    }
  }

  inputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  setChecklistValue(bucket: Record<string, boolean | undefined>, itemId: string, value: boolean): void {
    bucket[itemId] = value;
    this.save();
  }

  setResult(target: 'part1' | 'part2', value: PassFail): void {
    this.model[target].result = value;
    this.save();
  }

  isInvalid(key: string): boolean {
    return this.invalidFieldKeys().has(key);
  }

  get isFormComplete(): boolean {
    return this.computeErrors().length === 0;
  }

  async save(showToast = false): Promise<void> {
    this.model.updatedAt = Date.now();
    await this.storage.save(this.model);
    if (showToast) {
      this.savedMessage.set('הטיוטה נשמרה');
      setTimeout(() => this.savedMessage.set(null), 2000);
    }
  }

  onSendEmailClick(): void {
    this.attemptShare(async () => {
      this.model.status = 'sent';
      await this.save();
      window.location.href = this.share.buildMailtoUrl(this.model);
    });
  }

  onSendWhatsAppClick(): void {
    this.attemptShare(async () => {
      this.model.status = 'sent';
      await this.save();
      window.open(this.share.buildWhatsAppUrl(this.model), '_blank');
    });
  }

  onCopyFullTextClick(): void {
    this.attemptShare(async () => {
      await navigator.clipboard.writeText(this.share.buildSummaryText(this.model));
      this.savedMessage.set('התוכן המלא הועתק ללוח');
      setTimeout(() => this.savedMessage.set(null), 2000);
    });
  }

  async deleteAndExit(): Promise<void> {
    if (!confirm('למחוק את הטופס? לא ניתן לשחזר.')) return;
    await this.storage.remove(this.model.id);
    this.router.navigate([this.routeBase || '/']);
  }

  private attemptShare(action: () => void | Promise<void>): void {
    const errors = this.computeErrors();
    if (errors.length > 0) {
      this.invalidFieldKeys.set(new Set(errors.map((e) => e.key)));
      this.validationMessage.set(
        `יש למלא את השדות הבאים לפני השיתוף: ${errors.map((e) => e.label).join(', ')}`
      );
      const firstEl = document.getElementById(errors[0].key);
      firstEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstEl?.focus();
      return;
    }
    this.invalidFieldKeys.set(new Set());
    this.validationMessage.set(null);
    action();
  }

  private computeErrors(): ValidationError[] {
    const errors: ValidationError[] = [];
    const m = this.model;

    if (!m.examineeName.trim()) errors.push({ key: 'examinee-name', label: 'שם הנבחן' });
    if (!m.dutyNumber.trim()) errors.push({ key: 'duty-number', label: 'מספר כונן' });
    if (!m.branch.trim()) errors.push({ key: 'branch', label: 'סניף' });
    if (!m.examinerName.trim()) errors.push({ key: 'examiner-name', label: 'שם הבוחן' });
    if (!m.examDate) errors.push({ key: 'exam-date', label: 'תאריך' });

    for (const item of this.part1Items) {
      if (m.part1.checklist[item.id] === undefined) {
        errors.push({ key: `part1-check-${item.id}`, label: `${item.label} (חלק 1)` });
      }
    }
    if (!m.part1.notes.trim()) errors.push({ key: 'part1-notes', label: 'הערות הבוחן (חלק 1)' });
    if (!m.part1.result) errors.push({ key: 'part1-result', label: 'תוצאה (חלק 1)' });

    this.skillIndexes.forEach((i) => {
      const skill = m.part2.skills[i];
      if (!skill.skillId) {
        errors.push({ key: `part2-skill-${i}-select`, label: `מיומנות ${i + 1}` });
      }
      for (const item of this.skillCriteria) {
        if (skill.evaluation[item.id] === undefined) {
          errors.push({
            key: `part2-skill-${i}-check-${item.id}`,
            label: `${item.label} (מיומנות ${i + 1})`,
          });
        }
      }
      if (!skill.notes.trim()) {
        errors.push({ key: `part2-skill-${i}-notes`, label: `הערות למיומנות ${i + 1}` });
      }
    });
    if (!m.part2.notes.trim()) errors.push({ key: 'part2-notes', label: 'הערות הבוחן (חלק 2)' });
    if (!m.part2.result) errors.push({ key: 'part2-result', label: 'תוצאה (חלק 2)' });

    if (!m.part3.scenarioId) errors.push({ key: 'part3-scenario', label: 'התרחיש שנבחר' });
    for (const item of this.scenarioCriteria) {
      if (m.part3.checklist[item.id] === undefined) {
        errors.push({ key: `part3-check-${item.id}`, label: `${item.label} (חלק 3)` });
      }
    }
    if (!m.part3.notes.trim()) errors.push({ key: 'part3-notes', label: 'הערות הבוחן (חלק 3)' });

    return errors;
  }
}
