# Anwendungsrahmen – Nx-Monorepo

Angular-Anwendung im Nx-Workspace. Eine App (`anwendungsrahmen`) setzt die Shell und die fachlichen Module zusammen und wird heute als **ein** Artefakt deployt. Die Struktur ist so geschnitten, dass sich die Fachmodule später als eigene Micro-Frontends getrennt deployen lassen.

## Struktur

| Projekt (Nx)               | Pfad                            | Import-Pfad                                  | Tag            | Inhalt                                                          |
| -------------------------- | ------------------------------- | -------------------------------------------- | -------------- | --------------------------------------------------------------- |
| `anwendungsrahmen`         | `apps/anwendungsrahmen`         | –                                            | `type:app`     | Deploybare App, Register der Fachmodule, Routing                |
| `anwendungsrahmen-e2e`     | `apps/anwendungsrahmen-e2e`     | –                                            | `type:e2e`     | Playwright-Tests                                                |
| `anwendungsrahmen-shell`   | `libs/anwendungsrahmen`         | `@monorepo-test-ai/anwendungsrahmen`         | `type:shell`   | Shell (Kopf, Navigation, Inhaltsbereich) und Startseite         |
| `bestandsdaten`            | `libs/bestandsdaten`            | `@monorepo-test-ai/bestandsdaten`            | `type:feature` | Fachmodul, Beispielseite Vertragsübersicht                      |
| `provisionsdatenerfassung` | `libs/provisionsdatenerfassung` | `@monorepo-test-ai/provisionsdatenerfassung` | `type:feature` | Fachmodul, Beispielseite Provisionserfassung (Formular)         |
| `auswertung`               | `libs/auswertung`               | `@monorepo-test-ai/auswertung`               | `type:feature` | Fachmodul, Beispielseite Auswertung nach Sparte                 |
| `wuf`                      | `libs/wuf`                      | `@monorepo-test-ai/wuf`                      | `type:ui`      | Zusammengesetzte UI-Komponenten (Seitenkopf, Tabelle)           |
| `wub`                      | `libs/wub`                      | `@monorepo-test-ai/wub`                      | `type:base`    | Basis-Komponenten (Button, Card) und Design-Tokens (`wub.scss`) |
| `shared`                   | `libs/shared`                   | `@monorepo-test-ai/shared`                   | `type:shared`  | Navigationsvertrag, Fachtypen (`Sparte`), Formatierung          |

Nx-Projektnamen müssen eindeutig sein. Deshalb heißt die Shell-Lib im Nx-Graph `anwendungsrahmen-shell`, Ordner und Import-Pfad heißen aber `anwendungsrahmen`.

## Abhängigkeitsregeln

Die Regeln sind in `eslint.config.mjs` (`@nx/enforce-module-boundaries`) hinterlegt und werden beim Lint geprüft:

```
app ──► shell ──┐
 │              ├──► wuf ──► wub ──► shared
 └──► feature ──┘
```

- Fachmodule importieren sich **nicht** gegenseitig.
- Die Shell kennt **keine** Fachmodule. Sie bekommt ihre Navigation über das Token `NAVIGATION_ITEMS` aus `shared`.
- Nur die App kennt alle Fachmodule, und zwar ausschließlich über dynamische Imports in `apps/anwendungsrahmen/src/app/fachmodule.ts`.
- Jedes Fachmodul exportiert in seiner `index.ts` nur seine Routen (z. B. `bestandsdatenRoutes`).

## Befehle

```sh
npm start                       # Dev-Server auf http://localhost:4200
npm run build                   # Produktions-Build nach dist/apps/anwendungsrahmen
npx nx run-many -t lint test    # Lint und Unit-Tests aller Projekte
npx nx e2e anwendungsrahmen-e2e # Playwright (einmalig: npx playwright install)
npx nx graph                    # Abhängigkeitsgraph anzeigen
npx nx affected -t test         # nur betroffene Projekte testen
```

## Navigation

### Innerhalb eines Fachmoduls

Innerhalb eines Fachmoduls wird **relativ** navigiert. Das Modul kennt den Pfad nicht, unter dem die App es einhängt. Beispiel Bestandsdaten ([bestandsdaten.routes.ts](libs/bestandsdaten/src/lib/bestandsdaten.routes.ts)):

| Von → Nach                           | Umsetzung                                                             |
| ------------------------------------ | --------------------------------------------------------------------- |
| Übersicht → Detail                   | Link-Spalte der Tabelle: `link: (v) => [v.vertragsnummer]`            |
| Detail → Übersicht                   | `routerLink=".."`                                                     |
| Detail → gefilterte Übersicht        | `routerLink=".." [queryParams]="{ sparte: v.sparte }"`                |
| Übersicht → Filter setzen            | `routerLink="." [queryParams]="{ sparte: s }"`                        |
| Detail → nächster/vorheriger Vertrag | `router.navigate(['..', nr], { relativeTo: route })` (programmatisch) |

Routen- und Query-Parameter kommen per `withComponentInputBinding()` als Signal-Inputs in die Komponenten (`vertragsnummer = input.required<string>()`, `sparte = input<Sparte>()`).

