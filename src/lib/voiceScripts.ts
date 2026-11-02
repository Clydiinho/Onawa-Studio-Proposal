/**
 * Voice-guide narration scripts, per page and per language.
 *
 * Generation-time copy for the Gemini TTS narration (`npm run voice:generate`).
 * English ships now. The `af` arrays stay empty until the Afrikaans narration
 * is approved: while they are empty, Afrikaans narration is simply absent
 * (handled gracefully by the player — English audio is NEVER substituted).
 *
 * Gemini TTS reads the text as a verbatim transcript, so:
 *  - contractions are written normally ("I'll", "you're") — the voice renders
 *    them naturally;
 *  - numbers are spelled ("eight hundred and fifty") so prices and counts are
 *    spoken naturally instead of raw digits;
 *  - the values of every price/plan stay EXACTLY as on the pages.
 */

export interface VoiceLine { id: string; label: string; text: string; }
export interface Script { en: VoiceLine[]; af: VoiceLine[]; introEn: string; introAf: string; }

// HOME — greets the visitor the moment they land, and hands them over to the
// two folder options (retail store / shopping mall). No section lines: the
// proposal pages carry their own narrated tours from there.
export const home: Script = {
  introEn: "Welcome to Onawa Studio. I'm your personal guide. Choose the option that best describes your business — a retail store, or a shopping mall. I'll then show you, section by section, exactly what we would do for you. Take your time. I'm right here.",
  introAf: "Welkom by Onawa Studio. Ek is jou persoonlike gids. Kies die opsie wat die beste by jou besigheid pas — 'n winkel, of 'n winkelsentrum. Ek wys jou daarna, afdeling vir afdeling, presies wat ons vir jou sal doen. Neem jou tyd. Ek is hier.",
  en: [],
  af: [],
};

export const retail: Script = {
  introEn: "Welcome to Onawa Studio. I'll show you how we keep your store looking busy — one section at a time. Ready? Let's go.",
  introAf: "Welkom by Onawa Studio. Ek wys jou hoe ons jou winkel aan die gang hou — een afdeling op 'n slag. Gereed? Kom ons gaan.",
  en: [
    { id: 'problem', label: 'The Reality', text: "Here's the reality: your specials, leaflets and socials never stop needing work. You sell the goods — creating the creative is the extra shift nobody signed up for." },
    { id: 'solution', label: 'The Solution', text: "So we become your creative department. Promos, digital leaflets, four-K motion reels and social publishing — done for you, every week, no new hire." },
    { id: 'proof', label: 'The Proof', text: "This is the quality you're signing up for: real-world-style posts across Facebook, Instagram, TikTok and WhatsApp — the kind of content that makes people stop scrolling and notice your specials." },
    { id: 'offers', label: 'The Packages', text: "Three plans. OkaLaaitie at eight hundred and fifty is the essentials: three designs and a leaflet a week. Omtat, one thousand five hundred, adds motion reels and more room. Mekulu, two thousand five hundred, is unlimited — the whole creative team on tap. No contract, month to month. Pick the one that fits your store." },
    { id: 'next-steps', label: 'Next Steps', text: "And that's the whole story. When you're ready, tap the WhatsApp button and send us one message about your store — we take it from there and show you exactly how we'd start. We're looking forward to hearing from you." },
  ],
  af: [
    { id: 'problem', label: 'Die Werklikheid', text: "Die werklikheid: jou spesiale, pamflette en sosiale bladsye hou nooit op om werk te nodig nie. Jy verkoop die ware — om die ontwerp te skep is die ekstra skof wat niemand onderteken het nie." },
    { id: 'solution', label: 'Die Oplossing', text: "So word ons jou kreatiewe departement. Promosies, digitale pamflette, vier-K-motionreels en sosiale publisering — elke week vir jou gedoen, sonder om iemand nuut aan te stel." },
    { id: 'proof', label: 'Die Bewys', text: "Dit is die gehalte waarvoor jy inskryf: werklike-wêreld-stylplasings oor Facebook, Instagram, TikTok en WhatsApp — die soort inhoud wat mense laat stilhou en jou spesiale raaksien." },
    { id: 'offers', label: 'Die Pakette', text: "Drie planne. OkaLaaitie teen agthonderd vyftig is die essensiëls: drie ontwerpe en 'n pamflet per week. Omtat, een duisend vyfhonderd, voeg motionreels en meer ruimte by. Mekulu, twee duisend vyfhonderd, is onbeperk — die hele kreatiewe span op aanvraag. Geen kontrak nie, maand vir maand. Kies die een wat by jou winkel pas." },
    { id: 'next-steps', label: 'Volgende Stappe', text: "En dis die hele storie. Wanneer jy gereed is, tik die WhatsApp-knoppie en stuur ons een boodskap oor jou winkel — ons neem dit van daar af en wys jou presies hoe ons sou begin. Ons sien uit daarna om van jou te hoor." },
  ],
};

