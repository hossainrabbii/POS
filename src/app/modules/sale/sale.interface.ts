import type {
  Document,
  Types,
} from "mongoose";


// ======================================================
// SALE PAYMENT
// ======================================================

export interface ISalePayment {

  // Amount received from customer.
  amount: number;

  // Owner/employee who received the payment.
  receivedBy: Types.ObjectId;

  // When payment was received.
  paidAt: Date;
}


// ======================================================
// SALE ITEM
// ======================================================

export interface ISaleItem {

  product: Types.ObjectId;

  quantity: number;

  // Purchase price at the time of sale.
  purchasePrice: number;

  // Selling price at the time of sale.
  unitPrice: number;

  // Optional warranty duration in months.
  warrantyMonths?: number | undefined;

  // unitPrice × quantity
  subtotal: number;
}


// ======================================================
// CUSTOMER
// ======================================================

export interface ISaleCustomer {

  name: string;

  phone?: string | undefined;

  address?: string | undefined;
}


// ======================================================
// SALE
// ======================================================

export interface ISale
  extends Document {

  // Unique invoice/receipt number.
  invoiceNumber: string;

  // Owner/employee who completed the sale.
  soldBy: Types.ObjectId;

  // Customer information at the time of sale.
  customer: ISaleCustomer;

  // Products included in the sale.
  items: ISaleItem[];

  subtotal: number;

  discount: number;

  totalAmount: number;

  paidAmount: number;

  dueAmount: number;

  // Optional commitment to pay due amount
  // within X months.
  dueCommitmentMonths?:
    number | undefined;

  // Payment history.
  payments: ISalePayment[];

  createdAt?: Date;

  updatedAt?: Date;
}


// ======================================================
// CREATE SALE
// ======================================================

export interface ICreateSale {

  customer: ISaleCustomer;

  items: {
    productId: string;

    quantity: number;

    warrantyMonths?:
      number | undefined;
  }[];

  discount?:
    number | undefined;

  paidAmount: number;

  dueCommitmentMonths?:
    number | undefined;
}


// ======================================================
// ADD SALE PAYMENT
// ======================================================

export interface IAddSalePayment {
  amount: number;
}