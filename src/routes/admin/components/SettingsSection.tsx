import { useCallback, useEffect, useState } from "react";
import { fetchSettings, saveSetting, type AdminSetting } from "@/services/adminApi";
import { toast } from "sonner";

interface SettingField {
  key: string;
  label: string;
  type?: "text" | "password";
}

const SETTINGS_FIELDS: SettingField[] = [
  { key: "website_name", label: "Website name" },
  { key: "support_phone", label: "Support phone" },
  { key: "support_email", label: "Support email" },
  { key: "business_address", label: "Business address" },
  { key: "facebook_url", label: "Facebook URL" },
  { key: "instagram_url", label: "Instagram URL" },
  { key: "footer_text", label: "Footer text" },
  { key: "support_hours", label: "Business hours" },
  { key: "linkedin_url", label: "LinkedIn URL" },
  { key: "twitter_url", label: "Twitter / X URL" },
  { key: "whatsapp_url", label: "WhatsApp URL" },
  { key: "youtube_url", label: "YouTube URL" },
  { key: "github_url", label: "GitHub URL" },
  { key: "store_logo", label: "Store logo URL" },
  { key: "favicon", label: "Favicon URL" },
  { key: "default_currency", label: "Default currency" },
  { key: "default_tax", label: "Default tax" },
  { key: "free_shipping_limit", label: "Free shipping limit" },
  { key: "smtp_host", label: "SMTP Host" },
  { key: "smtp_port", label: "SMTP Port" },
  { key: "smtp_user", label: "SMTP User" },
  { key: "gstin", label: "GSTIN" },
];

export default function SettingsSection({ token }: { token?: string }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSettings(token);
      const map: Record<string, string> = {};
      for (const s of data.value) {
        map[s.key] = s.value != null ? String(s.value) : "";
      }
      setValues(map);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load settings");
    } finally {
      setLoading(false);
    }
  },[token]);

  useEffect(() => { void loadSettings(); }, [loadSettings]);

  const handleChange = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async () => {
    setSaving(true);
    let successCount = 0;
    let failCount = 0;
    for (const field of SETTINGS_FIELDS) {
      const val = values[field.key];
      if (val !== undefined && val !== "") {
        try {
          await saveSetting(field.key, val, token);
          successCount++;
        } catch (err) {
          failCount++;
        }
      }
    }
    setSaving(false);
    if (failCount === 0) {
      toast.success(`${successCount} setting(s) saved successfully`);
      loadSettings();
    } else {
      toast.error(`${failCount} setting(s) failed to save. ${successCount} succeeded.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your store
          </p>
        </div>
        <button
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          disabled={saving}
          onClick={handleSave}
        >
          {saving ? "Saving..." : "Save settings"}
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
          <button onClick={loadSettings} className="ml-3 underline underline-offset-2 hover:text-destructive/80">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {SETTINGS_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="text-sm font-medium">{field.label}</label>
              <input
                className="mt-1.5 w-full rounded-md border px-3 py-2"
                type={field.type || "text"}
                value={values[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
