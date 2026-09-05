import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = signal<string | null>(null);
  loading = signal(false);

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  async onSubmit(): Promise<void> {
    this.errorMessage.set(null);
    this.loading.set(true);
    try {
      await this.auth.login(this.email.trim(), this.password);
      this.router.navigate(['/']);
    } catch {
      this.errorMessage.set('אימייל או סיסמה שגויים.');
    } finally {
      this.loading.set(false);
    }
  }
}
