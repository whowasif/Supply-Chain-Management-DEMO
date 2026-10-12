# Procuria guide

This is a plain guide to the demo. It explains what each screen is for, and what a person can do there.

Procuria is a buying system for an office like Dhaka Ahsania Mission. Staff ask for goods, the office buys them, the store receives them, and the supplier gets paid. The same story is shown from two sides:

- **Internal portal** — the office: programmes, procurement, stores, and finance.
- **Supplier portal** — the company that wants to sell to the office. In this demo that company is Bengal Medical Supplies Ltd.

The numbers on screen, including approval limits, VAT, and tax, are **sample figures for the demo**. They are not Ahsania Mission’s official rules. Replace them when the real procurement manual is in hand.

Nothing is saved on a server. The demo keeps its records in the browser. There is no real login and no file upload. A “document” is a title and text you can read or edit.

## How to move around

The left menu changes when you switch portal. The link at the bottom of the menu is **Supplier portal** or **Internal portal**.

The name in the top-right corner is the person you are acting as. On the internal side you can switch among:

- Programme manager
- Procurement officer
- Procurement committee
- Executive Director

Only the person the record is waiting for can approve it. Switching the name does not change the page you are on.

Other tools in the header:

- **Language** switches menu names and page titles between English and Bangla. The forms themselves stay in English.
- **Search** finds a record and opens it.
- **Notifications** lists things that need attention. Open one to go to that record.
- **Tabs** sit under the header. Each visit from the menu opens a new tab, even for a section you already have open. Click a tab to return to it. You can close a tab, but not the last one. Internal tabs and supplier tabs are separate lists.

## How a purchase usually travels

1. A programme writes a **requisition** (what they need, and for which project).
2. The right person **approves** it. A larger purchase needs a stronger buying method.
3. For a quotation, staff record at least three **market survey** quotes. For a tender, they publish it, suppliers bid, and a committee **evaluates**.
4. The office issues a **purchase order**, and sometimes a **contract**.
5. The supplier confirms **delivery** with a challan number. The store posts a **goods receipt**.
6. Medicine goes into **inventory** by batch and expiry. Equipment and vehicles become **assets**.
7. The supplier sends an **invoice**. Finance checks it and marks it paid.

## Internal portal

This is the office workspace.

### Dashboard

**What it is for.** A first look at today’s work.

**What you can do.** See open approvals, spending, and recent records, and start a new requisition.

### Approvals

**What it is for.** The waiting list for decisions.

**What you can do.** Approve, return, or reject a requisition or a supplier invoice. A return needs a written comment. The button works only when you are signed in as the role that record is waiting for.

### Requisitions

**What it is for.** The request to buy something.

**What you can do.** Write a draft, name the project and donor budget, add lines (consumable, medicine, equipment, or vehicle), and submit it. The value picks the buying method and the approver. If you choose a less competitive method than that value requires, you must write a reason. You can print the requisition in Bangla.

### Plans

**What it is for.** The year’s buying plan, before individual requests.

**What you can do.** Record a plan with a budget ceiling, the programme, and planned purchases by quarter.

### Market surveys

**What it is for.** Comparing prices before a smaller purchase.

**What you can do.** Attach quotes to a requisition. A quotation-method request cannot be submitted until three quotes are linked to it.

### Tenders

**What it is for.** An open or limited competition that suppliers can see.

**What you can do.** Draft a tender from an approved requisition, set the document fee and tender security, publish it, add papers (including a corrigendum), record the opening minute, and answer a supplier’s clarification question. Publishing does not require the opening minute.

### Evaluations

**What it is for.** The committee’s decision on the bids.

**What you can do.** Score a bidder, record the result as awarded or unsuccessful, and write the committee note. Awarding a very large purchase requires that note. From an award you can create a draft purchase order.

### Suppliers

**What it is for.** The companies the office buys from.

**What you can do.** Invite a supplier and keep their trade licence, TIN, BIN, bank account, and categories. You can return the file for correction (a comment is required) or mark it verified. A supplier cannot submit a bid until the file is verified.

### Purchase orders

**What it is for.** The official order sent to a supplier.

**What you can do.** Create an order from an award or an approved requisition, choose the project and delivery place, save a draft, and issue it. An issued order is what the supplier delivers against. You can print the order in Bangla.

### Contracts

**What it is for.** The agreement after an award, especially when work is paid in milestones.

**What you can do.** Record the supplier, the linked purchase order, the dates, the value, the performance security note, and the milestones. You can save a draft or activate the contract. The supplier accepts or declines it on their own portal.

### Receiving

**What it is for.** The store’s record that goods arrived.

**What you can do.** Post a goods receipt against a purchase order: choose the store, write the challan, and enter the quantity. Medicine needs a batch and an expiry date. Mark the quality accepted, accepted with remarks, or rejected. Rejected goods do not enter stock. An equipment or vehicle line creates an asset. You can print the receipt in Bangla.

### Inventory

**What it is for.** What is on the shelf, and movements in or out.

**What you can do.** See stock by item, store, batch, expiry, and project. Post a receipt, an issue, or a transfer between stores. A transfer reduces one store and increases the other.

