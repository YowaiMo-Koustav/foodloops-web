import mongoose, { Schema, Document } from 'mongoose';

export type ProductCategory = 'dairy' | 'bakery' | 'meat' | 'produce' | 'pantry' | 'frozen' | 'beverages' | 'other';
export type ListingStatus = 'active' | 'inactive' | 'sold_out' | 'expired';

export interface IProduct extends Document {
  name: string;
  description?: string;
  category: ProductCategory;
  original_price: number;
  current_price: number;
  discount_percentage: number;
  expiry_date: Date;
  quantity_available: number;
  status: ListingStatus;
  image_url?: string;
  seller_id: string;
  seller_name: string;
  store_name: string;
  store_address: string;
  store_phone?: string;
  store_email?: string;
  created_at: Date;
  updated_at: Date;
}

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    enum: ['dairy', 'bakery', 'meat', 'produce', 'pantry', 'frozen', 'beverages', 'other']
  },
  original_price: {
    type: Number,
    required: true,
    min: 0
  },
  current_price: {
    type: Number,
    required: true,
    min: 0
  },
  discount_percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  expiry_date: {
    type: Date,
    required: true
  },
  quantity_available: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'sold_out', 'expired'],
    default: 'active'
  },
  image_url: {
    type: String,
    trim: true
  },
  seller_id: {
    type: String,
    required: true,
    index: true
  },
  seller_name: {
    type: String,
    required: true,
    trim: true
  },
  store_name: {
    type: String,
    required: true,
    trim: true
  },
  store_address: {
    type: String,
    required: true,
    trim: true
  },
  store_phone: {
    type: String,
    trim: true
  },
  store_email: {
    type: String,
    trim: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Index for efficient queries
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ expiry_date: 1 });
ProductSchema.index({ discount_percentage: -1 });
ProductSchema.index({ created_at: -1 });

// Pre-save middleware to calculate discount percentage
ProductSchema.pre('save', function(next) {
  if (this.original_price > 0) {
    this.discount_percentage = Math.round(((this.original_price - this.current_price) / this.original_price) * 100);
  }
  next();
});

// Method to check if product is expired
ProductSchema.methods.isExpired = function(): boolean {
  return new Date() > this.expiry_date;
};

// Static method to get active products
ProductSchema.statics.findActive = function() {
  return this.find({ 
    status: 'active', 
    expiry_date: { $gt: new Date() },
    quantity_available: { $gt: 0 }
  });
};

export default mongoose.model<IProduct>('Product', ProductSchema); 