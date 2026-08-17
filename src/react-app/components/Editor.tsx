import type { ChangeEvent, ReactNode } from "react";
import type { Invoice, InvoiceStatus, LineItem, Party } from "../types";
import {
	CURRENCIES,
	discountAmount,
	formatMoney,
	itemTotal,
	subtotal,
	taxAmount,
	total,
	uid,
} from "../lib";

interface EditorProps {
	invoice: Invoice;
	onChange: (inv: Invoice) => void;
}

const STATUSES: { value: InvoiceStatus; label: string }[] = [
	{ value: "draft", label: "Draft" },
	{ value: "sent", label: "Sent" },
	{ value: "paid", label: "Paid" },
];

/* ------------------------------ small helpers ----------------------------- */

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
	return (
		<section className="editor-section">
			<header className="editor-section-head">
				<h2>{title}</h2>
				{hint ? <span className="editor-section-hint">{hint}</span> : null}
			</header>
			<div className="editor-section-body">{children}</div>
		</section>
	);
}

function Field({
	label,
	children,
	wide,
}: {
	label: string;
	children: ReactNode;
	wide?: boolean;
}) {
	return (
		<label className={`field${wide ? " field-wide" : ""}`}>
			<span className="field-label">{label}</span>
			{children}
		</label>
	);
}

function setPartyField(
	inv: Invoice,
	party: "client" | "company",
	key: keyof Party | "tagline" | "phone" | "website",
	value: string,
) {
	const next: Invoice = { ...inv, [party]: { ...inv[party], [key]: value } };
	return next;
}

/* --------------------------------- editor -------------------------------- */

