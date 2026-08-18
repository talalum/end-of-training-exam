import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExamForm, PassFail } from '../../models/exam-form.model';
import { StorageService } from '../../services/storage.service';
import { ShareService } from '../../services/share.service';
import {
  EMERGENCY_EVALUATION_CRITERIA,
  EMERGENCY_SCENARIOS,
  PART1_CHECKLIST,
  SKILL_EVALUATION_CRITERIA,
  TRAUMA_SKILLS,
} from '../../config/exam-config';

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

  model!: ExamForm;
  savedMessage = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
    private share: ShareService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.model = this.storage.getById(id) ?? this.storage.createBlank();
    } else {
      this.model = this.storage.createBlank();
      this.storage.save(this.model);
      this.router.navigate(['/form', this.model.id], { replaceUrl: true });
    }
  }

  inputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  toggleChecklist(bucket: Record<string, boolean>, itemId: string): void {
    bucket[itemId] = !bucket[itemId];
    this.save();
  }

  setResult(target: 'part1' | 'part2', value: PassFail): void {
    this.model[target].result = value;
    this.save();
  }

  save(showToast = false): void {
    this.model.updatedAt = Date.now();
    this.storage.save(this.model);
    if (showToast) {
      this.savedMessage.set('הטיוטה נשמרה');
      setTimeout(() => this.savedMessage.set(null), 2000);
    }
  }

  sendEmail(): void {
    this.model.status = 'sent';
    this.save();
    window.location.href = this.share.buildMailtoUrl(this.model);
  }

  sendWhatsApp(): void {
    this.model.status = 'sent';
    this.save();
    window.open(this.share.buildWhatsAppUrl(this.model), '_blank');
  }

  async copyFullText(): Promise<void> {
    await navigator.clipboard.writeText(this.share.buildSummaryText(this.model));
    this.savedMessage.set('התוכן המלא הועתק ללוח');
    setTimeout(() => this.savedMessage.set(null), 2000);
  }

  deleteAndExit(): void {
    if (!confirm('למחוק את הטופס? לא ניתן לשחזר.')) return;
    this.storage.remove(this.model.id);
    this.router.navigate(['/']);
  }
}
