# ZAD Business Process System: Deluge Workflows

App: `agaramsoft2demo / zad-business-process-system`, development environment.

The Creator API can't create workflows, so paste each script below in
**Creator → Edit app → Workflow → Form Workflows** (or **Functions** for section 1).
Each heading names the form, the event and the trigger.

Every field name below comes from the app as built. Test in development
before you publish.

---

## 0. Setup order

1. Create the **Locations** records first: *Main Store*, *Production*, *DIC Store*, *Online*.
2. Paste the functions in section 1.
3. Paste the form workflows in sections 2 to 16.
4. Load opening stock with one **Stock Adjustment** per location, using reason *Opening Stock*.

---

## 1. Functions (Workflow → Functions)

### 1a. `stock.post` posts one stock movement

Namespace: `stock`. Every stock-moving form calls this. It writes a
Stock Ledger row and updates `Stock_On_Hand`, and keeps the old whole-number
`current_stock` field in sync.

```deluge
void stock.post(int itemId, int locationId, decimal qtyIn, decimal qtyOut, string batch, date expiry, string sourceType, string sourceRef)
{
	if(itemId == null)
	{
		return;
	}
	insert into Stock_Ledger
	[
		Added_User = zoho.loginuser
		Movement_Date = zoho.currentdate
		Item = itemId
		Location = locationId
		Quantity_In = qtyIn
		Quantity_Out = qtyOut
		Batch_Number = batch
		Expiry_Date = expiry
		Source_Type = sourceType
		Source_Reference = sourceRef
	];
	itm = inventory_item[ID == itemId];
	if(itm.count() > 0)
	{
		newQty = ifnull(itm.Stock_On_Hand,0) + qtyIn - qtyOut;
		itm.Stock_On_Hand = newQty;
		itm.current_stock = newQty.round(0).toLong();
	}
}
```

### 1b. `stock.locationStock` gives the balance of an item at one location

```deluge
decimal stock.locationStock(int itemId, int locationId)
{
	qIn = Stock_Ledger[Item == itemId && Location == locationId].sum(Quantity_In);
	qOut = Stock_Ledger[Item == itemId && Location == locationId].sum(Quantity_Out);
	return ifnull(qIn,0) - ifnull(qOut,0);
}
```

### 1c. `stock.postAssembly` consumes raw materials and adds the finished good

Called from the Assembly workflow and the Daily Production Sheet. If the
assembly has no material lines, it calculates them from the linked BOM,
including the waste %.

```deluge
void stock.postAssembly(int assemblyId)
{
	asm = assembly[ID == assemblyId];
	if(asm.count() == 0 || asm.Stock_Posted == true)
	{
		return;
	}
	ref = ifnull(asm.assembly_name,"ASM-" + assemblyId);
	qty = ifnull(asm.total_quantity,0);
	hasLines = false;
	for each ml in asm.Materials_Consumed
	{
		if(ml.raw_material != null && ifnull(ml.consumed_quantity,0) > 0)
		{
			hasLines = true;
			thisapp.stock.post(ml.raw_material, asm.Production_Location, 0.0, ml.consumed_quantity.toDecimal(), "", null, "Assembly Consumption", ref);
		}
	}
	if(!hasLines && asm.Related_BOM != null)
	{
		bom = bill_of_material[ID == asm.Related_BOM];
		for each c in bom.BOM_Components
		{
			need = ifnull(c.required_quantity,0) * qty * (1 + ifnull(c.waste_percentage,0) / 100);
			if(c.raw_material != null && need > 0)
			{
				thisapp.stock.post(c.raw_material, asm.Production_Location, 0.0, need.toDecimal(), "", null, "Assembly Consumption", ref);
			}
		}
	}
	if(qty > 0)
	{
		thisapp.stock.post(asm.finished_good, asm.Production_Location, qty.toDecimal(), 0.0, ifnull(asm.Batch_Number,""), asm.Expiry_Date, "Assembly Output", ref);
	}
	asm.Stock_Posted = true;
	// close the linked production requirement
	if(asm.Related_Production_Requirement != null)
	{
		pr = production_requirement[ID == asm.Related_Production_Requirement];
		pr.status = "Completed";
	}
}
```

### 1d. `sales.createInvoiceFromSO` turns a sales order into an invoice

Applies any paid retainer (advance) on the order. Skips the order if it
already has an invoice.

