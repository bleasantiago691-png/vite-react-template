import type { Invoice } from "../types";
import {
	balanceDue,
	discountAmount,
	formatDate,
	formatMoney,
	itemTotal,
	subtotal,
	taxAmount,
	total,
} from "../lib";

const STATUS_LABEL: Record<Invoice["status"], string> = {
	draft: "Draft",
	sent: "Sent",
	paid: "Paid",
};

function Lines({ text }: { text: string }) {
	if (!text) return null;
	return (
		<>
			{text.split("\n").map((line, i) => (
				<span key={i} className="line-block">
					{line}
				</span>
			))}
		</>
	);
}

export default function Paper({ invoice }: { invoice: Invoice }) {
	const inv = invoice;
	const sub = subtotal(inv.items);
	const discount = discountAmount(inv);
	const tax = taxAmount(inv);
	const grand = total(inv);
	const due = balanceDue(inv);

	const discountLabel =
		inv.discountType === "percent"
			? `Discount (${inv.discountValue}%)`
			: "Discount";

	return (
		<div className="paper" data-status={inv.status}>
			{/* header */}
			<div className="paper-top">
				<div className="paper-brand">
					<div className="paper-brand-row">
						<div className="paper-monogram" aria-hidden="true">
							AE
						</div>
						<div>
							<h1 className="paper-company">{inv.company.name || "Absolute Events"}</h1>
							<p className="paper-tagline">{inv.company.tagline}</p>
						</div>
					</div>
					<div className="paper-company-meta">
						<Lines text={inv.company.address} />
						{inv.company.phone ? <span className="line-block">{inv.company.phone}</span> : null}
						{inv.company.email ? <span className="line-block">{inv.company.email}</span> : null}
						{inv.company.website ? <span className="line-block">{inv.company.website}</span> : null}
					</div>
				</div>
				<div className="paper-invoice-head">
					<h2 className="paper-invoice-title">Invoice</h2>
					<div className="paper-invoice-meta">
						<div className="meta-row">
							<span>Invoice no.</span>
							<strong>{inv.id}</strong>
						</div>
						<div className="meta-row">
							<span>Issued</span>
							<strong>{formatDate(inv.issueDate)}</strong>
						</div>
						<div className="meta-row">
							<span>Due</span>
							<strong>{formatDate(inv.dueDate)}</strong>
						</div>
						<div className="meta-row">
							<span>Status</span>
							<strong>
								<span className={`status-badge status-${inv.status}`}>
									{STATUS_LABEL[inv.status]}
								</span>
							</strong>
						</div>
					</div>
				</div>
			</div>

			{/* event strip */}
			{(inv.eventName || inv.eventDate || inv.venue) && (
				<div className="paper-event">
					<span className="paper-event-label">Event</span>
					<div className="paper-event-main">
						<h3 className="paper-event-name">{inv.eventName || "Untitled event"}</h3>
						<div className="paper-event-sub">
							{inv.eventDate ? (
								<span className="event-chip">
									<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
										<rect x="3" y="5" width="18" height="16" rx="2" />
										<path d="M16 3v4M8 3v4M3 10h18" />
									</svg>
									{formatDate(inv.eventDate)}
								</span>
							) : null}
							{inv.venue ? (
								<span className="event-chip">
									<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
										<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
										<circle cx="12" cy="10" r="3" />
									</svg>
									{inv.venue}
								</span>
							) : null}
						</div>
					</div>
				</div>
			)}

			{/* bill to */}
			<div className="paper-billto">
				<span className="paper-billto-label">Bill to</span>
				<strong className="paper-client-name">{inv.client.name || "—"}</strong>
				{inv.client.contact && inv.client.contact !== inv.client.name ? (
					<span className="line-block">Attn: {inv.client.contact}</span>
				) : null}
				{inv.client.email ? <span className="line-block">{inv.client.email}</span> : null}
				<Lines text={inv.client.address} />
			</div>

			{/* items */}
			<table className="paper-table">
				<thead>
					<tr>
						<th className="col-desc">Description</th>
						<th className="col-qty">Qty</th>
						<th className="col-rate">Rate</th>
						<th className="col-amount">Amount</th>
					</tr>
				</thead>
				<tbody>
					{inv.items.map((item) => (
						<tr key={item.id}>
							<td className="col-desc">{item.description || "—"}</td>
							<td className="col-qty">{item.quantity}</td>
							<td className="col-rate">{formatMoney(item.rate || 0, inv.currency)}</td>
							<td className="col-amount">{formatMoney(itemTotal(item), inv.currency)}</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* summary */}
			<div className="paper-summary">
				<div className="summary-lines">
					<div className="summary-row">
						<span>Subtotal</span>
						<strong>{formatMoney(sub, inv.currency)}</strong>
					</div>
					{discount > 0 ? (
						<div className="summary-row">
							<span>{discountLabel}</span>
							<strong>− {formatMoney(discount, inv.currency)}</strong>
						</div>
					) : null}
					{tax > 0 ? (
						<div className="summary-row">
							<span>Tax ({inv.taxRate}%)</span>
							<strong>{formatMoney(tax, inv.currency)}</strong>
						</div>
					) : null}
					<div className="summary-row summary-total">
						<span>Total</span>
						<strong>{formatMoney(grand, inv.currency)}</strong>
					</div>
				</div>
				<div className={`amount-due${inv.status === "paid" ? " amount-due-paid" : ""}`}>
					<span>{inv.status === "paid" ? "Paid in full" : "Amount due"}</span>
					<strong>{formatMoney(due, inv.currency)}</strong>
				</div>
			</div>

			{/* footer */}
			<div className="paper-footer">
				{inv.notes ? (
					<div className="paper-notes">
						<h4>Notes</h4>
						<p>
							<Lines text={inv.notes} />
						</p>
					</div>
				) : null}
				{inv.terms ? (
					<div className="paper-notes">
						<h4>Payment terms</h4>
						<p>
							<Lines text={inv.terms} />
						</p>
					</div>
				) : null}
			</div>

			<div className="paper-legal">
				<p>
					{inv.company.name || "Absolute Events"} · {inv.company.phone} · {inv.company.email} ·{" "}
					{inv.company.website}
				</p>
				<p>Thank you for your business — it was an absolute pleasure!</p>
			</div>
		</div>
	);
}
