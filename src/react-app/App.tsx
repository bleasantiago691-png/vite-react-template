import { ChangeEvent, useEffect, useRef, useState } from "react";
import "./App.css";

type CardData = {
	name: string;
	studentId: string;
	program: string;
	school: string;
	year: string;
	campus: string;
	validUntil: string;
	email: string;
	photo: string | null;
};

const DEFAULT_CARD: CardData = {
	name: "Amina Njeri",
	studentId: "NU • 26 • 1048",
	program: "BSc Information Science",
	school: "School of Computing",
	year: "Year 3 · Full-time",
	campus: "Main Campus",
	validUntil: "30 Nov 2026",
	email: "amina.njeri@example.test",
	photo: null,
};

const iconProps = {
	viewBox: "0 0 24 24",
	width: "18",
	height: "18",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "1.8",
	strokeLinecap: "round" as const,
	strokeLinejoin: "round" as const,
};

function Mark({ small = false }: { small?: boolean }) {
	return (
		<div className={`brand-mark${small ? " brand-mark-small" : ""}`} aria-hidden="true">
			<svg viewBox="0 0 40 40" width={small ? "24" : "30"} height={small ? "24" : "30"}>
				<path d="M20 3.5 33 8.7v9.2c0 8.3-5.3 14.9-13 18.3-7.7-3.4-13-10-13-18.3V8.7L20 3.5Z" fill="currentColor" opacity=".16" />
				<path d="m12.8 27 3.1-14h3.1l1 5.8 1-5.8h3.2l3 14h-3.4l-1.4-8.5-1.3 8.5h-2.4l-1.3-8.5-1.4 8.5h-3.2Z" fill="currentColor" />
			</svg>
		</div>
	);
}

function Icon({ name }: { name: "print" | "upload" | "refresh" | "shield" | "sparkle" | "check" }) {
	if (name === "print") {
		return <svg {...iconProps}><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v7H6z" /><path d="M18 12h.01" /></svg>;
	}
	if (name === "upload") {
		return <svg {...iconProps}><path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" /><path d="M5 14v5h14v-5" /></svg>;
	}
	if (name === "refresh") {
		return <svg {...iconProps}><path d="M20 11a8 8 0 0 0-14.7-4L3 10" /><path d="M3 5v5h5M4 13a8 8 0 0 0 14.7 4L21 14" /><path d="M21 19v-5h-5" /></svg>;
	}
	if (name === "shield") {
		return <svg {...iconProps}><path d="M12 3 20 6v5.5c0 4.9-3.2 8.6-8 9.8-4.8-1.2-8-4.9-8-9.8V6l8-3Z" /><path d="m8.6 12 2.2 2.2 4.7-4.7" /></svg>;
	}
	if (name === "sparkle") {
		return <svg {...iconProps}><path d="m12 3-1.1 4.7a4 4 0 0 1-2.9 2.9L3.3 12l4.7 1.4a4 4 0 0 1 2.9 2.9L12 21l1.1-4.7a4 4 0 0 1 2.9-2.9l4.7-1.4-4.7-1.4a4 4 0 0 1-2.9-2.9L12 3Z" /></svg>;
	}
	return <svg {...iconProps}><path d="m5 12 4 4L19 6" /></svg>;
}

function initials(name: string) {
	return name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join("") || "NU";
}

function Field({
	label,
	value,
	onChange,
	placeholder,
	wide = false,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	wide?: boolean;
}) {
	return (
		<label className={`field${wide ? " field-wide" : ""}`}>
			<span>{label}</span>
			<input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
		</label>
	);
}

function StudentCard({ card }: { card: CardData }) {
	return (
		<article className="student-card" aria-label="Student identity card preview">
			<div className="card-watermark">SAMPLE · NOT VALID</div>
			<div className="card-accent-bar" />
			<div className="card-topline">
				<div className="card-institution">
					<Mark small />
					<div>
						<strong>NAIROBI UNIVERSITY</strong>
						<span>Student identity card · design preview</span>
					</div>
				</div>
				<div className="card-demo-pill">DEMO CARD</div>
			</div>

			<div className="card-body">
				<div className="card-photo-wrap">
					{card.photo ? (
						<img className="card-photo" src={card.photo} alt="Student portrait" />
					) : (
						<div className="card-photo-placeholder">
							<strong>{initials(card.name)}</strong>
							<span>PHOTO</span>
						</div>
					)}
				</div>
				<div className="card-details">
					<p className="card-eyebrow">STUDENT</p>
					<h2>{card.name || "Student name"}</h2>
					<div className="card-id-row">
						<span>Student no.</span>
						<strong>{card.studentId || "NU • 00 • 0000"}</strong>
					</div>
					<div className="card-field-list">
						<div><span>Programme</span><strong>{card.program || "Programme"}</strong></div>
						<div><span>School</span><strong>{card.school || "School / faculty"}</strong></div>
						<div><span>Study status</span><strong>{card.year || "Year · Status"}</strong></div>
					</div>
				</div>
			</div>

			<div className="card-footer">
				<div>
					<span>Campus</span>
					<strong>{card.campus || "Campus"}</strong>
				</div>
				<div>
					<span>Valid through</span>
					<strong>{card.validUntil || "Date"}</strong>
				</div>
				<div className="card-code" aria-hidden="true" />
			</div>
			<div className="card-notice"><Icon name="shield" /> SAMPLE — NOT A REAL UNIVERSITY CREDENTIAL</div>
		</article>
	);
}

const STORAGE_KEY = "card-studio:nairobi-demo:v1";

