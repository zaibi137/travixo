import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

type LoginView = 'login' | 'forgotPassword' | 'otpEntry' | 'newPassword';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  view = signal<LoginView>('login');

  // ---------- Login ----------
  userId = signal(''); // this is now the email
  password = signal('');
  showPassword = signal(false);
  errorMessage = signal('');
  isLoading = signal(false);

  // ---------- Forgot password (email step) ----------
  resetEmail = signal('');
  resetUserCode = signal('');
  isSendingReset = signal(false);
  resetMessage = signal('');

  // ---------- OTP + new password step ----------
  otpLength = 4;
  otpDigits = signal<string[]>(Array(this.otpLength).fill(''));
  otpCode = computed(() => this.otpDigits().join(''));
  newPassword = signal('');
  showNewPassword = signal(false);
  confirmPassword = signal('');
  showConfirmPassword = signal(false);
  isResettingPassword = signal(false);

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    if (this.auth.isAuthenticated()) {
      void this.router.navigateByUrl('/dashboard');
    }
  }

  // Visibility Toggle Methods
  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword.set(!this.showNewPassword());
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  // Helper getter to ensure User Code is never empty if typed on login page
  private getEffectiveUserCode(): string {
    return (this.resetUserCode().trim() || this.userId().trim());
  }

  // ---------- Login submit ----------
  submit(): void {
    if (!this.userId().trim()) {
      this.errorMessage.set('Please enter your email.');
      return;
    }

    if (!this.password().trim()) {
      this.errorMessage.set('Please enter password.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.auth.login(this.userId().trim(), this.password().trim()).subscribe({
      next: (success) => {
        this.isLoading.set(false);
        if (success) {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
          void this.router.navigateByUrl(returnUrl);
        } else {
          this.errorMessage.set('Invalid email or password.');
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Login error:', error);
        this.errorMessage.set(error?.error?.message || error?.error?.detail || 'Login failed. Please try again.');
      }
    });
  }

  // ---------- View switching ----------
  toggleForgotPassword(): void {
    const nextView = this.view() === 'forgotPassword' ? 'login' : 'forgotPassword';
    this.view.set(nextView);
    this.errorMessage.set('');
    this.resetMessage.set('');

    // Pre-fill resetUserCode from login userId if available
    if (nextView === 'forgotPassword' && !this.resetUserCode() && this.userId()) {
      this.resetUserCode.set(this.userId());
    }
  }

  backToLogin(): void {
    this.view.set('login');
    this.errorMessage.set('');
    this.resetMessage.set('');
    this.resetEmail.set('');
    this.resetUserCode.set('');
    this.resetOtpAndPasswordFields();
  }

  private resetOtpAndPasswordFields(): void {
    this.otpDigits.set(Array(this.otpLength).fill(''));
    this.newPassword.set('');
    this.confirmPassword.set('');
    this.showPassword.set(false);
    this.showNewPassword.set(false);
    this.showConfirmPassword.set(false);  
  }

  private isValidEmail(email: string): boolean {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  }

  // ---------- Step 1: request OTP by email ----------
  submitForgotPassword(): void {
    const email = this.resetEmail().trim();
    const userCode = this.getEffectiveUserCode();

    if (!userCode) {
      this.errorMessage.set('User code is required.');
      return;
    }

    if (!this.isValidEmail(email)) {
      this.errorMessage.set('Please enter a valid email address.');
      return;
    }

    this.isSendingReset.set(true);
    this.errorMessage.set('');
    this.resetMessage.set('');

    this.auth.forgotPassword(email, userCode).subscribe({
      next: (result) => {
        this.isSendingReset.set(false);

        if (result.success) {
          this.resetOtpAndPasswordFields();
          this.view.set('otpEntry');
        } else {
          this.errorMessage.set(result.message || 'Failed to send reset instructions.');
        }
      },
      error: () => {
        this.isSendingReset.set(false);
        this.errorMessage.set('Failed to send reset instructions.');
      }
    });
  }

  resendOtp(): void {
    this.submitForgotPasswordSilently();
  }

  private submitForgotPasswordSilently(): void {
    const email = this.resetEmail().trim();
    const userCode = this.getEffectiveUserCode();

    if (!this.isValidEmail(email) || !userCode) {
      this.errorMessage.set('Email and User Code are required to resend OTP.');
      return;
    }

    this.isSendingReset.set(true);
    this.errorMessage.set('');

    this.auth.forgotPassword(email, userCode).subscribe({
      next: (result) => {
        this.isSendingReset.set(false);
        this.resetMessage.set(result.success ? 'A new OTP has been sent to your email.' : '');
        if (!result.success) {
          this.errorMessage.set(result.message || 'Failed to resend OTP.');
        }
      },
      error: () => {
        this.isSendingReset.set(false);
        this.errorMessage.set('Failed to resend OTP.');
      }
    });
  }

  // ---------- OTP box handling ----------
  trackByIndex(index: number): number {
    return index;
  }

  onOtpInput(event: Event, index: number): void {
    const inputEl = event.target as HTMLInputElement;
    const digit = inputEl.value.replace(/[^0-9]/g, '').slice(-1);

    const current = [...this.otpDigits()];
    current[index] = digit;
    this.otpDigits.set(current);

    if (digit) {
      const next = inputEl.nextElementSibling as HTMLInputElement | null;
      next?.focus();
    }
  }

  onOtpKeydown(event: KeyboardEvent, index: number): void {
    const inputEl = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !inputEl.value) {
      const prev = inputEl.previousElementSibling as HTMLInputElement | null;
      prev?.focus();
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    const pasted = event.clipboardData?.getData('text').replace(/[^0-9]/g, '') ?? '';
    if (!pasted) return;

    event.preventDefault();
    const digits = pasted.slice(0, this.otpLength).split('');
    const current = Array(this.otpLength).fill('');
    digits.forEach((d, i) => (current[i] = d));
    this.otpDigits.set(current);
  }

  // ---------- Step 2: Verify OTP ----------
  verifyOtp(): void {
    const userCode = this.getEffectiveUserCode();

    if (this.otpCode().length !== this.otpLength) {
      this.errorMessage.set(`Please enter the full ${this.otpLength}-digit code.`);
      return;
    }

    if (!userCode) {
      this.errorMessage.set('User code is required.');
      return;
    }

    this.errorMessage.set('');

    this.auth.verifyResetToken(this.otpCode(), userCode).subscribe({
      next: (result) => {
        if (result.success) {
          this.view.set('newPassword');
        } else if (result.message === 'verify-not-supported') {
          this.errorMessage.set('OTP will be validated when resetting your password.');
        } else {
          this.errorMessage.set(result.message || 'Invalid or expired code.');
        }
      },
      error: (err) => {
        console.error('Verify OTP error:', err);
        this.errorMessage.set('Failed to verify code. Please try again.');
      }
    });
  }

  // ---------- Step 3: Set New Password ----------
  submitResetPassword(): void {
    const userCode = this.getEffectiveUserCode();

    if (this.otpCode().length !== this.otpLength) {
      this.errorMessage.set(`Please enter the full ${this.otpLength}-digit code.`);
      this.view.set('otpEntry');
      return;
    }

    if (!this.newPassword() || this.newPassword().length < 6) {
      this.errorMessage.set('New password must be at least 6 characters.');
      return;
    }

    if (this.newPassword() !== this.confirmPassword()) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    this.isResettingPassword.set(true);
    this.errorMessage.set('');

    this.auth.resetPassword(this.otpCode(), this.newPassword(), userCode).subscribe({
      next: (result) => {
        this.isResettingPassword.set(false);

        if (result.success) {
          this.resetMessage.set('Password reset successfully. Please log in with your new password.');
          this.resetUserCode.set('');
          this.resetEmail.set('');
          this.resetOtpAndPasswordFields();
          this.view.set('login');
        } else {
          this.errorMessage.set(result.message || 'Invalid or expired code.');
          this.view.set('otpEntry');
        }
      },
      error: () => {
        this.isResettingPassword.set(false);
        this.errorMessage.set('Failed to reset password.');
      }
    });
  }
}