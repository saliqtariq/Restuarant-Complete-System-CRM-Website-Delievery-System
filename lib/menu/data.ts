export type MenuItem = {
  name: string;
  price: string;
  image: string;
  serves: string;
};

export type MenuCategoryData = {
  id: string;
  title: string;
  items: MenuItem[];
};

export const menuData: MenuCategoryData[] = [
  {
    id: "la-carta-combos",
    title: "LA Carta & Combos",
    items: [
      { name: "Outlaw Zinger", price: "RS 790", image: "/Outlaw zinger withnobg.png", serves: "Premium crispy chicken fillet, cheese, spicy mayo" },
      { name: "Zinger Butcher", price: "RS 650", image: "/Zinger Butcher No bg.png", serves: "Crispy chicken fillet with fresh lettuce and mayo" },
      { name: "Abraham's Double Stack", price: "RS 890", image: "/Abraham's Double Stack no bg.png", serves: "Two crispy fillets with double cheese" },
    ]
  },
  {
    id: "signature-boxes",
    title: "Signature Boxes",
    items: [
      { name: "Duo Box", price: "RS 1590", image: "/DuoBoxnoBG.png", serves: "Serves 2 persons" },
      { name: "Family Meals", price: "RS 2450", image: "/FamilyDealNobg.png", serves: "Serves 4-6 people" },
    ]
  },
  {
    id: "snacks-beverages",
    title: "Snacks & Beverages",
    items: [
      { name: "Crispy Chicken Bucket", price: "RS 1750", image: "/Crispy Wings Bucket.png", serves: "Serves 2-3 persons" },
      { name: "7Up Regular", price: "RS 180", image: "/7upRegularWithoutBG.png", serves: "Refreshing 345ml drink" },
      { name: "Pepsi Regular", price: "RS 180", image: "/PepsiRegularnoBg.png", serves: "Chilled 345ml drink" },
      { name: "Regular Fries", price: "RS 250", image: "/RegularFries.png", serves: "Crispy golden salted fries" },
    ]
  },
  {
    id: "condiments",
    title: "Condiments",
    items: [
      { name: "Creamy Ranch", price: "RS 90", image: "/creamyranch.png", serves: "Rich & creamy dip sauce" },
      { name: "Garlic Sauce", price: "RS 90", image: "/GarliSauce.png", serves: "Signature garlic dip" },
      { name: "Buffalo Sauce", price: "RS 90", image: "/BuffaloSauce.png", serves: "Tangy & spicy buffalo dip" },
    ]
  },
  {
    id: "everyday-value",
    title: "Everyday Value",
    items: [
      { name: "Burger n Chicken Combo", price: "RS 550", image: "/Burger n Chicken ComboNobg.png", serves: "1 burger and 1 piece of crispy chicken" },
    ]
  }
];
