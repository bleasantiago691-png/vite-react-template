import { useEffect } from "react";
import type { Invoice } from "../types";
import { formatDateShort, formatMoney, total } from "../lib";

interface SavedDrawerProps {
	open: boolean;
	invoices: Invoice[];
	onClose: () => void;
	onLoad: (inv: Invoice) => void;
	onDelete: (id: string) => void;
}

export default function SavedDrawer({ open, invoices, onClose, onLoad, onDelete }: SavedDrawerProps) {
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	if (!open) return null;

	const sorted = [...invoices].sort((a, b) => b.updatedAt - a.updatedAt);

	return (
		<div className="drawer-backdrop" onClick={onClose} role="presentation">
			<aside
				className="drawer"
				role="dialog"
				aria-label="Saved invoices"
				onClick={(e) => e.stopPropagation()}
			>
				<header className="drawer-head">
					<h2>Saved invoices</h2>
					<button type="button" className="icon-btn" aria-label="Close" onClick={onClose}>
						<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
							<path d="M18 6 6 18M6 6l12 12" />
						</svg>
					</button>
				</header>
				<div className="drawer-body">
					{sorted.length === 0 ? (
						<div className="drawer-empty">
							<p>No saved invoices yet.</p>
							<p className="drawer-empty-sub">
								Hit <strong>Save</strong> on an invoice and it will appear here.
							</p>
						</div>
					) : (
						<ul className="saved-list">
							{sorted.map((inv) => (
								<li key={inv.id} className="saved-card">
									<div className="saved-card-top">
										<strong className="saved-number">{inv.id}</strong>
										<span className={`status-badge status-${inv.status}`}>{inv.status}</span>
									</div>
									<p className="saved-client">{inv.client.name || "No client"}</p>
									<p className="saved-event">{inv.eventName || "Untitled event"}</p>
									<div className="saved-meta">
										<span>{formatDateShort(inv.issueDate)}</span>
										<strong>{formatMoney(total(inv), inv.currency)}</strong>
									</div>
									<div className="saved-actions">
										<button type="button" className="btn btn-small" onClick={() => onLoad(inv)}>
											Load
										</button>
										<button
											type="button"
											className="icon-btn saved-delete"
											aria-label={`Delete ${inv.id}`}
											onClick={() => onDelete(inv.id)}
										>
											<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
												<path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
											</svg>
										</button>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>
			</aside>
		</div>
	);
}
