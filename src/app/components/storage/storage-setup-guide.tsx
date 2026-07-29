import { useState } from "react";
import {
  Database,
  Copy,
  CheckCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  HardDrive,
  Shield,
  Globe,
  FileUp,
  Trash2,
  FolderOpen,
  Link,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { STORAGE_RLS_SQL, BUCKET, MAX_FILE_SIZE, ALLOWED_MIME_TYPES } from "@/app/api/storage";

// ─── Feature cards drawn from the Bucket Fundamentals guide ───────────────────
const FEATURES = [
  {
    icon: HardDrive,
    title: "Bucket Creation",
    desc: "The `erp-documents` bucket is created via SQL with `public = true`, a 10 MB file-size limit, and a strict MIME-type allowlist.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: Globe,
    title: "Public Access",
    desc: "Files served from a public bucket have a permanent, cacheable CDN URL — no auth token required to view them.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Shield,
    title: "RLS Policies",
    desc: "Four policies on `storage.objects` grant the anon role SELECT, INSERT, UPDATE, and DELETE rights scoped only to this bucket.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: FileUp,
    title: "Upload (upsert)",
    desc: "Files are uploaded with `upsert: true` and a 1-hour cache-control header, so re-uploading the same path overwrites cleanly.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Link,
    title: "Signed URLs",
    desc: "Private or time-limited sharing uses `createSignedUrl(path, seconds)` to generate a JWT-protected, expiring link.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: FolderOpen,
    title: "List & Search",
    desc: "`storage.list(folder, { search, sortBy })` lists objects in a folder with pagination support.",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    icon: Database,
    title: "Move & Copy",
    desc: "`storage.move(from, to)` renames or relocates an object; `storage.copy(from, to)` duplicates it without re-uploading.",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    icon: Trash2,
    title: "Delete",
    desc: "Single or bulk delete via `storage.remove([paths])`. Bulk deletes are transactional — all succeed or all fail.",
    color: "text-red-600",
    bg: "bg-red-50",
  },
];

export function StorageSetupGuide({ onClose }: { onClose?: () => void }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(STORAGE_RLS_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Database className="h-6 w-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Supabase Storage Setup</h2>
            <Badge className="bg-amber-100 text-amber-700 border-amber-200">Action Required</Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            File uploads use Supabase Storage bucket <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">{BUCKET}</code>.
            One-time SQL setup is needed to configure the bucket and grant the anon key write access via RLS policies.
          </p>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="shrink-0">
            ✕
          </Button>
        )}
      </div>

      {/* RLS Error Banner */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800">Why uploads fail with 403</p>
          <p className="text-sm text-amber-700 mt-1">
            Supabase Storage enforces Row Level Security on the <code className="bg-amber-100 px-1 rounded font-mono">storage.objects</code> table.
            Even with a public bucket, the <strong>anon</strong> key cannot INSERT files without an explicit RLS policy.
            The SQL below adds all four required policies in one go.
          </p>
        </div>
      </div>

      {/* Step-by-step */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">1</span>
          Open your Supabase SQL Editor
        </h3>
        <a
          href={`https://supabase.com/dashboard/project/${/* projectId injected via env */ "zzktykqbyszsgrpatwwg"}/sql/new`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          <ExternalLink className="h-4 w-4" />
          Open SQL Editor in Supabase Dashboard
        </a>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">2</span>
            Paste &amp; run the SQL below
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            {copied ? (
              <>
                <CheckCheck className="h-4 w-4 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy SQL
              </>
            )}
          </Button>
        </div>

        {/* SQL preview */}
        <div className="relative">
          <pre
            className={`bg-gray-900 text-gray-100 rounded-lg p-4 text-xs font-mono overflow-x-auto leading-relaxed transition-all ${
              expanded ? "max-h-none" : "max-h-64 overflow-y-hidden"
            }`}
          >
            {STORAGE_RLS_SQL}
          </pre>
          {!expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 to-transparent rounded-b-lg" />
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-muted-foreground gap-1"
        >
          {expanded ? (
            <><ChevronUp className="h-4 w-4" /> Collapse</>
          ) : (
            <><ChevronDown className="h-4 w-4" /> Show full SQL</>
          )}
        </Button>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">3</span>
          Click <strong>Run</strong> — then upload a file to verify ✓
        </h3>
        <div className="flex items-center gap-2 mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          No app restart needed — uploads will work immediately after the SQL runs.
        </div>
      </Card>

      {/* Bucket config summary */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Bucket Configuration</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bucket name</span>
              <code className="font-mono bg-gray-100 px-1.5 rounded">{BUCKET}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Access</span>
              <Badge className="bg-green-100 text-green-700 border-green-200">Public</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Max file size</span>
              <span className="font-medium">{MAX_FILE_SIZE / 1024 / 1024} MB</span>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Allowed MIME types</p>
            <div className="flex flex-wrap gap-1">
              {ALLOWED_MIME_TYPES.map((t) => (
                <Badge key={t} variant="secondary" className="text-xs font-mono">
                  {t.split("/")[1]}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Feature grid */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">
          Storage Features Implemented (Bucket Fundamentals Guide)
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {FEATURES.map((f) => (
            <div key={f.title} className={`flex items-start gap-3 p-4 rounded-lg border ${f.bg}`}>
              <f.icon className={`h-5 w-5 shrink-0 mt-0.5 ${f.color}`} />
              <div>
                <p className={`font-medium text-sm ${f.color}`}>{f.title}</p>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