```deluge
int sales.createInvoiceFromSO(int soId, int shipmentId)
{
	so = sales_order[ID == soId];
	if(so.count() == 0)
	{
		return 0;
	}
	existing = invoice[related_so == soId];
	if(existing.count() > 0)
	{
		return existing.ID;
	}
	total = 0.0;
	for each l in so.SO_Items
	{
		total = total + ifnull(l.quantity,0) * ifnull(l.unit_price,0) - ifnull(l.discount,0);
	}
	adv = Retainer_Invoice[Related_Sales_Order == soId && (Status == "Paid" || Status == "Partially Paid")].sum(Amount_Received);
	adv = ifnull(adv,0);
	ret = Retainer_Invoice[Related_Sales_Order == soId];
	retId = if(ret.count() > 0, ret.ID, null);
	invNo = "INV-" + ifnull(so.sales_order_number,soId.toString());
	newId = insert into invoice
	[
		Added_User = zoho.loginuser
		invoice_number = invNo
		related_so = soId
		customer = so.customer
		invoice_date = zoho.currentdate
		due_date = zoho.currentdate.addDay(30)
		total_amount = total
		advance_paid = adv
		outstanding_balance = total - adv
		Related_Retainer = retId
		Related_Shipment = shipmentId
		Invoice_Currency = so.Order_Currency
		status = "Issued"
	];
	if(retId != null)
	{
		r = Retainer_Invoice[ID == retId];
		r.Status = "Applied To Invoice";
		r.Applied_To_Invoice = newId;
	}
	return newId;
}
```

### 1e. `finance.refreshInvoice` recalculates the invoice balance and status

```deluge
void finance.refreshInvoice(int invId)
{
	inv = invoice[ID == invId];
	if(inv.count() == 0)
	{
		return;
	}
	rcv = payment[Related_Invoice == invId && (payment_type == "Payment Received" || payment_type == "Received")].sum(amount);
	rcv = ifnull(rcv,0);
	gross = ifnull(inv.total_amount,0) + ifnull(inv.VAT_Amount,0);
	bal = gross - ifnull(inv.advance_paid,0) - rcv;
	inv.Amount_Received = rcv;
	inv.outstanding_balance = bal;
	if(inv.status != "Draft")
	{
		if(bal <= 0)
		{
			inv.status = "Paid";
		}
		else if(rcv > 0 || ifnull(inv.advance_paid,0) > 0)
		{
			inv.status = "Partially Paid";
		}
		else if(inv.due_date != null && inv.due_date < zoho.currentdate)
		{
			inv.status = "Overdue";
		}
		else
		{
			inv.status = "Issued";
		}
	}
}
```

### 1f. `finance.refreshBill` and `finance.refreshRetainer`

```deluge
void finance.refreshBill(int billId)
{
	b = Purchase_Bill[ID == billId];
	if(b.count() == 0)
	{
		return;
	}
	paid = payment[Related_Bill == billId && (payment_type == "Paid To Supplier" || payment_type == "Vendor Advance")].sum(amount);
	paid = ifnull(paid,0);
	b.Amount_Paid = paid;
	gross = ifnull(b.Sub_Total,0) + ifnull(b.Tax_Amount,0);
	if(paid >= gross && gross > 0)
	{
		b.Status = "Paid";
	}
	else if(paid > 0)
	{
		b.Status = "Partially Paid";
	}
	else if(b.Due_Date != null && b.Due_Date < zoho.currentdate)
	{
		b.Status = "Overdue";
	}
}

void finance.refreshRetainer(int retId)
{
	r = Retainer_Invoice[ID == retId];
	if(r.count() == 0 || r.Status == "Applied To Invoice")
	{
		return;
	}
	got = payment[Related_Retainer == retId && (payment_type == "Advance Received" || payment_type == "Advanced")].sum(amount);
	got = ifnull(got,0);
	r.Amount_Received = got;
	if(got >= ifnull(r.Advance_Amount,0) && got > 0)
	{
		r.Status = "Paid";
	}
	else if(got > 0)
	{
		r.Status = "Partially Paid";
	}
}
```

---

## 2. Default dates (On Load, all add forms)

**Event:** Form → *Load of the form* → *Created*. Paste the line that
matches each form:

