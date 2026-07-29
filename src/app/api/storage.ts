/**
 * Supabase Storage – ERP Documents
 *
 * Implements the full Bucket Fundamentals guide:
 *  https://supabase.com/docs/guides/storage/buckets/fundamentals
 *
 * Covers:
 *  • Bucket creation & config (public, file-size limit, MIME allowlist)
 *  • Upload (upsert support, cacheControl, contentType)
 *  • Download (blob → object URL)
 *  • Get public URL
 *  • Create signed URL  (time-limited, for private paths)
 *  • List objects in a folder
 *  • Move / Copy objects
 *  • Delete single or multiple objects
 *  • Bucket-level RLS setup SQL (returned as a helper string)
 */

import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

// ─── Singleton Supabase client (anon key – respects RLS) ─────────────────────
const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
);

export const BUCKET = "erp-documents";

// ─── Allowed MIME types (enforced client-side; mirror in bucket policy) ───────
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

// Max file size: 10 MB (in bytes)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StorageFile {
  name: string;
  url: string;
  type: string;
  size: number;
  path: string;
}

export interface UploadResult {
  url: string;
  path: string;
}

// ─── Validation ───────────────────────────────────────────────────────────────

export function validateFile(file: File): void {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(
      `Unsupported file type "${file.type}". Allowed: PDF, Word, JPEG, PNG, WebP.`
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed is 10 MB.`
    );
  }
}

// ─── 1. Upload ────────────────────────────────────────────────────────────────
// Docs: storage.from(bucket).upload(path, file, options)
// • upsert:true  → overwrites if path already exists (PUT semantics)
// • cacheControl → CDN cache TTL in seconds

export async function uploadFile(
  file: File,
  folder: string
): Promise<UploadResult> {
  validateFile(file);

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${folder}/${Date.now()}-${safeName}`;

  const { data, error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "3600",
    upsert: true,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const url = getPublicUrl(data.path);
  return { url, path: data.path };
}

// ─── 2. Get Public URL ───────────────────────────────────────────────────────
// Docs: storage.from(bucket).getPublicUrl(path)
// Returns a stable, permanent CDN URL. Bucket must be public.

export function getPublicUrl(path: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ─── 3. Create Signed URL ─────────────────────────────────────────────────────
// Docs: storage.from(bucket).createSignedUrl(path, expiresIn)
// Use for private files or time-limited sharing. expiresIn is in seconds.

export async function createSignedUrl(
  path: string,
  expiresInSeconds = 3600
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresInSeconds);

  if (error) throw new Error(`Signed URL failed: ${error.message}`);
  return data.signedUrl;
}

// ─── 4. Download ──────────────────────────────────────────────────────────────
// Docs: storage.from(bucket).download(path)
// Returns a Blob which we convert to an object URL for the browser.

export async function downloadFile(path: string): Promise<string> {
  const { data, error } = await supabase.storage.from(BUCKET).download(path);
  if (error) throw new Error(`Download failed: ${error.message}`);
  return URL.createObjectURL(data);
}

// ─── 5. List objects in a folder ─────────────────────────────────────────────
// Docs: storage.from(bucket).list(folder, { limit, offset, search })

export async function listFiles(
  folder: string,
  options?: { limit?: number; offset?: number; search?: string }
): Promise<StorageFile[]> {
  const { data, error } = await supabase.storage.from(BUCKET).list(folder, {
    limit: options?.limit ?? 100,
    offset: options?.offset ?? 0,
    search: options?.search,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) throw new Error(`List failed: ${error.message}`);

  return (data ?? [])
    .filter((item) => item.name !== ".emptyFolderPlaceholder")
    .map((item) => {
      const path = `${folder}/${item.name}`;
      return {
        name: item.name,
        url: getPublicUrl(path),
        type: item.metadata?.mimetype ?? "application/octet-stream",
        size: item.metadata?.size ?? 0,
        path,
      };
    });
}

// ─── 6. Move (rename) ─────────────────────────────────────────────────────────
// Docs: storage.from(bucket).move(fromPath, toPath)

export async function moveFile(fromPath: string, toPath: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).move(fromPath, toPath);
  if (error) throw new Error(`Move failed: ${error.message}`);
}

// ─── 7. Copy ─────────────────────────────────────────────────────────────────
// Docs: storage.from(bucket).copy(fromPath, toPath)

export async function copyFile(fromPath: string, toPath: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).copy(fromPath, toPath);
  if (error) throw new Error(`Copy failed: ${error.message}`);
}

// ─── 8. Delete single file ───────────────────────────────────────────────────
// Docs: storage.from(bucket).remove([path])

export async function deleteFile(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}

// ─── 9. Delete multiple files ────────────────────────────────────────────────
// Docs: storage.from(bucket).remove(paths[])

export async function deleteFiles(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) throw new Error(`Bulk delete failed: ${error.message}`);
}

// ─── 10. Extract path from public URL ────────────────────────────────────────
// Reverse of getPublicUrl — used when we only have the stored URL.

export function extractPathFromUrl(publicUrl: string): string | null {
  try {
    const marker = `/object/public/${BUCKET}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(publicUrl.slice(idx + marker.length));
  } catch {
    return null;
  }
}

// ─── RLS Setup SQL ───────────────────────────────────────────────────────────
// The Supabase Storage guide requires explicit RLS policies on
// storage.objects for the anon role to be able to read/write files.
// Run this SQL once in your Supabase SQL Editor (Dashboard → SQL Editor).

export const STORAGE_RLS_SQL = `
-- ════════════════════════════════════════════════════════════════
--  ERP Documents – Supabase Storage RLS Policies
--  Paste this into: Supabase Dashboard → SQL Editor → Run
-- ════════════════════════════════════════════════════════════════

-- Step 1: Create the bucket (skip if already created via Dashboard)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'erp-documents',
  'erp-documents',
  true,
  10485760,   -- 10 MB in bytes
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp'
  ]
)
ON CONFLICT (id) DO UPDATE
  SET public            = true,
      file_size_limit   = 10485760,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Step 2: Enable RLS on storage.objects (already on by default, but safe to repeat)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Step 3: Allow anyone (anon + authenticated) to READ files
DROP POLICY IF EXISTS "erp-documents: public read"   ON storage.objects;
CREATE POLICY "erp-documents: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'erp-documents');

-- Step 4: Allow anyone to UPLOAD (INSERT) files
DROP POLICY IF EXISTS "erp-documents: public insert" ON storage.objects;
CREATE POLICY "erp-documents: public insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'erp-documents');

-- Step 5: Allow anyone to UPDATE (upsert / overwrite) files
DROP POLICY IF EXISTS "erp-documents: public update" ON storage.objects;
CREATE POLICY "erp-documents: public update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'erp-documents');

-- Step 6: Allow anyone to DELETE files
DROP POLICY IF EXISTS "erp-documents: public delete" ON storage.objects;
CREATE POLICY "erp-documents: public delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'erp-documents');
`.trim();