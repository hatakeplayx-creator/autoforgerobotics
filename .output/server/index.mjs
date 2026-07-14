globalThis.__nitro_main__ = import.meta.url;
import { a as FastResponse, n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/assets/about-C4JNogqH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6f8-+2ENi5cckYLgf17OnMwML5bip5o\"",
		"mtime": "2026-07-12T17:36:46.606Z",
		"size": 1784,
		"path": "../public/assets/about-C4JNogqH.js"
	},
	"/assets/atl-kits-enquiry-CqDY2uqg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ae-7gNJJSH34odQYICeUoNvJAM3to4\"",
		"mtime": "2026-07-12T17:36:46.606Z",
		"size": 686,
		"path": "../public/assets/atl-kits-enquiry-CqDY2uqg.js"
	},
	"/assets/bom-tool-D2ZRRxuk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b4-tWNAhWNeG9yoaNfPdju5DoELBr4\"",
		"mtime": "2026-07-12T17:36:46.607Z",
		"size": 436,
		"path": "../public/assets/bom-tool-D2ZRRxuk.js"
	},
	"/assets/blogs-uaKB7299.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"31f-LWSufPAW7jDMDRvl2deIGvKXGes\"",
		"mtime": "2026-07-12T17:36:46.607Z",
		"size": 799,
		"path": "../public/assets/blogs-uaKB7299.js"
	},
	"/assets/admin-CZTgF5vW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e683-SV2VXkI8wLzjIO2JmWxuqSymols\"",
		"mtime": "2026-07-12T17:36:46.606Z",
		"size": 59011,
		"path": "../public/assets/admin-CZTgF5vW.js"
	},
	"/assets/bulk-enquiry-CyM-LIx2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"381-BMMGkMd2cSIvaFh0CkjuCnspPFQ\"",
		"mtime": "2026-07-12T17:36:46.608Z",
		"size": 897,
		"path": "../public/assets/bulk-enquiry-CyM-LIx2.js"
	},
	"/assets/breadcrumb-Cbr6PO-T.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"72a-4kGRoa4FTUl3O5YEoOV9PPLf3Dk\"",
		"mtime": "2026-07-12T17:36:46.608Z",
		"size": 1834,
		"path": "../public/assets/breadcrumb-Cbr6PO-T.js"
	},
	"/assets/CartContext-BpVavZbd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"acd-eHBMlfTZ2kS/yLilXCc6FYlYkxU\"",
		"mtime": "2026-07-12T17:36:46.602Z",
		"size": 2765,
		"path": "../public/assets/CartContext-BpVavZbd.js"
	},
	"/assets/cart-BX93AHIh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ef1-g7THzSHt4iNmtCddOc+Cu3iosZU\"",
		"mtime": "2026-07-12T17:36:46.609Z",
		"size": 12017,
		"path": "../public/assets/cart-BX93AHIh.js"
	},
	"/assets/button-9zzfJYUL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"55e-9b0vm+u855y8vypeiEzvFh/gnA8\"",
		"mtime": "2026-07-12T17:36:46.608Z",
		"size": 1374,
		"path": "../public/assets/button-9zzfJYUL.js"
	},
	"/assets/careers-OcvJGiaj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"331-qCuvOGoo89zjCb6KkJ10wLl/SIE\"",
		"mtime": "2026-07-12T17:36:46.609Z",
		"size": 817,
		"path": "../public/assets/careers-OcvJGiaj.js"
	},
	"/assets/cat-3d-printers-C4nm_rIE.jpg": {
		"type": "image/jpeg",
		"etag": "\"5f77-/qZAYVSKsWOvuZGUmyJBzJDgv/8\"",
		"mtime": "2026-07-12T17:36:46.625Z",
		"size": 24439,
		"path": "../public/assets/cat-3d-printers-C4nm_rIE.jpg"
	},
	"/assets/cat-batteries-XLGzx-Wh.jpg": {
		"type": "image/jpeg",
		"etag": "\"4a37-fh6q50O6i94NNES42wY1qBwFOJw\"",
		"mtime": "2026-07-12T17:36:46.625Z",
		"size": 18999,
		"path": "../public/assets/cat-batteries-XLGzx-Wh.jpg"
	},
	"/assets/cat-components-lexUjA1v.jpg": {
		"type": "image/jpeg",
		"etag": "\"97e7-vryq91fN+Adcxg7tZ3J793pGzVs\"",
		"mtime": "2026-07-12T17:36:46.625Z",
		"size": 38887,
		"path": "../public/assets/cat-components-lexUjA1v.jpg"
	},
	"/assets/cat-drone-parts-B9X2zVGQ.jpg": {
		"type": "image/jpeg",
		"etag": "\"6a1a-OxTlLsp8ehz7J0/oGvjftfpT2/k\"",
		"mtime": "2026-07-12T17:36:46.627Z",
		"size": 27162,
		"path": "../public/assets/cat-drone-parts-B9X2zVGQ.jpg"
	},
	"/assets/cat-ev-parts-DD5oVyTF.jpg": {
		"type": "image/jpeg",
		"etag": "\"64f6-ocpsRsQxVNkpEyua349L78eNtrg\"",
		"mtime": "2026-07-12T17:36:46.627Z",
		"size": 25846,
		"path": "../public/assets/cat-ev-parts-DD5oVyTF.jpg"
	},
	"/assets/cat-diy-kits-BHB2wH7M.jpg": {
		"type": "image/jpeg",
		"etag": "\"aae3-jNJ0oo6ztgN4f0V3NqD02yxLrTE\"",
		"mtime": "2026-07-12T17:36:46.627Z",
		"size": 43747,
		"path": "../public/assets/cat-diy-kits-BHB2wH7M.jpg"
	},
	"/assets/cat-modules-displays-BZCiohwt.jpg": {
		"type": "image/jpeg",
		"etag": "\"83d7-9BYve6C4jNXHiScyTdABfMx0Tag\"",
		"mtime": "2026-07-12T17:36:46.629Z",
		"size": 33751,
		"path": "../public/assets/cat-modules-displays-BZCiohwt.jpg"
	},
	"/assets/cat-iot-wireless-tSydtVdJ.jpg": {
		"type": "image/jpeg",
		"etag": "\"a9ab-IRwL1Z4qKRHrCdisqljweU9odq8\"",
		"mtime": "2026-07-12T17:36:46.628Z",
		"size": 43435,
		"path": "../public/assets/cat-iot-wireless-tSydtVdJ.jpg"
	},
	"/assets/cat-mechanical-tools-6B8hsMVl.jpg": {
		"type": "image/jpeg",
		"etag": "\"a5e7-SYUQrvcLJ/mnOxe0XqWRfV6QRYY\"",
		"mtime": "2026-07-12T17:36:46.629Z",
		"size": 42471,
		"path": "../public/assets/cat-mechanical-tools-6B8hsMVl.jpg"
	},
	"/assets/cat-motors-6ouil9u3.jpg": {
		"type": "image/jpeg",
		"etag": "\"a575-UUfialZXn5JvZyw8zxA7oSwSqzY\"",
		"mtime": "2026-07-12T17:36:46.630Z",
		"size": 42357,
		"path": "../public/assets/cat-motors-6ouil9u3.jpg"
	},
	"/assets/cat-sensors-7UtTOXVk.jpg": {
		"type": "image/jpeg",
		"etag": "\"952e-jWaDmjZPy1vwQGKaMSmI0V7XDOk\"",
		"mtime": "2026-07-12T17:36:46.630Z",
		"size": 38190,
		"path": "../public/assets/cat-sensors-7UtTOXVk.jpg"
	},
	"/assets/checkout-BQ-y3nL4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f1d-JA7dzLhelZsanccMSglDEP5I8LY\"",
		"mtime": "2026-07-12T17:36:46.610Z",
		"size": 3869,
		"path": "../public/assets/checkout-BQ-y3nL4.js"
	},
	"/assets/Combination-Hc7-hox6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a63-vp7TO0bmhhm3NjWY+wJd7AV/ROw\"",
		"mtime": "2026-07-12T17:36:46.603Z",
		"size": 27235,
		"path": "../public/assets/Combination-Hc7-hox6.js"
	},
	"/assets/circle-check-CseiU70G.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b2-1zZdNnVP1//pnrPRle3F0+ddXK0\"",
		"mtime": "2026-07-12T17:36:46.610Z",
		"size": 178,
		"path": "../public/assets/circle-check-CseiU70G.js"
	},
	"/assets/contact-BGDHT5zq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"114c-+Us3BJN2NEaK8iHMMFzebLTahYU\"",
		"mtime": "2026-07-12T17:36:46.611Z",
		"size": 4428,
		"path": "../public/assets/contact-BGDHT5zq.js"
	},
	"/assets/createLucideIcon-BOWk1upE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d3-FiabzEAj/PmEJD488IR+1yOgmuQ\"",
		"mtime": "2026-07-12T17:36:46.611Z",
		"size": 1235,
		"path": "../public/assets/createLucideIcon-BOWk1upE.js"
	},
	"/assets/dist-cmKEqsEi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"73d7-Tgt8y6Id/g/mqiWL3ZinBQuZzlA\"",
		"mtime": "2026-07-12T17:36:46.612Z",
		"size": 29655,
		"path": "../public/assets/dist-cmKEqsEi.js"
	},
	"/assets/dist-DA6TTE_P.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"280-PdaXE4sOXxBDg1JMZpFHx9k1riQ\"",
		"mtime": "2026-07-12T17:36:46.612Z",
		"size": 640,
		"path": "../public/assets/dist-DA6TTE_P.js"
	},
	"/assets/faq-h8z5YoO2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"898-ex0wPHnXk9lZMnklYfCgME2MFM4\"",
		"mtime": "2026-07-12T17:36:46.612Z",
		"size": 2200,
		"path": "../public/assets/faq-h8z5YoO2.js"
	},
	"/assets/dist-BDEcX1Dz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10b3-YyF4vi+749CxByVvD9W21vjK31Q\"",
		"mtime": "2026-07-12T17:36:46.611Z",
		"size": 4275,
		"path": "../public/assets/dist-BDEcX1Dz.js"
	},
	"/assets/forgot-password-B1Wsjf7Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"614-xMF0YLmqlb7zGGtJEFb/pYyvH2c\"",
		"mtime": "2026-07-12T17:36:46.613Z",
		"size": 1556,
		"path": "../public/assets/forgot-password-B1Wsjf7Y.js"
	},
	"/assets/forum-BqiHhumX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1642-ob7pzKKI1okW0gquwq1TU1RP0FQ\"",
		"mtime": "2026-07-12T17:36:46.613Z",
		"size": 5698,
		"path": "../public/assets/forum-BqiHhumX.js"
	},
	"/assets/hero-1-Cq5UAOx1.jpg": {
		"type": "image/jpeg",
		"etag": "\"32b0b-mpF/RGdt04UA/ZD6s6IKoNrR2OY\"",
		"mtime": "2026-07-12T17:36:46.630Z",
		"size": 207627,
		"path": "../public/assets/hero-1-Cq5UAOx1.jpg"
	},
	"/assets/login-CiucsdOJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1dd5-7h4XXavgJOjdSwCAZViEMx1IV9U\"",
		"mtime": "2026-07-12T17:36:46.614Z",
		"size": 7637,
		"path": "../public/assets/login-CiucsdOJ.js"
	},
	"/assets/link-BDT0ojcu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5b00-z8zRU60NSMOHvthH9psHCGNukrw\"",
		"mtime": "2026-07-12T17:36:46.614Z",
		"size": 23296,
		"path": "../public/assets/link-BDT0ojcu.js"
	},
	"/assets/hero-2-BuGhh0LR.jpg": {
		"type": "image/jpeg",
		"etag": "\"2732a-zedAHV5pftqLoBGruV7sjTwu3e4\"",
		"mtime": "2026-07-12T17:36:46.631Z",
		"size": 160554,
		"path": "../public/assets/hero-2-BuGhh0LR.jpg"
	},
	"/assets/hero-3-xCCq0lik.jpg": {
		"type": "image/jpeg",
		"etag": "\"32ce9-alWOJlT+NjYdSt6dFCGR6kT8OPc\"",
		"mtime": "2026-07-12T17:36:46.632Z",
		"size": 208105,
		"path": "../public/assets/hero-3-xCCq0lik.jpg"
	},
	"/assets/index-D3xxEVmo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4c092-qTnhTQpxihnbY/6cOGsevvGWZHY\"",
		"mtime": "2026-07-12T17:36:46.601Z",
		"size": 311442,
		"path": "../public/assets/index-D3xxEVmo.js"
	},
	"/assets/new-arrivals-Bqigagqj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"31f-8G3jgZf4sUBpz1CrsfMP5Eat2UI\"",
		"mtime": "2026-07-12T17:36:46.616Z",
		"size": 799,
		"path": "../public/assets/new-arrivals-Bqigagqj.js"
	},
	"/assets/login-DVNVTNPR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a5-T4hjg+hI3iaVlw9IXdUMXnYgqGY\"",
		"mtime": "2026-07-12T17:36:46.614Z",
		"size": 2213,
		"path": "../public/assets/login-DVNVTNPR.js"
	},
	"/assets/orders-Brioa9Oc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a8a-nduVknKilwdnOh4X497OFLJPOCQ\"",
		"mtime": "2026-07-12T17:36:46.616Z",
		"size": 2698,
		"path": "../public/assets/orders-Brioa9Oc.js"
	},
	"/assets/message-square-Dd4bwWwD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e9-WlsVCGaHdeyFgAsDsMLa6mIUAsg\"",
		"mtime": "2026-07-12T17:36:46.616Z",
		"size": 233,
		"path": "../public/assets/message-square-Dd4bwWwD.js"
	},
	"/assets/preload-helper-COS053G0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1828-arRJ9amSZdHTwV1wO+NNVX1soAs\"",
		"mtime": "2026-07-12T17:36:46.617Z",
		"size": 6184,
		"path": "../public/assets/preload-helper-COS053G0.js"
	},
	"/assets/privacy-VYIVjHeA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"998-f/e56aYjhHOV5izeRxJaQ5bEObw\"",
		"mtime": "2026-07-12T17:36:46.617Z",
		"size": 2456,
		"path": "../public/assets/privacy-VYIVjHeA.js"
	},
	"/assets/prod-ams-DEMucPiE.jpg": {
		"type": "image/jpeg",
		"etag": "\"5d5e-TVdR/zvpdpWz92uunfOP92NV1bA\"",
		"mtime": "2026-07-12T17:36:46.632Z",
		"size": 23902,
		"path": "../public/assets/prod-ams-DEMucPiE.jpg"
	},
	"/assets/prod-camera-BeOzk9sI.jpg": {
		"type": "image/jpeg",
		"etag": "\"5293-bDTNJPnjHqIm5lCBC3v98qaXR08\"",
		"mtime": "2026-07-12T17:36:46.633Z",
		"size": 21139,
		"path": "../public/assets/prod-camera-BeOzk9sI.jpg"
	},
	"/assets/prod-breakout-J8dcccV9.jpg": {
		"type": "image/jpeg",
		"etag": "\"60a6-ZPTzRnz68KYDxAYJD+l3L/zQU70\"",
		"mtime": "2026-07-12T17:36:46.633Z",
		"size": 24742,
		"path": "../public/assets/prod-breakout-J8dcccV9.jpg"
	},
	"/assets/prod-carrier-CstuSCre.jpg": {
		"type": "image/jpeg",
		"etag": "\"53cf-IqxoeBc5RrbVPCFZijuRjokE1is\"",
		"mtime": "2026-07-12T17:36:46.633Z",
		"size": 21455,
		"path": "../public/assets/prod-carrier-CstuSCre.jpg"
	},
	"/assets/prod-drone-motor-B_-iyosk.jpg": {
		"type": "image/jpeg",
		"etag": "\"51ea-+0RGcLp6oLxG2lQvOWf5cM+cMUg\"",
		"mtime": "2026-07-12T17:36:46.634Z",
		"size": 20970,
		"path": "../public/assets/prod-drone-motor-B_-iyosk.jpg"
	},
	"/assets/prod-fpga-CsQdQXjm.jpg": {
		"type": "image/jpeg",
		"etag": "\"7f0c-Me5oHf6Sz2ps5UUf3DOz3Y9/XqA\"",
		"mtime": "2026-07-12T17:36:46.634Z",
		"size": 32524,
		"path": "../public/assets/prod-fpga-CsQdQXjm.jpg"
	},
	"/assets/prod-lcd-board-B_6B-QCj.jpg": {
		"type": "image/jpeg",
		"etag": "\"2b28-HjQyrCoBzLGr6ere24tbVtMiNoM\"",
		"mtime": "2026-07-12T17:36:46.634Z",
		"size": 11048,
		"path": "../public/assets/prod-lcd-board-B_6B-QCj.jpg"
	},
	"/assets/prod-light-sensor-PMWT34bk.jpg": {
		"type": "image/jpeg",
		"etag": "\"284c-8earWPvM/VN6V9ExXf6gGjqmLWo\"",
		"mtime": "2026-07-12T17:36:46.635Z",
		"size": 10316,
		"path": "../public/assets/prod-light-sensor-PMWT34bk.jpg"
	},
	"/assets/prod-mp3-CIprnfTD.jpg": {
		"type": "image/jpeg",
		"etag": "\"34e2-6JUMiyggl35CG4dLQcMTGeQJQjQ\"",
		"mtime": "2026-07-12T17:36:46.636Z",
		"size": 13538,
		"path": "../public/assets/prod-mp3-CIprnfTD.jpg"
	},
	"/assets/prod-mini-board-DZwJ-vTv.jpg": {
		"type": "image/jpeg",
		"etag": "\"36e5-Gz5s5a9JzaS9O7EzAnbWw28P9FM\"",
		"mtime": "2026-07-12T17:36:46.635Z",
		"size": 14053,
		"path": "../public/assets/prod-mini-board-DZwJ-vTv.jpg"
	},
	"/assets/prod-printer-Bh5Pe8TU.jpg": {
		"type": "image/jpeg",
		"etag": "\"55ee-lVaLEYOZLxgNjYmduZBQMEwCMsI\"",
		"mtime": "2026-07-12T17:36:46.636Z",
		"size": 21998,
		"path": "../public/assets/prod-printer-Bh5Pe8TU.jpg"
	},
	"/assets/ProductCard-LnUzv4uZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d7d-nLlxpQ37YOZekPyezNhoH4qj3JM\"",
		"mtime": "2026-07-12T17:36:46.604Z",
		"size": 3453,
		"path": "../public/assets/ProductCard-LnUzv4uZ.js"
	},
	"/assets/profile-Pq5sSs3v.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a96-FVNgsfJdpD2pqvyo1sQyWuHADoo\"",
		"mtime": "2026-07-12T17:36:46.618Z",
		"size": 2710,
		"path": "../public/assets/profile-Pq5sSs3v.js"
	},
	"/assets/register-Dyj639zL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ab5-W8/JkZZCbIp9IsbfKoSEM2K/OEQ\"",
		"mtime": "2026-07-12T17:36:46.618Z",
		"size": 2741,
		"path": "../public/assets/register-Dyj639zL.js"
	},
	"/assets/returns-Br5EzoWv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5cb-u/3gOPL2UPUNuAlYHIu784eOfnE\"",
		"mtime": "2026-07-12T17:36:46.619Z",
		"size": 1483,
		"path": "../public/assets/returns-Br5EzoWv.js"
	},
	"/assets/rolldown-runtime-Bh1tDfsg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"237-RWMfWL++Hyx/oSoFmTJgBJkEveY\"",
		"mtime": "2026-07-12T17:36:46.619Z",
		"size": 567,
		"path": "../public/assets/rolldown-runtime-Bh1tDfsg.js"
	},
	"/assets/routes-Cf61Fznj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6c84-rDCJiqc95ZXiwQRa30+a2kpIoQY\"",
		"mtime": "2026-07-12T17:36:46.619Z",
		"size": 27780,
		"path": "../public/assets/routes-Cf61Fznj.js"
	},
	"/assets/sell-on-autoforge-CmMqXIpz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a42-ExmWAajgLDdG+zkA2438b3YJydc\"",
		"mtime": "2026-07-12T17:36:46.620Z",
		"size": 6722,
		"path": "../public/assets/sell-on-autoforge-CmMqXIpz.js"
	},
	"/assets/shield-check-D7n-77tO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-O9VPW3ZMorB+lHw40XwHD04/IYs\"",
		"mtime": "2026-07-12T17:36:46.620Z",
		"size": 320,
		"path": "../public/assets/shield-check-D7n-77tO.js"
	},
	"/assets/shipping-Dq5GMGYz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"602-XPp3PCxhqDcqoay0cpIC659Rkgg\"",
		"mtime": "2026-07-12T17:36:46.621Z",
		"size": 1538,
		"path": "../public/assets/shipping-Dq5GMGYz.js"
	},
	"/assets/shop-Ce1I86Oe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e026-CEVZH9qiwRGItVzwENrAc1oSBb8\"",
		"mtime": "2026-07-12T17:36:46.621Z",
		"size": 57382,
		"path": "../public/assets/shop-Ce1I86Oe.js"
	},
	"/assets/shop-D5aY0gCn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"38ad-uIHZKCUAmEbjLkPcuuVinSPFymY\"",
		"mtime": "2026-07-12T17:36:46.621Z",
		"size": 14509,
		"path": "../public/assets/shop-D5aY0gCn.js"
	},
	"/assets/shopping-bag-kyw_YGnt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"154-zeEDPuFQalgICCE+XF+XLbLPP4M\"",
		"mtime": "2026-07-12T17:36:46.622Z",
		"size": 340,
		"path": "../public/assets/shopping-bag-kyw_YGnt.js"
	},
	"/assets/sonner-Bb9jjfqr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1fd-dN6Cb6UvbIxblQz1hOLLD+zQrHo\"",
		"mtime": "2026-07-12T17:36:46.622Z",
		"size": 509,
		"path": "../public/assets/sonner-Bb9jjfqr.js"
	},
	"/assets/StoreFooter-DIR8Xmud.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"130e1-5LA9+QpkUEeWCNdqwJLcbfy7yJE\"",
		"mtime": "2026-07-12T17:36:46.604Z",
		"size": 78049,
		"path": "../public/assets/StoreFooter-DIR8Xmud.js"
	},
	"/assets/terms-DndwXygM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"72b-O6+DqI3OLVh6j/GJIWhWXEGB1/k\"",
		"mtime": "2026-07-12T17:36:46.622Z",
		"size": 1835,
		"path": "../public/assets/terms-DndwXygM.js"
	},
	"/assets/StorePageShell-BTSyIm4U.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"189-BpUOcTUBaEk2oejhIpKQKh0aLLo\"",
		"mtime": "2026-07-12T17:36:46.604Z",
		"size": 393,
		"path": "../public/assets/StorePageShell-BTSyIm4U.js"
	},
	"/assets/styles-BxVoYKxY.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"17131-D+1Z7bBbIwvIV92XNDpDnq03ols\"",
		"mtime": "2026-07-12T17:36:46.637Z",
		"size": 94513,
		"path": "../public/assets/styles-BxVoYKxY.css"
	},
	"/assets/useCart-DBOVDJ2o.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"121-zfiO5ytqc2qIGJlPyurXQoYF3RU\"",
		"mtime": "2026-07-12T17:36:46.623Z",
		"size": 289,
		"path": "../public/assets/useCart-DBOVDJ2o.js"
	},
	"/assets/useAuth-D2wxZDqk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ba6b-aAXerWnhiIu1+g/gWACIRHMpwbU\"",
		"mtime": "2026-07-12T17:36:46.623Z",
		"size": 47723,
		"path": "../public/assets/useAuth-D2wxZDqk.js"
	},
	"/assets/users-Cz1pLtJn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132-rWrhaoGHahy9ET5BTC4aMKU6EOM\"",
		"mtime": "2026-07-12T17:36:46.624Z",
		"size": 306,
		"path": "../public/assets/users-Cz1pLtJn.js"
	},
	"/assets/wishlist-cdHA7_DH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a2b-/RLzg+9CxwtJO/9gd6/iUiL0NsY\"",
		"mtime": "2026-07-12T17:36:46.624Z",
		"size": 2603,
		"path": "../public/assets/wishlist-cdHA7_DH.js"
	},
	"/assets/WishlistContext-CzQnWgBU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"70d-zfS1bPvNUx9lVavcs6zbo1dBTg4\"",
		"mtime": "2026-07-12T17:36:46.605Z",
		"size": 1805,
		"path": "../public/assets/WishlistContext-CzQnWgBU.js"
	},
	"/assets/_sku-BEyfA-KK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"488d-aR2SZ0L3EVi299qhH0iQtrpAUHM\"",
		"mtime": "2026-07-12T17:36:46.605Z",
		"size": 18573,
		"path": "../public/assets/_sku-BEyfA-KK.js"
	},
	"/assets/_sku-bO3lkbQH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"36a-ot5SbQN8EJH7fRO2dbcdfUdf56M\"",
		"mtime": "2026-07-12T17:36:46.605Z",
		"size": 874,
		"path": "../public/assets/_sku-bO3lkbQH.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_i0MFKQ = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_i0MFKQ
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
