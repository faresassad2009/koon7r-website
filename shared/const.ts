export const COOKIE_NAME = "app_session_id";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
export const AXIOS_TIMEOUT_MS = 30_000;
export const UNAUTHED_ERR_MSG = 'Please login (10001)';
export const NOT_ADMIN_ERR_MSG = 'You do not have required permission (10002)';

export const PRODUCTS = [
  {
    id: 1,
    name: "HOODIE NAKBA",
    description: "Premium hoodie with NAKBA design - Wear your history with pride",
    price: 45,
    image: "/products/NAKBA-BACK.png",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "hoodie",
    badge: "Limited",
  },
  {
    id: 2,
    name: "T-SHIRT PALESTINE",
    description: "Classic Palestine design t-shirt - Comfortable and meaningful",
    price: 25,
    image: "/products/back-tshirt.png",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "tshirt",
    badge: "New",
  },
  {
    id: 3,
    name: "HOODIE FREEDOM",
    description: "Freedom hoodie - Express your voice",
    price: 45,
    image: "/products/back-tshirt.png",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "hoodie",
  },
  {
    id: 4,
    name: "T-SHIRT KUFIYA",
    description: "Traditional Kufiya pattern t-shirt",
    price: 25,
    image: "/products/back-tshirt.png",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "tshirt",
  },
];

export const CUSTOM_PRICES = {
  base: {
    tshirt: 20,
    hoodie: 40,
    sweater: 35,
  },
  design: {
    embroidery: 15,
    printing: 10,
  },
};

export const CONTACT_INFO = {
  email: "info@koon7r.com",
  phone: "+970 59 123 4567",
  whatsapp: "+970591234567",
};

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/koon7r",
  facebook: "https://facebook.com/koon7r",
  twitter: "https://twitter.com/koon7r",
};

export const FAQS = [
  {
    question: "What is the shipping time?",
    answer: "We ship within 3-5 business days. International shipping takes 7-14 days depending on your location.",
  },
  {
    question: "Can I return or exchange items?",
    answer: "Yes! We accept returns within 30 days of delivery. Items must be unworn and in original condition.",
  },
  {
    question: "What materials do you use?",
    answer: "We use 100% premium cotton for t-shirts and cotton-polyester blend for hoodies to ensure comfort and durability.",
  },
  {
    question: "How do I care for my KOON7R items?",
    answer: "Machine wash cold, inside out. Tumble dry low or hang dry. Do not bleach or iron directly on design.",
  },
  {
    question: "Can I customize my own design?",
    answer: "Absolutely! Use our Custom Design Studio to upload your artwork and create a unique piece.",
  },
];
