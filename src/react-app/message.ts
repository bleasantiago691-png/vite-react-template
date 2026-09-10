/**
 * ─────────────────────────────────────────────────────────────
 *  EVERY WORD OF THE CARD LIVES HERE.
 *  Edit any line below and the gift card updates instantly —
 *  no other file needs to change.
 * ─────────────────────────────────────────────────────────────
 */

export type GiftCard = {
	/** Her name — used on the seal, the envelope and the card. */
	recipient: string;
	/** The first letter shown on the wax seal. */
	sealLetter: string;
	/** Your name, shown on the envelope and under the signature. */
	sender: string;
	/** Small line above the headline. */
	eyebrow: string;
	/** The big handwriting headline. */
	headline: string;
	/** One-line wish under the headline. */
	subhead: string;
	/** How you greet her. */
	greeting: string;
	/** The heart of the message — one string per paragraph. */
	paragraphs: string[];
	/** The last line before your signature. */
	closing: string;
	/** Your sign-off. */
	signature: string;
	/** Little line at the very bottom of the card. */
	footnote: string;
};

export const card: GiftCard = {
	recipient: "Precious",
	sealLetter: "P",
	sender: "Jaden",
	eyebrow: "For my favourite person",
	headline: "Congratulations, Precious",
	subhead: "Wishing you every success in your final exams",
	greeting: "My dearest Precious,",
	paragraphs: [
		"The long nights, the early mornings, the tired eyes bent over your books — every single one of them was a chapter leading to this moment. Today you sit for your final exams, and I need you to walk in knowing one thing for certain: you are ready.",
		"You have worked, prayed and pushed through days you thought you couldn't. So breathe, my love. Read every question slowly, trust everything you have learned, and let that beautiful mind of yours shine the way it always does.",
		"Whatever the paper asks, remember who you are — a woman of strength, grace and quiet brilliance. Answer with confidence, because the girl who studied this hard is the very same girl who is about to shine.",
		"I am so proud of you, Precious. Not only for the marks you are about to earn, but for the woman you have become along the way. Go and write your victory — I will be right here, cheering the loudest for you.",
	],
	closing: "Good luck, my love. You've got this — and you've got me.",
	signature: "Forever yours, Jaden",
	footnote: "Sealed with love, from Jaden — today, tomorrow, always.",
};
