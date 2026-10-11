export interface AdminRfqItem {
  id: string;
  clientName: string;
  companyName: string;
  crNumber?: string;
  phone: string;
  email: string;
  city: string;
  category: string;
  productName?: string;
  requestedVolume: string;
  status: "Pending" | "Under Review" | "Quoted" | "Fulfilled" | "Cancelled";
  date: string;
  notes: string;
}

export const MOCK_ADMIN_RFQS: AdminRfqItem[] = [
  {
    id: "RFQ-2026-0891",
    clientName: "Tariq Al-Ghamdi",
    companyName: "Al-Safwah Catering Services",
    crNumber: "2050123456",
    phone: "+966 50 891 2341",
    email: "procurement@alsafwahcatering.com",
    city: "Jubail Industrial City",
    category: "Rice & Grains",
    productName: "Aged 1121 XXL Basmati Rice",
    requestedVolume: "10 Metric Tons (Weekly)",
    status: "Pending",
    date: "Today, 11:45 AM",
    notes: "Requires delivery to Jubail camp facility. Spec sheets needed for Mandi catering contract."
  },
  {
    id: "RFQ-2026-0890",
    clientName: "Fahad Al-Zahrani",
    companyName: "Eastern Hotels Group",
    crNumber: "2051987654",
    phone: "+966 55 412 8765",
    email: "f.zahrani@easternhotels.sa",
    city: "Khobar / Dammam",
    category: "Meat",
    productName: "Chilled Halal Beef Ribeye Primal",
    requestedVolume: "500 kg (Bi-weekly)",
    status: "Under Review",
    date: "Today, 09:15 AM",
    notes: "Looking for 0°C to +2°C vacuum packed portions with Halal & SFDA certificates."
  },
  {
    id: "RFQ-2026-0889",
    clientName: "Sultan Al-Otaibi",
    companyName: "Al-Madar Wholesale Food Distribution",
    crNumber: "1010345678",
    phone: "+966 53 776 5432",
    email: "sultan@almadarfoods.com",
    city: "Riyadh Central",
    category: "Edible Oils",
    productName: "Pure Refined Sunflower Oil (18L Tins)",
    requestedVolume: "2 Full Container Loads (FCL)",
    status: "Quoted",
    date: "Yesterday",
    notes: "Official quotation sent. Waiting for purchase order confirmation."
  },
  {
    id: "RFQ-2026-0888",
    clientName: "Waleed Al-Dosari",
    companyName: "Gulf Fisheries & Seafood Outlets",
    crNumber: "2050998877",
    phone: "+966 54 223 9988",
    email: "w.dosari@gulffisheries.com",
    city: "Dammam Port",
    category: "Seafood",
    productName: "Fresh Atlantic Salmon Fillets",
    requestedVolume: "300 kg (Weekly)",
    status: "Fulfilled",
    date: "09 Oct 2026",
    notes: "First trial order completed. Client requested recurring Monday morning dispatch."
  },
  {
    id: "RFQ-2026-0887",
    clientName: "Ibrahim Al-Hassan",
    companyName: "Al-Bustan Bakery & Pastry LLC",
    crNumber: "2050443322",
    phone: "+966 56 331 4455",
    email: "ibrahim@albustanbakery.com",
    city: "Jubail",
    category: "Dairy Products",
    productName: "Pure Creamery Unsalted Butter 82% FAT",
    requestedVolume: "1,500 kg (60 cartons)",
    status: "Quoted",
    date: "08 Oct 2026",
    notes: "Quotation sent for 25kg bulk European butter blocks."
  }
];

export const MOCK_ADMIN_STATS = {
  totalSkus: 524,
  activeRfqs: 14,
  pendingReview: 6,
  completedDeliveriesThisMonth: 184,
  totalVolumeMonthMT: "4,250 MT",
  slaDeliveryRate: "99.4%",
};
