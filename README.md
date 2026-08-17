# Absolute Events — Invoice Studio

A polished invoice generator for **Absolute Events**, built with React, TypeScript and Vite (on the Cloudflare Workers template). Create branded, print-ready A4 invoices for events in seconds.

## Features

- **Live A4 preview** — every change updates the invoice paper instantly
- **Event-first invoicing** — event name, date and venue get a highlighted strip on the document
- **Editable line items** — add, remove and re-price services, packages and add-ons
- **Automatic math** — subtotal, percentage or flat discounts, tax rate and amount due
- **12 currencies** with proper locale formatting
- **Invoice details** — number, status (draft / sent / paid), issue & due dates
- **Your company & client details** — fully editable, shown on the paper
- **Save & load invoices** — drafts and saved invoices persist in the browser (localStorage)
- **Download PDF** — print the exact A4 document straight to PDF from the browser
- **Auto-numbering** — sequential invoice numbers (`AE-2026-001`, …)

## Getting started

```bash
npm install
npm run dev
```

The app runs at [http://localhost:5173](http://localhost:5173).

## Building & deploying

```bash
npm run build
npm run deploy   # deploy to Cloudflare Workers
```

## Structure

```
src/react-app/
  App.tsx                 app shell, state, toolbar actions
  types.ts                invoice data model
  lib.ts                  money math, dates, numbering, storage
  components/
    Editor.tsx            left-hand form (event, parties, items, totals)
    Paper.tsx             the A4 invoice document
    SavedDrawer.tsx       saved invoices drawer
```
