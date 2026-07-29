import { useState, useEffect, useRef } from "react";
import {
  Folder, FileText, Image, File, Trash2, Download, Copy,
  Link2, RefreshCw, Upload, Search, Eye, Move, ChevronRight,
  CheckCircle2, AlertCircle, X,
} from "lucide-react";
import {
  STORAGE_FOLDERS, StorageFolder, StorageFileInfo,
  listFiles, uploadFileToStorage, deleteFiles, downloadFile,
  createSignedUrl, moveFile, copyFile, getPublicUrl,
} from "../../api/supabase-api";

// ── helpers ────────────────────────────────────────────────────

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

function fileIcon(mime: string) {
  if (mime.startsWith("image/")) return <Image className="w-4 h-4 text-purple-500" />;
  if (mime === "application/pdf") return <FileText className="w-4 h-4 text-red-500" />;
  return <File className="w-4 h-4 text-gray-400" />;
}

type Toast = { id: number; type: "success" | "error"; msg: string };
let toastId = 0;

// ── component ──────────────────────────────────────────────────

export function StorageManager() {
  const folders = Object.values(STORAGE_FOLDERS);
  const [activeFolder, setActiveFolder] = useState<StorageFolder>(STORAGE_FOLDERS.MISC);
  const [files, setFiles]               = useState<StorageFileInfo[]>([]);
  const [loading, setLoading]           = useState(false);
  const [search, setSearch]             = useState("");
  const [selected, setSelected]         = useState<Set<string>>(new Set());
  const [toasts, setToasts]             = useState<Toast[]>([]);
  const [preview, setPreview]           = useState<StorageFileInfo | null>(null);
  const [signedUrl, setSignedUrl]       = useState<string>("");
  const [signedLoading, setSignedLoading] = useState(false);
  const [movingFile, setMovingFile]     = useState<StorageFileInfo | null>(null);
  const [moveTarget, setMoveTarget]     = useState<StorageFolder>(STORAGE_FOLDERS.MISC);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, [activeFolder]);

  async function load() {
    setLoading(true);
    setSelected(new Set());
    try {
      const list = await listFiles(activeFolder, { search: search || undefined });
      setFiles(list);
    } catch (e: any) {
      toast("error", e.message);
    } finally {
      setLoading(false);
    }
  }

  function toast(type: "success" | "error", msg: string) {
    const id = ++toastId;
    setToasts((p) => [...p, { id, type, msg }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  }

  // Upload
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    if (!picked.length) return;
    for (const f of picked) {
      try {
        await uploadFileToStorage(f, activeFolder);
        toast("success", `Uploaded ${f.name}`);
      } catch (err: any) {
        toast("error", `${f.name}: ${err.message}`);
      }
    }
    e.target.value = "";
    load();
  }

  // Delete selected
  async function handleDelete() {
    if (!selected.size) return;
    const paths = files
      .filter((f) => selected.has(f.name))
      .map((f) => `${activeFolder}/${f.name}`);
    try {
      await deleteFiles(paths);
      toast("success", `Deleted ${paths.length} file(s)`);
      load();
    } catch (e: any) {
      toast("error", e.message);
    }
  }

  // Download
  async function handleDownload(f: StorageFileInfo) {
    try {
      const blob = await downloadFile(`${activeFolder}/${f.name}`);
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.download = f.name; a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast("error", e.message);
    }
  }

  // Copy public URL
  function copyUrl(f: StorageFileInfo) {
    navigator.clipboard.writeText(f.publicUrl).then(() =>
      toast("success", "Public URL copied!")
    );
  }

  // Signed URL
  async function handleSignedUrl(f: StorageFileInfo) {
    setPreview(f);
    setSignedUrl("");
    setSignedLoading(true);
    try {
      const url = await createSignedUrl(`${activeFolder}/${f.name}`, 3600);
      setSignedUrl(url);
    } catch (e: any) {
      toast("error", e.message);
    } finally {
      setSignedLoading(false);
    }
  }

  // Move file
  async function handleMove() {
    if (!movingFile) return;
    try {
      const from = `${activeFolder}/${movingFile.name}`;
      const to   = `${moveTarget}/${movingFile.name}`;
      await moveFile(from, to);
      toast("success", `Moved to ${moveTarget}`);
      setMovingFile(null);
      load();
    } catch (e: any) {
      toast("error", e.message);
    }
  }

  // Copy file within bucket
  async function handleCopy(f: StorageFileInfo) {
    try {
      const from = `${activeFolder}/${f.name}`;
      const to   = `${activeFolder}/copy-${Date.now()}-${f.name}`;
      await copyFile(from, to);
      toast("success", "File duplicated");
      load();
    } catch (e: any) {
      toast("error", e.message);
    }
  }

  const displayed = files.filter((f) =>
    !search || f.name.toLowerCase().includes(search.toLowerCase())
  );

  const allSelected = displayed.length > 0 && displayed.every((f) => selected.has(f.name));

  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(displayed.map((f) => f.name)));
  }

  function toggleOne(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  return (
    <div className="flex h-full min-h-[600px] bg-white rounded-xl border border-gray-200 overflow-hidden">

      {/* ── Sidebar: folders ───────────────────────────────── */}
      <aside className="w-48 border-r border-gray-100 bg-gray-50 flex flex-col flex-shrink-0">
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Folders</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {folders.map((folder) => (
            <button
              key={folder}
              onClick={() => { setActiveFolder(folder); setSearch(""); }}
              className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                activeFolder === folder
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Folder className={`w-4 h-4 flex-shrink-0 ${activeFolder === folder ? "text-indigo-500" : "text-gray-400"}`} />
              <span className="truncate capitalize">{folder.replace(/-/g, " ")}</span>
              {activeFolder === folder && <ChevronRight className="w-3 h-3 ml-auto text-indigo-400" />}
            </button>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-gray-100">
          <p className="text-[10px] text-gray-400">Bucket: erp-documents</p>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 flex-wrap">
          <div className="relative flex-1 min-w-0 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files…"
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <button
            onClick={load}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          {selected.size > 0 && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete ({selected.size})
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg ml-auto"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading…
            </div>
          ) : displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <Folder className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-sm">No files in this folder</p>
              <p className="text-xs mt-1">Click Upload to add files</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 sticky top-0">
                <tr>
                  <th className="w-8 px-4 py-2">
                    <input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded" />
                  </th>
                  <th className="text-left px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                  <th className="text-left px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Type</th>
                  <th className="text-left px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Size</th>
                  <th className="text-left px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Updated</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {displayed.map((f) => (
                  <tr key={f.name} className={`hover:bg-gray-50 transition-colors ${selected.has(f.name) ? "bg-indigo-50" : ""}`}>
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selected.has(f.name)}
                        onChange={() => toggleOne(f.name)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-2">
                        {fileIcon(f.mimetype)}
                        <span className="truncate max-w-[200px] text-gray-800">{f.name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2 hidden sm:table-cell">
                      <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{f.mimetype || "—"}</span>
                    </td>
                    <td className="px-2 py-2 text-gray-500 hidden md:table-cell">{formatBytes(f.size)}</td>
                    <td className="px-2 py-2 text-gray-400 text-xs hidden lg:table-cell">
                      {f.updatedAt ? new Date(f.updatedAt).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-1 justify-end">
                        {/* Preview */}
                        <button
                          title="Preview / Signed URL"
                          onClick={() => setPreview(f)}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {/* Download */}
                        <button
                          title="Download"
                          onClick={() => handleDownload(f)}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        {/* Copy URL */}
                        <button
                          title="Copy public URL"
                          onClick={() => copyUrl(f)}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                        </button>
                        {/* Duplicate */}
                        <button
                          title="Duplicate file"
                          onClick={() => handleCopy(f)}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {/* Move */}
                        <button
                          title="Move to folder"
                          onClick={() => { setMovingFile(f); setMoveTarget(activeFolder); }}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700"
                        >
                          <Move className="w-3.5 h-3.5" />
                        </button>
                        {/* Delete */}
                        <button
                          title="Delete"
                          onClick={() => { setSelected(new Set([f.name])); handleDelete(); }}
                          className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-400 flex items-center justify-between">
          <span>{files.length} file{files.length !== 1 ? "s" : ""} in <strong className="text-gray-600">{activeFolder}</strong></span>
          {selected.size > 0 && <span>{selected.size} selected</span>}
        </div>
      </div>

      {/* ── Preview modal ──────────────────────────────────── */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setPreview(null)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                {fileIcon(preview.mimetype)}
                <span className="font-medium text-gray-800 truncate max-w-xs">{preview.name}</span>
              </div>
              <button onClick={() => setPreview(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Image preview */}
              {preview.mimetype.startsWith("image/") && (
                <img src={preview.publicUrl} alt={preview.name} className="w-full max-h-60 object-contain rounded-lg border border-gray-100" />
              )}

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Size</p>
                  <p className="font-medium text-gray-700">{formatBytes(preview.size)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Type</p>
                  <p className="font-medium text-gray-700 truncate">{preview.mimetype || "—"}</p>
                </div>
              </div>

              {/* Public URL */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Public URL</p>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={preview.publicUrl}
                    className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-600 truncate"
                  />
                  <button
                    onClick={() => copyUrl(preview)}
                    className="flex-shrink-0 flex items-center gap-1 text-xs text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 rounded-lg px-3 py-2"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
              </div>

              {/* Signed URL */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-gray-500">Signed URL (1 hr)</p>
                  <button
                    onClick={() => handleSignedUrl(preview)}
                    disabled={signedLoading}
                    className="text-xs text-indigo-600 hover:underline disabled:opacity-50"
                  >
                    {signedLoading ? "Generating…" : "Generate →"}
                  </button>
                </div>
                {signedUrl && (
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={signedUrl}
                      className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-600 truncate"
                    />
                    <button
                      onClick={() => { navigator.clipboard.writeText(signedUrl); toast("success", "Signed URL copied!"); }}
                      className="flex-shrink-0 flex items-center gap-1 text-xs text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 rounded-lg px-3 py-2"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleDownload(preview)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
                <a
                  href={preview.publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  <Eye className="w-4 h-4" /> Open in tab
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Move modal ─────────────────────────────────────── */}
      {movingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setMovingFile(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-80 mx-4 p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-gray-800 mb-3">Move file</h3>
            <p className="text-sm text-gray-500 mb-4">Move <strong>{movingFile.name}</strong> to:</p>
            <select
              value={moveTarget}
              onChange={(e) => setMoveTarget(e.target.value as StorageFolder)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {folders.map((f) => (
                <option key={f} value={f} disabled={f === activeFolder}>
                  {f}{f === activeFolder ? " (current)" : ""}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button onClick={() => setMovingFile(null)} className="flex-1 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleMove} className="flex-1 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Move</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast notifications ────────────────────────────── */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium pointer-events-auto ${
              t.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {t.type === "success"
              ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              : <AlertCircle   className="w-4 h-4 flex-shrink-0" />}
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
