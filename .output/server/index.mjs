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
	"/assets/blogs-C6pO2iaC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"31f-Jm7aGfBjb02YbgNhX4+s4s3977Q\"",
		"mtime": "2026-07-14T17:46:36.532Z",
		"size": 799,
		"path": "../public/assets/blogs-C6pO2iaC.js"
	},
	"/assets/about-Ccpk6E4Q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6f8-D0z9ftpzcX8foC6dFbrQOgugnHo\"",
		"mtime": "2026-07-14T17:46:36.529Z",
		"size": 1784,
		"path": "../public/assets/about-Ccpk6E4Q.js"
	},
	"/assets/atl-kits-enquiry-CAZemF57.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ae-/LtuSfkAU1RTnQqWl6Nub2cF3ko\"",
		"mtime": "2026-07-14T17:46:36.531Z",
		"size": 686,
		"path": "../public/assets/atl-kits-enquiry-CAZemF57.js"
	},
	"/assets/bom-tool-lRNxVaJA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b4-cfeWmmdB4J/EEZxWvKXDKGKvUGY\"",
		"mtime": "2026-07-14T17:46:36.532Z",
		"size": 436,
		"path": "../public/assets/bom-tool-lRNxVaJA.js"
	},
	"/assets/admin-2ula4xQt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"100e2-pYOk30ys2pZDYCWLA/0QdJ3lSyY\"",
		"mtime": "2026-07-14T17:46:36.530Z",
		"size": 65762,
		"path": "../public/assets/admin-2ula4xQt.js"
	},
	"/assets/bulk-enquiry-Buf0LVUO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"381-URLOMR18CdSBESWT3q2BBUqLgvE\"",
		"mtime": "2026-07-14T17:46:36.534Z",
		"size": 897,
		"path": "../public/assets/bulk-enquiry-Buf0LVUO.js"
	},
	"/assets/button-CnFj_4q6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"55e-9HnCUItmIlL2ea5y0BriLTXMx3E\"",
		"mtime": "2026-07-14T17:46:36.535Z",
		"size": 1374,
		"path": "../public/assets/button-CnFj_4q6.js"
	},
	"/assets/breadcrumb-4pSars3O.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"72a-bgu9jbUBJIm/nZQqmoMzLVdg2ck\"",
		"mtime": "2026-07-14T17:46:36.533Z",
		"size": 1834,
		"path": "../public/assets/breadcrumb-4pSars3O.js"
	},
	"/assets/careers-DWffsFvg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"331-XLnsq1hsUtbtazC+eDXDMKHUO7Y\"",
		"mtime": "2026-07-14T17:46:36.536Z",
		"size": 817,
		"path": "../public/assets/careers-DWffsFvg.js"
	},
	"/assets/cat-3d-printers-C4nm_rIE.jpg": {
		"type": "image/jpeg",
		"etag": "\"5f77-/qZAYVSKsWOvuZGUmyJBzJDgv/8\"",
		"mtime": "2026-07-14T17:46:36.567Z",
		"size": 24439,
		"path": "../public/assets/cat-3d-printers-C4nm_rIE.jpg"
	},
	"/assets/cat-batteries-XLGzx-Wh.jpg": {
		"type": "image/jpeg",
		"etag": "\"4a37-fh6q50O6i94NNES42wY1qBwFOJw\"",
		"mtime": "2026-07-14T17:46:36.567Z",
		"size": 18999,
		"path": "../public/assets/cat-batteries-XLGzx-Wh.jpg"
	},
	"/assets/cat-components-lexUjA1v.jpg": {
		"type": "image/jpeg",
		"etag": "\"97e7-vryq91fN+Adcxg7tZ3J793pGzVs\"",
		"mtime": "2026-07-14T17:46:36.568Z",
		"size": 38887,
		"path": "../public/assets/cat-components-lexUjA1v.jpg"
	},
	"/assets/cat-diy-kits-BHB2wH7M.jpg": {
		"type": "image/jpeg",
		"etag": "\"aae3-jNJ0oo6ztgN4f0V3NqD02yxLrTE\"",
		"mtime": "2026-07-14T17:46:36.569Z",
		"size": 43747,
		"path": "../public/assets/cat-diy-kits-BHB2wH7M.jpg"
	},
	"/assets/cat-ev-parts-DD5oVyTF.jpg": {
		"type": "image/jpeg",
		"etag": "\"64f6-ocpsRsQxVNkpEyua349L78eNtrg\"",
		"mtime": "2026-07-14T17:46:36.571Z",
		"size": 25846,
		"path": "../public/assets/cat-ev-parts-DD5oVyTF.jpg"
	},
	"/assets/cat-drone-parts-B9X2zVGQ.jpg": {
		"type": "image/jpeg",
		"etag": "\"6a1a-OxTlLsp8ehz7J0/oGvjftfpT2/k\"",
		"mtime": "2026-07-14T17:46:36.570Z",
		"size": 27162,
		"path": "../public/assets/cat-drone-parts-B9X2zVGQ.jpg"
	},
	"/assets/cat-iot-wireless-tSydtVdJ.jpg": {
		"type": "image/jpeg",
		"etag": "\"a9ab-IRwL1Z4qKRHrCdisqljweU9odq8\"",
		"mtime": "2026-07-14T17:46:36.571Z",
		"size": 43435,
		"path": "../public/assets/cat-iot-wireless-tSydtVdJ.jpg"
	},
	"/assets/cat-mechanical-tools-6B8hsMVl.jpg": {
		"type": "image/jpeg",
		"etag": "\"a5e7-SYUQrvcLJ/mnOxe0XqWRfV6QRYY\"",
		"mtime": "2026-07-14T17:46:36.572Z",
		"size": 42471,
		"path": "../public/assets/cat-mechanical-tools-6B8hsMVl.jpg"
	},
	"/assets/CartContext-BLAKyF4F.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"afa-EhD+R7Z8B3OgoayL3s+4L+40Hqw\"",
		"mtime": "2026-07-14T17:46:36.522Z",
		"size": 2810,
		"path": "../public/assets/CartContext-BLAKyF4F.js"
	},
	"/assets/cart-iRABbbEz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2e8f-ckGhlJy8m0QjEphtzFSQHwbMuN4\"",
		"mtime": "2026-07-14T17:46:36.537Z",
		"size": 11919,
		"path": "../public/assets/cart-iRABbbEz.js"
	},
	"/assets/cat-modules-displays-BZCiohwt.jpg": {
		"type": "image/jpeg",
		"etag": "\"83d7-9BYve6C4jNXHiScyTdABfMx0Tag\"",
		"mtime": "2026-07-14T17:46:36.575Z",
		"size": 33751,
		"path": "../public/assets/cat-modules-displays-BZCiohwt.jpg"
	},
	"/assets/cat-motors-6ouil9u3.jpg": {
		"type": "image/jpeg",
		"etag": "\"a575-UUfialZXn5JvZyw8zxA7oSwSqzY\"",
		"mtime": "2026-07-14T17:46:36.575Z",
		"size": 42357,
		"path": "../public/assets/cat-motors-6ouil9u3.jpg"
	},
	"/assets/checkout-ClmLUGl7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ee1-pqdtNMwP6QYKlRO53wgPluDdloc\"",
		"mtime": "2026-07-14T17:46:36.538Z",
		"size": 3809,
		"path": "../public/assets/checkout-ClmLUGl7.js"
	},
	"/assets/cat-sensors-7UtTOXVk.jpg": {
		"type": "image/jpeg",
		"etag": "\"952e-jWaDmjZPy1vwQGKaMSmI0V7XDOk\"",
		"mtime": "2026-07-14T17:46:36.576Z",
		"size": 38190,
		"path": "../public/assets/cat-sensors-7UtTOXVk.jpg"
	},
	"/assets/circle-check-BsvDdns0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b2-R9DjnCVR8s42j7iqaDGNDVdb94s\"",
		"mtime": "2026-07-14T17:46:36.538Z",
		"size": 178,
		"path": "../public/assets/circle-check-BsvDdns0.js"
	},
	"/assets/createLucideIcon-CPrtpynQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d3-b/b+nYbdMVPEMCCjgZULQ6YkeIg\"",
		"mtime": "2026-07-14T17:46:36.540Z",
		"size": 1235,
		"path": "../public/assets/createLucideIcon-CPrtpynQ.js"
	},
	"/assets/dist-D2IuPVn_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10b3-OEvSWruzufEZc4UIseFC2RnyB64\"",
		"mtime": "2026-07-14T17:46:36.542Z",
		"size": 4275,
		"path": "../public/assets/dist-D2IuPVn_.js"
	},
	"/assets/contact-CD5N6FMy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10df-fKSVls6mBzPZXYZJc8sOQLSGeyg\"",
		"mtime": "2026-07-14T17:46:36.539Z",
		"size": 4319,
		"path": "../public/assets/contact-CD5N6FMy.js"
	},
	"/assets/Combination-4dzo3lLn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a63-9k/LURQXjT48ZBAxQTillNixa6w\"",
		"mtime": "2026-07-14T17:46:36.524Z",
		"size": 27235,
		"path": "../public/assets/Combination-4dzo3lLn.js"
	},
	"/assets/dist-Soyt8AsC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"280-scMz5ZCJAmjRg3LswOiH/TtP0r8\"",
		"mtime": "2026-07-14T17:46:36.542Z",
		"size": 640,
		"path": "../public/assets/dist-Soyt8AsC.js"
	},
	"/assets/dist-B-Dy14bS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"73d7-UowbNaYEADNcS9m3FLNXPctRg3o\"",
		"mtime": "2026-07-14T17:46:36.541Z",
		"size": 29655,
		"path": "../public/assets/dist-B-Dy14bS.js"
	},
	"/assets/faq-DR1IpLO9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"898-KgtNJiHhvHCKFni/WKk6FNfXE64\"",
		"mtime": "2026-07-14T17:46:36.543Z",
		"size": 2200,
		"path": "../public/assets/faq-DR1IpLO9.js"
	},
	"/assets/hero-2-BuGhh0LR.jpg": {
		"type": "image/jpeg",
		"etag": "\"2732a-zedAHV5pftqLoBGruV7sjTwu3e4\"",
		"mtime": "2026-07-14T17:46:36.578Z",
		"size": 160554,
		"path": "../public/assets/hero-2-BuGhh0LR.jpg"
	},
	"/assets/hero-1-Cq5UAOx1.jpg": {
		"type": "image/jpeg",
		"etag": "\"32b0b-mpF/RGdt04UA/ZD6s6IKoNrR2OY\"",
		"mtime": "2026-07-14T17:46:36.577Z",
		"size": 207627,
		"path": "../public/assets/hero-1-Cq5UAOx1.jpg"
	},
	"/assets/hero-3-xCCq0lik.jpg": {
		"type": "image/jpeg",
		"etag": "\"32ce9-alWOJlT+NjYdSt6dFCGR6kT8OPc\"",
		"mtime": "2026-07-14T17:46:36.578Z",
		"size": 208105,
		"path": "../public/assets/hero-3-xCCq0lik.jpg"
	},
	"/assets/forgot-password-CQm66YZz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5aa-YqFaYubIe9jqi3HN70rvbbZlCM4\"",
		"mtime": "2026-07-14T17:46:36.544Z",
		"size": 1450,
		"path": "../public/assets/forgot-password-CQm66YZz.js"
	},
	"/assets/forum-D9ad8GYL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1642-lmaQH71R5XTapLCwGfSBu7gU9aA\"",
		"mtime": "2026-07-14T17:46:36.545Z",
		"size": 5698,
		"path": "../public/assets/forum-D9ad8GYL.js"
	},
	"/assets/login-Cs0Sz60i.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d68-dR+D+vGcjn9klOpceBqa59WurUk\"",
		"mtime": "2026-07-14T17:46:36.547Z",
		"size": 7528,
		"path": "../public/assets/login-Cs0Sz60i.js"
	},
	"/assets/login-DTf1EMoa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"838-NocmkZryQiEK9Oqb2w3G2gI9ID4\"",
		"mtime": "2026-07-14T17:46:36.548Z",
		"size": 2104,
		"path": "../public/assets/login-DTf1EMoa.js"
	},
	"/assets/link-DRg_h8Wf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5b00-pmdB6jQce0uetlr5gJVHvwxhy4U\"",
		"mtime": "2026-07-14T17:46:36.546Z",
		"size": 23296,
		"path": "../public/assets/link-DRg_h8Wf.js"
	},
	"/assets/new-arrivals-BRtzN8HX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"31f-RC0aYzA1ih9v3CspkKS34i+qZBY\"",
		"mtime": "2026-07-14T17:46:36.549Z",
		"size": 799,
		"path": "../public/assets/new-arrivals-BRtzN8HX.js"
	},
	"/assets/message-square-DlIqdXwp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e9-S11AlXNlIwKYlsP1g3zeLgXfTu8\"",
		"mtime": "2026-07-14T17:46:36.548Z",
		"size": 233,
		"path": "../public/assets/message-square-DlIqdXwp.js"
	},
	"/assets/orders-C74VpK7N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a89-KsYmpC6BnV1eAau1+4aBRM9RnUg\"",
		"mtime": "2026-07-14T17:46:36.550Z",
		"size": 2697,
		"path": "../public/assets/orders-C74VpK7N.js"
	},
	"/assets/prod-ams-DEMucPiE.jpg": {
		"type": "image/jpeg",
		"etag": "\"5d5e-TVdR/zvpdpWz92uunfOP92NV1bA\"",
		"mtime": "2026-07-14T17:46:36.579Z",
		"size": 23902,
		"path": "../public/assets/prod-ams-DEMucPiE.jpg"
	},
	"/assets/prod-camera-BeOzk9sI.jpg": {
		"type": "image/jpeg",
		"etag": "\"5293-bDTNJPnjHqIm5lCBC3v98qaXR08\"",
		"mtime": "2026-07-14T17:46:36.580Z",
		"size": 21139,
		"path": "../public/assets/prod-camera-BeOzk9sI.jpg"
	},
	"/assets/prod-breakout-J8dcccV9.jpg": {
		"type": "image/jpeg",
		"etag": "\"60a6-ZPTzRnz68KYDxAYJD+l3L/zQU70\"",
		"mtime": "2026-07-14T17:46:36.579Z",
		"size": 24742,
		"path": "../public/assets/prod-breakout-J8dcccV9.jpg"
	},
	"/assets/privacy-CRq7SJ_y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"998-GjeFhvtNDyLN5bSfN7LoBy1J+0I\"",
		"mtime": "2026-07-14T17:46:36.551Z",
		"size": 2456,
		"path": "../public/assets/privacy-CRq7SJ_y.js"
	},
	"/assets/preload-helper-BbsV3x_j.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1828-2LlsO3qmgFnwT0WUb3lhhC/4Fvk\"",
		"mtime": "2026-07-14T17:46:36.551Z",
		"size": 6184,
		"path": "../public/assets/preload-helper-BbsV3x_j.js"
	},
	"/assets/prod-carrier-CstuSCre.jpg": {
		"type": "image/jpeg",
		"etag": "\"53cf-IqxoeBc5RrbVPCFZijuRjokE1is\"",
		"mtime": "2026-07-14T17:46:36.581Z",
		"size": 21455,
		"path": "../public/assets/prod-carrier-CstuSCre.jpg"
	},
	"/assets/prod-drone-motor-B_-iyosk.jpg": {
		"type": "image/jpeg",
		"etag": "\"51ea-+0RGcLp6oLxG2lQvOWf5cM+cMUg\"",
		"mtime": "2026-07-14T17:46:36.582Z",
		"size": 20970,
		"path": "../public/assets/prod-drone-motor-B_-iyosk.jpg"
	},
	"/assets/prod-lcd-board-B_6B-QCj.jpg": {
		"type": "image/jpeg",
		"etag": "\"2b28-HjQyrCoBzLGr6ere24tbVtMiNoM\"",
		"mtime": "2026-07-14T17:46:36.583Z",
		"size": 11048,
		"path": "../public/assets/prod-lcd-board-B_6B-QCj.jpg"
	},
	"/assets/prod-light-sensor-PMWT34bk.jpg": {
		"type": "image/jpeg",
		"etag": "\"284c-8earWPvM/VN6V9ExXf6gGjqmLWo\"",
		"mtime": "2026-07-14T17:46:36.584Z",
		"size": 10316,
		"path": "../public/assets/prod-light-sensor-PMWT34bk.jpg"
	},
	"/assets/prod-fpga-CsQdQXjm.jpg": {
		"type": "image/jpeg",
		"etag": "\"7f0c-Me5oHf6Sz2ps5UUf3DOz3Y9/XqA\"",
		"mtime": "2026-07-14T17:46:36.582Z",
		"size": 32524,
		"path": "../public/assets/prod-fpga-CsQdQXjm.jpg"
	},
	"/assets/prod-mini-board-DZwJ-vTv.jpg": {
		"type": "image/jpeg",
		"etag": "\"36e5-Gz5s5a9JzaS9O7EzAnbWw28P9FM\"",
		"mtime": "2026-07-14T17:46:36.586Z",
		"size": 14053,
		"path": "../public/assets/prod-mini-board-DZwJ-vTv.jpg"
	},
	"/assets/prod-printer-Bh5Pe8TU.jpg": {
		"type": "image/jpeg",
		"etag": "\"55ee-lVaLEYOZLxgNjYmduZBQMEwCMsI\"",
		"mtime": "2026-07-14T17:46:36.587Z",
		"size": 21998,
		"path": "../public/assets/prod-printer-Bh5Pe8TU.jpg"
	},
	"/assets/prod-mp3-CIprnfTD.jpg": {
		"type": "image/jpeg",
		"etag": "\"34e2-6JUMiyggl35CG4dLQcMTGeQJQjQ\"",
		"mtime": "2026-07-14T17:46:36.587Z",
		"size": 13538,
		"path": "../public/assets/prod-mp3-CIprnfTD.jpg"
	},
	"/assets/ProductCard-CsHQrsbf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ddb-AxsqbHegoM0gK7sbxXn143hLRXE\"",
		"mtime": "2026-07-14T17:46:36.525Z",
		"size": 3547,
		"path": "../public/assets/ProductCard-CsHQrsbf.js"
	},
	"/assets/profile-BZdk7MCQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a29-AsCpzQd8dd1ReJgpCh7Zy0TBz/o\"",
		"mtime": "2026-07-14T17:46:36.553Z",
		"size": 2601,
		"path": "../public/assets/profile-BZdk7MCQ.js"
	},
	"/assets/rolldown-runtime-Bh1tDfsg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"237-RWMfWL++Hyx/oSoFmTJgBJkEveY\"",
		"mtime": "2026-07-14T17:46:36.556Z",
		"size": 567,
		"path": "../public/assets/rolldown-runtime-Bh1tDfsg.js"
	},
	"/assets/register-DMkHCuQW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a48-O8wLwF6+595GtzfpSTUgmMb/hqw\"",
		"mtime": "2026-07-14T17:46:36.554Z",
		"size": 2632,
		"path": "../public/assets/register-DMkHCuQW.js"
	},
	"/assets/returns-BoiU8PAm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5cb-2W++JVKkEtYB7XdHgn9qJRP+Xsc\"",
		"mtime": "2026-07-14T17:46:36.555Z",
		"size": 1483,
		"path": "../public/assets/returns-BoiU8PAm.js"
	},
	"/assets/index-BSpjYuYV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4c25e-3LpUpjl3DFpLD7GUXuaRaRo2JHk\"",
		"mtime": "2026-07-14T17:46:36.521Z",
		"size": 311902,
		"path": "../public/assets/index-BSpjYuYV.js"
	},
	"/assets/shield-check-B29eS8sw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-hOOTzApAdQHZz8TBIQZ/OLvr6Fg\"",
		"mtime": "2026-07-14T17:46:36.558Z",
		"size": 320,
		"path": "../public/assets/shield-check-B29eS8sw.js"
	},
	"/assets/sell-on-autoforge-CJRF-38G.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a38-YQufaShDgQlH9/3ZLPffGMXFawU\"",
		"mtime": "2026-07-14T17:46:36.557Z",
		"size": 6712,
		"path": "../public/assets/sell-on-autoforge-CJRF-38G.js"
	},
	"/assets/shipping-D8tt3YBJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"602-i95EG4hYpDmYuqSHlUgjupL2CLg\"",
		"mtime": "2026-07-14T17:46:36.559Z",
		"size": 1538,
		"path": "../public/assets/shipping-D8tt3YBJ.js"
	},
	"/assets/routes-BYnMoBZV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7554-QjaGYpki3qD/mVC9OvEntV1fICU\"",
		"mtime": "2026-07-14T17:46:36.556Z",
		"size": 30036,
		"path": "../public/assets/routes-BYnMoBZV.js"
	},
	"/assets/shopping-bag-C74bJt_y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"154-/tT4HOTl9wvf8QqEJfjydjyzYsY\"",
		"mtime": "2026-07-14T17:46:36.562Z",
		"size": 340,
		"path": "../public/assets/shopping-bag-C74bJt_y.js"
	},
	"/assets/store-data-BqN70mLv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"178-gYi0Wz5eYaUXoo7i8lbAQ0pWloU\"",
		"mtime": "2026-07-14T17:46:36.563Z",
		"size": 376,
		"path": "../public/assets/store-data-BqN70mLv.js"
	},
	"/assets/shop-BzYGiUON.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3841-w79jYhzteZ/dkTAXGqCep9FdXNI\"",
		"mtime": "2026-07-14T17:46:36.561Z",
		"size": 14401,
		"path": "../public/assets/shop-BzYGiUON.js"
	},
	"/assets/shop-BVSLTDyz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e00a-78F3a4W67sHEkKAcgJ21P1k/lHU\"",
		"mtime": "2026-07-14T17:46:36.559Z",
		"size": 57354,
		"path": "../public/assets/shop-BVSLTDyz.js"
	},
	"/assets/StorePageShell-093u-WAc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"189-9na9QNtStz1T4E8ih/CiSHkz638\"",
		"mtime": "2026-07-14T17:46:36.526Z",
		"size": 393,
		"path": "../public/assets/StorePageShell-093u-WAc.js"
	},
	"/assets/StoreFooter-CLLYWWSl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13145-R2lNCuOQZqH6md7GnTxSGbbndg4\"",
		"mtime": "2026-07-14T17:46:36.526Z",
		"size": 78149,
		"path": "../public/assets/StoreFooter-CLLYWWSl.js"
	},
	"/assets/terms-B8YGWyFO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"72b-pGexlrt7h7HLil/CDxFBeD126mc\"",
		"mtime": "2026-07-14T17:46:36.563Z",
		"size": 1835,
		"path": "../public/assets/terms-B8YGWyFO.js"
	},
	"/assets/users-C-JucN1g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132-ju7yJ/6cwTn5/+BxQJK7BgxcY/0\"",
		"mtime": "2026-07-14T17:46:36.565Z",
		"size": 306,
		"path": "../public/assets/users-C-JucN1g.js"
	},
	"/assets/wishlist-DdOhoyva.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a2e-MJgKw4Ejbz137ogQELBVIEcl/ug\"",
		"mtime": "2026-07-14T17:46:36.566Z",
		"size": 2606,
		"path": "../public/assets/wishlist-DdOhoyva.js"
	},
	"/assets/styles-BxVoYKxY.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"17131-D+1Z7bBbIwvIV92XNDpDnq03ols\"",
		"mtime": "2026-07-14T17:46:36.588Z",
		"size": 94513,
		"path": "../public/assets/styles-BxVoYKxY.css"
	},
	"/assets/WishlistContext-VYwnPYyl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"70d-kmxT1OLkhBYKZ/isBTH1vTeFGJk\"",
		"mtime": "2026-07-14T17:46:36.527Z",
		"size": 1805,
		"path": "../public/assets/WishlistContext-VYwnPYyl.js"
	},
	"/assets/useAuth-BbaC1SqV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bb73-OI/Rw2ELjvQ3CnatC22DL2MLHzY\"",
		"mtime": "2026-07-14T17:46:36.564Z",
		"size": 47987,
		"path": "../public/assets/useAuth-BbaC1SqV.js"
	},
	"/assets/_sku-DOZlZbzK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34e-tNvNsWD0R4dmVST04nUy6KmFLNA\"",
		"mtime": "2026-07-14T17:46:36.528Z",
		"size": 846,
		"path": "../public/assets/_sku-DOZlZbzK.js"
	},
	"/assets/_sku-B-JJaNVc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"47b5-49HDcZRCji797kpx7Npa7tGxBZA\"",
		"mtime": "2026-07-14T17:46:36.528Z",
		"size": 18357,
		"path": "../public/assets/_sku-B-JJaNVc.js"
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
