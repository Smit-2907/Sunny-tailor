import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

// ═══════════════════════════════════════════════════════════════
//  Supabase JS client  (anon key – respects RLS)
// ═══════════════════════════════════════════════════════════════

const SUPABASE_URL = `https://${projectId}.supabase.co`;

export const supabase = createClient(SUPABASE_URL, publicAnonKey);

// Export projectId so setup utilities can reference it
export { projectId };

// ═══════════════════════════════════════════════════════════════
//  Edge-function base (KV store, auth, POs, bills, users…)
// ═══════════════════════════════════════════════════════════════

const BASE = `${SUPABASE_URL}/functions/v1/make-server-ed7cbcb6`;

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${publicAnonKey}`,
});

async function request<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: { ...headers(), ...(opts?.headers || {}) },
  });
  if (!res.ok) {
    const body = await res.text();

    // All 404s are expected — new routes may not be deployed yet, localStorage fallback handles them.
    // 401 on auth is also expected — localStorage auth fallback handles it.
    const isExpectedError = res.status === 404 || (res.status === 401 && path.includes('/auth/'));

    if (!isExpectedError) {
      console.error(`[API] ${opts?.method || "GET"} ${path} failed (${res.status}):`, body);
    }

    throw new Error(`API error ${res.status}: ${body}`);
  }
  return res.json();
}

// ═══════════════════════════════════════════════════════════════
//  STORAGE — Bucket fundamentals (per Supabase docs)
//
//  Bucket: erp-documents  (public)
//
//  ⚠️  ONE-TIME SETUP in Supabase Dashboard → SQL Editor:
//  ─────────────────────────────────────────────────────────
//  -- 1. Create the public bucket
//  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
//  VALUES (
//    'erp-documents',
//    'erp-documents',
//    true,
//    52428800,   -- 50 MB per file
//    ARRAY['image/png','image/jpeg','image/webp','application/pdf',
//           'application/msword',
//           'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//           'application/vnd.ms-excel',
//           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
//  )
//  ON CONFLICT (id) DO NOTHING;
//
//  -- 2. RLS policies (allow all operations for this ERP)
//  CREATE POLICY "erp_allow_insert" ON storage.objects
//    FOR INSERT WITH CHECK (bucket_id = 'erp-documents');
//
//  CREATE POLICY "erp_allow_select" ON storage.objects
//    FOR SELECT USING (bucket_id = 'erp-documents');
//
//  CREATE POLICY "erp_allow_update" ON storage.objects
//    FOR UPDATE USING (bucket_id = 'erp-documents');
//
//  CREATE POLICY "erp_allow_delete" ON storage.objects
//    FOR DELETE USING (bucket_id = 'erp-documents');
// ═══════════════════════════════════════════════════════════════

export const BUCKET = "erp-documents";

// ── Folder constants (organise objects inside the bucket) ──────
export const STORAGE_FOLDERS = {
  PO_DOCUMENTS:       "po-documents",
  FABRIC_BILLS:       "fabric-bills",
  COMPANY_INVOICES:   "company-invoices",
  PROFILE_PHOTOS:     "profile-photos",
  MISC:               "misc",
} as const;

export type StorageFolder = typeof STORAGE_FOLDERS[keyof typeof STORAGE_FOLDERS];

// ── Upload a file ──────────────────────────────────────────────
// Returns the public URL.  Upsert is enabled so re-uploading the
// same path overwrites the old file (handy for profile photos).
export async function uploadFileToStorage(
  file: File,
  folder: StorageFolder | string = STORAGE_FOLDERS.MISC,
): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${folder}/${Date.now()}-${safeName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type || "application/octet-stream",
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  return getPublicUrl(data.path);
}

// ── Get public URL (no auth required for public bucket) ────────
export function getPublicUrl(path: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ── Create a signed URL (time-limited, works for private files) ─
export async function createSignedUrl(
  path: string,
  expiresInSeconds = 3600,
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw new Error(`Signed URL failed: ${error?.message ?? "no URL returned"}`);
  }
  return data.signedUrl;
}

// ── Create multiple signed URLs in one call ───────────────────
export async function createSignedUrls(
  paths: string[],
  expiresInSeconds = 3600,
): Promise<Array<{ path: string; signedUrl: string }>> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(paths, expiresInSeconds);

  if (error) throw new Error(`Signed URLs failed: ${error.message}`);
  return (data ?? []).map((d) => ({ path: d.path, signedUrl: d.signedUrl ?? "" }));
}

// ── Download a file as Blob ────────────────────────────────────
export async function downloadFile(path: string): Promise<Blob> {
  const { data, error } = await supabase.storage.from(BUCKET).download(path);
  if (error || !data) throw new Error(`Download failed: ${error?.message}`);
  return data;
}

// ── List files in a folder ─────────────────────────────────────
export interface StorageFileInfo {
  name: string;
  id: string | null;
  size: number;
  mimetype: string;
  updatedAt: string;
  publicUrl: string;
}

export async function listFiles(
  folder: StorageFolder | string,
  opts?: { limit?: number; offset?: number; search?: string },
): Promise<StorageFileInfo[]> {
  const { data, error } = await supabase.storage.from(BUCKET).list(folder, {
    limit:  opts?.limit  ?? 100,
    offset: opts?.offset ?? 0,
    search: opts?.search,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) {
    // Bucket not configured yet — return empty list so UI shows "No files"
    // instead of crashing.  The StorageSetupBanner already informs the admin.
    console.warn("[Storage] List skipped — bucket or policies not ready:", error.message);
    return [];
  }

  return (data ?? []).map((f) => ({
    name:      f.name,
    id:        f.id ?? null,
    size:      f.metadata?.size ?? 0,
    mimetype:  f.metadata?.mimetype ?? "",
    updatedAt: f.updated_at ?? "",
    publicUrl: getPublicUrl(`${folder}/${f.name}`),
  }));
}

// ── Move a file (rename / reorganise) ─────────────────────────
export async function moveFile(fromPath: string, toPath: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).move(fromPath, toPath);
  if (error) throw new Error(`Move failed: ${error.message}`);
}

// ── Copy a file ───────────────────────────────────────────────
export async function copyFile(fromPath: string, toPath: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).copy(fromPath, toPath);
  if (error) throw new Error(`Copy failed: ${error.message}`);
}

// ── Delete one or more files ───────────────────────────────────
export async function deleteFiles(paths: string[]): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}

// Convenience wrapper for a single file
export async function deleteFile(path: string): Promise<void> {
  return deleteFiles([path]);
}

// ── Extract storage path from a public URL ─────────────────────
// Useful when you have stored the full URL and need the path for
// signed-URL generation or deletion.
export function extractStoragePath(publicUrl: string): string {
  const marker = `/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) throw new Error("URL does not belong to this bucket");
  return publicUrl.slice(idx + marker.length);
}

