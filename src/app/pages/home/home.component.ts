import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExamForm } from '../../models/exam-form.model';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  forms = signal<ExamForm[]>([]);

  constructor(private storage: StorageService) {
    this.refresh();
  }

  refresh(): void {
    this.forms.set(this.storage.getRecent());
  }

  deleteForm(form: ExamForm, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!confirm(`למחוק את הטופס של ${form.examineeName || 'ללא שם'}?`)) return;
    this.storage.remove(form.id);
    this.refresh();
  }

  formattedTime(ts: number): string {
    return new Date(ts).toLocaleString('he-IL');
  }
}
