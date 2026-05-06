import { jsPDF } from "jspdf";

import type { PurchaseRequest } from "@/types";

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function downloadReceiptPdf(r: PurchaseRequest) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Receipt", 40, 52);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Receipt: ${r.receiptNumber}`, 40, 78);
  doc.text(`Date: ${new Date(r.createdAt).toLocaleString()}`, 40, 96);

  doc.setFont("helvetica", "bold");
  doc.text("Customer", 40, 130);
  doc.setFont("helvetica", "normal");
  doc.text(`${r.customerName}`, 40, 150);
  doc.text(`${r.customerEmail}`, 40, 168);

  doc.setFont("helvetica", "bold");
  doc.text("Item", 40, 206);
  doc.setFont("helvetica", "normal");
  doc.text(`Bike: ${r.bikeName}`, 40, 226);
  doc.text(`Part: ${r.partType} (${r.condition})`, 40, 244);
  doc.text(`Quantity: ${r.quantity}`, 40, 262);
  doc.text(`Unit price: ${money(r.unitPriceCents)}`, 40, 280);

  doc.setFont("helvetica", "bold");
  doc.text(`Total: ${money(r.totalCents)}`, 40, 314);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Thank you for your purchase.", 40, 352);

  doc.save(`${r.receiptNumber}.pdf`);
}

