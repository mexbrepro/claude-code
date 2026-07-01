/**
 * ────────────────────────────────────────────────────────────────────────
 *  DIE STORY — zentrale Inhaltsdatei
 * ────────────────────────────────────────────────────────────────────────
 *
 *  Hier pflegt ihr (Schüler:innen) die GESAMTE Erzählung. Ihr müsst dafür
 *  keinen Programmcode verstehen — ihr ändert nur die Texte, Zahlen und
 *  Links zwischen den Anführungszeichen.
 *
 *  Grundregeln:
 *   • Text immer zwischen "Anführungszeichen" lassen.
 *   • Zeilen enden mit einem Komma.
 *   • Bilder/Videos ladet ihr in Google Drive (Freigabe: "Jeder mit Link"),
 *     bei Bildern nehmt ihr am besten den direkten Link oder ladet sie in
 *     den Ordner /public/story/ dieses Projekts (dann Pfad "/story/bild.jpg").
 *   • Knight-Lab-Tools (TimelineJS, Juxtapose, StoryMap) baut ihr auf den
 *     jeweiligen Websites, kopiert dort den "iframe / embed"-Link und fügt
 *     ihn hier als `src` ein. Mehr dazu unten bei den Kapiteln.
 *
 *  Die einzelnen Bausteine ("blocks") sind Vorlagen (Templates). Ihr könnt
 *  sie beliebig anordnen, weglassen oder mehrfach verwenden.
 * ────────────────────────────────────────────────────────────────────────
 */

export type StoryBlock =
  | { type: "prose"; kicker?: string; heading?: string; body: string[] }
  | { type: "pullquote"; quote: string; cite?: string }
  | { type: "fullBleed"; image: string; caption?: string; heading?: string; body?: string }
  | { type: "stats"; heading?: string; items: { value: number; suffix?: string; label: string }[] }
  | { type: "embed"; tool: "timeline" | "juxtapose" | "storymap" | "other"; src: string; title: string; heightVh?: number; note?: string }
  | { type: "scrolly"; heading?: string; steps: { label: string; big: string; body: string }[] };

export type Chapter = {
  id: string;        // eindeutige Kurz-ID, nur Kleinbuchstaben, für die Navigation
  nav: string;       // Beschriftung in der Kapitel-Navigation
  title: string;     // große Kapitelüberschrift
  accent?: "amber" | "red" | "sky" | "emerald"; // Signalfarbe des Kapitels
  blocks: StoryBlock[];
};