// ══════════════════════════════════════════════════════════════
//  PURCHASE ORDERS
// ═══════════════════════════════════════════════════════════════

export async function fetchPOs() {
  const { data } = await request<{ data: any[] }>("/pos");
  return data || [];
}

export async function savePO(po: any) {
  await request("/pos", { method: "POST", body: JSON.stringify(po) });
}

export async function deletePO(id: string) {
  await request(`/pos/${encodeURIComponent(id)}`, { method: "DELETE" });
}

// ═══════════════════════════════════════════════════════════════
//  EMPLOYEES
// ═══════════════════════════════════════════════════════════════

export async function fetchEmployees(poId: string) {
  const { data } = await request<{ data: any[] }>(`/employees/${encodeURIComponent(poId)}`);
  return data || [];
}

export async function saveEmployees(poId: string, employees: any[]) {
  await request(`/employees/${encodeURIComponent(poId)}`, {
    method: "POST",
    body: JSON.stringify({ employees }),
  });
}

// ═══════════════════════════════════════════════════════════════
//  BILLS
// ═══════════════════════════════════════════════════════════════

export async function fetchBills() {
  const { data } = await request<{ data: any[] }>("/bills");
  return data || [];
}

export async function saveBill(bill: any) {
  await request("/bills", { method: "POST", body: JSON.stringify(bill) });
}

export async function deleteBill(id: string) {
  await request(`/bills/${encodeURIComponent(id)}`, { method: "DELETE" });
}

// ═══════════════════════════════════════════════════════════════
//  BULK SYNC (localStorage → Supabase KV)
// ══════════════════════════════════════════════════════════════

export async function bulkSync(payload: {
  purchaseOrders?: any[];
  employeesByPO?: Record<string, any[]>;
  bills?: any[];
}) {
  await request("/sync/upload", { method: "POST", body: JSON.stringify(payload) });
}

