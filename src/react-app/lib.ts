import type { Invoice, LineItem } from "./types";

/* ---------------------------------- ids ---------------------------------- */

export const uid = (): string =>
	Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

/* -------------------------------- currency ------------------------------- */

export const CURRENCIES = [
	{ code: "USD", label: "USD — US Dollar" },
	{ code: "EUR", label: "EUR — Euro" },
	{ code: "GBP", label: "GBP — British Pound" },
	{ code: "AED", label: "AED — UAE Dirham" },
	{ code: "AUD", label: "AUD — Australian Dollar" },
	{ code: "CAD", label: "CAD — Canadian Dollar" },
	{ code: "CHF", label: "CHF — Swiss Franc" },
	{ code: "NGN", label: "NGN — Nigerian Naira" },
	{ code: "KES", label: "KES — Kenyan Shilling" },
	{ code: "ZAR", label: "ZAR — South African Rand" },
	{ code: "INR", label: "INR — Indian Rupee" },
	{ code: "SGD", label: "SGD — Singapore Dollar" },
] as const;

const moneyFormatCache = new Map<string, Intl.NumberFormat>();

export function formatMoney(value: number, currency: string): string {
	const cacheKey = currency;
	let fmt = moneyFormatCache.get(cacheKey);
	if (!fmt) {
		try {
			fmt = new Intl.NumberFormat(undefined, {
				style: "currency",
				currency,
				currencyDisplay: "symbol",
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			});
		} catch {
			fmt = new Intl.NumberFormat(undefined, {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			});
		}
		moneyFormatCache.set(cacheKey, fmt);
	}
	const fallback = `${currency} ${value.toFixed(2)}`;
	try {
		return fmt.format(value);
	} catch {
		return fallback;
	}
}

export const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

/* --------------------------------- dates --------------------------------- */

export function toISODate(d: Date): string {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
}

export function addDays(iso: string, days: number): string {
	const d = new Date(`${iso}T00:00:00`);
	if (Number.isNaN(d.getTime())) return iso;
	d.setDate(d.getDate() + days);
	return toISODate(d);
}

