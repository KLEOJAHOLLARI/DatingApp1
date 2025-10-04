import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account-service';
import { ToastService } from '../services/toast-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountServie = inject(AccountService);
  const toast = inject(ToastService);

  if (
    accountServie.currentUser()?.roles.includes('Admin') ||
    accountServie.currentUser()?.roles.includes('Moderator')
  ) {
    return true;
  } else {
    toast.error('Enter this area,you cannot');
    return false;
  }
};