| Form | Script |
|---|---|
| Quote | `input.Quote_Date = zoho.currentdate;` |
| Purchase Bill | `input.Bill_Date = zoho.currentdate;` |
| Retainer Invoice | `input.Retainer_Date = zoho.currentdate;` |
| Picklist | `input.Picklist_Date = zoho.currentdate;` |
| Package | `input.Package_Date = zoho.currentdate;` |
| Daily Production Plan | `input.Plan_Date = zoho.currentdate;` |
| Daily Production Sheet | `input.Sheet_Date = zoho.currentdate;` |
| Sales Order | `input.order_date = zoho.currentdate;` |
| Purchase Order | `input.order_date = zoho.currentdate;` |
| Goods Receipt | `input.receipt_date = zoho.currentdate;` |
| Invoice | `input.invoice_date = zoho.currentdate;` `input.due_date = zoho.currentdate.addDay(30);` |
| Payment | `input.payment_date = zoho.currentdate;` |
| Sales Return | `input.Return_Date = zoho.currentdate;` |
| Stock Adjustment | `input.Adjustment_Date = zoho.currentdate;` |
| Assembly | `input.production_date = zoho.currentdate;` |

Also on the **On Load** of the **Created** event for these forms, hide the fields scripts fill in:
`hide Stock_Posted;` on Goods Receipt, Stock Transfer, Package, Assembly, Sales Return and Stock Adjustment.

---

## 3. Quote

**On user input** of `Quote_Items.Quantity`, `Quote_Items.Unit_Price` and `Quote_Items.Discount`:
```deluge
row.Line_Total = ifnull(row.Quantity,0) * ifnull(row.Unit_Price,0) - ifnull(row.Discount,0);
t = 0.0;
for each r in input.Quote_Items
{
	t = t + ifnull(r.Line_Total,0);
}
input.Total_Amount = t;
```

**On user input** of `Customer`. It fills the channel from the customer type:
```deluge
if(input.Customer != null)
{
	c = customer[ID == input.Customer];
	if(c.customer_type == "Export" || c.customer_type == "Private Label")
	{
		input.Sales_Channel = c.customer_type;
	}
}
```

**On Validate (Created or Edited).** This recalculates the totals as a backstop:
```deluge
t = 0.0;
for each r in input.Quote_Items
{
	r.Line_Total = ifnull(r.Quantity,0) * ifnull(r.Unit_Price,0) - ifnull(r.Discount,0);
	t = t + r.Line_Total;
}
input.Total_Amount = t;
```

**On Success (Created or Edited).** This converts the quote to a Sales Order when its status is set to *Accepted*:
```deluge
if(input.Status == "Accepted" && input.Converted_Sales_Order == null)
{
	soNo = "SO-Q" + input.Quote_Number;
	soId = insert into sales_order
	[
		Added_User = zoho.loginuser
		sales_order_number = soNo
		customer = input.Customer
		order_date = zoho.currentdate
		channel = input.Sales_Channel
		Brand_Name = input.Brand_Name
		Order_Currency = input.Currency
		Related_Quote = input.ID
		total_amount = input.Total_Amount
		Approval_Required = (input.Sales_Channel == "Export" || input.Sales_Channel == "Private Label")
		status = "Draft"
	];
	for each r in input.Quote_Items
	{
		insert into so_line_item
		[
			Added_User = zoho.loginuser
			parent_so = soId
			item = r.Item
			quantity = r.Quantity.round(0).toLong()
			unit_price = r.Unit_Price
			discount = r.Discount
		];
	}
	q = Quote[ID == input.ID];
	q.Status = "Converted";
	q.Converted_Sales_Order = soId;
}
```

---

## 4. Sales Order

**On user input** of `channel`:
```deluge
input.Approval_Required = (input.channel == "Export" || input.channel == "Private Label");
```

**On Validate (Created or Edited):**
```deluge
t = 0.0;
for each l in input.SO_Items
{
	t = t + ifnull(l.quantity,0) * ifnull(l.unit_price,0) - ifnull(l.discount,0);
}
input.total_amount = t;
// export and private label orders need an approved label before shipping
if(input.Approval_Required == true && (input.status == "Shipped" || input.status == "Delivered"))
{
	ok = approval_document[related_so == input.ID && approval_status == "Approved"].count();
	if(ok == 0)
	{
		alert "This order needs an approved Label / Authority Approval Document before it can be shipped.";
		cancel submit;
	}
}
```

**On Success (Created or Edited).** When the order is *Confirmed*, this creates a Make To Order requirement for each line where stock is short:
```deluge
if(input.status == "Confirmed" && production_requirement[related_sales_order == input.ID].count() == 0)
{
	for each l in input.SO_Items
	{
		if(l.item != null)
		{
			itm = inventory_item[ID == l.item];
			onHand = ifnull(itm.Stock_On_Hand,0);
			need = ifnull(l.quantity,0);
			if(onHand < need && itm.item_type != "Raw Material")
			{
				insert into production_requirement
				[
					Added_User = zoho.loginuser
					requirement_type = "Make To Order"
					related_sales_order = input.ID
					sku = l.item
					planned_quantity = (need - onHand).round(0).toLong()
					current_stock = onHand.round(0).toLong()
					reorder_level = itm.reorder_level
					shortage_quantity = (need - onHand).round(0).toLong()
					status = "Pending"
				];
			}
		}
	}
}
```

