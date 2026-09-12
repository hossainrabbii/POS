import { Shop } from "./shop.model.js";

// ======================================================
// GET SHOP SETTINGS
// ======================================================

export const getShopSettings = async () => {
  const shop = await Shop.findOne().lean();
  return shop;
};

// ======================================================
// CREATE SHOP SETTINGS
// ======================================================

export const createShopSettings = async (data: Record<string, unknown>) => {
  const existingShop = await Shop.findOne();
  if (existingShop) {
    throw new Error("Shop settings already exist");
  }

  const shop = await Shop.create(data);

  return shop;
};

// ======================================================
// UPDATE SHOP SETTINGS
// ======================================================

export const updateShopSettings = async (data: Record<string, unknown>) => {
  const shop = await Shop.findOne();

  if (!shop) {
    const newShop = await Shop.create(data);

    return newShop;
  }

  Object.assign(shop, data);

  await shop.save();

  return shop;
};
