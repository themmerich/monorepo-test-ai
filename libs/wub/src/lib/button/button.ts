import { Directive, input } from '@angular/core';

export type WubButtonVariante = 'primaer' | 'sekundaer';

/** Basis-Button. Verwendung: `<button wubButton variante="sekundaer">` */
@Directive({
  selector: 'button[wubButton], a[wubButton]',
  host: {
    class: 'wub-button',
    '[class.wub-button--sekundaer]': "variante() === 'sekundaer'",
  },
})
export class WubButton {
  readonly variante = input<WubButtonVariante>('primaer');
}