---

## 5. Production Requirement

**On user input** of `sku`:
```deluge
if(input.sku != null)
{
	itm = inventory_item[ID == input.sku];
	input.current_stock = ifnull(itm.Stock_On_Hand,0).round(0).toLong();
	input.reorder_level = itm.reorder_level;
}
```

**On user input** of `planned_quantity`. This replaces the existing on-input script, so merge them if that one does something else:
```deluge
s = ifnull(input.planned_quantity,0) - ifnull(input.current_stock,0);
input.shortage_quantity = if(s > 0, s, 0);
```

**On Success (Edited).** When a requirement is *Approved*, this checks raw-material stock against the active BOM:
```deluge
if(input.status == "Approved" && input.sku != null)
{
	bom = bill_of_material[finished_good == input.sku && is_active == true];
	if(bom.count() > 0)
	{
		msg = "Raw material check (" + zoho.currentdate + "):\n";
		short = false;
		for each c in bom.BOM_Components
		{
			need = ifnull(c.required_quantity,0) * ifnull(input.planned_quantity,0) * (1 + ifnull(c.waste_percentage,0) / 100);
			rm = inventory_item[ID == c.raw_material];
			have = ifnull(rm.Stock_On_Hand,0);
			if(have < need)
			{
				short = true;
				msg = msg + "- " + rm.item_name + ": need " + need + ", have " + have + " -> order " + (need - have) + "\n";
			}
		}
		if(!short)
		{
			msg = msg + "All raw materials available.";
		}
		pr = production_requirement[ID == input.ID];
		pr.notes = ifnull(pr.notes,"") + "\n" + msg;
	}
}
```

**Schedule (Workflow → Schedules), daily at 06:00.** For Make To Stock, this raises a requirement for each finished good below its reorder level:
```deluge
for each itm in inventory_item[item_type == "Finished Good" && is_active == true]
{
	if(itm.reorder_level != null && ifnull(itm.Stock_On_Hand,0) < itm.reorder_level)
	{
		open = production_requirement[sku == itm.ID && (status == "Pending" || status == "Approved")].count();
		if(open == 0)
		{
			insert into production_requirement
			[
				Added_User = zoho.adminuser
				requirement_type = "Make To Stock"
				sku = itm.ID
				current_stock = ifnull(itm.Stock_On_Hand,0).round(0).toLong()
				reorder_level = itm.reorder_level
				planned_quantity = (itm.reorder_level * 2 - ifnull(itm.Stock_On_Hand,0)).round(0).toLong()
				shortage_quantity = (itm.reorder_level - ifnull(itm.Stock_On_Hand,0)).round(0).toLong()
				status = "Pending"
			];
		}
	}
}
```

---

## 6. Purchase Order

**On Validate (Created or Edited):**
```deluge
t = 0.0;
for each l in input.PO_Items
{
	t = t + ifnull(l.ordered_quantity,0) * ifnull(l.unit_price,0) + ifnull(l.tax_amount,0);
}
input.total_amount = t;
```

---

## 7. Goods Receipt (stock in)

**On Success (Created or Edited):**
```deluge
if(input.Stock_Posted != true && (input.status == "Received" || input.status == "Partial"))
{
	for each l in input.Received_Items
	{
		good = ifnull(l.received_quantity,0) - ifnull(l.damaged_quantity,0);
		if(l.item != null && good > 0)
		{
			thisapp.stock.post(l.item, input.Receiving_Location, good.toDecimal(), 0.0, ifnull(l.Batch_Number,""), l.Expiry_Date, "Goods Receipt", ifnull(input.receipt_number,""));
		}
	}
	gr = goods_receipt[ID == input.ID];
	gr.Stock_Posted = true;
	// update the PO status
	if(input.related_po != null)
	{
		po = purchase_order[ID == input.related_po];
		ordered = 0;
		for each pl in po.PO_Items
		{
			ordered = ordered + ifnull(pl.ordered_quantity,0);
		}
		got = 0;
		for each g in goods_receipt[related_po == input.related_po && Stock_Posted == true]
		{
			for each gl in g.Received_Items
			{
				got = got + ifnull(gl.received_quantity,0) - ifnull(gl.damaged_quantity,0);
			}
		}
		po.status = if(ordered > 0 && got >= ordered, "Completed", "Partially Received");
	}
}
```