export default function Editor({ invoice, onChange }: EditorProps) {
	const inv = invoice;

	const patch = (partial: Partial<Invoice>) => onChange({ ...inv, ...partial });

	const updateItem = (id: string, patchItem: Partial<LineItem>) =>
		patch({
			items: inv.items.map((item) => (item.id === id ? { ...item, ...patchItem } : item)),
		});

	const removeItem = (id: string) =>
		patch({ items: inv.items.filter((item) => item.id !== id) });

	const addItem = () =>
		patch({ items: [...inv.items, { id: uid(), description: "", quantity: 1, rate: 0 }] });

	const num = (value: string): number => {
		const n = Number.parseFloat(value);
		return Number.isFinite(n) ? n : 0;
	};

	const sub = subtotal(inv.items);
	const discount = discountAmount(inv);
	const tax = taxAmount(inv);
	const grand = total(inv);

	return (
		<div className="editor">
			<Section title="Event details" hint="What's on the calendar">
				<Field label="Event name" wide>
					<input
						type="text"
						value={inv.eventName}
						placeholder="e.g. The Sterling Wedding"
						onChange={(e) => patch({ eventName: e.target.value })}
					/>
				</Field>
				<Field label="Event date">
					<input
						type="date"
						value={inv.eventDate}
						onChange={(e) => patch({ eventDate: e.target.value })}
					/>
				</Field>
				<Field label="Venue">
					<input
						type="text"
						value={inv.venue}
						placeholder="e.g. The Grand Pavilion"
						onChange={(e) => patch({ venue: e.target.value })}
					/>
				</Field>
			</Section>

			<Section title="Invoice details">
				<Field label="Invoice number">
					<input type="text" value={inv.id} onChange={(e) => patch({ id: e.target.value })} />
				</Field>
				<Field label="Status">
					<select
						value={inv.status}
						onChange={(e) => patch({ status: e.target.value as InvoiceStatus })}
					>
						{STATUSES.map((s) => (
							<option key={s.value} value={s.value}>
								{s.label}
							</option>
						))}
					</select>
				</Field>
				<Field label="Issue date">
					<input
						type="date"
						value={inv.issueDate}
						onChange={(e) => patch({ issueDate: e.target.value })}
					/>
				</Field>
				<Field label="Due date">
					<input
						type="date"
						value={inv.dueDate}
						onChange={(e) => patch({ dueDate: e.target.value })}
					/>
				</Field>
				<Field label="Currency" wide>
					<select
						value={inv.currency}
						onChange={(e) => patch({ currency: e.target.value })}
					>
						{CURRENCIES.map((c) => (
							<option key={c.code} value={c.code}>
								{c.label}
							</option>
						))}
					</select>
				</Field>
			</Section>

			<Section title="Bill to" hint="Your client">
				<Field label="Name / organization" wide>
					<input
						type="text"
						value={inv.client.name}
						placeholder="e.g. Maya & Daniel Sterling"
						onChange={(e) => onChange(setPartyField(inv, "client", "name", e.target.value))}
					/>
				</Field>
				<Field label="Contact person">
					<input
						type="text"
						value={inv.client.contact}
						placeholder="Primary contact"
						onChange={(e) => onChange(setPartyField(inv, "client", "contact", e.target.value))}
					/>
				</Field>
				<Field label="Email">
					<input
						type="email"
						value={inv.client.email}
						placeholder="client@example.com"
						onChange={(e) => onChange(setPartyField(inv, "client", "email", e.target.value))}
					/>
				</Field>
				<Field label="Address" wide>
					<textarea
						rows={2}
						value={inv.client.address}
						placeholder={"Street\nCity, ZIP"}
						onChange={(e) => onChange(setPartyField(inv, "client", "address", e.target.value))}
					/>
				</Field>
			</Section>

			<Section title="Your company" hint="Shown on the invoice">
				<Field label="Company name" wide>
					<input
						type="text"
						value={inv.company.name}
						onChange={(e) => onChange(setPartyField(inv, "company", "name", e.target.value))}
					/>
				</Field>
				<Field label="Tagline" wide>
					<input
						type="text"
						value={inv.company.tagline}
						onChange={(e) => onChange(setPartyField(inv, "company", "tagline", e.target.value))}
					/>
				</Field>
				<Field label="Address" wide>
					<textarea
						rows={2}
						value={inv.company.address}
						onChange={(e) => onChange(setPartyField(inv, "company", "address", e.target.value))}
					/>
				</Field>
				<Field label="Phone">
					<input
						type="text"
						value={inv.company.phone}
						onChange={(e) => onChange(setPartyField(inv, "company", "phone", e.target.value))}
					/>
				</Field>
				<Field label="Email">
					<input
						type="email"
						value={inv.company.email}
						onChange={(e) => onChange(setPartyField(inv, "company", "email", e.target.value))}
					/>
				</Field>
				<Field label="Website">
					<input
						type="text"
						value={inv.company.website}
						onChange={(e) => onChange(setPartyField(inv, "company", "website", e.target.value))}
					/>
				</Field>
			</Section>

			<Section title="Line items" hint="Services, packages & add-ons">
				<div className="items-head">
					<span className="items-head-desc">Description</span>
					<span>Qty</span>
					<span>Rate</span>
					<span>Amount</span>
					<span aria-hidden="true" />
				</div>
				<ul className="items-list">
					{inv.items.map((item, index) => (
						<li key={item.id} className="item-row">
							<input
								className="item-desc"
								type="text"
								value={item.description}
								placeholder={index === 0 ? "e.g. Event design & planning" : "Description"}
								onChange={(e) => updateItem(item.id, { description: e.target.value })}
							/>
							<input
								className="item-qty"
								type="number"
								min={0}
								step="any"
								inputMode="decimal"
								value={Number.isFinite(item.quantity) ? item.quantity : 0}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									updateItem(item.id, { quantity: num(e.target.value) })
								}
							/>
							<input
								className="item-rate"
								type="number"
								min={0}
								step="any"
								inputMode="decimal"
								value={Number.isFinite(item.rate) ? item.rate : 0}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									updateItem(item.id, { rate: num(e.target.value) })
								}
							/>
							<span className="item-amount">{formatMoney(itemTotal(item), inv.currency)}</span>
							<button
								type="button"
								className="icon-btn item-remove"
								aria-label={`Remove item ${index + 1}`}
								disabled={inv.items.length === 1}
								onClick={() => removeItem(item.id)}
							>
								<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
									<path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
								</svg>
							</button>
						</li>
					))}
				</ul>
				<button type="button" className="add-item-btn" onClick={addItem}>
					<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
						<path d="M12 5v14M5 12h14" />
					</svg>
					Add line item
				</button>
			</Section>

			<Section title="Totals">
				<Field label="Discount type">
					<select
						value={inv.discountType}
						onChange={(e) =>
							patch({ discountType: e.target.value as "percent" | "flat" })
						}
					>
						<option value="percent">Percent (%)</option>
						<option value="flat">Flat amount</option>
					</select>
				</Field>
				<Field label={inv.discountType === "percent" ? "Discount %" : "Discount amount"}>
					<input
						type="number"
						min={0}
						step="any"
						inputMode="decimal"
						value={Number.isFinite(inv.discountValue) ? inv.discountValue : 0}
						onChange={(e) => patch({ discountValue: num(e.target.value) })}
					/>
				</Field>
				<Field label="Tax rate %" wide>
					<input
						type="number"
						min={0}
						step="any"
						inputMode="decimal"
						value={Number.isFinite(inv.taxRate) ? inv.taxRate : 0}
						onChange={(e) => patch({ taxRate: num(e.target.value) })}
					/>
				</Field>
				<div className="totals-mini">
					<div>
						<span>Subtotal</span>
						<strong>{formatMoney(sub, inv.currency)}</strong>
					</div>
					<div>
						<span>Discount</span>
						<strong>− {formatMoney(discount, inv.currency)}</strong>
					</div>
					<div>
						<span>Tax</span>
						<strong>{formatMoney(tax, inv.currency)}</strong>
					</div>
					<div className="totals-mini-grand">
						<span>Total</span>
						<strong>{formatMoney(grand, inv.currency)}</strong>
					</div>
				</div>
			</Section>

			<Section title="Notes & terms">
				<Field label="Notes" wide>
					<textarea
						rows={3}
						value={inv.notes}
						placeholder="Thank-you message, deposit info, delivery details…"
						onChange={(e) => patch({ notes: e.target.value })}
					/>
				</Field>
				<Field label="Payment terms" wide>
					<textarea
						rows={2}
						value={inv.terms}
						onChange={(e) => patch({ terms: e.target.value })}
					/>
				</Field>
			</Section>
		</div>
	);
}
