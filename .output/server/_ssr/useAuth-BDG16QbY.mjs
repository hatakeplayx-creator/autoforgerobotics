import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useAuth-BDG16QbY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var baseUrl = "http://localhost:4000".replace(/\/$/, "");
async function apiFetch(path, init = {}) {
	if (!baseUrl) throw new Error("API is not configured");
	const response = await fetch(`${baseUrl}${path}`, {
		...init,
		headers: {
			"Content-Type": "application/json",
			...init.headers
		}
	});
	if (!response.ok) throw new Error((await response.json().catch(() => ({ message: "Request failed" }))).message);
	return response.status === 204 ? void 0 : response.json();
}
var ACCESS_TOKEN_KEY = "autoforge_access_token";
var REFRESH_TOKEN_KEY = "autoforge_refresh_token";
var AuthContext = (0, import_react.createContext)(void 0);
async function refreshAccessToken(refreshToken) {
	return apiFetch("/api/auth/refresh", {
		method: "POST",
		body: JSON.stringify({ refreshToken })
	});
}
var refreshPromise = null;
async function apiFetchWithAuth(path, init = {}, accessToken, setAccessToken, setRefreshToken, setUser) {
	const headers = new Headers(init.headers || {});
	if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
	try {
		return await apiFetch(path, {
			...init,
			headers
		});
	} catch (err) {
		const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
		if (!storedRefreshToken) {
			setUser(null);
			throw err;
		}
		if (!refreshPromise) refreshPromise = refreshAccessToken(storedRefreshToken);
		try {
			const newTokens = await refreshPromise;
			setAccessToken(newTokens.accessToken);
			setRefreshToken(newTokens.refreshToken);
			setUser(newTokens.user);
			localStorage.setItem(ACCESS_TOKEN_KEY, newTokens.accessToken);
			localStorage.setItem(REFRESH_TOKEN_KEY, newTokens.refreshToken);
			const newHeaders = new Headers(init.headers || {});
			newHeaders.set("Authorization", `Bearer ${newTokens.accessToken}`);
			return await apiFetch(path, {
				...init,
				headers: newHeaders
			});
		} catch (refreshErr) {
			localStorage.removeItem(ACCESS_TOKEN_KEY);
			localStorage.removeItem(REFRESH_TOKEN_KEY);
			setUser(null);
			throw refreshErr;
		} finally {
			refreshPromise = null;
		}
	}
}
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [accessToken, setAccessToken] = (0, import_react.useState)(null);
	const [refreshToken, setRefreshToken] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
		const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
		if (storedAccessToken && storedRefreshToken) {
			setAccessToken(storedAccessToken);
			setRefreshToken(storedRefreshToken);
			(async () => {
				try {
					const userData = await apiFetchWithAuth("/api/me", {}, storedAccessToken, setAccessToken, setRefreshToken, setUser);
					setUser(userData);
				} catch (err) {
					console.error("Failed to restore session", err);
					localStorage.removeItem(ACCESS_TOKEN_KEY);
					localStorage.removeItem(REFRESH_TOKEN_KEY);
				} finally {
					setLoading(false);
				}
			})();
		} else setLoading(false);
	}, []);
	const login = async (email, password) => {
		try {
			const auth = await apiFetch("/api/auth/login", {
				method: "POST",
				body: JSON.stringify({
					email,
					password
				})
			});
			setUser(auth.user);
			setAccessToken(auth.accessToken);
			setRefreshToken(auth.refreshToken);
			localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
			localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
			toast.success(`Welcome back, ${auth.user.name}!`);
			return true;
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Login failed");
			return false;
		}
	};
	const sendOtp = async (phone) => {
		try {
			await apiFetch("/api/auth/otp/send", {
				method: "POST",
				body: JSON.stringify({ phone })
			});
			toast.success("OTP sent successfully!");
			return true;
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to send OTP");
			return false;
		}
	};
	const verifyOtp = async (phone, otp, name) => {
		try {
			const auth = await apiFetch("/api/auth/otp/verify", {
				method: "POST",
				body: JSON.stringify({
					phone,
					otp,
					name
				})
			});
			setUser(auth.user);
			setAccessToken(auth.accessToken);
			setRefreshToken(auth.refreshToken);
			localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
			localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
			toast.success(`Welcome${name ? `, ${name}` : ""}!`);
			return true;
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "OTP verification failed");
			return false;
		}
	};
	const register = async (payload) => {
		toast.error("Registration via email/password is disabled, use OTP login instead");
		return false;
	};
	const logout = async () => {
		if (refreshToken) try {
			await apiFetch("/api/auth/logout", {
				method: "POST",
				body: JSON.stringify({ refreshToken })
			});
		} catch {}
		localStorage.removeItem(ACCESS_TOKEN_KEY);
		localStorage.removeItem(REFRESH_TOKEN_KEY);
		setUser(null);
		setAccessToken(null);
		setRefreshToken(null);
		toast.info("You have been logged out.");
	};
	const requestPasswordReset = async (email) => {
		try {
			await apiFetch("/api/auth/password-reset", {
				method: "POST",
				body: JSON.stringify({ email })
			});
			toast.success("If the account exists, reset instructions were sent.");
			return true;
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Request failed");
			return false;
		}
	};
	const updateProfile = async (payload) => {
		if (!accessToken) {
			toast.error("Please login to update your profile");
			return;
		}
		try {
			const updatedUser = await apiFetchWithAuth("/api/me", {
				method: "PATCH",
				body: JSON.stringify(payload)
			}, accessToken, setAccessToken, setRefreshToken, setUser);
			setUser(updatedUser);
			toast.success("Profile updated.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to update profile");
		}
	};
	const value = (0, import_react.useMemo)(() => ({
		user,
		isAuthenticated: !!user,
		loading,
		login,
		sendOtp,
		verifyOtp,
		register,
		logout,
		requestPasswordReset,
		updateProfile
	}), [
		user,
		loading,
		accessToken,
		refreshToken
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value,
		children
	});
}
function useAuth() {
	const context = (0, import_react.useContext)(AuthContext);
	if (context === void 0) throw new Error("useAuth must be used within an AuthProvider");
	return context;
}
//#endregion
export { apiFetch as n, useAuth as r, AuthProvider as t };
