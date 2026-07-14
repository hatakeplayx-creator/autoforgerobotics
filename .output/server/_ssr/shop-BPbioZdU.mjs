import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as objectType, r as stringType, t as numberType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-BPbioZdU.js
var $$splitComponentImporter = () => import("./shop-GKjDvsVb.mjs");
var shopSearchSchema = objectType({
	q: stringType().catch("").optional(),
	category: stringType().catch("").optional(),
	brand: stringType().catch("").optional(),
	sortBy: stringType().catch("featured").optional(),
	page: numberType().catch(1).optional()
});
var Route = createFileRoute("/shop/")({
	validateSearch: (search) => shopSearchSchema.parse(search),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