---

## 8. Purchase Bill

**On user input** of `Related_PO`. This fills in the supplier and lines from the PO:
```deluge
if(input.Related_PO != null)
{
	po = purchase_order[ID == input.Related_PO];
	input.Supplier = po.supplier;
	input.Currency = po.currency;
	rows = Collection();
	for each pl in po.PO_Items
	{
		r = Purchase_Bill.Bill_Items();
		r.Item = pl.item;
		r.Quantity = pl.ordered_quantity;
		r.Unit_Price = pl.unit_price;
		r.Tax_Amount = pl.tax_amount;
		r.Line_Total = ifnull(pl.ordered_quantity,0) * ifnull(pl.unit_price,0) + ifnull(pl.tax_amount,0);
		rows.insert(r);
	}
	input.Bill_Items.clear();
	input.Bill_Items.insert(rows);
}
```

**On Validate (Created or Edited):**
```deluge
sub = 0.0;
tax = 0.0;
for each r in input.Bill_Items
{
	r.Line_Total = ifnull(r.Quantity,0) * ifnull(r.Unit_Price,0) + ifnull(r.Tax_Amount,0);
	sub = sub + ifnull(r.Quantity,0) * ifnull(r.Unit_Price,0);
	tax = tax + ifnull(r.Tax_Amount,0);
}
if(input.Bill_Items.count() > 0)
{
	input.Sub_Total = sub;
	input.Tax_Amount = tax;
}
```

---

## 9. Stock Transfer (move between locations)

**On Validate (Created or Edited):**
```deluge
if(input.From_Location == input.To_Location)
{
	alert "From and To locations must be different.";
	cancel submit;
}
if(input.Stock_Posted != true && (input.status == "Transferred" || input.status == "Delivered"))
{
	for each l in input.Transfer_Items
	{
		avail = thisapp.stock.locationStock(l.item, input.From_Location);
		if(ifnull(l.quantity,0) > avail)
		{
			alert "Not enough stock at the source location for one of the items (available: " + avail + ").";
			cancel submit;
		}
	}
}
```

**On Success (Created or Edited):**
```deluge
if(input.Stock_Posted != true && (input.status == "Transferred" || input.status == "Delivered"))
{
	ref = ifnull(input.transfer_number,"TRF-" + input.ID);
	for each l in input.Transfer_Items
	{
		q = ifnull(l.quantity,0).toDecimal();
		if(l.item != null && q > 0)
		{
			thisapp.stock.post(l.item, input.From_Location, 0.0, q, "", null, "Stock Transfer", ref);
			thisapp.stock.post(l.item, input.To_Location, q, 0.0, "", null, "Stock Transfer", ref);
		}
	}
	st = stock_transfer[ID == input.ID];
	st.Stock_Posted = true;
}
```

---

## 10. Assembly (job order and RM consumption)

**On user input** of `finished_good` and `production_date`. This sets the expiry from shelf life and picks the active BOM:
```deluge
if(input.finished_good != null)
{
	fg = inventory_item[ID == input.finished_good];
	if(fg.Shelf_Life_Days != null && input.production_date != null)
	{
		input.Expiry_Date = input.production_date.addDay(fg.Shelf_Life_Days);
	}
	b = bill_of_material[finished_good == input.finished_good && is_active == true];
	if(b.count() > 0)
	{
		input.Related_BOM = b.ID;
	}
}
```

**On user input** of `Related_BOM` and `total_quantity`. This fills the materials from the BOM:
```deluge
if(input.Related_BOM != null && ifnull(input.total_quantity,0) > 0)
{
	bom = bill_of_material[ID == input.Related_BOM];
	rows = Collection();
	for each c in bom.BOM_Components
	{
		r = assembly.Materials_Consumed();
		r.raw_material = c.raw_material;
		r.consumed_quantity = (ifnull(c.required_quantity,0) * input.total_quantity * (1 + ifnull(c.waste_percentage,0) / 100)).round(0).toLong();
		rows.insert(r);
	}
	input.Materials_Consumed.clear();
	input.Materials_Consumed.insert(rows);
}
```

**On Success (Created or Edited):**
```deluge
if(input.status == "Completed")
{
	thisapp.stock.postAssembly(input.ID);
}
```

---

## 11. Daily Production Plan and Sheet