// ═══════════════════════════════════════════════════════════════
//  USERS
// ═══════════════════════════════════════════════════════════════

export async function fetchUsers() {
  try {
    const { data } = await request<{ data: any[] }>("/users");
    return data || [];
  } catch (error: any) {
    // Fallback to localStorage
    console.log("[Users] Fetching from localStorage");
    const users: any[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("user:")) {
        try {
          const userData = JSON.parse(localStorage.getItem(key) || "{}");
          // Don't expose passwords in the list
          users.push({ ...userData, password: "••••••" });
        } catch (e) {
          console.error(`[Users] Failed to parse user: ${key}`, e);
        }
      }
    }
    return users;
  }
}

export async function saveUser(user: any) {
  const normalizedEmail = user.email.toLowerCase().trim();
  const key = `user:${normalizedEmail}`;

  try {
    const { data } = await request<{ data: any }>("/users", {
      method: "POST",
      body: JSON.stringify(user),
    });

    // Also save to localStorage for fallback
    const existing = localStorage.getItem(key);
    const existingData = existing ? JSON.parse(existing) : {};
    const finalUser = {
      ...user,
      email: normalizedEmail,
      password: user.password === "••••••" && existing ? existingData.password : user.password,
      createdAt: existingData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(finalUser));
    console.log(`[Users] Saved to both server and localStorage: ${normalizedEmail}`);

    return data;
  } catch (error: any) {
    // Fallback to localStorage only
    console.log("[Users] Server unavailable, saving to localStorage only");
    const existing = localStorage.getItem(key);
    const existingData = existing ? JSON.parse(existing) : {};
    const finalUser = {
      ...user,
      email: normalizedEmail,
      password: user.password === "••••••" && existing ? existingData.password : user.password,
      createdAt: existingData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(finalUser));
    console.log(`[Users] Saved to localStorage: ${normalizedEmail}`);
    return { ...finalUser, password: "••••••" };
  }
}

export async function deleteUser(email: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const key = `user:${normalizedEmail}`;

  try {
    await request(`/users/${encodeURIComponent(email)}`, { method: "DELETE" });
    // Also remove from localStorage
    localStorage.removeItem(key);
    console.log(`[Users] Deleted from both server and localStorage: ${normalizedEmail}`);
  } catch (error: any) {
    // Fallback to localStorage only
    console.log("[Users] Server unavailable, deleting from localStorage only");
    localStorage.removeItem(key);
    console.log(`[Users] Deleted from localStorage: ${normalizedEmail}`);
  }
}

// ══════════════════════════════════════════════════════════════
//  AUTH / LOGIN  (server-backed with localStorage fallback)
// ═══════════════════════════════════════════════════════════════

const MASTER_ACCOUNTS = [
  { email: "sunnytailor@gmail.com", password: "Admin@123", role: "master-manager",     name: "Master Admin", isActive: true },
  { email: "sunnytailor@gmail.com", password: "Admin@123", role: "hr",                 name: "Master Admin", isActive: true },
  { email: "sunnytailor@gmail.com", password: "Admin@123", role: "measurement-expert", name: "Master Admin", isActive: true },
  { email: "sunnytailor@gmail.com", password: "Admin@123", role: "production-manager", name: "Master Admin", isActive: true },
  { email: "sunnytailor@gmail.com", password: "Admin@123", role: "fabric-store",       name: "Master Admin", isActive: true },
  { email: "sunnytailor@gmail.com", password: "Admin@123", role: "raw-material-store", name: "Master Admin", isActive: true },
  { email: "sunnytailor@gmail.com", password: "Admin@123", role: "dispatch",           name: "Master Admin", isActive: true },
  { email: "sunnytailor@gmail.com", password: "Admin@123", role: "accountant",         name: "Master Admin", isActive: true },
  { email: "patelsmit090305@gmail.com", password: "Smit@935", role: "master-manager",  name: "Smit Patel",   isActive: true },
];

function seedLocalMasterAccounts() {
  console.log(`[LocalAuth] Seeding ${MASTER_ACCOUNTS.length} master accounts...`);

  for (const master of MASTER_ACCOUNTS) {
    // Store each account under a role-scoped key so multiple roles per email work
    const key = `user:${master.email}:${master.role}`;
    const existing = localStorage.getItem(key);
    const userData = existing ? JSON.parse(existing) : {};
    const finalData = {
      ...master,
      createdAt: userData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(finalData));
    console.log(`[LocalAuth] Seeded: ${master.email} as ${master.role}`);
  }
}

