import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ExamForm } from '../../models/exam-form.model';
import { ExamsRepository } from '../../services/exams-repository';
import { AuthService } from '../../services/auth.service';
import { DEMO_MODE, ROUTE_BASE } from '../../tokens';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  protected routeBase = inject(ROUTE_BASE);
  protected isDemo = inject(DEMO_MODE);

  forms = signal<ExamForm[]>([]);
  loading = signal(true);

  constructor(
    private storage: ExamsRepository,
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
