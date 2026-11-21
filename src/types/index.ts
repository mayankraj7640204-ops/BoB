export interface BobLabModule {
  id: string;
  slug: string;
  category: string;
  title: string;
  description: string;
  image: string;
  ratio: number;
  specs: Record<string, any>;
  tags: string[];
}

export interface DeviceNode {
  id: string;
  name: string;
  type: string;
  temperature: number;
  humidity: number;
  status: 'active' | 'inactive' | 'error';
  lastReading: string;
  topic: string;
  messages: number;
}

export interface SimulationConfig {
  deviceCount: number;
  publishingInterval: number;
  minTemp: number;
  maxTemp: number;
  minHumidity: number;
  maxHumidity: number;
  isRunning: boolean;
}

export interface BobLabsData {
  labInfo: {
    name: string;
    subtitle: string;
    platform: string;
    version: string;
    broker: string;
    backendStatus: string;
    environment: string;
    mascot: string;
    activeFleetCount: number;
    totalTelemetryDelivered: number;
  };
  modules: BobLabModule[];
  deviceFleet: DeviceNode[];
}

// Retain legacy compatibility types
export interface Product {
  id: string;
  title: string;
  href: string;
  collectionSlug: string;
  price: number;
  minPrice: number;
  maxPrice: number;
  image: string;
  imageLarge: string;
  ratio: number;
  caption: string;
}

export interface Collection {
  slug: string;
  name: string;
  count: number;
  desc: string;
  previewImage: string;
  productCount: number;
}

export interface Currency {
  code: string;
  symbol: string;
  rate: number;
}

export interface CartItem {
  cartId: string;
  product: Product;
  paper: string;
  size: string;
  frame: string;
  signature: string;
  quantity: number;
  unitPrice: number;
}
