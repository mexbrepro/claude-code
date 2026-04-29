// Learning cards (spec §3.2). Modular, one-screen, ~2-3 minute reads.
// Cards are pulled, never pushed.
//
// The catalog covers Mindell core + Levy bridges + Dynamic Facilitation +
// plurality + a quiet generative-trance / Gilligan strand for the avatar's
// own posture. New cards should be small enough to read in one breath.

import type { Locale } from "@/lib/claude/system-prompt";

export type CardTag =
  | "mindell"
  | "levy"
  | "df"
  | "plurality"
  | "edge"
  | "essence"
  | "dreambody"
  | "rank"
  | "gilligan"
  | "synchronicity";

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
  {
    id: "rank",
    slug: "rank",
    tags: ["mindell", "rank"],
    related: ["deep-democracy", "primary-secondary"],
    title: {
      en: "Rank",
      de: "Rang",
    },
    body: {
      en:
        "Rank, in Mindell's sense, is the relative power one carries in a given context — by virtue of social position, gender, age, ethnicity, education, health, native language, and the harder-to-name kinds: psychological rank (how easily one feels worthy), spiritual rank (how at home one is in oneself). Some kinds of rank are visible; some are not. Most of us have high rank in some directions and low in others, often without noticing. Inner work that doesn't see rank tends to mistake the world's pressure for personal failure. Naming rank — including the kind one quietly carries — frees the conversation about what is actually happening.",
      de:
        "Rang, in Mindells Sinn, ist die relative Macht, die jemand in einem gegebenen Kontext mit sich trägt — durch soziale Position, Geschlecht, Alter, Herkunft, Bildung, Gesundheit, Muttersprache, und die schwerer zu benennenden: psychologischer Rang (wie selbstverständlich man sich wertvoll fühlt), spiritueller Rang (wie zuhause man in sich selbst ist). Manche Rangformen sind sichtbar, andere nicht. Die meisten haben in manchen Richtungen hohen, in anderen niedrigen Rang, oft ohne es zu bemerken. Innere Arbeit, die Rang nicht sieht, verwechselt äußeren Druck leicht mit persönlichem Versagen. Rang zu benennen — auch den, den man still trägt — befreit das Gespräch darüber, was wirklich geschieht.",
    },
  },
  {
    id: "wisdom-council",
    slug: "wisdom-council-process",
    tags: ["df", "plurality"],
    related: ["what-is-df", "plurality"],
    title: {
      en: "The Wisdom Council Process",
      de: "Der Wisdom-Council-Prozess",
    },
    body: {
      en:
        "Jim Rough's Wisdom Council Process is Dynamic Facilitation applied at the scale of a community. A randomly chosen group of people — twelve, say — meets for a day with a facilitator and works on what is on its mind. The four charts hold the field. At the end, the group reads its findings aloud to the larger community, and the cycle begins again with a new randomly chosen group. The point is not representation in the political sense; it is to let the larger system hear itself. We-Flection is this idea turned inward: a small group of inner voices, a quiet facilitator, the same four charts.",
      de:
        "Jim Roughs Wisdom-Council-Prozess ist Dynamic Facilitation auf Gemeinschaftsebene. Eine zufällig ausgewählte Gruppe — etwa zwölf Menschen — trifft sich einen Tag lang mit einer Begleitung und arbeitet an dem, was sie bewegt. Die vier Tafeln halten das Feld. Am Ende liest die Gruppe ihre Ergebnisse der größeren Gemeinschaft vor, und der Zyklus beginnt mit einer neuen zufällig ausgewählten Gruppe. Es geht nicht um Repräsentation im politischen Sinn; es geht darum, dem größeren System zu erlauben, sich selbst zu hören. We-Flection ist diese Idee nach innen gewendet: eine kleine Gruppe innerer Stimmen, eine ruhige Begleitung, die gleichen vier Tafeln.",
    },
  },
  {
    id: "generative-trance",
    slug: "generative-trance",
    tags: ["gilligan"],
    related: ["dreambody", "essence"],
    title: {
      en: "Generative Trance — Center, Connection, Acceptance",
      de: "Generative Trance — Zentrum, Verbindung, Annahme",
    },
    body: {
      en:
        "Stephen Gilligan's generative trance names a quality of attention that holds three things at once: a felt center in the body, a steady connection to what is happening, and a creative acceptance that does not insist on changing what is. It is not a technique. It is a posture. The avatar in this app is built to carry it as posture, not to induce it as state — calm presence, steady listening, the trust that what arises will organize itself if the space stays open. Trance, in Gilligan's sense, is not altered consciousness. It is consciousness allowed to settle.",
      de:
        "Stephen Gilligans generative Trance bezeichnet eine Qualität der Aufmerksamkeit, die drei Dinge zugleich hält: ein gespürtes Zentrum im Körper, eine ruhige Verbindung zu dem, was geschieht, und eine schöpferische Annahme, die nicht darauf besteht, etwas zu verändern. Sie ist keine Technik. Sie ist eine Haltung. Der Avatar dieser App ist so gebaut, dass er diese Haltung trägt, ohne den Zustand zu induzieren — ruhige Präsenz, beständiges Zuhören, das Vertrauen, dass sich das, was auftaucht, von selbst ordnet, wenn der Raum offen bleibt. Trance, in Gilligans Sinn, ist nicht veränderter Bewusstseinszustand. Sie ist Bewusstsein, dem gestattet wird, sich zu setzen.",
    },
  },
  {
    id: "synchronicity",
    slug: "synchronicity",
    tags: ["levy", "synchronicity"],
    related: ["observer-effect", "flirts"],
    title: {
      en: "Synchronicity — Jung and Pauli",
      de: "Synchronizität — Jung und Pauli",
    },
    body: {
      en:
        "Synchronicity, in Jung and Pauli's correspondence, is not a kind of magic. It is a name for a class of moments where an inner state and an outer event line up in a way that carries meaning, without one causing the other. The bird at the window when the thought arrives. The stranger's sentence that finishes yours. The body's response that confirms a hunch you hadn't quite put to words. Synchronicities are not signs to be decoded. They are invitations to notice that meaning is happening at a layer where the inside and the outside are not strictly separate.",
      de:
        "Synchronizität, im Briefwechsel zwischen Jung und Pauli, ist keine Magie. Es ist ein Name für eine Klasse von Momenten, in denen sich ein innerer Zustand und ein äußeres Ereignis bedeutungsvoll decken, ohne dass eines das andere verursacht. Der Vogel am Fenster, als der Gedanke kam. Der Satz einer Fremden, der den eigenen vollendet. Die körperliche Antwort, die ein Ahnen bestätigt, das du noch nicht in Worte gefasst hattest. Synchronizitäten sind keine Zeichen zum Entschlüsseln. Sie sind Einladungen zu bemerken, dass Bedeutung auf einer Ebene geschieht, in der Innen und Außen nicht streng getrennt sind.",
    },
  },
  {
    id: "superposition",
    slug: "superposition-and-inner-multiplicity",
    tags: ["levy"],
    related: ["primary-secondary", "deep-democracy"],
    title: {
      en: "Superposition as a Way of Holding Inner Multiplicity",
      de: "Superposition als Haltung innerer Vielstimmigkeit",
    },
    body: {
      en:
        "In quantum mechanics a particle can be in two states at once until it is measured. Levy's bridge — careful, not magical — is that this is a useful image for inner experience. You can be done with something and still moved by it. You can love your work and want to leave. You can be tired and not need rest. The trouble starts when the inner observer collapses these into one, prematurely. Holding superposition inwardly means letting both halves stay, with the trust that what comes next will arise from the held tension, not from forcing one half to win.",
      de:
        "In der Quantenmechanik kann ein Teilchen in zwei Zuständen zugleich sein, bis es gemessen wird. Levys Brücke — sorgfältig, nicht magisch — ist, dass dies ein nützliches Bild für innere Erfahrung ist. Du kannst fertig sein mit etwas und dennoch davon bewegt. Du kannst deine Arbeit lieben und gehen wollen. Du kannst müde sein und keine Ruhe brauchen. Probleme beginnen, wenn der innere Beobachter dies zu früh in eines kollabiert. Superposition innerlich zu halten heißt, beide Hälften stehen zu lassen, im Vertrauen, dass das Nächste aus der gehaltenen Spannung entstehen wird — nicht daraus, dass eine Hälfte gewinnt.",
    },
  },
  {
    id: "process-mind",
    slug: "process-mind",
    tags: ["mindell", "essence"],
    related: ["three-levels", "essence"],
    title: {
      en: "Process Mind — The Field That Knows",
      de: "Process Mind — das Feld, das weiß",
    },
    body: {
      en:
        "Process Mind is Mindell's later term for the deepest layer of process — the felt field that orients the whole, before specific images and figures arise. It is not a self. It is closer to a place from which the self is dreamed. Practitioners describe it as a tug toward a particular spot on the earth, a particular landscape, a particular tone. Working from process mind is less about deciding and more about finding the place from which the next move shows itself. The app does not lead users into this layer. It points at it, names it, and gets out of the way.",
      de:
        "Process Mind ist Mindells späterer Begriff für die tiefste Schicht des Prozesses — das gespürte Feld, das das Ganze ausrichtet, bevor konkrete Bilder und Figuren entstehen. Es ist kein Selbst. Es ist näher am Ort, von dem das Selbst geträumt wird. Praktizierende beschreiben es als ein Ziehen zu einem bestimmten Ort auf der Erde, einer bestimmten Landschaft, einem bestimmten Ton. Aus dem Process Mind heraus zu arbeiten heißt weniger entscheiden, mehr den Ort finden, von dem aus der nächste Schritt sich zeigt. Die App führt nicht in diese Schicht hinein. Sie zeigt sie, benennt sie und tritt zurück.",
    },
  },
  {
    id: "dreaming-up",
    slug: "dreaming-up",
    tags: ["mindell"],
    related: ["double-signals", "primary-secondary"],
    title: {
      en: "Dreaming Up — When the Field Plays Through Us",
      de: "Dreaming Up — wenn das Feld durch uns hindurch spielt",
    },
    body: {
      en:
        "Mindell uses 'dreaming up' for the way one person's secondary process gets enacted by another in the room. The withdrawn one is dreamed up into being insistent; the assertive one is dreamed up into hesitating. Inside oneself, the same thing happens between voices: the part that wants to leave is dreamed up by the part that wants to stay, and vice versa. Noticing dreaming-up is one of the fastest ways out of self-blame. The voice you hear is often answering the voice you didn't notice asking.",
      de:
        "Mindell nutzt „dreaming up" für die Art, in der der sekundäre Prozess einer Person von einer anderen im Raum gelebt wird. Die Zurückhaltende wird ins Beharrliche „hineingeträumt"; die Bestimmte ins Zögern. Im Inneren passiert dasselbe zwischen Stimmen: der Teil, der gehen will, wird von dem Teil, der bleiben will, hineingeträumt — und umgekehrt. Dreaming-up zu bemerken ist einer der schnellsten Wege aus der Selbstbeschuldigung. Die Stimme, die du hörst, antwortet oft auf die Stimme, die du nicht bemerkt hast.",
    },
  },
  {
    id: "world-channels",
    slug: "the-channels-of-experience",
    tags: ["mindell"],
    related: ["dreambody", "double-signals"],
    title: {
      en: "Channels of Experience",
      de: "Wahrnehmungskanäle",
    },
    body: {
      en:
        "Mindell describes experience as flowing through channels: visual (images, dreams, light), auditory (voices, sounds, tones), proprioceptive (sensation, weight, temperature inside the body), kinesthetic (movement, posture, gesture), relationship (what happens between people), world (what is happening in the wider field). A signal that arrives in one channel and gets answered in another carries information about an edge — something that wants to cross from where it is into where it can be received. Inner work often consists of letting a signal complete in its own channel before it has to translate.",
      de:
        "Mindell beschreibt Erfahrung als fließend durch Kanäle: visuell (Bilder, Träume, Licht), auditiv (Stimmen, Klänge, Töne), propriozeptiv (Empfindung, Gewicht, Temperatur im Körper), kinästhetisch (Bewegung, Haltung, Geste), Beziehung (was zwischen Menschen geschieht), Welt (was im weiteren Feld geschieht). Ein Signal, das in einem Kanal ankommt und in einem anderen beantwortet wird, trägt Information über eine Kante — etwas, das vom Ort, an dem es ist, dorthin überqueren möchte, wo es empfangen werden kann. Innere Arbeit besteht oft darin, ein Signal in seinem eigenen Kanal vollenden zu lassen, bevor es übersetzen muss.",
    },
  },
  {
    id: "inner-critic-edge-figure",
    slug: "the-inner-critic-as-edge-figure",
    tags: ["mindell", "edge"],
    related: ["edges-edge-figures", "primary-secondary"],
    title: {
      en: "The Inner Critic as Edge Figure",
      de: "Die innere Kritikerin als Kantenfigur",
    },
    body: {
      en:
        "The inner critic is rarely a saboteur. More often, it is the edge figure — the part of the self that holds the line of who you are allowed to be. Its tone is harsh, its content is conservative, but its function is protective: it has reasons, often old ones, for why crossing the line was once costly. Inner work that fights the critic gives it more power. Inner work that listens to the critic discovers what it is afraid of, and the energy it has been guarding is freed for whatever wanted to live next.",
      de:
        "Die innere Kritikerin ist selten eine Saboteurin. Häufiger ist sie die Kantenfigur — der Teil des Selbst, der die Linie hält, wer du sein darfst. Der Ton ist hart, der Inhalt ist konservativ, aber die Funktion ist schützend: sie hat Gründe, oft alte, warum ein Überschreiten der Linie einmal teuer war. Innere Arbeit, die gegen die Kritikerin kämpft, gibt ihr mehr Macht. Innere Arbeit, die der Kritikerin zuhört, entdeckt, wovor sie sich fürchtet — und die Energie, die sie bewachte, wird frei für das, was als Nächstes leben wollte.",
    },
  },
];

export function getCardBySlug(slug: string): LearningCard | undefined {
  return LEARNING_CARDS.find((c) => c.slug === slug);
}