### Mehrere Unterseiten in einem Bereich

Unterseiten eines Fachmoduls sind eigene Routen des Moduls und erscheinen als **Untermenü in der Side-Navigation**. Beispiel Provisionsdatenerfassung ([provisionsdatenerfassung.routes.ts](libs/provisionsdatenerfassung/src/lib/provisionsdatenerfassung.routes.ts)):

```
/provisionsdatenerfassung                →  Weiterleitung auf erfassen
/provisionsdatenerfassung/erfassen       →  Provisionen erfassen
/provisionsdatenerfassung/bezeichnungen  →  Provisionsbezeichnungen
```

- Die Menüeinträge stehen im App-Register [fachmodule.ts](apps/anwendungsrahmen/src/app/fachmodule.ts) unter `unterseiten`. Die Shell bekommt sie als `kinder` eines `NavigationItem` und klappt sie auf, solange der Bereich aktiv ist.
- Die Pfade der Unterseiten müssen zu den Routen der Lib passen. `app.spec.ts` prüft, dass jeder Menüpunkt auf eine existierende Route führt.
- Von einer Unterseite zur anderen innerhalb der Lib: `routerLink="../bezeichnungen"`.
- Beim Wechsel der Unterseite wird die Seitenkomponente zerstört. Daten, die den Wechsel überleben oder von beiden Unterseiten gebraucht werden, gehören in einen Service (hier `Provisionsbezeichnungen` und `ErfassteProvisionen`).
- Seiten mit Formularen schützt `ungespeicherteAenderungenGuard` aus `shared` (`canDeactivate`) vor versehentlichem Verlassen.

### Zwischen Fachmodulen

Fachmodule importieren sich nicht gegenseitig. Querverweise laufen über den **URL-Vertrag** in [verweise.ts](libs/shared/src/lib/verweise.ts):

- `FACHMODUL_PFADE` legt fest, unter welchem Pfad die App ein Fachmodul einhängt. [fachmodule.ts](apps/anwendungsrahmen/src/app/fachmodule.ts) verwendet genau diese Konstanten.
- `bestandsdatenVerweise` beschreibt die öffentlichen Einstiege von Bestandsdaten: `vertraege({ sparte })` und `vertrag(nr)`.
- Die Auswertung verlinkt damit auf die gefilterte Vertragsübersicht und auf einzelne Verträge, ohne Code aus Bestandsdaten zu importieren:
  ```html
  @let ziel = verweise.vertraege({ sparte: zeile.sparte });
  <a [routerLink]="ziel.pfad" [queryParams]="ziel.queryParams">…</a>
  ```

Weil nur URLs ausgetauscht werden, funktionieren die Verweise auch nach einer Aufteilung in getrennt deployte Module. Ändert ein Fachmodul eine öffentliche Route, muss es `verweise.ts` mit anpassen. Interne Routen, die niemand von außen anspringt, gehören nicht in den Vertrag.

## Neues Fachmodul hinzufügen

1. Lib erzeugen:
   ```sh
   npx nx g @nx/angular:library libs/<name> --name=<name> --importPath=@monorepo-test-ai/<name> --prefix=<kürzel> --tags="type:feature,scope:<name>" --style=scss
   ```
2. In `src/index.ts` nur die Routen exportieren (`export const <name>Routes: Route[]`).
3. Pfad in `FACHMODUL_PFADE` (`libs/shared/src/lib/verweise.ts`) ergänzen, bei Bedarf öffentliche Verweise dazu.
4. Eintrag in `apps/anwendungsrahmen/src/app/fachmodule.ts` ergänzen. Route und Navigation entstehen daraus automatisch.

## Später getrennt deployen (Module Federation)

Heute lädt die App jedes Fachmodul per `import()` als eigenen Lazy Chunk, deployt wird ein einziges Bundle. Für ein getrenntes Deployment:

1. Die App wird zum Host, jedes Fachmodul bekommt eine kleine Remote-App, die die Routen der Lib freigibt:
   ```sh
   npx nx g @nx/angular:setup-mf anwendungsrahmen --mfType=host
   npx nx g @nx/angular:remote apps/bestandsdaten-remote --host=anwendungsrahmen
   ```
   Im Remote wird `./Routes` auf `libs/bestandsdaten/src/index.ts` gemappt.
2. In `fachmodule.ts` wird nur die Ladefunktion getauscht:
   ```ts
   laden: () => loadRemote<typeof import('@monorepo-test-ai/bestandsdaten')>('bestandsdaten/Routes')
     .then((m) => m!.bestandsdatenRoutes),
   ```
3. Shell, `wuf`, `wub`, `shared` und Angular werden als Shared-Singletons konfiguriert, damit sie nur einmal geladen werden.

Das geht auch schrittweise: Einzelne Fachmodule können ausgelagert werden, während die übrigen weiter per `import()` im Host-Bundle bleiben. Code in den Libs muss dafür nicht geändert werden, weil die oben genannten Abhängigkeitsregeln schon heute gelten.
