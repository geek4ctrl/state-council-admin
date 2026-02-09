import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = buildErrorMessage(error);
      toastService.error(message);
      return throwError(() => error);
    })
  );
};

function buildErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'Network error. Please check your connection and try again.';
  }

  if (typeof error.error === 'string' && error.error.trim().length > 0) {
    return error.error;
  }

  const apiMessage = error.error?.message || error.error?.error || error.message;
  if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) {
    return apiMessage;
  }

  return 'Something went wrong. Please try again.';
}
