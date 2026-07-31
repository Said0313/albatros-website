import { useCallback, useEffect, useState } from "react";
import { api } from "../api";

// Global catch-up control for commits that piled up locally without being
// published (AUTO_PUSH was off, or an auto-push failed). Polls whether local
// HEAD is ahead of origin/DEPLOY_BRANCH and only shows the button when there
// is actually something to publish.
export default function PublishBar() {
  const [status, setStatus] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState(null);

  const refresh = useCallback(() => {
    api.publishStatus().then(setStatus).catch(() => {});
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 20000);
    window.addEventListener("focus", refresh);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", refresh);
    };
  }, [refresh]);

  const doPublish = async () => {
    setPublishing(true);
    setResult(null);
    try {
      const d = await api.publish();
      setResult(d);
    } catch (e) {
      setResult({ pushed: false, pushError: e.message });
    } finally {
      setPublishing(false);
      refresh();
    }
  };

  const err = result && (result.pullError || result.pushError);

  return (
    <div className="flex items-center gap-2">
      {err && (
        <span className="max-w-xs truncate text-xs text-red-600" title={err}>
          Ошибка публикации: {err}
        </span>
      )}
      {result && !err && result.pushed && <span className="text-xs text-emerald-600">Опубликовано.</span>}
      {status?.hasUnpublished && (
        <button className="btn-primary" onClick={doPublish} disabled={publishing}>
          {publishing ? "Публикация..." : `Опубликовать (${status.ahead})`}
        </button>
      )}
    </div>
  );
}
