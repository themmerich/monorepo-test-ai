import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface WufSpalte<T> {
  key: keyof T & string;
  label: string;
  /** Optionale Formatierung des Zellwerts */
  format?: (wert: T[keyof T]) => string;
  ausrichtung?: 'links' | 'rechts';
}

/** Einfache Tabelle für Listen fachlicher Daten. */
@Component({
  selector: 'wuf-data-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table>
      <thead>
        <tr>
          @for (spalte of spalten(); track spalte.key) {
            <th [class.rechts]="spalte.ausrichtung === 'rechts'">
              {{ spalte.label }}
            </th>
          }
        </tr>
      </thead>
      <tbody>
        @for (zeile of zeilen(); track $index) {
          <tr>
            @for (spalte of spalten(); track spalte.key) {
              <td [class.rechts]="spalte.ausrichtung === 'rechts'">
                {{ anzeige(zeile, spalte) }}
              </td>
            }
          </tr>
        } @empty {
          <tr>
            <td class="leer" [attr.colspan]="spalten().length">
              {{ leerText() }}
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: `
    :host {
      display: block;
      overflow-x: auto;
      background: var(--wub-farbe-flaeche);
      border: 1px solid var(--wub-farbe-rahmen);
      border-radius: var(--wub-radius);
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th,
    td {
      padding: 0.6rem var(--wub-abstand-m);
      text-align: left;
      border-bottom: 1px solid var(--wub-farbe-rahmen);
    }
    th {
      font-size: 0.85rem;
      color: var(--wub-farbe-text-leise);
    }
    tbody tr:last-child td {
      border-bottom: none;
    }
    .rechts {
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
    .leer {
      color: var(--wub-farbe-text-leise);
      text-align: center;
    }
  `,
})
export class WufDataTable<T extends object> {
  readonly spalten = input.required<WufSpalte<T>[]>();
  readonly zeilen = input.required<readonly T[]>();
  readonly leerText = input('Keine Einträge vorhanden');

  protected anzeige(zeile: T, spalte: WufSpalte<T>): string {
    const wert = zeile[spalte.key];
    return spalte.format ? spalte.format(wert) : String(wert ?? '');
  }
}
