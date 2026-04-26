// Learning cards (spec §3.2). Modular, one-screen, ~2-3 minute reads.
// Cards are pulled, never pushed.
//
// First ten cards cover Mindell core + a Levy bridge + DF + plurality —
// the minimum-viable explanation set for a returning seeker.

import type { Locale } from "@/lib/claude/system-prompt";

export type CardTag =
  | "mindell"
  | "levy"
  | "df"
  | "plurality"
  | "edge"
  | "essence"
  | "dreambody";

export type LearningCard = {
  id: string;
  slug: string;
  tags: CardTag[];
  related: string[];
  title: Record<Locale, string>;
  body: Record<Locale, string>;
};

export const LEARNING_CARDS: LearningCard[] = [
  {
    id: "three-levels",
    slug: "three-levels-of-experience",
    tags: ["mindell"],
    related: ["dreambody", "edges-edge-figures", "essence"],
    title: {
      en: "The Three Levels of Experience",
      de: "Die drei Ebenen der Erfahrung",
    },
    body: {
      en:
        "Mindell describes three levels at which any moment can be lived. Consensus reality is what we agree on: the body in the chair, the time on the clock, the conversation as anyone could record it. Dreamland is the level of images, atmospheres, double signals — the pulling in your chest, the figure that appeared in last night's dream, the feeling that someone is angry even though they say they aren't. Essence is the deepest layer: a felt direction underneath both, often non-verbal, pre-image, almost a tendency. Inner work moves between these levels. The same moment is differently true at each.",
      de:
        "Mindell unterscheidet drei Ebenen, auf denen jeder Moment gelebt werden kann. Die Konsensrealität ist das, worüber wir uns einigen können: der Körper im Stuhl, die Uhrzeit, das Gespräch wie es jemand aufzeichnen würde. Das Dreamland ist die Ebene der Bilder, Atmosphären, Doppelbotschaften — das Ziehen in der Brust, die Gestalt aus dem Traum, das Gefühl, dass jemand wütend ist, obwohl er es leugnet. Die Essenz ist die tiefste Schicht: eine gespürte Richtung darunter, oft vorsprachlich, vorbildlich, fast eine Tendenz. Innere Arbeit bewegt sich zwischen diesen Ebenen. Der gleiche Moment ist auf jeder Ebene anders wahr.",
    },
  },
  {
    id: "edges-edge-figures",
    slug: "edges-and-edge-figures",
    tags: ["mindell", "edge"],
    related: ["three-levels", "primary-secondary"],
    title: {
      en: "Edges and Edge Figures",
      de: "Kanten und Kantenfiguren",
    },
    body: {
      en:
        "An edge is the threshold of your identified self — the place where what wants to be lived meets what you can imagine yourself living. Edge language sounds like 'I would never,' 'that's not me,' 'I can't.' On the other side of the edge is something secondary: a part of you that is real but hasn't crossed over yet. The figure that holds the edge — the inner voice that says no — is the edge figure. It is not the enemy. It usually carries something protective. Inner work doesn't push past the edge. It listens to the edge figure first.",
      de:
        "Eine Kante ist die Schwelle deines identifizierten Selbst — der Ort, an dem das, was gelebt werden will, auf das trifft, was du dir vorstellen kannst zu leben. Kantensprache klingt wie 'Ich würde nie,' 'das bin nicht ich,' 'ich kann nicht.' Auf der anderen Seite der Kante steht etwas Sekundäres: ein Teil von dir, der real ist, aber noch nicht hinübergekommen ist. Die Figur, die die Kante hält — die innere Stimme, die nein sagt — ist die Kantenfigur. Sie ist nicht der Feind. Meist trägt sie etwas Schützendes. Innere Arbeit drängt nicht über die Kante. Sie hört zuerst der Kantenfigur zu.",
    },
  },
  {
    id: "primary-secondary",
    slug: "primary-and-secondary-process",
    tags: ["mindell"],
    related: ["edges-edge-figures", "double-signals"],
    title: {
      en: "Primary and Secondary Process",
      de: "Primärer und sekundärer Prozess",
    },
    body: {
      en:
        "What you identify with is your primary process: 'I am calm,' 'I am responsible,' 'I am the one who handles things.' What is happening alongside but outside your identity is your secondary process: the irritation in your jaw while you say you're calm, the exhaustion under the responsibility, the wish that someone else would handle things this once. Both are real. The secondary is not a flaw to fix; it is information about a part of the self that hasn't been fully welcomed. The work is not to swap them, but to widen the room enough to hold both.",
      de:
        "Womit du dich identifizierst, ist dein primärer Prozess: 'Ich bin ruhig,' 'Ich bin verantwortlich,' 'Ich bin diejenige, die das regelt.' Was daneben, aber außerhalb deiner Identität geschieht, ist dein sekundärer Prozess: die Anspannung im Kiefer, während du sagst, du seist ruhig; die Erschöpfung unter der Verantwortung; der Wunsch, dass es diesmal jemand anders übernimmt. Beide sind real. Das Sekundäre ist kein Mangel, der behoben werden muss; es ist Information über einen Teil des Selbst, der noch nicht ganz willkommen geheißen wurde. Die Arbeit besteht nicht darin, sie zu tauschen, sondern den Raum so zu weiten, dass beide Platz haben.",
    },
  },
  {
    id: "double-signals",
    slug: "double-signals",
    tags: ["mindell"],
    related: ["primary-secondary", "flirts"],
    title: {
      en: "Double Signals",
      de: "Doppelbotschaften",
    },
    body: {
      en:
        "A double signal is when what is said and what is shown don't quite match. You say you are fine and your shoulders rise toward your ears. You say you are done with this and your voice softens with something like longing. Mindell saw double signals as the body's way of holding both processes at once — the primary in words, the secondary in tone, posture, gesture. In inner work, naming the double signal as observation (not interpretation) lets both halves into the room without choosing one over the other.",
      de:
        "Eine Doppelbotschaft entsteht, wenn das Gesagte und das Gezeigte nicht ganz übereinstimmen. Du sagst, dir geht es gut, und deine Schultern wandern Richtung Ohren. Du sagst, du seist fertig damit, und deine Stimme wird weicher, fast sehnsüchtig. Mindell verstand Doppelbotschaften als die Art des Körpers, beide Prozesse gleichzeitig zu halten — den primären in Worten, den sekundären in Ton, Haltung, Geste. In der inneren Arbeit lässt das Benennen der Doppelbotschaft als Beobachtung (nicht als Deutung) beide Hälften herein, ohne dass eine die andere überstimmt.",
    },
  },
  {
    id: "flirts",
    slug: "flirts",
    tags: ["mindell"],
    related: ["dreambody", "double-signals"],
    title: {
      en: "Flirts",
      de: "Flirts",
    },
    body: {
      en:
        "A flirt is what catches your attention without explanation. The bird outside the window. The phrase that sticks. The face in the crowd that pulls your eye. Mindell used the word to point at the moment before you decide whether to take something seriously — the lightest touch of dreamland on consensus reality. Flirts are easily dismissed: 'just a coincidence,' 'I'm imagining things.' In inner work, the flirt is a doorway. You don't have to walk through; you just notice it is there.",
      de:
        "Ein Flirt ist das, was deine Aufmerksamkeit ohne Erklärung fängt. Der Vogel draußen. Der Satz, der hängenbleibt. Das Gesicht in der Menge, das deinen Blick zieht. Mindell verwendete das Wort, um den Moment zu beschreiben, bevor du entscheidest, ob du etwas ernst nimmst — die leichteste Berührung des Dreamlands auf der Konsensrealität. Flirts werden leicht abgetan: 'nur Zufall,' 'ich bilde mir was ein.' In der inneren Arbeit ist der Flirt eine Tür. Du musst nicht hindurchgehen; du bemerkst nur, dass sie da ist.",
    },
  },
  {
    id: "dreambody",
    slug: "the-dreambody",
    tags: ["mindell", "dreambody"],
    related: ["three-levels", "flirts"],
    title: {
      en: "The Dreambody",
      de: "Der Traumkörper",
    },
    body: {
      en:
        "Mindell's term for the body that doesn't separate physical sensation from dream and image. The headache and the figure in last night's dream are the same process showing up in different registers. The pulling in your chest is not only a feeling, not only a metaphor — it is a body's way of dreaming. Working with the dreambody means treating sensations as carriers of meaning the way one treats dreams: not interpreting, listening. The pulling, when listened to, often has its own picture, its own direction, its own next.",
      de:
        "Mindells Begriff für den Körper, der körperliche Empfindung nicht von Traum und Bild trennt. Der Kopfschmerz und die Figur aus dem nächtlichen Traum sind derselbe Prozess in unterschiedlichen Registern. Das Ziehen in der Brust ist nicht nur ein Gefühl, nicht nur eine Metapher — es ist eine Art des Körpers zu träumen. Mit dem Traumkörper zu arbeiten heißt, Empfindungen als Bedeutungsträger zu behandeln, wie man Träume behandelt: nicht deutend, sondern hörend. Das Ziehen hat, wenn man ihm zuhört, oft ein eigenes Bild, eine eigene Richtung, ein eigenes Nächstes.",
    },
  },
  {
    id: "deep-democracy",
    slug: "deep-democracy-as-an-inner-principle",
    tags: ["mindell"],
    related: ["primary-secondary", "we-flection"],
    title: {
      en: "Deep Democracy as an Inner Principle",
      de: "Deep Democracy als innere Haltung",
    },
    body: {
      en:
        "Mindell's deep democracy is the assumption that every voice in a system has something to contribute, including the voices we'd rather not hear. As an outer politics it gives space to minority experience. As an inner principle it gives space to the parts of yourself that the dominant self would rather mute: the part that is tired, the part that is angry, the part that says enough. Deep democracy doesn't choose between them. It widens until everyone in the room — including the inner room — gets to speak.",
      de:
        "Mindells Deep Democracy ist die Annahme, dass jede Stimme in einem System etwas beizutragen hat — auch die Stimmen, die wir lieber nicht hören würden. Als äußere Politik gibt sie Minderheitserfahrungen Raum. Als innere Haltung gibt sie den Teilen von dir Raum, die das dominante Selbst lieber stummschalten würde: dem müden Teil, dem zornigen Teil, dem Teil, der genug sagt. Deep Democracy wählt nicht zwischen ihnen. Sie weitet den Raum, bis alle im Raum — auch im inneren Raum — zu Wort kommen.",
    },
  },
  {
    id: "observer-effect",
    slug: "the-observer-effect-in-personal-experience",
    tags: ["levy"],
    related: ["dreambody", "three-levels"],
    title: {
      en: "The Observer Effect in Personal Experience",
      de: "Der Beobachtereffekt in persönlicher Erfahrung",
    },
    body: {
      en:
        "In quantum physics the act of observation participates in what is observed. Levy's bridge is that this is not only a fact about particles; it is a structure of experience. How you watch your inner life shapes what comes forward. A vigilant, judging observer brings out a different inner population than a curious, unhurried one. This is not magical thinking; it is the description of a relationship. The point is not to manipulate the inner life by 'observing it differently' — the point is to notice that the quality of attention is part of what is happening.",
      de:
        "In der Quantenphysik wirkt die Beobachtung am Beobachteten mit. Levys Brücke: das ist nicht nur eine Aussage über Teilchen, sondern eine Struktur der Erfahrung. Wie du dein Inneres betrachtest, prägt, was sich zeigt. Ein wachsamer, urteilender Beobachter ruft eine andere innere Bevölkerung hervor als eine neugierige, ruhige. Das ist keine Magie; es ist die Beschreibung einer Beziehung. Es geht nicht darum, das Innere durch 'anderes Beobachten' zu manipulieren — sondern darum zu bemerken, dass die Qualität der Aufmerksamkeit Teil dessen ist, was geschieht.",
    },
  },
  {
    id: "what-is-df",
    slug: "what-is-dynamic-facilitation",
    tags: ["df"],
    related: ["we-flection", "wisdom-council"],
    title: {
      en: "What is Dynamic Facilitation",
      de: "Was ist Dynamic Facilitation",
    },
    body: {
      en:
        "Dynamic Facilitation, developed by Jim Rough, is a way of working with groups that holds the messiness of a real conversation rather than tidying it. The facilitator listens for four kinds of contribution — solutions, concerns, data, problem-statements — and writes each in its own chart, in the speaker's own words. There is no agenda, no orderly turn-taking, no forcing toward consensus. People speak when they have something to say. The charts collect the field. Out of the collection, a new shape often arises — one that no single voice could have predicted. We-Flection is this practice translated for one person: you are the group, and your inner multiplicity is what gets heard.",
      de:
        "Dynamic Facilitation, entwickelt von Jim Rough, ist eine Art, mit Gruppen zu arbeiten, die die Unordnung eines echten Gesprächs aushält, statt sie zu glätten. Die Begleitung hört auf vier Arten von Beiträgen — Lösungen, Anliegen, Daten, Problemstellungen — und schreibt jeden in seine eigene Tafel, in den Worten der Sprechenden. Keine Tagesordnung, kein geordnetes Wortrotieren, kein Drängen zum Konsens. Menschen sprechen, wenn sie etwas zu sagen haben. Die Tafeln sammeln das Feld. Aus dem Gesammelten entsteht oft eine neue Form — eine, die keine einzelne Stimme hätte vorhersagen können. We-Flection ist diese Praxis für eine Person übersetzt: du bist die Gruppe, und deine innere Vielstimmigkeit kommt zu Wort.",
    },
  },
  {
    id: "plurality",
    slug: "plurality-and-tang",
    tags: ["plurality"],
    related: ["deep-democracy", "what-is-df"],
    title: {
      en: "Plurality and Audrey Tang's Work",
      de: "Plurality und die Arbeit von Audrey Tang",
    },
    body: {
      en:
        "Audrey Tang, working in Taiwan and beyond, treats plurality as the political practice of holding many voices at once without collapsing them into a single answer. Tools like Pol.is map the topology of disagreement so that consensus can grow where it is real and difference can stay visible where it is not. The horizon of inner work meets plurality at the moment the user's own multiplicity matures into the question of we — when the room widens beyond the self and other people are in it. Dynamic Companion holds this as a horizon, not a destination. When it is time, the app points outward.",
      de:
        "Audrey Tang, deren Arbeit in Taiwan und darüber hinaus wirkt, versteht Plurality als politische Praxis, viele Stimmen zugleich zu halten, ohne sie in eine einzelne Antwort kollabieren zu lassen. Werkzeuge wie Pol.is kartieren die Topologie von Uneinigkeit — Konsens kann wachsen, wo er echt ist, Differenz darf sichtbar bleiben, wo er es nicht ist. Der Horizont innerer Arbeit trifft Plurality in dem Moment, in dem die eigene Vielstimmigkeit zur Frage des Wir reift — wenn der Raum sich über das Selbst hinaus weitet und andere Menschen darin sind. Dynamic Companion hält das als Horizont, nicht als Ziel. Wenn die Zeit reif ist, zeigt die App nach außen.",
    },
  },
];

export function getCardBySlug(slug: string): LearningCard | undefined {
  return LEARNING_CARDS.find((c) => c.slug === slug);
}