function App() {
	const [card, setCard] = useState<CardData>(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			return saved ? { ...DEFAULT_CARD, ...(JSON.parse(saved) as Partial<CardData>) } : DEFAULT_CARD;
		} catch {
			return DEFAULT_CARD;
		}
	});
	const [activeTab, setActiveTab] = useState<"details" | "appearance">("details");
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(card));
		} catch {
			// Storage can be disabled or full; the editor still works in memory.
		}
	}, [card]);

	const update = (key: keyof CardData, value: string | null) => {
		setCard((current) => ({ ...current, [key]: value }));
	};

	const handlePhoto = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.addEventListener("load", () => update("photo", typeof reader.result === "string" ? reader.result : null));
		reader.readAsDataURL(file);
	};

	const reset = () => {
		setCard(DEFAULT_CARD);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	return (
		<div className="app-shell">
			<header className="app-header">
				<div className="header-brand">
					<Mark />
					<div>
						<div className="brand-name">Card Studio</div>
						<div className="brand-subtitle">Student ID designer</div>
					</div>
				</div>
				<div className="header-center"><span className="status-dot" />Local draft <span className="header-divider" />No data leaves your browser</div>
				<div className="header-actions">
					<button type="button" className="button button-light" onClick={reset}><Icon name="refresh" />Reset</button>
					<button type="button" className="button button-dark" onClick={() => window.print()}><Icon name="print" />Print / save PDF</button>
				</div>
			</header>

			<main className="workspace">
				<aside className="editor-panel">
					<div className="panel-heading">
						<div>
							<p className="overline">Nairobi University · template</p>
							<h1>Build your card</h1>
						</div>
						<div className="template-badge"><Icon name="sparkle" />Template 01</div>
					</div>
					<div className="safety-note"><Icon name="shield" /><span><strong>Design preview only.</strong> This card is marked as a sample and is not affiliated with or valid for admission, access, or identification.</span></div>

					<div className="editor-tabs" role="tablist" aria-label="Card editor sections">
						<button type="button" role="tab" aria-selected={activeTab === "details"} className={activeTab === "details" ? "active" : ""} onClick={() => setActiveTab("details")}>Student details</button>
						<button type="button" role="tab" aria-selected={activeTab === "appearance"} className={activeTab === "appearance" ? "active" : ""} onClick={() => setActiveTab("appearance")}>Photo & notes</button>
					</div>

					{activeTab === "details" ? (
						<div className="form-grid">
							<Field label="Full name" value={card.name} onChange={(value) => update("name", value)} wide placeholder="e.g. Amina Njeri" />
							<Field label="Student number" value={card.studentId} onChange={(value) => update("studentId", value)} placeholder="NU • 26 • 0000" />
							<Field label="Campus" value={card.campus} onChange={(value) => update("campus", value)} placeholder="Main Campus" />
							<Field label="Programme" value={card.program} onChange={(value) => update("program", value)} wide placeholder="BSc Information Science" />
							<Field label="School / faculty" value={card.school} onChange={(value) => update("school", value)} />
							<Field label="Year & status" value={card.year} onChange={(value) => update("year", value)} placeholder="Year 3 · Full-time" />
							<Field label="Valid through" value={card.validUntil} onChange={(value) => update("validUntil", value)} />
						</div>
					) : (
						<div className="appearance-panel">
							<div className="upload-box">
								<div className="upload-preview">
									{card.photo ? <img src={card.photo} alt="Uploaded student portrait" /> : <strong>{initials(card.name)}</strong>}
								</div>
								<div className="upload-copy"><strong>Add a portrait</strong><span>JPG or PNG · square works best</span></div>
								<input ref={fileInputRef} type="file" accept="image/png,image/jpeg" onChange={handlePhoto} hidden />
								<button type="button" className="button button-upload" onClick={() => fileInputRef.current?.click()}><Icon name="upload" />{card.photo ? "Replace" : "Upload"}</button>
							</div>
							<div className="mini-copy"><Icon name="check" />Image is processed locally in this preview.</div>
							<label className="field field-wide"><span>Contact email <em>optional</em></span><input value={card.email} onChange={(event) => update("email", event.target.value)} placeholder="name@example.test" /></label>
							<div className="editor-callout"><span className="callout-icon"><Icon name="sparkle" /></span><p><strong>Make it yours</strong><br />Use a neutral portrait and placeholder details for a polished, shareable concept.</p></div>
						</div>
					)}

					<div className="editor-footer">
						<div className="save-state"><span className="saved-check"><Icon name="check" /></span><span><strong>Autosaved locally</strong><small>Just now · browser only</small></span></div>
						<button type="button" className="text-button" onClick={reset}>Restore sample</button>
					</div>
				</aside>

				<section className="preview-panel" aria-label="Student ID preview">
					<div className="preview-heading">
						<div><p className="overline">Live preview</p><h2>Front of card</h2></div>
						<div className="preview-meta"><span className="preview-dot" />Updates as you type</div>
					</div>
					<div className="preview-stage">
						<div className="card-wrap"><StudentCard card={card} /></div>
						<div className="preview-caption"><span>Standard card ratio · 85.6 × 54 mm</span><span>Includes sample watermark</span></div>
					</div>
					<div className="preview-footer">
						<div><span className="footer-icon"><Icon name="shield" /></span><p><strong>Safe by design</strong><span>This concept uses an original mark and a permanent “SAMPLE · NOT VALID” label.</span></p></div>
						<button type="button" className="button button-outline" onClick={() => window.print()}><Icon name="print" />Print preview</button>
					</div>
				</section>
			</main>
			<footer className="app-footer"><span>Card Studio</span><span>Prototype workspace</span><span>For design exploration only · Not an official university document</span></footer>
		</div>
	);
}

export default App;
