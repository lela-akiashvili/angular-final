import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appHostListeners]',
  standalone: true
})
export class HostListenersDirective {

  constructor() { }
@HostListener('mouseover') hover(){
  
}
}
