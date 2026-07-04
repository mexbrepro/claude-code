# Immersive Story — Anleitung für Schüler:innen

Dieser Ordner enthält eine **durchgängige, multimediale Scroll-Erzählung**
(Scrollytelling im Stil von *Snowfall*) für den **SWARCO Young Mobility
Ambassador Award 2027**. Ihr braucht dafür **keinen Programmcode zu
schreiben** — ihr pflegt eure Inhalte an einer einzigen Stelle.

Aufrufbar ist die Story im Browser unter **`/story`**.

## Wo pflege ich was?

| Was ihr ändern wollt | Datei |
|----------------------|-------|
| **Alle Texte, Kapitel, Zahlen, Einbettungen** | `story.config.ts` |
| Bilder / Hero-Bild | Datei in `public/story/` ablegen, im Config den Pfad `/story/dateiname.jpg` eintragen |

Die restlichen Dateien (`page.tsx`, `layout.tsx`, `../../components/story/*`)
sind das **Gerüst und die Templates** — die müsst ihr normalerweise nicht
anfassen.

## Die Bausteine (Templates)

In `story.config.ts` besteht jedes Kapitel aus „blocks“. Diese Typen gibt es:

- **`prose`** — normaler Erzähltext mit optionaler Überschrift.
- **`pullquote`** — großes, hervorgehobenes Zitat.
- **`stats`** — bis zu drei Kennzahlen, die beim Scrollen hochzählen.
- **`scrolly`** — Schritt-für-Schritt-Animation (linke Grafik bleibt stehen,
  rechts scrollt der Ablauf durch). Ideal z. B. für „Bremsweg / Blindflug“.
- **`fullBleed`** — bildschirmfüllendes Foto mit Text darüber.
- **`embed`** — ein Knight-Lab-Tool (TimelineJS, Juxtapose, StoryMap) oder
  jedes andere iframe.

Ihr könnt Bausteine beliebig anordnen, kopieren oder weglassen.

## Die Stimmung eines Kapitels (Farbpalette)

Jedes Kapitel bekommt in `story.config.ts` eine `palette` — mal dunkel und
satt für intensive Themen, mal hell und pastellig für ruhigere, reflektierende
Momente:

| Palette | Wirkung | Bisher verwendet für |
|---|---|---|
| `duskAmber` | Schwarz, warmes Amber | Prolog |
| `midnightTeal` | Dunkles Petrol/Türkis | Die Chronik |
| `crimsonDark` | Dunkles Rot | Crashtest |
| `violetNight` | Dunkles Violett | Das Handy |
| `pastelMint` | Helles Mintgrün | Alkohol |
| `pastelDawn` | Helles Warmbeige | Epilog |

Ändert einfach den Wert von `palette: "..."` bei einem Kapitel, um die
Stimmung zu wechseln — der Rest (Text, Kontrast, Akzentfarbe) passt sich
automatisch an. Alle Paletten sind in `palettes.ts` definiert; dort könnt ihr
auch neue hinzufügen, wenn ihr eine eigene Farbwelt für ein Kapitel wollt.

## Knight-Lab-Tools einbinden

1. Baut euer Tool auf der jeweiligen Website:
   - **TimelineJS** → <https://timeline.knightlab.com> (aus einem **Google
     Sheet** — jede:r pflegt eine Zeile = ein Meilenstein)
   - **Juxtapose** (vorher/nachher) → <https://juxtapose.knightlab.com>
   - **StoryMapJS** (Karte oder Gigapixel-Bild) → <https://storymap.knightlab.com>
2. Klickt dort auf **„Share“ / „Embed“** und kopiert die **URL** aus dem
   `src="…"` des angebotenen iframe-Codes.
3. Fügt diese URL in `story.config.ts` beim passenden `embed`-Block als
   `src: "…"` ein.

Solange `src` leer ist, zeigt die Seite automatisch eine kurze Einbau-
Anleitung an — es bricht also nichts.

## Bilder & Videos aus Google Drive

- Ladet Medien in einen Drive-Ordner, Freigabe **„Jeder mit dem Link“**.
- Für die **Knight-Lab-Tools** könnt ihr die Drive-/YouTube-Links direkt dort
  einfügen.
- Für Bilder in dieser Story am besten in `public/story/` ablegen (dann
  laden sie am schnellsten und zuverlässigsten).

## Vorschau starten

```bash
npm run dev
# dann im Browser: http://localhost:3000/story
```
