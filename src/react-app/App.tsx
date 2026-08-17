import { useCallback, useEffect, useRef, useState } from "react";
import type { Invoice } from "./types";
import Editor from "./components/Editor";
import Paper from "./components/Paper";
import SavedDrawer from "./components/SavedDrawer";
import {
	loadCurrent,
	loadSaved,
	makeBlankInvoice,
	makeSampleInvoice,
	nextInvoiceNumber,
	persistCurrent,
	persistSaved,
} from "./lib";
import "./App.css";

let initialInvoice: Invoice | null = null;

function getInitialInvoice(): Invoice {
	// Memoized so React StrictMode's double-invocation of the state
	// initializer can't consume two invoice numbers on first mount.
	if (initialInvoice) return initialInvoice;
	const existing = loadCurrent();
	initialInvoice = existing ?? makeSampleInvoice(nextInvoiceNumber());
	return initialInvoice;
}

function App() {
	const [invoice, setInvoice] = useState<Invoice>(getInitialInvoice);
	const [saved, setSaved] = useState<Invoice[]>(() => loadSaved());
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [toast, setToast] = useState<string | null>(null);
	const toastTimer = useRef<number | undefined>(undefined);

	/* keep the working invoice (draft) persisted */
	useEffect(() => {
		persistCurrent(invoice);
	}, [invoice]);

	const showToast = useCallback((message: string) => {
		setToast(message);
		window.clearTimeout(toastTimer.current);
		toastTimer.current = window.setTimeout(() => setToast(null), 2600);
	}, []);

	const handleChange = (inv: Invoice) => setInvoice({ ...inv, updatedAt: Date.now() });

	const handleNew = () => {
		const fresh = makeBlankInvoice(nextInvoiceNumber());
		setInvoice({ ...fresh, updatedAt: Date.now() });
		showToast(`Started ${fresh.id}`);
	};

	const handleSave = () => {
		const stamp = { ...invoice, updatedAt: Date.now() };
		setInvoice(stamp);
		setSaved((prev) => {
			const exists = prev.some((s) => s.id === stamp.id);
			const next = exists
				? prev.map((s) => (s.id === stamp.id ? stamp : s))
				: [stamp, ...prev];
			persistSaved(next);
			return next;
		});
		showToast(`Saved ${stamp.id}`);
	};

	const handleLoad = (inv: Invoice) => {
		setInvoice({ ...inv, updatedAt: Date.now() });
		setDrawerOpen(false);
		showToast(`Loaded ${inv.id}`);
	};

	const handleDelete = (id: string) => {
		setSaved((prev) => {
			const next = prev.filter((s) => s.id !== id);
			persistSaved(next);
			return next;
		});
		showToast(`Deleted ${id}`);
	};

	const handlePrint = () => {
		window.print();
	};

	return (
		<div className="app">
			<header className="app-header">
				<div className="brand">
					<div className="brand-mark" aria-hidden="true">
						AE
					</div>
					<div className="brand-text">
						<h1>Absolute Events</h1>
						<span>Invoice Studio</span>
					</div>
				</div>
				<nav className="header-actions">
					<button
						type="button"
						className="btn btn-ghost"
						onClick={() => setDrawerOpen(true)}
					>
						<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
						</svg>
						Invoices
						{saved.length > 0 ? <span className="count-pill">{saved.length}</span> : null}
					</button>
					<button type="button" className="btn btn-ghost" onClick={handleNew}>
						<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
							<path d="M12 5v14M5 12h14" />
						</svg>
						New
					</button>
					<button type="button" className="btn btn-ghost" onClick={handleSave}>
						<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
							<path d="M17 21v-8H7v8M7 3v5h8" />
						</svg>
						Save
					</button>
					<button type="button" className="btn btn-primary" onClick={handlePrint}>
						<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
						</svg>
						Download PDF
					</button>
				</nav>
			</header>

			<main className="workspace">
				<aside className="editor-pane">
					<Editor invoice={invoice} onChange={handleChange} />
				</aside>
				<section className="preview-pane" aria-label="Invoice preview">
					<div className="paper-wrap">
						<Paper invoice={invoice} />
					</div>
				</section>
			</main>

			<SavedDrawer
				open={drawerOpen}
				invoices={saved}
				onClose={() => setDrawerOpen(false)}
				onLoad={handleLoad}
				onDelete={handleDelete}
			/>

			{toast ? (
				<div className="toast" role="status">
					{toast}
				</div>
			) : null}
		</div>
	);
}

export default App;
