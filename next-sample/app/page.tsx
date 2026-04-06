"use client"

import { useState } from "react"

type HttpMethod = "GET" | "POST" | "DELETE"

type UiLog = {
  id: string
  message: string
}

const REQUEST_HEADERS = {
  "x-tenant-id": "sample-tenant",
  "x-user-id": "sample-user",
  "x-user-roles": "admin",
}

export default function Home() {
  const [logs, setLogs] = useState<UiLog[]>([])
  const [loadingMethod, setLoadingMethod] = useState<HttpMethod | null>(null)

  const appendLog = (message: string) => {
    setLogs((currentLogs) => [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        message: `${new Date().toLocaleTimeString("ja-JP")} ${message}`,
      },
      ...currentLogs,
    ])
  }

  const callSampleApi = async (method: HttpMethod) => {
    setLoadingMethod(method)
    appendLog(`${method} ボタンを押しました。`)

    try {
      const response = await fetch("/api/v1/sample?debug=true", {
        method,
        headers: REQUEST_HEADERS,
      })
      const data = await response.json()

      if (!response.ok) {
        appendLog(
          `${method} は失敗しました。status=${response.status}, code=${data?.code ?? "UNKNOWN"}`
        )
        return
      }

      appendLog(
        `${method} が成功しました。traceId=${data?.traceId ?? "unknown"}`
      )
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "unknown error occurred"
      appendLog(`${method} で例外が発生しました。${message}`)
    } finally {
      setLoadingMethod(null)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-50">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/30 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
            Sample API Console
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            `/api/v1/sample` を GET / POST / DELETE で実行
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            各ボタンは `debug=true` と認証用ヘッダーを付けて API を呼び出します。
            API 側では `logger.info(...)` を出し、画面側でも押下履歴を残します。
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {(["GET", "POST", "DELETE"] as HttpMethod[]).map((method) => {
            const isLoading = loadingMethod === method

            return (
              <button
                key={method}
                type="button"
                onClick={() => void callSampleApi(method)}
                disabled={loadingMethod !== null}
                className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-6 py-5 text-left transition hover:border-cyan-300 hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="block text-xs uppercase tracking-[0.3em] text-cyan-200">
                  {method}
                </span>
                <span className="mt-3 block text-lg font-medium text-white">
                  {isLoading ? "実行中..." : `${method} を送信`}
                </span>
              </button>
            )
          })}
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900 p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">画面ログ</h2>
            <span className="text-sm text-slate-400">{logs.length} entries</span>
          </div>

          <div className="mt-6 space-y-3">
            {logs.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-slate-400">
                まだ操作されていません。
              </p>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                >
                  {log.message}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
