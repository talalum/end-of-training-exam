import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ExamForm } from '../../models/exam-form.model';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  forms = signal<ExamForm[]>([]);
  loading = signal(true);

  constructor(
    private storage: StorageService,
    protected authService: AuthService,
    private router: Router
  ) {
    this.refresh();
  }

  async refresh(): Promise<void> {
    this.loading.set(true);
    this.forms.set(await this.storage.getAll());
    this.loading.set(false);
  }

  async deleteForm(form: ExamForm, event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    if (!confirm(`למחוק את הטופס של ${form.examineeName || 'ללא שם'}?`)) return;
    await this.storage.remove(form.id);
    await this.refresh();
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  formattedTime(ts: number): string {
    return new Date(ts).toLocaleString('he-IL');
  }
}