// Export for manual seeding if needed
export function reseedMasterAccounts() {
  console.log("[LocalAuth] Manually reseeding master accounts...");
  seedLocalMasterAccounts();
  console.log("[LocalAuth] Master accounts reseeded successfully");
}

// ═══════════════════════════════════════════════════════════════
//  CHART OF ACCOUNTS
// ═══════════════════════════════════════════════════════════════

const STORAGE_KEY_ACCOUNTS = "erp_chart_of_accounts";

export async function fetchChartOfAccounts() {
  // Try localStorage first for instant load
  const stored = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
  const localData = stored ? JSON.parse(stored) : [];

  try {
    // Try server for sync (in background)
    const { data } = await request<{ data: any[] }>("/accounts");
    // Update localStorage with server data
    if (data && data.length > 0) {
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(data));
      return data;
    }
  } catch (error: any) {
    // Server unavailable or 404 - use localStorage (silent fallback)
    if (error.message && !error.message.includes("404")) {
      console.log("[Accounts] Server unavailable, using localStorage");
    }
  }

  return localData;
}

export async function saveChartOfAccount(account: any) {
  const key = STORAGE_KEY_ACCOUNTS;

  // Always save to localStorage first for immediate persistence
  const stored = localStorage.getItem(key);
  const accounts = stored ? JSON.parse(stored) : [];
  const existingIndex = accounts.findIndex((a: any) => a.id === account.id);

  const finalAccount = {
    ...account,
    updatedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    accounts[existingIndex] = finalAccount;
  } else {
    accounts.push(finalAccount);
  }

  localStorage.setItem(key, JSON.stringify(accounts));

  // Try to sync with server (non-blocking)
  try {
    await request<{ data: any }>("/accounts", {
      method: "POST",
      body: JSON.stringify(finalAccount),
    });
    console.log(`[Accounts] Saved to both server and localStorage: ${account.accountCode}`);
  } catch (error: any) {
    // Server unavailable - already saved to localStorage
    if (error.message && !error.message.includes("404")) {
      console.log("[Accounts] Server unavailable, saved to localStorage only");
    }
  }

  return finalAccount;
}

export async function deleteChartOfAccount(id: string) {
  const key = STORAGE_KEY_ACCOUNTS;

  // Always delete from localStorage first
  const stored = localStorage.getItem(key);
  if (stored) {
    const accounts = JSON.parse(stored);
    const filtered = accounts.filter((a: any) => a.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));
  }

  // Try to sync with server (non-blocking)
  try {
    await request(`/accounts/${encodeURIComponent(id)}`, { method: "DELETE" });
    console.log(`[Accounts] Deleted from both server and localStorage: ${id}`);
  } catch (error: any) {
    // Server unavailable - already deleted from localStorage
    if (error.message && !error.message.includes("404")) {
      console.log("[Accounts] Server unavailable, deleted from localStorage only");
    }
  }
}

export async function bulkSaveChartOfAccounts(accounts: any[]) {
  const key = STORAGE_KEY_ACCOUNTS;

  // Always save to localStorage first
  localStorage.setItem(key, JSON.stringify(accounts));
  console.log(`[Accounts] Bulk saved ${accounts.length} accounts to localStorage`);

  // Try to sync with server (non-blocking)
  try {
    await request("/accounts/bulk", {
      method: "POST",
      body: JSON.stringify({ accounts }),
    });
    console.log(`[Accounts] Successfully synced ${accounts.length} accounts to server`);
  } catch (error: any) {
    // Server unavailable - already saved to localStorage
    if (error.message && !error.message.includes("404")) {
      console.log("[Accounts] Server unavailable, using localStorage only");
    }
  }
}

