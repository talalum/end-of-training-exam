import { Injectable } from '@angular/core';
import { ExamForm } from '../models/exam-form.model';
import {
  EMAIL_RECIPIENTS,
  EMERGENCY_EVALUATION_CRITERIA,
  EMERGENCY_SCENARIOS,
  PART1_CHECKLIST,
  SKILL_EVALUATION_CRITERIA,
  TRAUMA_SKILLS,
  WHATSAPP_SHARE_PHONE,
} from '../config/exam-config';
import { ChecklistItem } from '../models/exam-form.model';

const resultLabel = (r: 'pass' | 'fail' | null): string =>
  r === 'pass' ? 'עבר' : r === 'fail' ? 'לא עבר' : 'לא צויין';

const findLabel = (items: ChecklistItem[], id: string | null): string =>
  items.find((i) => i.id === id)?.label ?? 'לא נבחר';

const checklistLines = (items: ChecklistItem[], state: Record<string, boolean>): string =>
  items.map((i) => `${state[i.id] ? '☑' : '☐'} ${i.label}`).join('\n');

@Injectable({ providedIn: 'root' })
export class ShareService {
  buildSummaryText(form: ExamForm): string {
    const lines: string[] = [];
    lines.push("צ'ק ליסט לבוחן – מבחן מסכם בסיום השתלמות");
    lines.push('');
    lines.push(`שם הנבחן: ${form.examineeName || '-'}`);
    lines.push(`שם הבוחן: ${form.examinerName || '-'}`);
    lines.push(`תאריך: ${form.examDate || '-'}`);
    lines.push('');
    lines.push('== חלק 1 – החייאה ==');
    lines.push(checklistLines(PART1_CHECKLIST, form.part1.checklist));
    lines.push(`הערות: ${form.part1.notes || '-'}`);
    lines.push(`תוצאה: ${resultLabel(form.part1.result)}`);
    lines.push('');
    lines.push('== חלק 2 – מיומנויות טראומה ==');
    form.part2.skills.forEach((skill, idx) => {
      lines.push(`מיומנות ${idx + 1}: ${findLabel(TRAUMA_SKILLS, skill.skillId)}`);
      lines.push(checklistLines(SKILL_EVALUATION_CRITERIA, skill.evaluation));
      lines.push(`הערות: ${skill.notes || '-'}`);
      lines.push('');
    });
    lines.push(`הערות הבוחן (כללי): ${form.part2.notes || '-'}`);
    lines.push(`תוצאה: ${resultLabel(form.part2.result)}`);
    lines.push('');
    lines.push('== חלק 3 – מצבי חירום רפואיים ==');
    lines.push(`התרחיש שנבחר: ${findLabel(EMERGENCY_SCENARIOS, form.part3.scenarioId)}`);
    lines.push(checklistLines(EMERGENCY_EVALUATION_CRITERIA, form.part3.checklist));
    lines.push(`הערות: ${form.part3.notes || '-'}`);
    return lines.join('\n');
  }

  buildMailtoUrl(form: ExamForm): string {
    const subject = `מבחן מסכם - ${form.examineeName || 'ללא שם'} - ${form.examDate}`;
    const body = this.buildSummaryText(form);
    const to = EMAIL_RECIPIENTS.join(',');
    return `mailto:${encodeURIComponent(to).replace(/%2C/g, ',')}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  buildWhatsAppUrl(form: ExamForm): string {
    const text = this.buildSummaryText(form);
    const base = WHATSAPP_SHARE_PHONE
      ? `https://wa.me/${WHATSAPP_SHARE_PHONE}`
      : 'https://wa.me/';
    return `${base}?text=${encodeURIComponent(text)}`;
  }
}