### Store issues

**What it is for.** Giving stock to a ward or an office.

**What you can do.** Choose the store, the destination, who asked, who received, and the project. If you leave the batch blank, the system suggests the earliest expiry that still has stock. You cannot issue more than that batch holds, and you cannot issue expired stock.

### Assets

**What it is for.** Equipment and vehicles the office keeps, not items that get used up.

**What you can do.** See the asset tag, location, custodian, condition, value, and project. Update the condition, custodian, or location. Consumables stay in inventory and do not appear here.

### Invoices and payments

**What it is for.** The supplier’s bill, checked against the order and the goods receipt.

**What you can do.** Record or open an invoice and see the subtotal, VAT, tax withheld, and net payable. Approve, return, or reject a submitted invoice, or mark it paid. The amount used for the check is the net payable. Marking paid is an office action. The supplier cannot do it.

### Reports

**What it is for.** The registers staff already keep on paper.

**What you can do.** Filter and export:

- purchase register
- stock ledger
- items expiring within 90 days
- pending deliveries
- assets by location
- committed spend

You can limit a register to one project. The same item under two projects stays separate.

### Audit trail

**What it is for.** A history of who changed what.

**What you can do.** Read each action: who did it, which record, and the status before and after. Use it when someone asks how a purchase reached its current state.

### Notifications

**What it is for.** A short list of things waiting on you.

**What you can do.** Open a notice to jump to that record, or mark notices as read.

## Supplier portal

This is the selling company’s workspace. In the demo you are Bengal Medical Supplies Ltd. You only see that company’s bids, orders, contracts, and invoices.

### Overview

**What it is for.** The supplier’s home page.

**What you can do.** See how many tenders are open, how many bids you have, how many contracts are waiting for you to accept, how many deliveries are not finished, and how many invoices are not yet paid. Open a recommended tender from the list.

### My company

**What it is for.** The company’s own file.

**What you can do.** Update the trade licence and its expiry, TIN, 13-digit BIN, bank name, account number, and routing number. Submitting a change sends the file back for the office to review. You can submit a bid only while the status is Verified. If the office returns the file, their comment is shown here.

### Available tenders

**What it is for.** Competitions you can still bid on.

**What you can do.** Read the lots, closing date, eligibility, document fee, and tender security. Read the tender papers and any corrigendum. Ask a clarification question, and read the office’s answer. Start a bid from the tender. Fees are recorded amounts in this demo. There is no bank payment.

### My bids

**What it is for.** The offers your company has prepared.

**What you can do.** Save a draft with a technical note, priced lines, and a tender-security reference (a pay order or bank-guarantee number, as text). Submit it after you confirm the declaration. A submitted bid shows a receipt with its number and date. Before the closing date you can replace it (it becomes a draft again) or withdraw it. After closing, you cannot change it. When the office finishes the evaluation, the same bid shows Awarded or Unsuccessful.

### Awards and contracts

**What it is for.** The result of a competition, and the agreement that follows.

**What you can do.** Read whether you were awarded or unsuccessful. Open a contract, read the performance security note and the milestones, and accept or decline it. Accepting is allowed when the contract is active. Declining is recorded. The contract is not deleted. After you accept, you can start an invoice for a milestone.

### Deliveries

**What it is for.** Telling the office what you will ship, and seeing what the store accepted.

**What you can do.** Confirm a delivery against an issued order: the date, the quantities, and a challan number. The challan number is required. After the store posts a goods receipt, you see whether it was accepted, accepted with remarks, or rejected, together with the store’s note.

### Invoices and payments

**What it is for.** Asking to be paid.

**What you can do.** Submit an invoice against a purchase order. Enter the Mushak 6.3 number. Its date must be the same as the invoice date. The screen shows the subtotal, VAT, tax withheld, net payable, and the status: draft, submitted, returned, paid, or rejected. The office marks it paid. You cannot.

### Notices

**What it is for.** A board of results, so you do not have to open every old bid.

**What you can do.** Read award notices for your company, and see tenders that are no longer open.

## Sample approval limits

These limits are only for the demo.

| Purchase value | Buying method | Who approves |
| --- | --- | --- |
| Up to BDT 25,000 | Direct purchase | Programme manager |
| BDT 25,001 to 500,000 | Quotation, at least three quotes | Procurement officer |
| BDT 500,001 to 2,500,000 | Limited tender | Procurement committee |
| Above BDT 2,500,000 | Open tender | Executive Director, after the committee note exists |

A supplier invoice in the demo adds VAT at 15 percent and withholds tax at 5 percent. The payable amount is the subtotal plus VAT, minus the tax withheld.

## What this demo does not do

- It does not log real users in, and it does not store files.
- It does not pay a bank, collect a tender fee online, or sign a document with a digital certificate.
- It does not cover the whole supply chain. It covers buying, receiving, stock, assets, and payment. It does not plan outbound distribution to the field beyond a store issue.
- One supplier account is built in. Other supplier names exist as records the office can use, but you cannot sign in as those companies.