**Daily Production Plan, On user input** of `Plan_Lines.Production_Requirement`:
```deluge
if(row.Production_Requirement != null)
{
	pr = production_requirement[ID == row.Production_Requirement];
	row.Item = pr.sku;
	row.Planned_Quantity = pr.planned_quantity;
	if(pr.requirement_type == "Make To Order")
	{
		row.Priority = "High";
	}
}
```

**Daily Production Sheet, On user input** of `Related_Plan`. This copies the plan lines into the output lines:
```deluge
if(input.Related_Plan != null)
{
	p = Daily_Production_Plan[ID == input.Related_Plan];
	input.Production_Location = p.Production_Location;
	input.Shift = p.Shift;
	rows = Collection();
	for each pl in p.Plan_Lines
	{
		r = Daily_Production_Sheet.Production_Output();
		r.Item = pl.Item;
		r.Planned_Quantity = pl.Planned_Quantity;
		rows.insert(r);
	}
	input.Production_Output.clear();
	input.Production_Output.insert(rows);
}
```

**Daily Production Sheet, On Success (Edited).** When the sheet is *Verified*, this creates and posts one Assembly per output line:
```deluge
if(input.Status == "Verified" && input.Related_Assembly == null)
{
	lastId = null;
	for each o in input.Production_Output
	{
		if(o.Item != null && ifnull(o.Produced_Quantity,0) > 0)
		{
			b = bill_of_material[finished_good == o.Item && is_active == true];
			bomId = if(b.count() > 0, b.ID, null);
			aId = insert into assembly
			[
				Added_User = zoho.loginuser
				assembly_name = "DPS-" + input.Sheet_Date + "-" + o.Item
				production_date = input.Sheet_Date
				finished_good = o.Item
				total_quantity = o.Produced_Quantity.round(0).toLong()
				status = "Completed"
				Production_Location = input.Production_Location
				Related_BOM = bomId
				Batch_Number = o.Batch_Number
				Expiry_Date = o.Expiry_Date
			];
			thisapp.stock.postAssembly(aId);
			lastId = aId;
		}
	}
	s = Daily_Production_Sheet[ID == input.ID];
	s.Related_Assembly = lastId;
	if(input.Related_Plan != null)
	{
		p = Daily_Production_Plan[ID == input.Related_Plan];
		p.Status = "Completed";
	}
}
```

---

## 12. Picklist and Package (pick, pack, stock out)

**Picklist, On user input** of `Related_Sales_Order`:
```deluge
if(input.Related_Sales_Order != null)
{
	so = sales_order[ID == input.Related_Sales_Order];
	input.Pick_From_Location = so.Ship_From_Location;
	rows = Collection();
	for each l in so.SO_Items
	{
		r = Picklist.Picklist_Items();
		r.Item = l.item;
		r.Quantity_Ordered = l.quantity;
		r.Quantity_Picked = l.quantity;
		rows.insert(r);
	}
	input.Picklist_Items.clear();
	input.Picklist_Items.insert(rows);
}
```

**Package, On user input** of `Related_Picklist`. It falls back to the sales order when there's no picklist:
```deluge
if(input.Related_Picklist != null)
{
	pk = Picklist[ID == input.Related_Picklist];
	input.Related_Sales_Order = pk.Related_Sales_Order;
	input.Ship_From_Location = pk.Pick_From_Location;
	rows = Collection();
	for each l in pk.Picklist_Items
	{
		r = Package.Package_Items();
		r.Item = l.Item;
		r.Quantity = l.Quantity_Picked;
		rows.insert(r);
	}
	input.Package_Items.clear();
	input.Package_Items.insert(rows);
}
```

**Package, On user input** of `Related_Sales_Order` (when no picklist is used):
```deluge
if(input.Related_Sales_Order != null && input.Related_Picklist == null)
{
	so = sales_order[ID == input.Related_Sales_Order];
	input.Ship_From_Location = so.Ship_From_Location;
	rows = Collection();
	for each l in so.SO_Items
	{
		r = Package.Package_Items();
		r.Item = l.item;
		r.Quantity = l.quantity;
		rows.insert(r);
	}
	input.Package_Items.clear();
	input.Package_Items.insert(rows);
}
```

**Package, On Validate (Created).** This checks stock and the label approval:
```deluge
for each l in input.Package_Items
{
	avail = thisapp.stock.locationStock(l.Item, input.Ship_From_Location);
	if(ifnull(l.Quantity,0) > avail)
	{
		alert "Not enough stock at the ship-from location for one of the items (available: " + avail + ").";
		cancel submit;
	}
}
so = sales_order[ID == input.Related_Sales_Order];
if(so.Approval_Required == true && approval_document[related_so == so.ID && approval_status == "Approved"].count() == 0)
{
	alert "Label / authority approval is still pending for this order.";
	cancel submit;
}
```