function authenticateLocally(
  email: string,
  password: string,
  role: string,
): { email: string; role: string; name: string } {
  const normalizedEmail = email.toLowerCase().trim();
  seedLocalMasterAccounts();

  // Try role-scoped key first (supports same email across multiple roles),
  // then fall back to plain email key for legacy stored accounts.
  const stored =
    localStorage.getItem(`user:${normalizedEmail}:${role}`) ||
    localStorage.getItem(`user:${normalizedEmail}`);

  console.log(`[LocalAuth] Looking up user: ${normalizedEmail} as ${role}, found: ${!!stored}`);

  if (stored) {
    try {
      const user = JSON.parse(stored);

      if (user.password === password && user.role === role && user.isActive !== false) {
        console.log(`[LocalAuth] Success: ${user.email} as ${role}`);
        return { email: user.email, role: user.role, name: user.name };
      }

      if (user.password !== password) {
        throw new Error("Incorrect password. Please try again.");
      }
      if (user.role !== role) {
        throw new Error(`This account is registered as "${user.role}", not "${role}". Please select the correct role.`);
      }
      if (user.isActive === false) {
        throw new Error("Your account has been deactivated. Please contact an administrator.");
      }
    } catch (e) {
      if (e instanceof Error && e.message !== "Unexpected token") throw e;
      throw new Error("Account data is corrupted. Please contact an administrator.");
    }
  }

  console.log(`[LocalAuth] No user found for email: ${normalizedEmail}`);
  throw new Error("No account found with this email. Please check your email or contact an administrator.");
}

export async function loginUser(
  email: string,
  password: string,
  role: string,
): Promise<{ email: string; role: string; name: string }> {
  const normalizedEmail = email.toLowerCase().trim();
  console.log(`[Login] Attempting login for: ${normalizedEmail} as role: ${role}`);

  // 1. Try server /auth/login endpoint — only trust a successful 200 response.
  //    Any error (including 401 role-mismatch from an outdated deployment) falls
  //    through silently to the local-auth fallback, which always has up-to-date
  //    seeded accounts for all roles.
  try {
    const { data } = await request<{ data: { email: string; role: string; name: string } }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: normalizedEmail, password, role }),
    });
    console.log(`[Login] Server auth success: ${data.email} as ${data.role}`);
    return data;
  } catch {
    console.log(`[Login] Server auth unavailable or rejected, falling back to local auth`);
  }

  // 2. Try localStorage / seeded master accounts
  try {
    return authenticateLocally(normalizedEmail, password, role);
  } catch (localError: any) {
    // 3. User not in localStorage → try fetching full user list from server
    if (localError.message?.includes("No account found")) {
      try {
        const users = await fetchUsers();
        const match = users.find((u: any) => {
          const uEmail = (u.email || "").toLowerCase().trim();
          return uEmail === normalizedEmail && u.role === role && u.isActive !== false;
        });

        if (!match) {
          throw new Error("No account found with this email. Please check your email or contact an administrator.");
        }

        const storedPw: string = match.password || "";
        if (storedPw && storedPw !== "••••••" && storedPw !== password) {
          throw new Error("Incorrect password. Please try again.");
        }

        // Cache to localStorage so next login works offline
        localStorage.setItem(`user:${normalizedEmail}`, JSON.stringify({
          ...match,
          email: normalizedEmail,
          password: storedPw === "••••••" ? password : storedPw,
          updatedAt: new Date().toISOString(),
        }));

        console.log(`[Login] Authenticated via server user list and cached locally: ${normalizedEmail}`);
        return {
          email: match.email || normalizedEmail,
          role: match.role,
          name: match.name || normalizedEmail,
        };
      } catch (syncError: any) {
        if (syncError.message !== localError.message) throw syncError;
      }
    }

    console.error(`[Login] Auth error:`, localError.message);
    throw localError;
  }
}

// ═══════════════════════════════════════════════════════════════
//  COMPANIES
// ═══════════════════════════════════════════════════════════════

export async function fetchCompanies() {
  const { data } = await request<{ data: any[] }>("/companies");
  return data || [];
}

export async function saveCompany(company: any) {
  const { data } = await request<{ data: any }>("/companies", {
    method: "POST",
    body: JSON.stringify(company),
  });
  return data;
}

export async function deleteCompany(id: string) {
  await request(`/companies/${encodeURIComponent(id)}`, { method: "DELETE" });
}

// ═══════════════════════════════════════════════════════════════
//  GENERIC ENTITY HELPER
//  server-first with localStorage cache as fallback
// ═══════════════════════════════════════════════════════════════

function lsKey(name: string) { return `erp_${name}`; }

function lsRead(name: string): any[] {
  try { const v = localStorage.getItem(lsKey(name)); return v ? JSON.parse(v) : []; }
  catch { return []; }
}