export function formatDate(iso: string): string {
	if (!iso) return "—";
	const d = new Date(`${iso}T00:00:00`);
	if (Number.isNaN(d.getTime())) return iso;
	return d.toLocaleDateString(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export function formatDateShort(iso: string): string {
	if (!iso) return "—";
	const d = new Date(`${iso}T00:00:00`);
	if (Number.isNaN(d.getTime())) return iso;
	return d.toLocaleDateString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

/* ------------------------------- calculations ---------------------------- */

export const itemTotal = (item: LineItem): number =>
	round2((Number(item.quantity) || 0) * (Number(item.rate) || 0));

export const subtotal = (items: LineItem[]): number =>
	round2(items.reduce((sum, item) => sum + itemTotal(item), 0));

export function discountAmount(inv: Invoice): number {
	const sub = subtotal(inv.items);
	const value = Number(inv.discountValue) || 0;
	if (value <= 0) return 0;
	if (inv.discountType === "percent") return round2((sub * value) / 100);
	return Math.min(round2(value), sub);
}

export function taxAmount(inv: Invoice): number {
	const taxable = subtotal(inv.items) - discountAmount(inv);
	return round2((taxable * (Number(inv.taxRate) || 0)) / 100);
}

export const total = (inv: Invoice): number =>
	round2(subtotal(inv.items) - discountAmount(inv) + taxAmount(inv));

export const balanceDue = (inv: Invoice): number => (inv.status === "paid" ? 0 : total(inv));

/* ------------------------------ invoice numbers -------------------------- */

const COUNTER_KEY = "absolute-events:counter:v1";

export function nextInvoiceNumber(): string {
	const year = new Date().getFullYear();
	let n = 1;
	let storedYear = 0;
	try {
		const raw = localStorage.getItem(COUNTER_KEY);
		if (raw) {
			const parsed = JSON.parse(raw) as { year: number; n: number };
			storedYear = Number(parsed.year) || 0;
			n = Number(parsed.n) || 0;
		}
	} catch {
		/* ignore corrupt storage */
	}
	n = storedYear === year ? n + 1 : 1;
	try {
		localStorage.setItem(COUNTER_KEY, JSON.stringify({ year, n }));
	} catch {
		/* storage may be unavailable */
	}
	return `AE-${year}-${String(n).padStart(3, "0")}`;
}

/* -------------------------------- persistence ---------------------------- */

const CURRENT_KEY = "absolute-events:current:v1";
const SAVED_KEY = "absolute-events:saved:v1";

export function loadCurrent(): Invoice | null {
	try {
		const raw = localStorage.getItem(CURRENT_KEY);
		return raw ? (JSON.parse(raw) as Invoice) : null;
	} catch {
		return null;
	}
}

export function persistCurrent(inv: Invoice): void {
	try {
		localStorage.setItem(CURRENT_KEY, JSON.stringify(inv));
	} catch {
		/* storage may be full or unavailable */
	}
}

export function loadSaved(): Invoice[] {
	try {
		const raw = localStorage.getItem(SAVED_KEY);
		return raw ? (JSON.parse(raw) as Invoice[]) : [];
	} catch {
		return [];
	}
}

export function persistSaved(list: Invoice[]): void {
	try {
		localStorage.setItem(SAVED_KEY, JSON.stringify(list));
	} catch {
		/* storage may be full or unavailable */
	}
}

/* --------------------------------- sample -------------------------------- */

export function makeBlankInvoice(number: string): Invoice {
	const today = toISODate(new Date());
	return {
		id: number,
		status: "draft",
		issueDate: today,
		dueDate: addDays(today, 14),
		eventName: "",
		eventDate: "",
		venue: "",
		client: { name: "", contact: "", email: "", address: "" },
		company: {
			name: "Absolute Events",
			tagline: "Event Production & Management",
			address: "21 Celebration Avenue\nSuite 400, New York, NY 10001",
			phone: "+1 (555) 010-2233",
			email: "billing@absoluteevents.co",
			website: "www.absoluteevents.co",
		},
		items: [
			{ id: uid(), description: "", quantity: 1, rate: 0 },
		],
		currency: "USD",
		taxRate: 0,
		discountType: "percent",
		discountValue: 0,
		notes: "",
		terms: "Payment due within 14 days of the invoice date.",
		updatedAt: Date.now(),
	};
}

export function makeSampleInvoice(number: string): Invoice {
	const today = toISODate(new Date());
	const inv = makeBlankInvoice(number);
	inv.eventName = "The Sterling Wedding — Reception & After-Party";
	inv.eventDate = addDays(today, 21);
	inv.venue = "The Grand Pavilion, Riverside Gardens";
	inv.client = {
		name: "Maya & Daniel Sterling",
		contact: "Maya Sterling",
		email: "maya.sterling@example.com",
		address: "18 Birchwood Lane\nOakville, CA 94107",
	};
	inv.items = [
		{ id: uid(), description: "Event design & full-service planning", quantity: 1, rate: 2500 },
		{ id: uid(), description: "Venue styling & décor package", quantity: 1, rate: 3400 },
		{ id: uid(), description: "Catering — plated dinner (per guest)", quantity: 120, rate: 85 },
		{ id: uid(), description: "Sound, lighting & stage production", quantity: 1, rate: 2900 },
		{ id: uid(), description: "Photography & videography (10 hours)", quantity: 1, rate: 3200 },
		{ id: uid(), description: "Live band — 4 piece, two sets", quantity: 1, rate: 2200 },
	];
	inv.taxRate = 8.25;
	inv.discountType = "percent";
	inv.discountValue = 5;
	inv.notes =
		"Thank you for choosing Absolute Events. A 40% deposit confirms the date; the remaining balance is due 7 days before the event.";
	inv.terms =
		"Payment due within 14 days. Late payments may incur a 1.5% monthly service fee.";
	return inv;
}