**Package, On Success (Created):**
```deluge
if(input.Stock_Posted != true)
{
	ref = "PKG-" + input.Package_Number;
	for each l in input.Package_Items
	{
		if(l.Item != null && ifnull(l.Quantity,0) > 0)
		{
			thisapp.stock.post(l.Item, input.Ship_From_Location, 0.0, l.Quantity, ifnull(l.Batch_Number,""), l.Expiry_Date, "Package", ref);
		}
	}
	p = Package[ID == input.ID];
	p.Stock_Posted = true;
	if(input.Related_Picklist != null)
	{
		pk = Picklist[ID == input.Related_Picklist];
		pk.Status = "Completed";
	}
}
```

---

## 13. Shipment (iFast delivery, POD and invoice)

**On user input** of `Related_Package`:
```deluge
if(input.Related_Package != null)
{
	p = Package[ID == input.Related_Package];
	input.related_so = p.Related_Sales_Order;
}
```

**On user input** of `pod_received`:
```deluge
if(input.pod_received == true)
{
	input.delivery_status = "Delivered";
	if(input.pod_date == null)
	{
		input.pod_date = zoho.currentdate;
	}
}
```

**On Success (Created or Edited):**
```deluge
if(input.related_so != null)
{
	so = sales_order[ID == input.related_so];
	if(input.delivery_status == "In Transit")
	{
		so.status = "Shipped";
	}
	else if(input.delivery_status == "Delivered")
	{
		so.status = "Delivered";
	}
}
if(input.Related_Package != null)
{
	p = Package[ID == input.Related_Package];
	if(input.delivery_status == "In Transit")
	{
		p.Status = "Shipped";
	}
	else if(input.delivery_status == "Delivered")
	{
		p.Status = "Delivered";
	}
}
// Sales invoice created from POD (Shopify, Fusteka and private label flows)
if(input.pod_received == true && input.related_so != null)
{
	thisapp.sales.createInvoiceFromSO(input.related_so, input.ID);
}
```

---

## 14. Invoice and Retainer Invoice

**Invoice, On user input** of `related_so`:
```deluge
if(input.related_so != null)
{
	so = sales_order[ID == input.related_so];
	input.customer = so.customer;
	input.Invoice_Currency = so.Order_Currency;
	t = 0.0;
	for each l in so.SO_Items
	{
		t = t + ifnull(l.quantity,0) * ifnull(l.unit_price,0) - ifnull(l.discount,0);
	}
	input.total_amount = t;
	ret = Retainer_Invoice[Related_Sales_Order == input.related_so && (Status == "Paid" || Status == "Partially Paid")];
	if(ret.count() > 0)
	{
		input.Related_Retainer = ret.ID;
		input.advance_paid = ret.sum(Amount_Received);
	}
}
```

**Invoice, On user input** of `total_amount`, `VAT_Amount` and `advance_paid`:
```deluge
input.outstanding_balance = ifnull(input.total_amount,0) + ifnull(input.VAT_Amount,0) - ifnull(input.advance_paid,0) - ifnull(input.Amount_Received,0);
```

**Invoice, On Success (Created or Edited):**
```deluge
thisapp.finance.refreshInvoice(input.ID);
```

**Retainer Invoice, On user input** of `Related_Quote`:
```deluge
if(input.Related_Quote != null)
{
	q = Quote[ID == input.Related_Quote];
	input.Customer = q.Customer;
	input.Currency = q.Currency;
	input.Related_Sales_Order = q.Converted_Sales_Order;
}
```

**Schedule, daily.** This marks overdue invoices and bills:
```deluge
for each i in invoice[status == "Issued" || status == "Partially Paid"]
{
	thisapp.finance.refreshInvoice(i.ID);
}
for each b in Purchase_Bill[Status == "Open" || Status == "Partially Paid"]
{
	thisapp.finance.refreshBill(b.ID);
}
```

---

## 15. Payment

**On user input** of `payment_type`. It shows only the links that apply to that type:
```deluge
hide Customer;
hide Supplier;
hide Related_Invoice;
hide Related_Bill;
hide Related_Retainer;
hide Related_Purchase_Order;
if(input.payment_type == "Advance Received" || input.payment_type == "Advanced")
{
	show Customer;
	show Related_Retainer;
}
else if(input.payment_type == "Payment Received" || input.payment_type == "Received")
{
	show Customer;
	show Related_Invoice;
}
else if(input.payment_type == "Paid To Supplier" || input.payment_type == "Vendor Advance")
{
	show Supplier;
	show Related_Bill;
	show Related_Purchase_Order;
}
```