function lsWrite(name: string, items: any[]) {
  try { localStorage.setItem(lsKey(name), JSON.stringify(items)); } catch { /* quota */ }
}

function lsUpsert(name: string, item: any): any[] {
  const all = lsRead(name);
  const idx = all.findIndex((x: any) => x.id === item.id);
  const stamped = { ...item, updatedAt: new Date().toISOString() };
  if (idx >= 0) { all[idx] = stamped; } else { all.push({ ...stamped, createdAt: stamped.updatedAt }); }
  lsWrite(name, all);
  return all;
}

function lsRemove(name: string, id: string): any[] {
  const filtered = lsRead(name).filter((x: any) => x.id !== id);
  lsWrite(name, filtered);
  return filtered;
}

async function entityFetch(route: string, lsName: string): Promise<any[]> {
  try {
    const { data } = await request<{ data: any[] }>(`/${route}`);
    if (data?.length) { lsWrite(lsName, data); return data; }
  } catch { /* fallback */ }
  return lsRead(lsName);
}

async function entitySave(route: string, lsName: string, item: any): Promise<any> {
  const all = lsUpsert(lsName, item);
  try { await request(`/${route}`, { method: "POST", body: JSON.stringify(item) }); }
  catch { /* server unavailable — localStorage cache updated */ }
  return item;
}

async function entityDelete(route: string, lsName: string, id: string): Promise<void> {
  lsRemove(lsName, id);
  try { await request(`/${route}/${encodeURIComponent(id)}`, { method: "DELETE" }); }
  catch { /* server unavailable */ }
}

async function entityBulkSave(route: string, lsName: string, items: any[]): Promise<any[]> {
  lsWrite(lsName, items);
  try { await request(`/${route}/bulk`, { method: "POST", body: JSON.stringify({ items }) }); }
  catch { /* server unavailable */ }
  return items;
}

// ═══════════════════════════════════════════════════════════════
//  BILLS & EXPENSES
// ═══════════════════════════════════════════════════════════════

export async function fetchBillsExpenses() { return entityFetch("bills-expenses", "bills_expenses"); }
export async function saveBillExpense(item: any) { return entitySave("bills-expenses", "bills_expenses", item); }
export async function deleteBillExpense(id: string) { return entityDelete("bills-expenses", "bills_expenses", id); }
export async function bulkSaveBillsExpenses(items: any[]) { return entityBulkSave("bills-expenses", "bills_expenses", items); }

// ═══════════════════════════════════════════════════════════════
//  SALARIES (HR)
// ═══════════════════════════════════════════════════════════════

export async function fetchSalaries() { return entityFetch("salaries", "employee_salaries"); }
export async function saveSalary(item: any) { return entitySave("salaries", "employee_salaries", item); }
export async function deleteSalary(id: string) { return entityDelete("salaries", "employee_salaries", id); }
export async function bulkSaveSalaries(items: any[]) { return entityBulkSave("salaries", "employee_salaries", items); }

// ═══════════════════════════════════════════════════════════════
//  FABRIC BILLS
// ═══════════════════════════════════════════════════════════════

export async function fetchFabricBills() { return entityFetch("fabric-bills", "fabric_bills"); }
export async function saveFabricBill(item: any) { return entitySave("fabric-bills", "fabric_bills", item); }
export async function deleteFabricBill(id: string) { return entityDelete("fabric-bills", "fabric_bills", id); }
export async function bulkSaveFabricBills(items: any[]) { return entityBulkSave("fabric-bills", "fabric_bills", items); }

// ═══════════════════════════════════════════════════════════════
//  COMPANY INVOICES
// ═══════════════════════════════════════════════════════════════

export async function fetchCompanyInvoices() { return entityFetch("company-invoices", "company_invoices"); }
export async function saveCompanyInvoice(item: any) { return entitySave("company-invoices", "company_invoices", item); }
export async function deleteCompanyInvoice(id: string) { return entityDelete("company-invoices", "company_invoices", id); }

// ═══════════════════════════════════════════════════════════════
//  PROCUREMENT ORDERS
// ═══════════════════════════════════════════════════════════════

export async function fetchProcurementOrders() { return entityFetch("procurement-orders", "procurement_orders"); }
export async function saveProcurementOrder(item: any) { return entitySave("procurement-orders", "procurement_orders", item); }
export async function deleteProcurementOrder(id: string) { return entityDelete("procurement-orders", "procurement_orders", id); }

