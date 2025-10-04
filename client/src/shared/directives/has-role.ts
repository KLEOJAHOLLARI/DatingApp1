import {
  Directive,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AccountService } from '../../core/services/account-service';

@Directive({
  selector: '[appHasRole]',
})
export class HasRole implements OnInit {
  @Input() appHasRole: string[] = [];
  private accountServie = inject(AccountService);
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);

  ngOnInit(): void {
    if (
      this.accountServie
        .currentUser()
        ?.roles?.some((r) => this.appHasRole.includes(r))
    ) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }
}
