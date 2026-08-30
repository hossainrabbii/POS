import { Router } from 'express';
import authRoutes from "../modules/auth/auth.route.js"
import categoryRoutes from "../modules/category/category.route.js";
import productRoutes from "../modules/product/product.route.js";
import saleRoutes from "../modules/sale/sale.route.js";
const router = Router();
const moduleRoutes = [
   {
      path: '/auth',
      route: authRoutes,
   },
   {
      path: '/categories',
      route: categoryRoutes,
   },
   {
      path: '/products',
      route: productRoutes,
   },
   {
      path: '/sales',
      route: saleRoutes,
   },
  
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;