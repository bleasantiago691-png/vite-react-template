import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CapIcon, ConfettiIcon, HeartIcon, PetalIcon, SparkIcon } from "./art";
import { card } from "./message";
import "./App.css";

type Stage = "sealed" | "opening" | "open";
type Ornament = (props: { size?: number }) => React.ReactElement;

const PETALS = 18;
const BURST = 34;
const OPEN_MS = 1250;

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

const PETAL_ART: Ornament[] = [HeartIcon, PetalIcon, SparkIcon];
const BURST_ART: Ornament[] = [HeartIcon, HeartIcon, SparkIcon, ConfettiIcon, CapIcon];

/* ── hearts and petals drifting through the background ─────────────────── */
function Petals() {
	const bits = useMemo(
		() =>
			Array.from({ length: PETALS }, (_, i) => ({
				id: i,
				Art: PETAL_ART[i % PETAL_ART.length],
				left: rand(0, 100),
				size: rand(11, 26),
				delay: rand(0, 16),
				duration: rand(14, 26),
				drift: rand(-70, 70),
				opacity: rand(0.22, 0.6),
			})),
		[],
	);

	return (
		<div className="petals" aria-hidden="true">
			{bits.map((b) => (
				<span
					key={b.id}
					className="petal"
					style={{
						left: `${b.left}%`,
						opacity: b.opacity,
						animationDelay: `${b.delay}s`,
						animationDuration: `${b.duration}s`,
						["--drift" as string]: `${b.drift}px`,
					}}
				>
					<b.Art size={b.size} />
				</span>
			))}
		</div>
	);
}

/* ── the celebration that fires when the card opens ────────────────────── */
function HeartBurst({ seed }: { seed: number }) {
	const bits = useMemo(
		() =>
			Array.from({ length: BURST }, (_, i) => ({
				id: `${seed}-${i}`,
				Art: BURST_ART[i % BURST_ART.length],
				x: rand(-42, 42),
				y: rand(-74, -16),
				rot: rand(-170, 170),
				size: rand(13, 30),
				delay: rand(0, 0.45),
				duration: rand(1.6, 2.9),
				hue: i % 3 === 0 ? "gold" : "rose",
			})),
		[seed],
	);

	return (
		<div className="burst" aria-hidden="true">
			{bits.map((b) => (
				<span
					key={b.id}
					className={`burst-bit ${b.hue}`}
					style={{
						animationDelay: `${b.delay}s`,
						animationDuration: `${b.duration}s`,
						["--dx" as string]: `${b.x}vw`,
						["--dy" as string]: `${b.y}vh`,
						["--rot" as string]: `${b.rot}deg`,
					}}
				>
					<b.Art size={b.size} />
				</span>
			))}
		</div>
	);
}

