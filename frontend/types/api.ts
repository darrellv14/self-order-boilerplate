export type PublicRestaurantResponse = {
  restaurant: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    logoUrl?: string;
    heroImageUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    bgColor: string;
    textColor: string;
    taxPercent: number;
    servicePercent: number;
    categories: Array<{ id: string; name: string; position: number }>;
    promos: Array<{
      id: string;
      title: string;
      description?: string;
      startsAt: string;
      endsAt: string;
      imageUrl?: string;
    }>;
    menuItems: Array<{
      id: string;
      slug: string;
      name: string;
      description?: string;
      imageUrl?: string;
      basePrice: number;
      categoryId?: string;
      category?: { id: string; name: string } | null;
      modifiers: Array<{
        id: string;
        name: string;
        type: string;
        required: boolean;
        options: unknown;
      }>;
    }>;
    tables: Array<{ id: string; code: string; qrToken: string }>;
  } | null;
};

export type RestaurantResource = NonNullable<
  PublicRestaurantResponse["restaurant"]
>;

export type PublicOrderResponse = {
  order: {
    id: string;
    status: string;
    totalAmount: number;
    paymentStatus: string;
    table: {
      code: string;
    };
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
      notes?: string | null;
    }>;
  } | null;
};

export type OwnerDashboardResponse = {
  restaurant:
    | (RestaurantResource & {
        users: Array<{
          id: string;
          fullName: string;
          email: string;
          role: "OWNER" | "WAITER";
        }>;
      })
    | null;
  metrics: {
    menuCount: number;
    promoCount: number;
    waiterCount: number;
    ordersToday: number;
  };
};

export type WaiterBoardResponse = {
  orders: Array<{
    id: string;
    status: string;
    table: {
      code: string;
    };
    items: Array<{
      id: string;
      name: string;
      quantity: number;
    }>;
  }>;
  calls: Array<{
    id: string;
    status: string;
    message?: string | null;
    table: {
      code: string;
    };
  }>;
};