// ═══════════════════════════════════════════════════════════════
//  PAYMENT LINKS
// ═══════════════════════════════════════════════════════════════

export async function fetchPaymentLinks() { return entityFetch("payment-links", "payment_links"); }
export async function savePaymentLink(item: any) { return entitySave("payment-links", "payment_links", item); }
export async function deletePaymentLink(id: string) { return entityDelete("payment-links", "payment_links", id); }

// ═══════════════════════════════════════════════════════════════
//  ACCOUNTS RECEIVABLE
// ═══════════════════════════════════════════════════════════════

export async function fetchCustomers() { return entityFetch("customers", "customers"); }
export async function saveCustomer(customer: any) { return entitySave("customers", "customers", customer); }
export async function deleteCustomer(id: string) { return entityDelete("customers", "customers", id); }

export async function fetchInvoices() { return entityFetch("invoices", "invoices"); }
export async function saveInvoice(invoice: any) { return entitySave("invoices", "invoices", invoice); }
export async function deleteInvoice(id: string) { return entityDelete("invoices", "invoices", id); }

export async function fetchCustomerPayments() { return entityFetch("customer-payments", "customer_payments"); }
export async function saveCustomerPayment(payment: any) { return entitySave("customer-payments", "customer_payments", payment); }
export async function deleteCustomerPayment(id: string) { return entityDelete("customer-payments", "customer_payments", id); }

// ═══════════════════════════════════════════════════════════════
//  ACCOUNTS PAYABLE
// ═══════════════════════════════════════════════════════════════

export async function fetchVendors() { return entityFetch("vendors", "vendors"); }
export async function saveVendor(vendor: any) { return entitySave("vendors", "vendors", vendor); }
export async function deleteVendor(id: string) { return entityDelete("vendors", "vendors", id); }

export async function fetchVendorBills() { return entityFetch("vendor-bills", "vendor_bills"); }
export async function saveVendorBill(bill: any) { return entitySave("vendor-bills", "vendor_bills", bill); }
export async function deleteVendorBill(id: string) { return entityDelete("vendor-bills", "vendor_bills", id); }

export async function fetchVendorPayments() { return entityFetch("vendor-payments", "vendor_payments"); }
export async function saveVendorPayment(payment: any) { return entitySave("vendor-payments", "vendor_payments", payment); }
export async function deleteVendorPayment(id: string) { return entityDelete("vendor-payments", "vendor_payments", id); }

export async function fetchPaymentSchedules() { return entityFetch("payment-schedules", "payment_schedules"); }
export async function savePaymentSchedule(schedule: any) { return entitySave("payment-schedules", "payment_schedules", schedule); }
export async function deletePaymentSchedule(id: string) { return entityDelete("payment-schedules", "payment_schedules", id); }

// ═══════════════════════════════════════════════════════════════
//  ONE-TIME MIGRATION: push all localStorage data to Supabase
// ═══════════════════════════════════════════════════════════════

export async function migrateLocalStorageToSupabase(): Promise<{ migrated: number }> {
  const entityMap: Record<string, string> = {
    bills_expense:      "erp_bills_expenses",
    salary:             "erp_employee_salaries",
    fabric_bill:        "erp_fabric_bills",
    company_invoice:    "erp_company_invoices",
    procurement_order:  "erp_procurement_orders",
    payment_link:       "erp_payment_links",
    customer:           "erp_customers",
    invoice:            "erp_invoices",
    customer_payment:   "erp_customer_payments",
    vendor:             "erp_vendors",
    vendor_bill:        "erp_vendor_bills",
    vendor_payment:     "erp_vendor_payments",
    payment_schedule:   "erp_payment_schedules",
  };

  const payload: Record<string, any[]> = {};
  for (const [prefix, lsKey] of Object.entries(entityMap)) {
    try {
      const v = localStorage.getItem(lsKey);
      const items = v ? JSON.parse(v) : [];
      if (items.length) payload[prefix] = items;
    } catch { /* skip */ }
  }

  try {
    const { migrated } = await request<{ success: boolean; migrated: number }>("/migrate/bulk", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return { migrated };
  } catch (e: any) {
    throw new Error(`Migration failed: ${e.message}`);
  }
}