function App() {
	const [stage, setStage] = useState<Stage>("sealed");
	const [round, setRound] = useState(0);
	const [burst, setBurst] = useState(0);
	const [reduced, setReduced] = useState(false);
	const timer = useRef<number | undefined>(undefined);
	const cardRef = useRef<HTMLElement | null>(null);
	const firstOpen = useRef(true);

	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const sync = () => setReduced(mq.matches);
		sync();
		mq.addEventListener("change", sync);
		return () => mq.removeEventListener("change", sync);
	}, []);

	useEffect(() => () => window.clearTimeout(timer.current), []);

	const playOpening = useCallback((ms: number, again: boolean) => {
		window.clearTimeout(timer.current);
		timer.current = window.setTimeout(() => {
			setStage("open");
			setBurst((n) => n + 1);
			if (again) setRound((n) => n + 1);
		}, ms);
	}, []);

	const openCard = useCallback(() => {
		if (!firstOpen.current) return;
		firstOpen.current = false;
		setStage("opening");
		playOpening(reduced ? 0 : OPEN_MS, false);
	}, [playOpening, reduced]);

	const readAgain = useCallback(() => {
		setStage("opening");
		playOpening(reduced ? 0 : 900, true);
	}, [playOpening, reduced]);

	const sealBack = useCallback(() => {
		window.clearTimeout(timer.current);
		firstOpen.current = true;
		setStage("sealed");
	}, []);

	/* bring the card into view (and move focus into it) once it is open */
	useEffect(() => {
		if (stage !== "open") return;
		const node = cardRef.current;
		if (!node) return;
		node.focus({ preventScroll: true });
		node.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
	}, [stage, round, reduced]);

	const revealed = stage === "open";
	const opening = stage === "opening";

	return (
		<div className={`gift stage-${stage}`}>
			<Petals />
			<span className="glow" aria-hidden="true" />
			{burst > 0 ? <HeartBurst key={burst} seed={burst} /> : null}

			{/* ─────────────── the sealed envelope ─────────────── */}
			<main className={`scene ${revealed ? "is-hidden" : ""}`} aria-hidden={revealed}>
				<p className="scene-kicker">Something special for</p>
				<h2 className="scene-name">{card.recipient}</h2>

				<button
					type="button"
					className={`envelope ${opening ? "is-open" : ""}`}
					onClick={openCard}
					tabIndex={revealed ? -1 : 0}
					aria-label={`Open the gift card for ${card.recipient}`}
				>
					<span className="env-body">
						<span className="env-letter" aria-hidden="true">
							<span className="env-letter-line" />
							<span className="env-letter-line short" />
							<HeartIcon size={17} className="env-letter-heart" />
						</span>
						<span className="env-pocket" aria-hidden="true" />
						<span className="env-flap" aria-hidden="true">
							<span className="face front" />
							<span className="face back" />
						</span>
						<span className="env-front" aria-hidden="true">
							<span className="env-lines" />
							<span className="env-to">
								<span className="env-to-label">To</span>
								<span className="env-to-name">{card.recipient}</span>
							</span>
							<span className="env-from">from {card.sender}</span>
						</span>
						<span className="env-seal" aria-hidden="true">
							<span className="env-seal-letter">{card.sealLetter}</span>
							<span className="env-seal-shine" />
						</span>
					</span>
				</button>

				<p className="scene-hint">
					<span className="tap-dot" aria-hidden="true" />
					Tap the seal to open your card
				</p>
				<p className="scene-sub">Wishing you every success in your final exams</p>
			</main>

			{/* ─────────────── the card, once opened ─────────────── */}
			{revealed ? (
				<main className="revealed">
					<article
						className="card"
						key={round}
						ref={cardRef}
						tabIndex={-1}
						aria-label={`A message for ${card.recipient} from ${card.sender}`}
					>
						<div className="card-inner">
							<span className="card-watermark" aria-hidden="true">
								<HeartIcon size={260} />
							</span>
							<header className="card-head">
								<p className="card-eyebrow reveal" style={{ animationDelay: "0.05s" }}>
									{card.eyebrow}
								</p>
								<h1 className="card-title reveal" style={{ animationDelay: "0.2s" }}>
									{card.headline}
								</h1>
								<p className="card-sub reveal" style={{ animationDelay: "0.42s" }}>
									{card.subhead}
								</p>
								<span className="card-rule reveal" style={{ animationDelay: "0.58s" }} aria-hidden="true">
									<span className="rule-line" />
									<HeartIcon size={13} className="rule-heart" />
									<span className="rule-line" />
								</span>
							</header>

							<div className="card-body">
								<p className="greeting reveal" style={{ animationDelay: "0.75s" }}>
									{card.greeting}
								</p>
								{card.paragraphs.map((text, i) => (
									<p key={i} className="reveal" style={{ animationDelay: `${1.02 + i * 0.34}s` }}>
										{text}
									</p>
								))}
								<p
									className="closing reveal"
									style={{ animationDelay: `${1.06 + card.paragraphs.length * 0.34}s` }}
								>
									{card.closing}
								</p>
							</div>

							<footer className="card-foot">
								<p
									className="signature reveal"
									style={{ animationDelay: `${1.32 + card.paragraphs.length * 0.34}s` }}
								>
									{card.signature}
								</p>
								<p
									className="footnote reveal"
									style={{ animationDelay: `${1.62 + card.paragraphs.length * 0.34}s` }}
								>
									{card.footnote}
								</p>
							</footer>
						</div>
						<span className="card-corner tl" aria-hidden="true" />
						<span className="card-corner tr" aria-hidden="true" />
						<span className="card-corner bl" aria-hidden="true" />
						<span className="card-corner br" aria-hidden="true" />
					</article>

					<div className="card-actions">
						<button type="button" className="btn btn-primary" onClick={readAgain}>
							Read it again
						</button>
						<button type="button" className="btn btn-ghost" onClick={() => setBurst((n) => n + 1)}>
							Send love <HeartIcon size={13} className="btn-heart" />
						</button>
						<button type="button" className="btn btn-ghost" onClick={sealBack}>
							Seal it back
						</button>
					</div>
				</main>
			) : null}
		</div>
	);
}

export default App;
