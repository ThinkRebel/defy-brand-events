import type { Lang } from "./types";

/**
 * FAQ per page — the exact question/answer pairs AI answer engines quote, and the ones people
 * actually ask before they mail. Rendered as an accordion AND published as FAQPage JSON-LD and
 * in llms.txt, so a human, Google and an agent read the same words.
 * Keys: service slugs + "home", "about", "contact".
 */
export type QA = { q: string; a: string };
type FaqSet = Record<Lang, QA[]>;

export const FAQ: Record<string, FaqSet> = {
  home: {
    nl: [
      { q: "Wat doet Defy & Brand Events precies?", a: "Defy & Brand Events (DB Events) is een creatief bureau in Oostende dat ideeën omzet in merken, websites, campagnes en AI-klare ervaringen. Negen diensten, één team: strategie, brand & creative, copywriting, website design, marketing, SEO, GEO, agent ready en agentic workflow." },
      { q: "Voor wie werken jullie?", a: "Voor ondernemers, kmo's en organisaties in België en daarbuiten die meer willen dan 'goed genoeg': een merk dat mensen voelen, een website die bezoekers laat blijven en marketing die de juiste mensen brengt. We werken in het Nederlands, Frans en Engels." },
      { q: "Zijn jullie een bureau of een freelancer?", a: "Geen klassiek bureau met een menu en geen losse freelancer. Eén compact team rond creative Njusja Orban dat denkt, maakt, test en verbetert — tot het idee doet wat het moest doen." },
      { q: "Hoe start een samenwerking?", a: "Je vertelt ons wat er in je hoofd zit via het contactformulier of marketing@defyandbrandevents.be. Binnen twee werkdagen hoor je van een mens, niet van een autoresponder. Daarna plannen we een gesprek en krijg je een concreet voorstel." },
      { q: "Wat betekent 'Let's make some noise'?", a: "Het is onze afsluiter en onze belofte: werk dat opvalt, dat mensen laat stoppen, kijken en kiezen. Geen ruis, wel geluid dat blijft hangen." },
    ],
    fr: [
      { q: "Que fait exactement Defy & Brand Events ?", a: "Defy & Brand Events (DB Events) est une agence créative basée à Ostende qui transforme des idées en marques, sites web, campagnes et expériences prêtes pour l'IA. Neuf services, une seule équipe : stratégie, brand & creative, copywriting, web design, marketing, SEO, GEO, agent ready et agentic workflow." },
      { q: "Pour qui travaillez-vous ?", a: "Pour des entrepreneurs, PME et organisations en Belgique et ailleurs qui veulent plus que « suffisant » : une marque que l'on ressent, un site où l'on reste et un marketing qui amène les bonnes personnes. Nous travaillons en néerlandais, français et anglais." },
      { q: "Êtes-vous une agence ou un freelance ?", a: "Ni une agence classique avec un menu, ni un freelance isolé. Une équipe compacte autour de la créative Njusja Orban, qui pense, crée, teste et améliore — jusqu'à ce que l'idée fasse ce qu'elle devait faire." },
      { q: "Comment démarre une collaboration ?", a: "Vous nous racontez ce que vous avez en tête via le formulaire ou marketing@defyandbrandevents.be. Sous deux jours ouvrables, un humain vous répond — pas un répondeur automatique. Ensuite : un entretien et une proposition concrète." },
      { q: "Que signifie « Let's make some noise » ?", a: "C'est notre signature et notre promesse : un travail qui se remarque, qui fait s'arrêter, regarder et choisir. Pas de bruit de fond, mais un son qui reste." },
    ],
    en: [
      { q: "What exactly does Defy & Brand Events do?", a: "Defy & Brand Events (DB Events) is a creative studio in Ostend, Belgium, that turns ideas into brands, websites, campaigns and AI-ready experiences. Nine services, one team: strategy, brand & creative, copywriting, website design, marketing, SEO, GEO, agent ready and agentic workflow." },
      { q: "Who do you work for?", a: "Entrepreneurs, SMEs and organisations in Belgium and beyond who want more than 'good enough': a brand people feel, a website visitors stay on, and marketing that brings the right people. We work in Dutch, French and English." },
      { q: "Are you an agency or a freelancer?", a: "Neither a classic agency with a menu nor a lone freelancer. One compact team around creative Njusja Orban that thinks, makes, tests and improves — until the idea does what it was meant to do." },
      { q: "How does a collaboration start?", a: "Tell us what's on your mind through the contact form or marketing@defyandbrandevents.be. Within two working days you hear from a human, not an autoresponder. Then we talk, and you get a concrete proposal." },
      { q: "What does 'Let's make some noise' mean?", a: "It's our sign-off and our promise: work that stands out, that makes people stop, look and choose. Not noise — a sound that sticks." },
    ],
  },
  strategy: {
    nl: [
      { q: "Wat is een merkstrategie en waarom heb ik die nodig?", a: "Een merkstrategie is het antwoord op vier vragen: wat moet dit opleveren, voor wie en waarom nu, wat laten we bewust liggen en waaraan zien we dat het werkt. Zonder die antwoorden wordt elke website, campagne of post een gok. Met die antwoorden wordt elke euro een keuze." },
      { q: "Hoe lang duurt een strategietraject?", a: "Meestal twee tot vier weken: een intake, één of twee werksessies met de beslissers, onderzoek naar klanten en concurrenten, en een document dat je team effectief gebruikt — geen dik rapport voor de lade." },
      { q: "Wat krijg ik concreet?", a: "Positionering, doelgroep, kernboodschap, tone of voice, prioriteiten per kanaal en meetbare doelen. Alles in één beknopt merkdocument dat richting geeft aan alle andere diensten." },
      { q: "Kan strategie los van uitvoering?", a: "Ja. Je kan enkel de strategie laten uitwerken en de uitvoering elders doen. In de praktijk gaat ze meestal samen met brand & creative of website design, omdat de strategie dan meteen zichtbaar wordt." },
    ],
    fr: [
      { q: "Qu'est-ce qu'une stratégie de marque et pourquoi en ai-je besoin ?", a: "Une stratégie de marque répond à quatre questions : que doit rapporter ceci, pour qui et pourquoi maintenant, que laissons-nous sciemment de côté, et à quoi verra-t-on que ça marche. Sans ces réponses, chaque site, campagne ou post est un pari. Avec elles, chaque euro devient un choix." },
      { q: "Combien de temps dure un parcours stratégique ?", a: "Généralement deux à quatre semaines : un intake, une ou deux sessions de travail avec les décideurs, une analyse clients et concurrents, et un document que votre équipe utilise vraiment — pas un rapport épais pour le tiroir." },
      { q: "Que reçois-je concrètement ?", a: "Positionnement, cible, message central, ton, priorités par canal et objectifs mesurables. Le tout dans un document de marque concis qui oriente tous les autres services." },
      { q: "La stratégie peut-elle être séparée de l'exécution ?", a: "Oui. Vous pouvez faire élaborer uniquement la stratégie et exécuter ailleurs. En pratique, elle va souvent de pair avec brand & creative ou le web design, car la stratégie devient alors immédiatement visible." },
    ],
    en: [
      { q: "What is a brand strategy and why do I need one?", a: "A brand strategy answers four questions: what has this got to deliver, for whom and why now, what do we deliberately leave out, and how will we know it works. Without those answers every website, campaign or post is a guess. With them, every euro becomes a choice." },
      { q: "How long does a strategy track take?", a: "Usually two to four weeks: an intake, one or two working sessions with the decision-makers, customer and competitor research, and a document your team actually uses — not a thick report for the drawer." },
      { q: "What do I get, concretely?", a: "Positioning, audience, core message, tone of voice, priorities per channel and measurable goals. All in one concise brand document that steers every other service." },
      { q: "Can strategy be separated from execution?", a: "Yes. You can have only the strategy developed and execute elsewhere. In practice it usually pairs with brand & creative or website design, because the strategy then becomes visible right away." },
    ],
  },
  "brand-creative": {
    nl: [
      { q: "Wat zit er in een branding-traject?", a: "Naam of naamcheck, logo en beeldmerk, kleur en typografie, beeldtaal, tone of voice en een brandbook met regels die je team en je leveranciers kunnen volgen. Alles vertrekt van de strategie, niet van smaak." },
      { q: "Doen jullie ook rebranding van bestaande merken?", a: "Ja. Vaak is dat zelfs de sterkste opdracht: wat werkt behouden, wat verwarrend is weglaten en het merk klaarmaken voor wat er nu komt — zonder je bestaande klanten te verliezen." },
      { q: "Wat kost een huisstijl?", a: "Dat hangt af van wat je nodig hebt: een compact startpakket voor een nieuwe zaak verschilt van een volledig merksysteem met campagnestijl en templates. Na een gesprek krijg je een vast bedrag, geen uurtje-factuurtje." },
      { q: "Krijg ik de bronbestanden?", a: "Altijd. Logo's in alle formaten, kleurcodes, lettertypes met licentie-info en werkbestanden. Het merk is van jou." },
    ],
    fr: [
      { q: "Que comprend un parcours de branding ?", a: "Nom ou vérification du nom, logo et signe, couleurs et typographie, langage visuel, ton et un brandbook avec des règles que votre équipe et vos fournisseurs peuvent suivre. Tout part de la stratégie, pas du goût." },
      { q: "Faites-vous aussi du rebranding ?", a: "Oui. C'est souvent la mission la plus forte : garder ce qui marche, retirer ce qui embrouille et préparer la marque pour ce qui vient — sans perdre vos clients actuels." },
      { q: "Combien coûte une identité visuelle ?", a: "Cela dépend de vos besoins : un pack de démarrage compact pour une nouvelle activité diffère d'un système de marque complet avec style de campagne et templates. Après un entretien, vous recevez un montant fixe, pas une facturation à l'heure." },
      { q: "Est-ce que je reçois les fichiers sources ?", a: "Toujours. Logos dans tous les formats, codes couleurs, polices avec infos de licence et fichiers de travail. La marque vous appartient." },
    ],
    en: [
      { q: "What's included in a branding track?", a: "Name or name check, logo and mark, colour and typography, visual language, tone of voice and a brandbook with rules your team and suppliers can follow. Everything starts from the strategy, not from taste." },
      { q: "Do you also rebrand existing brands?", a: "Yes. That is often the strongest brief: keep what works, drop what confuses, and make the brand ready for what's next — without losing your existing customers." },
      { q: "What does a visual identity cost?", a: "It depends on what you need: a compact starter kit for a new business differs from a full brand system with campaign style and templates. After a conversation you get a fixed price, not hourly billing." },
      { q: "Do I get the source files?", a: "Always. Logos in every format, colour codes, fonts with licence info and working files. The brand is yours." },
    ],
  },
  copywriting: {
    nl: [
      { q: "Welke teksten schrijven jullie?", a: "Websiteteksten, campagnes, slogans, nieuwsbrieven, social posts, pitches en productteksten — in het Nederlands, Frans en Engels. Altijd in jouw tone of voice, nooit in bureau-taal." },
      { q: "Schrijven jullie met AI?", a: "We gebruiken AI zoals een goede schrijver een woordenboek gebruikt: voor research, varianten en tempo. De keuzes, de toon en de eindtekst zijn van een mens. Je merkt het verschil in de eerste zin." },
      { q: "Is de tekst ook goed voor SEO en AI-zoekmachines?", a: "Ja. Elke tekst wordt geschreven om gelezen én gevonden te worden: duidelijke koppen, antwoorden op echte vragen, feiten die een zoekmachine of AI kan citeren. Zonder keyword-gestamp." },
      { q: "Hoeveel revisierondes zitten er in?", a: "Standaard twee. In de praktijk zijn we meestal na één ronde klaar, omdat we vooraf de briefing en de toon vastleggen." },
    ],
    fr: [
      { q: "Quels textes écrivez-vous ?", a: "Textes de site, campagnes, slogans, newsletters, posts sociaux, pitchs et fiches produits — en néerlandais, français et anglais. Toujours dans votre ton, jamais en langue d'agence." },
      { q: "Écrivez-vous avec l'IA ?", a: "Nous utilisons l'IA comme un bon rédacteur utilise un dictionnaire : pour la recherche, les variantes et le rythme. Les choix, le ton et le texte final sont humains. La différence se voit dès la première phrase." },
      { q: "Le texte est-il aussi bon pour le SEO et les moteurs IA ?", a: "Oui. Chaque texte est écrit pour être lu et trouvé : titres clairs, réponses à de vraies questions, faits qu'un moteur de recherche ou une IA peut citer. Sans bourrage de mots-clés." },
      { q: "Combien de tours de révision sont inclus ?", a: "Deux en standard. En pratique, un seul suffit souvent, parce que le brief et le ton sont fixés au départ." },
    ],
    en: [
      { q: "What kind of copy do you write?", a: "Website copy, campaigns, taglines, newsletters, social posts, pitches and product copy — in Dutch, French and English. Always in your tone of voice, never in agency-speak." },
      { q: "Do you write with AI?", a: "We use AI the way a good writer uses a dictionary: for research, variants and pace. The choices, the tone and the final text are human. You notice the difference in the first sentence." },
      { q: "Is the copy also good for SEO and AI search?", a: "Yes. Every text is written to be read and found: clear headings, answers to real questions, facts a search engine or AI can quote. No keyword stuffing." },
      { q: "How many revision rounds are included?", a: "Two as standard. In practice we're usually done after one, because we lock the brief and the tone up front." },
    ],
  },
  "website-design": {
    nl: [
      { q: "Wat kost een website bij Defy & Brand Events?", a: "Een compacte site met een paar pagina's start lager dan een meertalige site met portfolio, formulieren en animatie. Je krijgt na het gesprek een vast bedrag met wat erin zit. Geen verrassingen achteraf, geen maandelijkse licentie op je eigen site." },
      { q: "Waarin bouwen jullie websites?", a: "In moderne code (Next.js/React) die snel laadt, veilig is en op elk scherm werkt, of in een CMS als je zelf veel wil aanpassen. We kiezen de techniek op basis van wat jij nodig hebt, niet op basis van wat wij toevallig verkopen." },
      { q: "Is de website mobielvriendelijk en snel?", a: "Ja, mobile-first en gemeten: laadtijd, Core Web Vitals en toegankelijkheid worden getest voor de site live gaat. Onze eigen site is het testbed." },
      { q: "Zit SEO en AI-vindbaarheid erin?", a: "Standaard: technische SEO, gestructureerde data (schema.org), meertalige tags, sitemap, llms.txt en teksten die AI kan citeren. Wil je verder gaan, dan combineer je met onze SEO- en GEO-diensten." },
      { q: "Kan ik de site zelf aanpassen?", a: "Als je dat wil, ja: dan bouwen we op een CMS of met een eenvoudige contentlaag. Wil je er niet naar omkijken, dan onderhouden wij hem." },
    ],
    fr: [
      { q: "Combien coûte un site chez Defy & Brand Events ?", a: "Un site compact de quelques pages démarre plus bas qu'un site multilingue avec portfolio, formulaires et animation. Après l'entretien, vous recevez un montant fixe avec ce qui est inclus. Pas de surprises, pas de licence mensuelle sur votre propre site." },
      { q: "Avec quoi construisez-vous les sites ?", a: "En code moderne (Next.js/React) rapide, sûr et fonctionnel sur tous les écrans, ou sur un CMS si vous voulez modifier beaucoup vous-même. Nous choisissons la technique selon vos besoins, pas selon ce que nous vendons par hasard." },
      { q: "Le site est-il mobile et rapide ?", a: "Oui, mobile-first et mesuré : temps de chargement, Core Web Vitals et accessibilité sont testés avant la mise en ligne. Notre propre site est le banc d'essai." },
      { q: "Le SEO et la visibilité IA sont-ils inclus ?", a: "En standard : SEO technique, données structurées (schema.org), balises multilingues, sitemap, llms.txt et des textes que l'IA peut citer. Pour aller plus loin, combinez avec nos services SEO et GEO." },
      { q: "Puis-je modifier le site moi-même ?", a: "Si vous le souhaitez, oui : nous construisons alors sur un CMS ou avec une couche de contenu simple. Si vous ne voulez pas y penser, nous l'entretenons." },
    ],
    en: [
      { q: "What does a website cost at Defy & Brand Events?", a: "A compact site with a few pages starts lower than a multilingual site with portfolio, forms and animation. After the conversation you get a fixed price with what's included. No surprises afterwards, no monthly licence on your own site." },
      { q: "What do you build websites with?", a: "In modern code (Next.js/React) that loads fast, is secure and works on every screen, or on a CMS if you want to edit a lot yourself. We choose the tech based on what you need, not on what we happen to sell." },
      { q: "Is the website mobile-friendly and fast?", a: "Yes, mobile-first and measured: load time, Core Web Vitals and accessibility are tested before launch. Our own site is the test bed." },
      { q: "Are SEO and AI findability included?", a: "As standard: technical SEO, structured data (schema.org), multilingual tags, sitemap, llms.txt and copy AI can quote. To go further, combine with our SEO and GEO services." },
      { q: "Can I edit the site myself?", a: "If you want to, yes: then we build on a CMS or with a simple content layer. If you'd rather not think about it, we maintain it." },
    ],
  },
  marketing: {
    nl: [
      { q: "Welke marketingkanalen zetten jullie in?", a: "Social media (organisch en betaald), e-mail, Google Ads, content en events — gekozen op basis van waar jouw klanten echt zitten, niet op basis van wat trending is." },
      { q: "Werken jullie met een maandelijks budget?", a: "Meestal wel: een vaste maandformule voor strategie, content en opvolging, plus het advertentiebudget dat rechtstreeks naar de platformen gaat. Je ziet elke maand wat er gebeurde en wat het opbracht." },
      { q: "Maken jullie ook de content?", a: "Ja: visuals, video, teksten en campagnes komen uit hetzelfde team als je merk, dus alles klopt met elkaar." },
      { q: "Hoe meten jullie resultaat?", a: "Op wat telt voor jou: aanvragen, verkopen, inschrijvingen — niet enkel likes. We spreken vooraf af wat succes is en rapporteren daarop." },
    ],
    fr: [
      { q: "Quels canaux marketing utilisez-vous ?", a: "Réseaux sociaux (organique et payant), e-mail, Google Ads, contenu et événements — choisis selon l'endroit où se trouvent vraiment vos clients, pas selon les tendances." },
      { q: "Travaillez-vous avec un budget mensuel ?", a: "Le plus souvent : une formule mensuelle fixe pour la stratégie, le contenu et le suivi, plus le budget publicitaire versé directement aux plateformes. Chaque mois, vous voyez ce qui s'est passé et ce que cela a rapporté." },
      { q: "Créez-vous aussi le contenu ?", a: "Oui : visuels, vidéo, textes et campagnes viennent de la même équipe que votre marque, donc tout est cohérent." },
      { q: "Comment mesurez-vous les résultats ?", a: "Sur ce qui compte pour vous : demandes, ventes, inscriptions — pas seulement des likes. Nous définissons le succès à l'avance et rapportons là-dessus." },
    ],
    en: [
      { q: "Which marketing channels do you use?", a: "Social media (organic and paid), email, Google Ads, content and events — chosen by where your customers really are, not by what's trending." },
      { q: "Do you work with a monthly budget?", a: "Usually: a fixed monthly formula for strategy, content and follow-up, plus the ad budget that goes straight to the platforms. Every month you see what happened and what it brought in." },
      { q: "Do you also create the content?", a: "Yes: visuals, video, copy and campaigns come from the same team as your brand, so everything fits together." },
      { q: "How do you measure results?", a: "On what matters to you: enquiries, sales, sign-ups — not just likes. We agree up front what success means and report on that." },
    ],
  },
  seo: {
    nl: [
      { q: "Wat is SEO en werkt het nog in 2026?", a: "SEO (search engine optimization) maakt je vindbaar in Google en andere zoekmachines. Het werkt nog steeds — de zoekresultaten zien er alleen anders uit: AI-overzichten, minder klikken, meer nadruk op merken die de vraag echt beantwoorden. Daarom combineren we SEO met GEO." },
      { q: "Hoe snel zie ik resultaat van SEO?", a: "Technische verbeteringen merk je binnen weken; nieuwe posities op belangrijke zoekwoorden duren meestal drie tot zes maanden. Wie snelle resultaten belooft, koopt ze meestal met advertenties." },
      { q: "Wat doen jullie concreet?", a: "Technische audit en fixes, zoekwoordonderzoek, contentplan, teksten en structuur, interne links, lokale SEO (Google Business Profile) en maandelijkse rapportering." },
      { q: "Doen jullie ook lokale SEO voor Oostende en de kust?", a: "Ja. We zitten zelf in Oostende en kennen de lokale markt: horeca, retail, toerisme en diensten die 'in de buurt' gevonden willen worden." },
    ],
    fr: [
      { q: "Qu'est-ce que le SEO et fonctionne-t-il encore en 2026 ?", a: "Le SEO (search engine optimization) vous rend trouvable sur Google et les autres moteurs. Il fonctionne toujours — les résultats ont simplement changé : aperçus IA, moins de clics, plus de poids pour les marques qui répondent vraiment à la question. C'est pourquoi nous combinons SEO et GEO." },
      { q: "En combien de temps voit-on des résultats ?", a: "Les améliorations techniques se voient en quelques semaines ; les nouvelles positions sur des mots-clés importants prennent généralement trois à six mois. Qui promet des résultats rapides les achète en général avec de la publicité." },
      { q: "Que faites-vous concrètement ?", a: "Audit technique et corrections, recherche de mots-clés, plan de contenu, textes et structure, liens internes, SEO local (Google Business Profile) et rapport mensuel." },
      { q: "Faites-vous du SEO local pour Ostende et la côte ?", a: "Oui. Nous sommes à Ostende et connaissons le marché local : horeca, commerce, tourisme et services qui veulent être trouvés « à proximité »." },
    ],
    en: [
      { q: "What is SEO and does it still work in 2026?", a: "SEO (search engine optimization) makes you findable in Google and other search engines. It still works — the results just look different: AI overviews, fewer clicks, more weight for brands that actually answer the question. That's why we combine SEO with GEO." },
      { q: "How fast do I see SEO results?", a: "Technical improvements show within weeks; new positions on important keywords usually take three to six months. Whoever promises fast results usually buys them with ads." },
      { q: "What do you do, concretely?", a: "Technical audit and fixes, keyword research, content plan, copy and structure, internal links, local SEO (Google Business Profile) and monthly reporting." },
      { q: "Do you do local SEO for Ostend and the coast?", a: "Yes. We're based in Ostend and know the local market: hospitality, retail, tourism and services that want to be found 'nearby'." },
    ],
  },
  geo: {
    nl: [
      { q: "Wat is GEO (generative engine optimization)?", a: "GEO zorgt dat AI-antwoordmachines zoals ChatGPT, Gemini, Copilot, Perplexity en Claude jouw merk begrijpen, noemen en citeren wanneer iemand een vraag stelt waar jij het antwoord op bent. Het is de opvolger van SEO voor het tijdperk waarin mensen vragen stellen in plaats van te zoeken." },
      { q: "Hoe weet ik of AI mij nu al noemt?", a: "Met ceeme.be, de tool die we hiervoor bouwden: je geeft je website in, ceeme stelt de vragen die je klanten aan AI stellen en toont of je naam in het antwoord staat, welke bronnen de AI wél citeert en wat er op je site ontbreekt." },
      { q: "Wat verandert er aan mijn website voor GEO?", a: "Duidelijke, citeerbare feiten (wie, wat, waar, voor wie, prijsindicatie), FAQ's die echte vragen beantwoorden, gestructureerde data (schema.org), een llms.txt, consistente naamgeving en bronnen die naar jou verwijzen. Geen trucs — alles wat we hier doen, doen we ook op deze site." },
      { q: "Vervangt GEO SEO?", a: "Nee, het bouwt erop. Een AI haalt zijn antwoorden uit dezelfde pagina's die goed scoren in zoekmachines. Technisch gezonde SEO is de basis; GEO zorgt dat de inhoud citeerbaar is." },
    ],
    fr: [
      { q: "Qu'est-ce que le GEO (generative engine optimization) ?", a: "Le GEO fait en sorte que les moteurs de réponse IA comme ChatGPT, Gemini, Copilot, Perplexity et Claude comprennent, mentionnent et citent votre marque quand quelqu'un pose une question dont vous êtes la réponse. C'est le successeur du SEO pour l'ère où l'on pose des questions au lieu de chercher." },
      { q: "Comment savoir si l'IA me mentionne déjà ?", a: "Avec ceeme.be, l'outil que nous avons construit pour ça : vous entrez votre site, ceeme pose les questions que vos clients posent à l'IA et montre si votre nom apparaît, quelles sources l'IA cite à votre place et ce qui manque sur votre site." },
      { q: "Qu'est-ce qui change sur mon site pour le GEO ?", a: "Des faits clairs et citables (qui, quoi, où, pour qui, indication de prix), des FAQ qui répondent à de vraies questions, des données structurées (schema.org), un llms.txt, une dénomination cohérente et des sources qui renvoient vers vous. Pas d'astuces — tout ce que nous faisons ici, nous le faisons aussi sur ce site." },
      { q: "Le GEO remplace-t-il le SEO ?", a: "Non, il s'appuie dessus. Une IA tire ses réponses des mêmes pages qui se classent bien dans les moteurs. Un SEO techniquement sain est la base ; le GEO rend le contenu citable." },
    ],
    en: [
      { q: "What is GEO (generative engine optimization)?", a: "GEO makes AI answer engines like ChatGPT, Gemini, Copilot, Perplexity and Claude understand, mention and cite your brand when someone asks a question you are the answer to. It's the successor of SEO for the era in which people ask instead of search." },
      { q: "How do I know whether AI already mentions me?", a: "With ceeme.be, the tool we built for this: you enter your website, ceeme asks the questions your customers ask AI and shows whether your name is in the answer, which sources the AI cites instead, and what your site is missing." },
      { q: "What changes on my website for GEO?", a: "Clear, quotable facts (who, what, where, for whom, price indication), FAQs that answer real questions, structured data (schema.org), an llms.txt, consistent naming and sources that point to you. No tricks — everything we do here, we also do on this site." },
      { q: "Does GEO replace SEO?", a: "No, it builds on it. An AI draws its answers from the same pages that rank well in search engines. Technically healthy SEO is the base; GEO makes the content quotable." },
    ],
  },
  "agent-ready": {
    nl: [
      { q: "Wat betekent 'agent ready'?", a: "Dat AI-agents — de assistenten die straks voor je klanten zoeken, vergelijken, boeken en bestellen — jouw website en gegevens kunnen lezen en gebruiken. Een mens ziet beeld en ritme; een agent leest structuur, feiten en acties." },
      { q: "Wat maakt een website agent ready?", a: "Gestructureerde data (schema.org voor organisatie, diensten, producten, openingsuren, FAQ), duidelijke acties (contact, boeken, bestellen) die ook zonder muis werken, een llms.txt en API's of feeds waar dat zinvol is." },
      { q: "Is dit al relevant voor een kleine onderneming?", a: "Ja. Agents beginnen bij eenvoudige vragen: 'welke fotograaf in Oostende is beschikbaar op 12 mei?' Wie leesbaar is, wordt voorgesteld; wie dat niet is, bestaat niet voor de agent." },
      { q: "Hoe verschilt dit van GEO?", a: "GEO gaat over genoemd en geciteerd worden in AI-antwoorden. Agent ready gaat over gebruikt kunnen worden door AI die handelt. Ze horen samen: eerst begrepen worden, dan gekozen worden." },
    ],
    fr: [
      { q: "Que signifie « agent ready » ?", a: "Que les agents IA — les assistants qui chercheront, compareront, réserveront et commanderont bientôt pour vos clients — peuvent lire et utiliser votre site et vos données. Un humain voit l'image et le rythme ; un agent lit la structure, les faits et les actions." },
      { q: "Qu'est-ce qui rend un site agent ready ?", a: "Des données structurées (schema.org pour l'organisation, les services, les produits, les horaires, la FAQ), des actions claires (contact, réservation, commande) qui fonctionnent aussi sans souris, un llms.txt et des API ou flux là où c'est utile." },
      { q: "Est-ce déjà pertinent pour une petite entreprise ?", a: "Oui. Les agents commencent par des questions simples : « quel photographe à Ostende est disponible le 12 mai ? » Qui est lisible est proposé ; qui ne l'est pas n'existe pas pour l'agent." },
      { q: "Quelle différence avec le GEO ?", a: "Le GEO concerne le fait d'être mentionné et cité dans les réponses IA. Agent ready concerne le fait de pouvoir être utilisé par une IA qui agit. Les deux vont ensemble : d'abord être compris, puis être choisi." },
    ],
    en: [
      { q: "What does 'agent ready' mean?", a: "That AI agents — the assistants that will soon search, compare, book and order for your customers — can read and use your website and data. A human sees image and rhythm; an agent reads structure, facts and actions." },
      { q: "What makes a website agent ready?", a: "Structured data (schema.org for organisation, services, products, opening hours, FAQ), clear actions (contact, book, order) that also work without a mouse, an llms.txt, and APIs or feeds where that makes sense." },
      { q: "Is this already relevant for a small business?", a: "Yes. Agents start with simple questions: 'which photographer in Ostend is available on 12 May?' Whoever is readable gets suggested; whoever isn't doesn't exist for the agent." },
      { q: "How does this differ from GEO?", a: "GEO is about being mentioned and cited in AI answers. Agent ready is about being usable by AI that acts. They belong together: first be understood, then be chosen." },
    ],
  },
  "agentic-workflow": {
    nl: [
      { q: "Wat is een agentic workflow?", a: "Een reeks stappen waarin een AI-agent zelf werk uitvoert binnen grenzen die jij bepaalt: een lead lezen, de vraag herkennen, de agenda checken, een antwoord in jouw toon voorstellen en je CRM bijwerken. Jij beslist 's ochtends; de agent deed het voorbereidende werk 's nachts." },
      { q: "Welke taken kan een agent overnemen?", a: "Inbox-triage, offertes voorbereiden, opvolging van leads, contentvarianten maken, rapportering, afspraken plannen en data overzetten tussen tools. Alles wat herhaalbaar is en duidelijke regels heeft." },
      { q: "Is het veilig? Wie is verantwoordelijk?", a: "De agent werkt met toegang die je expliciet geeft, logt elke actie en vraagt goedkeuring voor onomkeerbare stappen (versturen, betalen, verwijderen). Jij blijft verantwoordelijk en kan alles terugdraaien of stopzetten." },
      { q: "Wat is het agent-programma dat eraan komt?", a: "Een reeks kant-en-klare agents voor je dagelijkse workflow — inbox, offertes, opvolging, content — die je zelf inzet, zonder ontwikkeltraject. Het is in de maak; laat weten of je erbij wil zijn als de eerste opengaan." },
    ],
    fr: [
      { q: "Qu'est-ce qu'un agentic workflow ?", a: "Une suite d'étapes où un agent IA exécute lui-même du travail dans les limites que vous fixez : lire un lead, reconnaître la demande, vérifier l'agenda, proposer une réponse dans votre ton et mettre à jour votre CRM. Vous décidez le matin ; l'agent a préparé la nuit." },
      { q: "Quelles tâches un agent peut-il reprendre ?", a: "Tri de la boîte mail, préparation de devis, suivi des leads, variantes de contenu, rapports, planification de rendez-vous et transfert de données entre outils. Tout ce qui est répétable et a des règles claires." },
      { q: "Est-ce sûr ? Qui est responsable ?", a: "L'agent travaille avec les accès que vous donnez explicitement, journalise chaque action et demande une validation pour les étapes irréversibles (envoyer, payer, supprimer). Vous restez responsable et pouvez tout annuler ou arrêter." },
      { q: "Qu'est-ce que le programme d'agents à venir ?", a: "Une série d'agents prêts à l'emploi pour votre travail quotidien — boîte mail, devis, suivi, contenu — que vous utilisez vous-même, sans projet de développement. C'est en préparation ; dites-nous si vous voulez être là quand les premiers ouvrent." },
    ],
    en: [
      { q: "What is an agentic workflow?", a: "A series of steps in which an AI agent does work itself within limits you set: read a lead, recognise the ask, check the calendar, propose a reply in your tone and update your CRM. You decide in the morning; the agent did the prep work at night." },
      { q: "Which tasks can an agent take over?", a: "Inbox triage, preparing quotes, following up leads, making content variants, reporting, scheduling appointments and moving data between tools. Anything repeatable with clear rules." },
      { q: "Is it safe? Who is responsible?", a: "The agent works with access you explicitly grant, logs every action and asks for approval before irreversible steps (send, pay, delete). You remain responsible and can undo or stop everything." },
      { q: "What is the upcoming agent programme?", a: "A set of ready-made agents for your daily workflow — inbox, quotes, follow-up, content — that you use yourself, without a development project. It's in the works; let us know if you want in when the first ones open." },
    ],
  },
  about: {
    nl: [
      { q: "Wie zit er achter Defy & Brand Events?", a: "Njusja Orban, creative en oprichter, met THINKREBEL als attitude: durven afwijken van wat 'iedereen doet'. Rond haar een compact team van makers en een netwerk van specialisten die we inschakelen wanneer een project erom vraagt." },
      { q: "Waar zijn jullie gevestigd?", a: "Zeedijk 133 bus 00.02, 8400 Oostende. We werken voor klanten in heel België en online voor klanten daarbuiten." },
      { q: "Wat betekent de naam Defy & Brand Events?", a: "Defy: durven tegen de stroom in. Brand: het merk als kern van alles. Events: elke ervaring die we maken is een moment — online of live — waarop iemand stopt, kijkt en kiest." },
    ],
    fr: [
      { q: "Qui est derrière Defy & Brand Events ?", a: "Njusja Orban, créative et fondatrice, avec THINKREBEL comme attitude : oser s'écarter de ce que « tout le monde fait ». Autour d'elle, une équipe compacte de créateurs et un réseau de spécialistes mobilisés quand un projet le demande." },
      { q: "Où êtes-vous établis ?", a: "Zeedijk 133 bus 00.02, 8400 Ostende. Nous travaillons pour des clients dans toute la Belgique et en ligne au-delà." },
      { q: "Que signifie le nom Defy & Brand Events ?", a: "Defy : oser aller à contre-courant. Brand : la marque au cœur de tout. Events : chaque expérience que nous créons est un moment — en ligne ou en direct — où quelqu'un s'arrête, regarde et choisit." },
    ],
    en: [
      { q: "Who is behind Defy & Brand Events?", a: "Njusja Orban, creative and founder, with THINKREBEL as the attitude: daring to deviate from what 'everyone does'. Around her a compact team of makers and a network of specialists we bring in when a project asks for it." },
      { q: "Where are you based?", a: "Zeedijk 133 bus 00.02, 8400 Ostend, Belgium. We work for clients across Belgium and online for clients beyond." },
      { q: "What does the name Defy & Brand Events mean?", a: "Defy: daring to go against the current. Brand: the brand at the core of everything. Events: every experience we make is a moment — online or live — where someone stops, looks and chooses." },
    ],
  },
  contact: {
    nl: [
      { q: "Hoe snel krijg ik antwoord?", a: "Binnen twee werkdagen, van een mens. Dringend? Bel 059 70 99 69." },
      { q: "Moet ik al een briefing hebben?", a: "Nee. Een idee zonder vorm, een probleem of een ambitie is genoeg. Kies eventueel een dienst in de ring hierboven als onderwerp; niet zeker mag ook." },
      { q: "Werken jullie ook buiten Oostende?", a: "Ja, in heel België en online daarbuiten, in het Nederlands, Frans en Engels." },
    ],
    fr: [
      { q: "En combien de temps recevrai-je une réponse ?", a: "Sous deux jours ouvrables, d'un humain. Urgent ? Appelez le 059 70 99 69." },
      { q: "Dois-je déjà avoir un brief ?", a: "Non. Une idée sans forme, un problème ou une ambition suffit. Choisissez éventuellement un service dans l'anneau ci-dessus comme sujet ; « pas sûr » est aussi une réponse." },
      { q: "Travaillez-vous aussi en dehors d'Ostende ?", a: "Oui, dans toute la Belgique et en ligne au-delà, en néerlandais, français et anglais." },
    ],
    en: [
      { q: "How fast do I get a reply?", a: "Within two working days, from a human. Urgent? Call +32 59 70 99 69." },
      { q: "Do I need a brief already?", a: "No. An idea without a shape, a problem or an ambition is enough. Pick a service in the ring above as the subject if you like; 'not sure' works too." },
      { q: "Do you also work outside Ostend?", a: "Yes, across Belgium and online beyond, in Dutch, French and English." },
    ],
  },
};

export const FAQ_TITLE: Record<Lang, { h: string; eyebrow: string }> = {
  nl: { h: "Vragen die we vaak krijgen.", eyebrow: "FAQ" },
  fr: { h: "Les questions qu'on nous pose souvent.", eyebrow: "FAQ" },
  en: { h: "Questions we get a lot.", eyebrow: "FAQ" },
};

export const faqFor = (key: string, lang: Lang): QA[] => FAQ[key]?.[lang] ?? [];
