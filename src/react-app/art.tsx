/**
 * Hand-drawn SVG ornaments for the card.
 *
 * Everything decorative is inline SVG rather than an emoji character, so the
 * card looks exactly the same on every phone and laptop — no missing-glyph
 * boxes, no waiting on an emoji font.
 */

type IconProps = {
	size?: number;
	className?: string;
};

export function HeartIcon({ size = 16, className }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			width={size}
			height={size}
			className={className}
			fill="currentColor"
			aria-hidden="true"
			focusable="false"
		>
			<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
		</svg>
	);
}

/** A single falling petal. */
export function PetalIcon({ size = 16, className }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			width={size}
			height={size}
			className={className}
			fill="currentColor"
			aria-hidden="true"
			focusable="false"
		>
			<path d="M12 2.2c-4.5 4.3-6.2 8.1-6.2 11.4a6.2 6.2 0 0 0 12.4 0c0-3.3-1.7-7.1-6.2-11.4Z" />
		</svg>
	);
}

/** A four-point sparkle. */
export function SparkIcon({ size = 16, className }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			width={size}
			height={size}
			className={className}
			fill="currentColor"
			aria-hidden="true"
			focusable="false"
		>
			<path d="M12 1.6l2.3 7.1 7.1 2.3-7.1 2.3L12 20.4l-2.3-7.1-7.1-2.3 7.1-2.3L12 1.6Z" />
		</svg>
	);
}

/** A graduation cap — for the girl who is about to finish strong. */
export function CapIcon({ size = 16, className }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			width={size}
			height={size}
			className={className}
			fill="currentColor"
			aria-hidden="true"
			focusable="false"
		>
			<path d="M12 3.4 1.9 8.2 12 13l10.1-4.8L12 3.4Z" />
			<path d="M5.6 11.1v4.6c0 1.9 2.9 3.4 6.4 3.4s6.4-1.5 6.4-3.4v-4.6L12 14.5l-6.4-3.4Z" />
			<path d="M21.4 8.9v4.9a1 1 0 1 0 1.6 0V8.9h-1.6Z" />
		</svg>
	);
}

/** A little piece of confetti. */
export function ConfettiIcon({ size = 16, className }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			width={size}
			height={size}
			className={className}
			fill="currentColor"
			aria-hidden="true"
			focusable="false"
		>
			<rect x="2" y="9" width="20" height="6" rx="3" />
		</svg>
	);
}
