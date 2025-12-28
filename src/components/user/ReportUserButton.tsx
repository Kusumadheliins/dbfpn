"use client"

import { useState } from "react"
import { Flag } from "lucide-react"

type Props = {
  viewerId: number | null
  targetUserId: number
  targetUsername: string | null
}

export default function ReportUserButton({ viewerId, targetUserId, targetUsername }: Props) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function submit() {
    setMsg(null)

    if (!viewerId) {
      setMsg("Kamu harus login dulu untuk melapor.")
      return
    }

    const cleanReason = reason.trim()
    if (!cleanReason) {
      setMsg("Alasan laporan tidak boleh kosong.")
      return
    }

    setLoading(true)
    try {
      // FIX UTAMA: endpoint harus /api/reports, bukan /api/report
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType: "user",
          targetId: targetUserId,
          reason: cleanReason,
        }),
      })

      let data: any = null
      try {
        data = await res.json()
      } catch {
        // kalau response bukan JSON, biarin
      }

      if (!res.ok) {
        // biar errornya jelas, bukan cuma "gagal"
        const detail =
          data?.error ||
          data?.message ||
          `Gagal mengirim laporan (HTTP ${res.status}).`

        console.log("REPORT_FAILED", { status: res.status, data })
        setMsg(detail)
        return
      }

      setReason("")
      setOpen(false)
      setMsg("Laporan terkirim.")
    } catch (err: any) {
      console.error("REPORT_EXCEPTION", err)
      setMsg(err?.message || "Gagal mengirim laporan.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setMsg(null)
          setOpen(true)
        }}
        className="px-3 py-2 rounded-lg bg-[#252525] hover:bg-[#333] border border-gray-700 text-white text-sm flex items-center gap-2"
      >
        <Flag size={16} />
        Laporkan
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-[#121212] border border-gray-800 p-6">
            <div className="text-lg font-bold">
              Laporkan {targetUsername || `User#${targetUserId}`}
            </div>
            <div className="text-gray-400 text-sm mt-1">
              Tulis alasan laporan, singkat tapi jelas.
            </div>

            <textarea
              className="mt-4 w-full min-h-[110px] rounded-xl bg-black/30 border border-gray-700 p-3 text-white outline-none"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contoh: spam, penipuan, toxic, dll"
              disabled={loading}
            />

            {msg && <div className="mt-3 text-sm text-gray-300">{msg}</div>}

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg bg-transparent border border-gray-700 text-white text-sm"
                disabled={loading}
              >
                Batal
              </button>

              <button
                type="button"
                onClick={submit}
                className="px-3 py-2 rounded-lg bg-primary text-black font-bold text-sm disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Mengirim..." : "Kirim"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
