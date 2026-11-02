/**
 * AI voice-guide narration scripts, per page and per language.
 *
 * English ships now. The `af` arrays stay empty until the Afrikaans
 * translation of the narration is approved: while they are empty the
 * EN/AF toggle inside the guide stays hidden and only English plays.
 * To enable Afrikaans later: fill each entry with the SAME `id`s as
 * `en`, and the toggle appears automatically — no other changes needed.
 *
 * Script voice notes:
 * -contractions are written phonetically ("I ll", "you re") so the TTS
 *  voice pronounces them cleanly; if ElevenLabs renders them odd, swap
 *  in full words ("I'll", "you're").
 * -numbers are spelled out ("eight hundred fifty") so the voice reads
 *  prices and counts naturally instead of raw digits.
 */

export interface VoiceLine { id: string; label: string; text: string; }
export interface Script { en: VoiceLine[]; af: VoiceLine[]; introEn: string; introAf: string; }

export const retail: Script = {
  introEn: "Welcome to Onawa Studio. I ll show you how we keep your store looking busy — one section at a time. Ready? Let s go.",
  introAf: "Welkom by Onawa Studio. Ek wys jou hoe ons jou winkel aan die gang hou — een afdeling op 'n slag. Gereed? Kom ons gaan.",
  en: [
    { id: 'problem', label: 'The Reality', text: "Here's the reality: your specials, leaflets and socials never stop needing work. You sell the goods — creating the creative is the extra shift nobody signed up for." },
    { id: 'solution', label: 'The Solution', text: "So we become your creative department. Promos, digital leaflets, four-K motion reels and social publishing — done for you, every week, no new hire." },
    { id: 'proof', label: 'The Proof', text: "This is the quality you re signing up for: real world style posts across Facebook, Instagram, TikTok and WhatsApp — the kind of content that makes people stop scrolling and notice your specials." },
    { id: 'offers', label: 'The Packages', text: "Three plans. OkaLaaitie at eight hundred fifty is the essentials: three designs and a leaflet a week. Omtat, one thousand five hundred, adds motion reels and more room. Mekulu, two thousand five hundred, is unlimited — the whole creative team on tap. No contract, month to month. Pick the one that fits your store." },
  ],
  af: [
    // FILL THESE WHEN THE AFRIKAANS TRANSLATION IS READY (same ids as en):
    // { id: 'problem', label: 'Die Werklikheid', text: "..." },
    // { id: 'solution', label: 'Die Oplossing', text: "..." },
    // { id: 'proof', label: 'Die Bewys', text: "..." },
    // { id: 'offers', label: 'Die Pakette', text: "..." },
  ],
};

export const mall: Script = {
  introEn: "Welcome to Onawa Studio. I ll walk you through how we keep your mall visible and your tenants busy — one section at a time. Ready? Let s go.",
  introAf: "Welkom by Onawa Studio. Ek loop jou deur hoe ons jou mall sigbaar hou en jou huurders besig — een afdeling op 'n slag. Gereed? Kom ons gaan.",
  en: [
    { id: 'problem', label: 'The Reality', text: "Running a mall means keeping a whole town moving under one roof. Tenants count on you for foot traffic — but the content, the countdowns and the campaigns that pull people in? That is a centre of its own to run." },
    { id: 'solution', label: 'The Solution', text: "We handle your mall s feed, tenant promotions and visitor campaigns — so the doors stay busy and your tenants look good." },
    { id: 'proof', label: 'The Proof', text: "This is the standard you re getting: polished, on-brand content that makes your mall feel alive and gives people reasons to visit." },
    { id: 'offers', label: 'The Packages', text: "Two plans. Mall Buzz at one thousand five hundred keeps you visible and promotes your tenants. Mall Buzz plus Web, two thousand, adds a website that connects visitors with your mall and lets prospective tenants register their interest. Pick the one that fits your centre." },
  ],
  af: [
    // FILL THESE WHEN THE AFRIKAANS TRANSLATION IS READY (same ids as en):
  ],
};
