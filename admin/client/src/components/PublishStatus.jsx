// Shows what actually happened to a save: `commit` is the object the server
// returns from commitFiles() (committed, commit, pushed, pullError, pushError).
// Never a toast that disappears — stays until the next save replaces it, so a
// "saved but not published" warning can't be missed.
export default function PublishStatus({ commit, action = "Сохранено" }) {
  if (!commit) return null;

  if (!commit.committed) {
    return (
      <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
        {action}. Изменений не было, коммит не создан.
      </div>
    );
  }

  if (commit.pushed) {
    return (
      <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
        {action} и опубликовано на сайте. Коммит: {commit.commit}
      </div>
    );
  }

  const err = commit.pullError || commit.pushError;
  return (
    <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
      <p className="font-semibold">{action} локально, но НЕ опубликовано на сайте.</p>
      <p className="mt-1 text-xs text-amber-700">Коммит: {commit.commit}</p>
      {err && <p className="mt-1 text-xs text-amber-700">{err}</p>}
    </div>
  );
}
