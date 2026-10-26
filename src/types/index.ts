export interface Producer {
  name: string;
  location: string;
  distance: string;
  story: string;
}

export type ProvisionCategory = 'all' | 'harvest' | 'bakery' | 'pantry' | 'dairy' | 'baskets';

export interface ProvisionItem {
  id: string;
  name: string;
  category: ProvisionCategory;
  categoryLabel: string;
  price: number;
  unit: string;
  description: string;
  details: string;
  producer: Producer;
  tastingNotes: string[];
  imageUrl: string;
  badge?: string;
  inStock: boolean;
  featured?: boolean;
  weightOrVolume?: string;
}

export interface CartItem {
  product: ProvisionItem;
  quantity: number;
}

export interface WeeklyBoxOption {
  id: string;
  title: string;
  servings: string;
  price: number;
  contents: string[];
}