export const story = {
  meta: {
    title: "SEKUNDEN",
    subtitle:
      "Wie ein paar Zehntelsekunden über Leben entscheiden – und wie die Technik gelernt hat, sie uns zurückzugeben.",
    // Untertitel/Projektzuordnung – für den SWARCO Young Mobility Ambassador Award 2027.
    footerNote: "Ein multimediales Projekt · SWARCO Young Mobility Ambassador Award 2027",
    heroImage: "/story/hero.jpg", // in /public/story/ ablegen (Platzhalter, s. Reveal-Fallback)
    authors: "Klasse … · Schule …",
  },

  chapters: [
    // ───────────────────────────── PROLOG ─────────────────────────────
    {
      id: "prolog",
      nav: "Prolog",
      title: "Zwei Zehntelsekunden",
      accent: "amber",
      blocks: [
        {
          type: "prose",
          kicker: "Prolog",
          body: [
            "Ein Mensch bei Tempo 50 legt in einer einzigen Sekunde fast vierzehn Meter zurück. In der Zeit, die du brauchst, um diesen Satz zu Ende zu lesen, wäre ein Auto längst über die Kreuzung.",
            "Die Geschichte der Verkehrssicherheit ist die Geschichte eines Kampfes um genau diese Momente – erzählt in Gurten, Knautschzonen und Millisekunden.",
          ],
        },
        {
          type: "pullquote",
          quote:
            "Sicherheit ist nicht die Abwesenheit von Gefahr. Sie ist die Summe tausender guter Entscheidungen, die jemand vor uns getroffen hat.",
        },
      ],
    },

    // ───────────────────── KAPITEL 1 · DIE CHRONIK ─────────────────────
    {
      id: "chronik",
      nav: "Die Chronik",
      title: "Die Chronik der Sicherheit",
      accent: "sky",
      blocks: [
        {
          type: "prose",
          kicker: "Kapitel 1",
          heading: "Von Berta Benz bis zum Notbremsassistenten",
          body: [
            "1888 fuhr Bertha Benz als erster Mensch über Land – ohne Gurt, ohne Bremskraftverstärker, ohne alles. Seither hat jede Generation ein Stück Sicherheit hinzugefügt.",
            "Recherchiert zu jedem Meilenstein eine kleine Geschichte: Wer hat es erfunden? Welcher Unfall gab den Anstoß? Was kam zuerst im Rennsport – und wanderte dann in die Serie?",
          ],
        },
        {
          // TimelineJS: Erstellt eure Zeitleiste auf https://timeline.knightlab.com
          // aus einem Google Sheet, klickt auf "Share" / "Embed", kopiert die
          // iframe-URL (steht im src="…") und fügt sie hier ein.
          type: "embed",
          tool: "timeline",
          title: "Meilensteine der Fahrzeugsicherheit seit 1888",
          src: "", // ← hier eure TimelineJS-Embed-URL einsetzen
          heightVh: 78,
          note: "Erstellt aus einem Google Sheet auf timeline.knightlab.com – jede:r Schüler:in pflegt eine Zeile = ein Meilenstein.",
        },
        {
          type: "stats",
          heading: "Was diese Erfindungen bewirkt haben",
          items: [
            { value: 21332, label: "Verkehrstote in Deutschland 1970" },
            { value: 2839, label: "Verkehrstote 2023 – trotz weit mehr Verkehr" },
            { value: 87, suffix: "%", label: "weniger Getötete pro gefahrenem Kilometer" },
          ],
        },
      ],
    },

    // ─────────────────── KAPITEL 2 · VORHER / NACHHER ──────────────────
    {
      id: "crashtest",
      nav: "Vorher/Nachher",
      title: "60 Jahre in einem Aufprall",
      accent: "red",
      blocks: [
        {
          type: "prose",
          kicker: "Kapitel 2",
          body: [
            "Schiebt den Regler und seht, was sechs Jahrzehnte Entwicklung bedeuten: dieselbe Geschwindigkeit, ein völlig anderes Ergebnis für die Menschen im Auto.",
          ],
        },
        {
          // Juxtapose: zwei Bilder vorher/nachher auf
          // https://juxtapose.knightlab.com erstellen, Embed-URL einfügen.
          type: "embed",
          tool: "juxtapose",
          title: "Crashtest 1959 gegen heute",
          src: "", // ← hier eure Juxtapose-Embed-URL einsetzen
          heightVh: 70,
          note: "Zwei Bilder (alt/neu) auf juxtapose.knightlab.com hochladen – Bilder z. B. aus eurem Google-Drive-Ordner.",
        },
      ],
    },

    // ─────────────── KAPITEL 3 · DIE DROGE NR. 1: DAS HANDY ────────────
    {
      id: "handy",
      nav: "Das Handy",
      title: "Die Droge Nr. 1",
      accent: "amber",
      blocks: [
        {
          type: "prose",
          kicker: "Kapitel 3",
          heading: "Zwei Sekunden Blick aufs Display",
          body: [
            "Eine kurze Nachricht zu lesen dauert im Schnitt zwei Sekunden. Bei Tempo 50 fährst du in dieser Zeit blind – scrollt weiter und seht, wie weit.",
          ],
        },
        {
          // Scrollytelling-Template: linke Grafik bleibt stehen, während
          // rechts die Schritte durchscrollen. Ideal für einen Ablauf.
          type: "scrolly",
          heading: "Blindflug",
          steps: [
            { label: "0,0 s", big: "0 m", body: "Der Blick geht aufs Display. Alles wirkt sicher, die Straße ist frei." },
            { label: "1,0 s", big: "14 m", body: "Eine gute Reaktionszeit später – aber du hast noch gar nicht reagiert. Du liest noch." },
            { label: "2,0 s", big: "28 m", body: "Zwei Sekunden Nachricht: eine komplette Fußgängerüberquerung im Blindflug." },
            { label: "+ Bremsweg", big: "≈ 41 m", body: "Erst jetzt beginnt das Bremsen. Zusammen fast die Länge eines Schwimmbeckens." },
          ],
        },
        {
          type: "stats",
          heading: "Ablenkung in Zahlen",
          items: [
            { value: 2, suffix: " s", label: "durchschnittlicher Blick aufs Handy" },
            { value: 28, suffix: " m", label: "blind gefahrene Strecke bei Tempo 50" },
            { value: 3, suffix: "×", label: "höheres Unfallrisiko beim Tippen am Steuer" },
          ],
        },
        {
          type: "pullquote",
          quote: "Niemand würde freiwillig die Augen schließen und 28 Meter weiterfahren. Genau das tut ein Blick aufs Display.",
        },
      ],
    },

    // ───────────────────── KAPITEL 4 · ALKOHOL ─────────────────────────
    {
      id: "alkohol",
      nav: "Alkohol",
      title: "Der Rechenfehler",
      accent: "emerald",
      blocks: [
        {
          type: "prose",
          kicker: "Kapitel 4",
          heading: "Warum sich Fahrtüchtigkeit nicht ausrechnen lässt",
          body: [
            "Es ist verlockend, eine App zu bauen, die sagt: 'Jetzt darfst du wieder fahren.' Wir haben uns bewusst dagegen entschieden – und das ist die eigentliche Botschaft dieses Kapitels.",
            "Der Abbau von Alkohol schwankt von Mensch zu Mensch stark. Jede Zahl, die 'sicher' verspricht, ist eine gefährliche Schätzung. Unser Tool zeigt deshalb nicht, WANN du fahren darfst, sondern WIE LANGE dich der Alkohol wirklich begleitet.",
          ],
        },
        {
          type: "pullquote",
          quote: "Die ehrlichste Antwort eines Promille-Rechners ist: 'Das kann dir niemand seriös versprechen.'",
          cite: "Leitgedanke unseres Aufklärungs-Tools",
        },
        {
          type: "prose",
          body: [
            "→ Hier bindet ihr später das selbst gebaute Aufklärungs-Tool ein (kein Knight-Lab-Werkzeug, sondern eine kleine eigene Web-App). Es simuliert den Alkohol­abbau nach der Widmark-Formel als ANSCHAULICHE Illustration – mit klarem Hinweis, dass es keine Fahrempfehlung gibt.",
          ],
        },
      ],
    },

    // ───────────────────────── EPILOG ─────────────────────────────────
    {
      id: "epilog",
      nav: "Epilog",
      title: "Die nächste Sekunde gehört dir",
      accent: "amber",
      blocks: [
        {
          type: "prose",
          kicker: "Epilog",
          body: [
            "Jede Sicherheitstechnik in diesem Projekt hat einmal als Idee begonnen – oft, weil jemand einen Unfall nicht noch einmal erleben wollte.",
            "Die nächste Erfindung könnte von euch kommen. Die nächste gute Entscheidung ganz sicher.",
          ],
        },
      ],
    },
  ] satisfies Chapter[],
};

export type Story = typeof story;