**On user input** of `Related_Invoice`, `Related_Retainer` and `Related_Bill`. This fills in the party and the balance due:
```deluge
if(input.Related_Invoice != null)
{
	i = invoice[ID == input.Related_Invoice];
	input.Customer = i.customer;
	input.amount = i.outstanding_balance;
	input.currency = i.Invoice_Currency;
}
if(input.Related_Retainer != null)
{
	r = Retainer_Invoice[ID == input.Related_Retainer];
	input.Customer = r.Customer;
	input.amount = ifnull(r.Advance_Amount,0) - ifnull(r.Amount_Received,0);
	input.currency = r.Currency;
}
if(input.Related_Bill != null)
{
	b = Purchase_Bill[ID == input.Related_Bill];
	input.Supplier = b.Supplier;
	input.amount = ifnull(b.Sub_Total,0) + ifnull(b.Tax_Amount,0) - ifnull(b.Amount_Paid,0);
	input.currency = b.Currency;
}
```

**On Success (Created or Edited)** and **On Delete (After)**. These recalculate the linked document from all of its payments, so edits and deletes stay correct:
```deluge
if(input.Related_Invoice != null)
{
	thisapp.finance.refreshInvoice(input.Related_Invoice);
}
if(input.Related_Retainer != null)
{
	thisapp.finance.refreshRetainer(input.Related_Retainer);
}
if(input.Related_Bill != null)
{
	thisapp.finance.refreshBill(input.Related_Bill);
}
```

---

## 16. Sales Return and Stock Adjustment

**Sales Return, On user input** of `Related_Invoice`:
```deluge
if(input.Related_Invoice != null)
{
	i = invoice[ID == input.Related_Invoice];
	input.Customer = i.customer;
}
```

**Sales Return, On Success (Created or Edited).** Resaleable items go back into stock; damaged and expired items don't:
```deluge
if(input.Stock_Posted != true && (input.Status == "Received" || input.Status == "Credit Issued"))
{
	ref = "RET-" + input.Return_Number;
	for each l in input.Return_Items
	{
		if(l.Item != null && ifnull(l.Quantity,0) > 0 && l.Condition_field == "Resaleable")
		{
			thisapp.stock.post(l.Item, input.Return_To_Location, l.Quantity, 0.0, ifnull(l.Batch_Number,""), null, "Sales Return", ref);
		}
	}
	sr = Sales_Return[ID == input.ID];
	sr.Stock_Posted = true;
}
```

**Stock Adjustment, On Success (Created).** A positive `Quantity_Change` adds stock and a negative one removes it:
```deluge
if(input.Stock_Posted != true)
{
	ref = "ADJ-" + input.Adjustment_Number + " " + input.Reason;
	for each l in input.Adjustment_Items
	{
		q = ifnull(l.Quantity_Change,0);
		if(l.Item != null && q != 0)
		{
			if(q > 0)
			{
				thisapp.stock.post(l.Item, input.Location, q, 0.0, ifnull(l.Batch_Number,""), null, "Stock Adjustment", ref);
			}
			else
			{
				thisapp.stock.post(l.Item, input.Location, 0.0, q * -1, ifnull(l.Batch_Number,""), null, "Stock Adjustment", ref);
			}
		}
	}
	sa = Stock_Adjustment[ID == input.ID];
	sa.Stock_Posted = true;
}
```

---

## 17. Reports to add by hand (Creator UI)

The API can't build reports, so add these in Creator:

- **Stock by Location:** a pivot of *Stock Ledger*. Rows are Item, columns are Location, and the values are Sum(Quantity In) minus Sum(Quantity Out).
- **Batch / Expiry Register:** a list of *Stock Ledger* grouped by Item and Batch, sorted by Expiry Date, with a filter for expiry within 60 days.
- **Low Stock:** a list of *Inventory Item* where Stock On Hand < Reorder Level.
- **Receivables:** a list of *Invoice* where Status is Issued, Partially Paid or Overdue, grouped by Customer.
- **Payables:** a list of *Purchase Bill* where Status is Open, Partially Paid or Overdue, grouped by Supplier.
- **COD Pending from iFast:** a list of *Shipment* where COD Amount > 0 and COD Remitted By Carrier is false.
- **Dashboard page:** tiles for open SOs, pending approvals, low stock, overdue invoices and today's production plan.