export const mall: Script = {
  introEn: "Welcome to Onawa Studio. I'll walk you through how we keep your mall visible and your tenants busy — one section at a time. Ready? Let's go.",
  introAf: "Welkom by Onawa Studio. Ek loop jou deur hoe ons jou mall sigbaar hou en jou huurders besig — een afdeling op 'n slag. Gereed? Kom ons gaan.",
  en: [
    { id: 'problem', label: 'The Reality', text: "Running a mall means keeping a whole town moving under one roof. Tenants count on you for foot traffic — but the content, the countdowns and the campaigns that pull people in? That is a centre of its own to run." },
    { id: 'solution', label: 'The Solution', text: "We handle your mall's feed, tenant promotions and visitor campaigns — so the doors stay busy and your tenants look good." },
    { id: 'proof', label: 'The Proof', text: "This is the standard you're getting: polished, on-brand content that makes your mall feel alive and gives people reasons to visit." },
    { id: 'offers', label: 'The Packages', text: "Two plans. Mall Buzz at one thousand five hundred keeps you visible and promotes your tenants. Mall Buzz plus Web, two thousand, adds a website that connects visitors with your mall and lets prospective tenants register their interest. Pick the one that fits your centre." },
    { id: 'next-steps', label: 'Next Steps', text: "And that's how Onawa Studio keeps a centre moving. When you're ready, tap the WhatsApp button and send us a message about your mall — we'll show you the plan that fits it. We're looking forward to hearing from you." },
  ],
  af: [
    { id: 'problem', label: 'Die Werklikheid', text: "Die bestuur van 'n sentrum beteken om 'n hele dorp onder een dak aan die beweeg te hou. Huurders staar op jou vir voetverkeer — maar die ontwerpe, die aftellings en die veldtogte wat mense trek? Dis 'n sentrum op sy eie om te bestuur." },
    { id: 'solution', label: 'Die Oplossing', text: "Ons hanteer jou sentrum se sosiale voer, huurder-promosies en besoeker-veldtogte — sodat die deure besig bly en jou huurders goed lyk." },
    { id: 'proof', label: 'Die Bewys', text: "Dit is die standaard wat jy kry: gepoleerde, handelsmerkgetroue inhoud wat jou sentrum lewendig laat voel en mense redes gee om te kom kuier." },
    { id: 'offers', label: 'Die Pakette', text: "Twee planne. Mall Buzz teen een duisend vyfhonderd hou jou sigbaar en bevorder jou huurders. Mall Buzz plus Web, twee duisend, voeg 'n webwerf by wat besoekers met jou sentrum verbind en voornemende huurders laat registreer. Kies die een wat by jou sentrum pas." },
    { id: 'next-steps', label: 'Volgende Stappe', text: "En só hou Onawa Studio 'n sentrum aan die beweeg. Wanneer jy gereed is, tik die WhatsApp-knoppie en stuur ons 'n boodskap oor jou sentrum — ons wys jou die plan wat by dit pas. Ons sien uit daarna om van jou te hoor." },
  ],
};
