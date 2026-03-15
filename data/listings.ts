export type Listing = {
  id: string;
  title: string;
  location: string;
  county: string;
  size: string;
  price: string;
  ref: string;
  description: string;
  images: string[];
  contactNote?: string;
};

export const listings: Listing[] = [
  {
    id: "PV-L001",
    title: "0.5 Acre Plot, Kitengela",
    location: "Kitengela",
    county: "Kajiado County",
    size: "0.5 acres",
    price: "KES 2,800,000",
    ref: "PV-L001",
    description: "Gated community, title deed clean, road access, near SGR station.",
    images: ["/listings/placeholder.jpg"],
    contactNote: "Enquiry about PV-L001, 0.5 Acre Plot in Kitengela, Kajiado County.",
  },
  {
    id: "PV-L002",
    title: "1 Acre Plot, Rongai",
    location: "Rongai",
    county: "Kajiado County",
    size: "1 acre",
    price: "KES 4,500,000",
    ref: "PV-L002",
    description: "Residential zone, borehole access, 10 minutes from Ongata Rongai town.",
    images: ["/listings/placeholder.jpg"],
    contactNote: "Enquiry about PV-L002, 1 Acre Plot in Rongai, Kajiado County.",
  },
  {
    id: "PV-L003",
    title: "Beach-Adjacent Plot, Malindi",
    location: "Malindi",
    county: "Kilifi County",
    size: "0.25 acres",
    price: "KES 6,200,000",
    ref: "PV-L003",
    description: "200 metres from the beach, title deed available for verification, ideal for holiday let development.",
    images: ["/listings/placeholder.jpg"],
    contactNote: "Enquiry about PV-L003, Beach-Adjacent Plot in Malindi, Kilifi County.",
  },
];
