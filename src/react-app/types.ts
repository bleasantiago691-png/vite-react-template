export type InvoiceStatus = "draft" | "sent" | "paid";

export interface LineItem {
	id: string;
	description: string;
	quantity: number;
	rate: number;
}

export interface Party {
	name: string;
	contact: string;
	email: string;
	address: string;
}

export type Company = Omit<Party, "contact"> & {
	tagline: string;
	phone: string;
	website: string;
};

export interface Invoice {
	/** Invoice number, e.g. AE-2026-001 */
	id: string;
	status: InvoiceStatus;
	issueDate: string; // yyyy-mm-dd
	dueDate: string; // yyyy-mm-dd
	eventName: string;
	eventDate: string; // yyyy-mm-dd
	venue: string;
	client: Party;
	company: Company;
	items: LineItem[];
	currency: string;
	taxRate: number; // percent
	discountType: "percent" | "flat";
	discountValue: number;
	notes: string;
	terms: string;
	updatedAt: number;
}
