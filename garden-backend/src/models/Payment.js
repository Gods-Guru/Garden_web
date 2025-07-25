const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // Basic information
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  garden: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Garden',
    required: true
  },

  // Payment details
  amount: { type: Number, required: true, min: 0 },

  type: {
    type: String,
    enum: ['plot_fee', 'membership', 'event', 'donation', 'fine', 'equipment', 'fee', 'other'],
    required: true
  },

  description: {
    type: String,
    maxlength: 500
  },

  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },

  // Enhanced status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded'],
    default: 'pending'
  },

  // Related entities
  relatedTo: {
    plot: { type: mongoose.Schema.Types.ObjectId, ref: 'Plot' },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' }
  },

  // Payment method
  paymentMethod: {
    type: {
      type: String,
      enum: ['credit_card', 'debit_card', 'bank_transfer', 'paypal', 'stripe', 'cash', 'check', 'other']
    },
    details: {
      last4: String,
      brand: String,
      bankName: String,
      checkNumber: String,
      receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
  },

  // Transaction details
  transaction: {
    transactionId: { type: String },
    stripePaymentIntentId: String,
    paypalTransactionId: String,
    processingFee: { type: Number, default: 0 },
    netAmount: Number,
    initiatedAt: { type: Date, default: Date.now },
    completedAt: Date,
    failedAt: Date,
    failureReason: String,
    failureCode: String
  },

  // Invoice details
  invoice: {
    invoiceNumber: { type: String },
    issuedDate: { type: Date, default: Date.now },
    dueDate: Date,
    subtotal: Number,
    total: Number,
    tax: {
      rate: { type: Number, default: 0 },
      amount: { type: Number, default: 0 }
    }
  },

  // Refund information
  refunds: [{
    amount: Number,
    reason: String,
    refundedAt: { type: Date, default: Date.now },
    refundedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }
  }],

  // Legacy fields for backward compatibility
  reference: { type: String },
  gateway: { type: String },
  receiptUrl: { type: String },

  // Notes
  notes: {
    internal: String,
    public: String
  }
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ user: 1, status: 1, createdAt: -1 });
paymentSchema.index({ garden: 1, status: 1 });
paymentSchema.index({ type: 1, status: 1 });
paymentSchema.index({ 'transaction.transactionId': 1 }, { unique: true, sparse: true });
paymentSchema.index({ 'invoice.invoiceNumber': 1 }, { unique: true, sparse: true });

// Pre-save middleware
paymentSchema.pre('save', function(next) {
  if (!this.transaction.transactionId) {
    this.transaction.transactionId = 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  if (!this.invoice.invoiceNumber) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    this.invoice.invoiceNumber = `INV-${year}${month}-${random}`;
  }

  if (this.amount && this.transaction.processingFee !== undefined) {
    this.transaction.netAmount = this.amount - this.transaction.processingFee;
  }

  next();
});

// Methods
paymentSchema.methods.isPaid = function() {
  return this.status === 'completed';
};

paymentSchema.methods.isOverdue = function() {
  return this.invoice.dueDate &&
         this.invoice.dueDate < new Date() &&
         !this.isPaid();
};

paymentSchema.methods.markAsPaid = function(paymentDetails = {}) {
  this.status = 'completed';
  this.transaction.completedAt = new Date();

  if (paymentDetails.transactionId) {
    this.transaction.stripePaymentIntentId = paymentDetails.transactionId;
  }

  return this.save();
};

paymentSchema.methods.markAsFailed = function(reason, code) {
  this.status = 'failed';
  this.transaction.failedAt = new Date();
  this.transaction.failureReason = reason;
  this.transaction.failureCode = code;

  return this.save();
};

module.exports = mongoose.model('Payment', paymentSchema);
