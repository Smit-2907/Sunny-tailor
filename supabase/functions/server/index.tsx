import { Hono } from "npm:hono@4";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono().basePath("/make-server-ed7cbcb6");

app.use("*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
app.use("*", logger(console.log));

// ─── Auto-seed Master Admins on startup ───
const MASTER_ACCOUNTS = [
  { email: "sunnytailor@gmail.com", password: "Admin@123", role: "master-manager",     name: "Master Admin" },
  { email: "sunnytailor@gmail.com", password: "Admin@123", role: "hr",                 name: "Master Admin" },
  { email: "sunnytailor@gmail.com", password: "Admin@123", role: "measurement-expert", name: "Master Admin" },
  { email: "sunnytailor@gmail.com", password: "Admin@123", role: "production-manager", name: "Master Admin" },
  { email: "sunnytailor@gmail.com", password: "Admin@123", role: "fabric-store",       name: "Master Admin" },
  { email: "sunnytailor@gmail.com", password: "Admin@123", role: "raw-material-store", name: "Master Admin" },
  { email: "sunnytailor@gmail.com", password: "Admin@123", role: "dispatch",           name: "Master Admin" },
  { email: "sunnytailor@gmail.com", password: "Admin@123", role: "accountant",         name: "Master Admin" },
  { email: "patelsmit090305@gmail.com", password: "Smit@935", role: "master-manager",  name: "Smit Patel"   },
];

(async () => {
  for (const master of MASTER_ACCOUNTS) {
    try {
      const existing = await kv.get(`user:${master.email}`) as any;
      // Always ensure master admin has correct password and role
      await kv.set(`user:${master.email}`, {
        email: master.email,
        password: master.password,
        role: master.role,
        name: existing?.name || master.name,
        isActive: true,
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log(`[SEED] Master admin ensured: ${master.email} with role ${master.role}`);
    } catch (e: any) {
      console.log(`[SEED] Error seeding master admin ${master.email}: ${e.message}`);
    }
  }
})();

// ─── Health ───
app.get("/health", (c) => c.json({ status: "ok" }));

// ═══════════════════════════════════════════════════════════════
//  PURCHASE ORDERS
// ═══════════════════════════════════════════════════════════════

// List all POs
app.get("/pos", async (c) => {
  try {
    const rows = await kv.getByPrefix("po:");
    console.log(`[GET /pos] Fetched ${rows.length} purchase orders`);
    return c.json({ data: rows });
  } catch (e: any) {
    console.log(`[GET /pos] Error: ${e.message}`);
    return c.json({ error: `Failed to fetch POs: ${e.message}` }, 500);
  }
});

// Create / Update PO
app.post("/pos", async (c) => {
  try {
    const po = await c.req.json();
    if (!po || !po.id) {
      return c.json({ error: "PO must have an id" }, 400);
    }
    await kv.set(`po:${po.id}`, po);
    console.log(`[POST /pos] Saved PO ${po.id}`);
    return c.json({ data: po });
  } catch (e: any) {
    console.log(`[POST /pos] Error: ${e.message}`);
    return c.json({ error: `Failed to save PO: ${e.message}` }, 500);
  }
});

// Delete PO (and its employees)
app.delete("/pos/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`po:${id}`);
    await kv.del(`emp:${id}`);
    console.log(`[DELETE /pos/${id}] Deleted PO and employees`);
    return c.json({ success: true });
  } catch (e: any) {
    console.log(`[DELETE /pos] Error: ${e.message}`);
    return c.json({ error: `Failed to delete PO: ${e.message}` }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════
//  EMPLOYEES (per PO)
// ═══════════════════════════════════════════════════════════════

// Get employees for a PO
app.get("/employees/:poId", async (c) => {
  try {
    const poId = c.req.param("poId");
    const employees = await kv.get(`emp:${poId}`);
    return c.json({ data: employees || [] });
  } catch (e: any) {
    console.log(`[GET /employees] Error: ${e.message}`);
    return c.json({ error: `Failed to fetch employees: ${e.message}` }, 500);
  }
});

// Set all employees for a PO
app.post("/employees/:poId", async (c) => {
  try {
    const poId = c.req.param("poId");
    const { employees } = await c.req.json();
    await kv.set(`emp:${poId}`, employees);
    console.log(`[POST /employees/${poId}] Saved ${employees?.length || 0} employees`);
    return c.json({ data: employees });
  } catch (e: any) {
    console.log(`[POST /employees] Error: ${e.message}`);
    return c.json({ error: `Failed to save employees: ${e.message}` }, 500);
  }
});

// Get ALL employees (all POs)
app.get("/employees", async (c) => {
  try {
    const rows = await kv.getByPrefix("emp:");
    // rows is an array of employee arrays; build a map
    // We need keys too – use a different approach
    const allKeys = await kv.getByPrefix("emp:");
    // getByPrefix returns values only; we need to reconstruct
    // Actually let's just return the flat list and let frontend manage
    return c.json({ data: rows });
  } catch (e: any) {
    console.log(`[GET /employees] Error: ${e.message}`);
    return c.json({ error: `Failed to fetch all employees: ${e.message}` }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════
//  BILLS
// ═══════════════════════════════════════════════════════════════

// List all bills
app.get("/bills", async (c) => {
  try {
    const rows = await kv.getByPrefix("bill:");
    console.log(`[GET /bills] Fetched ${rows.length} bills`);
    return c.json({ data: rows });
  } catch (e: any) {
    console.log(`[GET /bills] Error: ${e.message}`);
    return c.json({ error: `Failed to fetch bills: ${e.message}` }, 500);
  }
});

// Create / Update bill
app.post("/bills", async (c) => {
  try {
    const bill = await c.req.json();
    if (!bill || !bill.id) {
      return c.json({ error: "Bill must have an id" }, 400);
    }
    await kv.set(`bill:${bill.id}`, bill);
    console.log(`[POST /bills] Saved bill ${bill.id}`);
    return c.json({ data: bill });
  } catch (e: any) {
    console.log(`[POST /bills] Error: ${e.message}`);
    return c.json({ error: `Failed to save bill: ${e.message}` }, 500);
  }
});

// Delete bill
app.delete("/bills/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`bill:${id}`);
    console.log(`[DELETE /bills/${id}] Deleted bill`);
    return c.json({ success: true });
  } catch (e: any) {
    console.log(`[DELETE /bills] Error: ${e.message}`);
    return c.json({ error: `Failed to delete bill: ${e.message}` }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════
//  BULK SYNC (for initial upload from localStorage)
// ══════════════════════════════════════════════════════════════

app.post("/sync/upload", async (c) => {
  try {
    const { purchaseOrders, employeesByPO, bills } = await c.req.json();
    
    // Sync POs
    if (purchaseOrders?.length) {
      const keys = purchaseOrders.map((po: any) => `po:${po.id}`);
      await kv.mset(keys, purchaseOrders);
      console.log(`[SYNC] Uploaded ${purchaseOrders.length} POs`);
    }

    // Sync employees
    if (employeesByPO && typeof employeesByPO === "object") {
      const poIds = Object.keys(employeesByPO);
      if (poIds.length) {
        const keys = poIds.map((id) => `emp:${id}`);
        const values = poIds.map((id) => employeesByPO[id]);
        await kv.mset(keys, values);
        console.log(`[SYNC] Uploaded employees for ${poIds.length} POs`);
      }
    }

    // Sync bills
    if (bills?.length) {
      const keys = bills.map((b: any) => `bill:${b.id}`);
      await kv.mset(keys, bills);
      console.log(`[SYNC] Uploaded ${bills.length} bills`);
    }

    return c.json({ success: true });
  } catch (e: any) {
    console.log(`[SYNC] Error: ${e.message}`);
    return c.json({ error: `Sync failed: ${e.message}` }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════
//  USERS (managed by Master Admin)
// ═══════════════════════════════════════════════════════════════

// List all users
app.get("/users", async (c) => {
  try {
    const rows = await kv.getByPrefix("user:");
    console.log(`[GET /users] Fetched ${rows.length} users`);
    // Strip passwords before sending to frontend
    const safeRows = rows.map((u: any) => ({ ...u, password: "••••••" }));
    return c.json({ data: safeRows });
  } catch (e: any) {
    console.log(`[GET /users] Error: ${e.message}`);
    return c.json({ error: `Failed to fetch users: ${e.message}` }, 500);
  }
});

// Create / Update user
app.post("/users", async (c) => {
  try {
    const user = await c.req.json();
    if (!user || !user.email || !user.password || !user.role) {
      return c.json({ error: "User must have email, password, and role" }, 400);
    }
    const key = `user:${user.email.toLowerCase()}`;
    const existing = await kv.get(key);
    // If updating and password is masked, keep old password
    const finalUser = {
      ...user,
      email: user.email.toLowerCase(),
      password: user.password === "••••••" && existing ? (existing as any).password : user.password,
      createdAt: existing ? (existing as any).createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await kv.set(key, finalUser);
    console.log(`[POST /users] Saved user ${finalUser.email} with role ${finalUser.role}`);
    return c.json({ data: { ...finalUser, password: "••••••" } });
  } catch (e: any) {
    console.log(`[POST /users] Error: ${e.message}`);
    return c.json({ error: `Failed to save user: ${e.message}` }, 500);
  }
});

// Delete user
app.delete("/users/:email", async (c) => {
  try {
    const email = decodeURIComponent(c.req.param("email")).toLowerCase();
    await kv.del(`user:${email}`);
    console.log(`[DELETE /users/${email}] Deleted user`);
    return c.json({ success: true });
  } catch (e: any) {
    console.log(`[DELETE /users] Error: ${e.message}`);
    return c.json({ error: `Failed to delete user: ${e.message}` }, 500);
  }
});

// Login (validate credentials)
app.post("/auth/login", async (c) => {
  try {
    const { email, password, role } = await c.req.json();
    if (!email || !password || !role) {
      return c.json({ error: "Email, password, and role are required" }, 400);
    }
    const normalizedEmail = email.toLowerCase().trim();

    // ── Hardcoded master admin fallback ──
    // Ensures master admins can always log in even if KV data was corrupted
    const masterAccount = MASTER_ACCOUNTS.find(
      (m) => m.email === normalizedEmail && m.password === password && m.role === role
    );

    if (masterAccount) {
      // Re-seed to fix any KV corruption
      await kv.set(`user:${masterAccount.email}`, {
        email: masterAccount.email,
        password: masterAccount.password,
        role: masterAccount.role,
        name: masterAccount.name,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log(`[AUTH] Master admin login success (hardcoded fallback): ${masterAccount.email}`);
      return c.json({ data: { email: masterAccount.email, role: masterAccount.role, name: masterAccount.name } });
    }

    const user = await kv.get(`user:${normalizedEmail}`);
    if (!user) {
      console.log(`[AUTH] Login failed – user not found: ${normalizedEmail}`);
      return c.json({ error: "Invalid credentials. User not found." }, 401);
    }
    const u = user as any;
    if (u.password !== password) {
      console.log(`[AUTH] Login failed – wrong password for: ${normalizedEmail}`);
      return c.json({ error: "Invalid credentials. Wrong password." }, 401);
    }
    if (u.role !== role) {
      console.log(`[AUTH] Login failed – role mismatch for: ${normalizedEmail} (expected ${u.role}, got ${role})`);
      return c.json({ error: `Role mismatch. Your account has role: ${u.role}` }, 401);
    }
    if (u.isActive === false) {
      console.log(`[AUTH] Login failed – account disabled: ${normalizedEmail}`);
      return c.json({ error: "Account is disabled. Contact your administrator." }, 401);
    }
    console.log(`[AUTH] Login success: ${normalizedEmail} as ${role}`);
    return c.json({ data: { email: u.email, role: u.role, name: u.name } });
  } catch (e: any) {
    console.log(`[AUTH] Error: ${e.message}`);
    return c.json({ error: `Login failed: ${e.message}` }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════
//  COMPANIES
// ═══════════════════════════════════════════════════════════════

// List all companies
app.get("/companies", async (c) => {
  try {
    const rows = await kv.getByPrefix("company:");
    console.log(`[GET /companies] Fetched ${rows.length} companies`);
    return c.json({ data: rows });
  } catch (e: any) {
    console.log(`[GET /companies] Error: ${e.message}`);
    return c.json({ error: `Failed to fetch companies: ${e.message}` }, 500);
  }
});

// Create / Update company
app.post("/companies", async (c) => {
  try {
    const company = await c.req.json();
    if (!company || !company.id) {
      return c.json({ error: "Company must have an id" }, 400);
    }
    await kv.set(`company:${company.id}`, company);
    console.log(`[POST /companies] Saved company ${company.id}`);
    return c.json({ data: company });
  } catch (e: any) {
    console.log(`[POST /companies] Error: ${e.message}`);
    return c.json({ error: `Failed to save company: ${e.message}` }, 500);
  }
});

// Delete company
app.delete("/companies/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`company:${id}`);
    console.log(`[DELETE /companies/${id}] Deleted company`);
    return c.json({ success: true });
  } catch (e: any) {
    console.log(`[DELETE /companies] Error: ${e.message}`);
    return c.json({ error: `Failed to delete company: ${e.message}` }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════
//  CHART OF ACCOUNTS
// ═══════════════════════════════════════════════════════════════

// Get all accounts
app.get("/accounts", async (c) => {
  try {
    const rows = await kv.getByPrefix("account:");
    console.log(`[GET /accounts] Fetched ${rows.length} accounts`);
    return c.json({ data: rows });
  } catch (e: any) {
    console.log(`[GET /accounts] Error: ${e.message}`);
    return c.json({ error: `Failed to fetch accounts: ${e.message}` }, 500);
  }
});

// Create / Update account
app.post("/accounts", async (c) => {
  try {
    const account = await c.req.json();
    if (!account || !account.id) {
      return c.json({ error: "Account must have an id" }, 400);
    }
    const key = `account:${account.id}`;
    await kv.set(key, account);
    console.log(`[POST /accounts] Saved account ${account.accountCode} - ${account.accountName}`);
    return c.json({ data: account });
  } catch (e: any) {
    console.log(`[POST /accounts] Error: ${e.message}`);
    return c.json({ error: `Failed to save account: ${e.message}` }, 500);
  }
});

// Bulk save accounts
app.post("/accounts/bulk", async (c) => {
  try {
    const { accounts } = await c.req.json();
    if (!accounts || !Array.isArray(accounts)) {
      return c.json({ error: "Invalid accounts data" }, 400);
    }

    for (const account of accounts) {
      const key = `account:${account.id}`;
      await kv.set(key, account);
    }

    console.log(`[POST /accounts/bulk] Saved ${accounts.length} accounts`);
    return c.json({ data: accounts });
  } catch (e: any) {
    console.log(`[POST /accounts/bulk] Error: ${e.message}`);
    return c.json({ error: `Failed to bulk save accounts: ${e.message}` }, 500);
  }
});

// Delete account
app.delete("/accounts/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`account:${id}`);
    console.log(`[DELETE /accounts/${id}] Deleted account`);
    return c.json({ success: true });
  } catch (e: any) {
    console.log(`[DELETE /accounts] Error: ${e.message}`);
    return c.json({ error: `Failed to delete account: ${e.message}` }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════
//  GENERIC CRUD FACTORY
//  Generates list / save / delete routes for any entity
// ═══════════════════════════════════════════════════════════════

function crudRoutes(prefix: string, route: string, idField = "id") {
  app.get(`/${route}`, async (c) => {
    try {
      const rows = await kv.getByPrefix(`${prefix}:`);
      return c.json({ data: rows });
    } catch (e: any) {
      return c.json({ error: `Failed to fetch ${route}: ${e.message}` }, 500);
    }
  });

  app.post(`/${route}`, async (c) => {
    try {
      const item = await c.req.json();
      if (!item || !item[idField]) return c.json({ error: `${route} must have ${idField}` }, 400);
      await kv.set(`${prefix}:${item[idField]}`, item);
      return c.json({ data: item });
    } catch (e: any) {
      return c.json({ error: `Failed to save ${route}: ${e.message}` }, 500);
    }
  });

  app.post(`/${route}/bulk`, async (c) => {
    try {
      const { items } = await c.req.json();
      if (!items?.length) return c.json({ data: [] });
      const keys = items.map((i: any) => `${prefix}:${i[idField]}`);
      await kv.mset(keys, items);
      return c.json({ data: items });
    } catch (e: any) {
      return c.json({ error: `Failed to bulk save ${route}: ${e.message}` }, 500);
    }
  });

  app.delete(`/${route}/:id`, async (c) => {
    try {
      const id = c.req.param("id");
      await kv.del(`${prefix}:${id}`);
      return c.json({ success: true });
    } catch (e: any) {
      return c.json({ error: `Failed to delete ${route}: ${e.message}` }, 500);
    }
  });
}

// ─── Register all remaining ERP entities ───────────────────────
crudRoutes("bills_expense",       "bills-expenses");
crudRoutes("salary",              "salaries");
crudRoutes("fabric_bill",         "fabric-bills");
crudRoutes("company_invoice",     "company-invoices");
crudRoutes("procurement_order",   "procurement-orders");
crudRoutes("payment_link",        "payment-links");
crudRoutes("customer",            "customers");
crudRoutes("invoice",             "invoices");
crudRoutes("customer_payment",    "customer-payments");
crudRoutes("vendor",              "vendors");
crudRoutes("vendor_bill",         "vendor-bills");
crudRoutes("vendor_payment",      "vendor-payments");
crudRoutes("payment_schedule",    "payment-schedules");

// ─── Big bulk migration endpoint (localStorage → Supabase) ─────
app.post("/migrate/bulk", async (c) => {
  try {
    const payload = await c.req.json();
    let count = 0;
    for (const [prefix, items] of Object.entries(payload) as [string, any[]][]) {
      if (!Array.isArray(items) || items.length === 0) continue;
      const keys = items.map((i: any) => `${prefix}:${i.id}`);
      await kv.mset(keys, items);
      count += items.length;
    }
    return c.json({ success: true, migrated: count });
  } catch (e: any) {
    return c.json({ error: `Migration failed: ${e.message}` }, 500);
  }
});

Deno.serve(app.fetch);
