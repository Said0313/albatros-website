"use strict";
const path = require("path");
const simpleGit = require("simple-git");
const { SITE_ROOT } = require("./config");

const git = simpleGit({ baseDir: SITE_ROOT });

// Commits the given files (absolute or repo-relative paths) attributed to the
// logged-in admin. LOCAL commit only: this never pushes and never deploys.
async function commitFiles(files, message, author) {
  const rel = files.map((f) => path.relative(SITE_ROOT, path.resolve(SITE_ROOT, f)));
  await git.add(rel);

  // Only commit if these paths actually changed, to avoid empty commits.
  const status = await git.status();
  const changed = new Set([
    ...status.created,
    ...status.modified,
    ...status.deleted,
    ...status.renamed.map((r) => r.to),
    ...status.staged,
    ...status.not_added,
  ]);
  const touched = rel.some((r) => {
    const norm = r.split(path.sep).join("/");
    return [...changed].some((c) => c.split(path.sep).join("/") === norm);
  });
  if (!touched) {
    return { committed: false, reason: "no changes" };
  }

  const authorStr = `${author.name} <${author.email}>`;
  const result = await git.commit(message, rel, { "--author": authorStr });
  return { committed: true, commit: result.commit, summary: result.summary };
}

async function currentBranch() {
  const s = await git.status();
  return s.current;
}

module.exports = { git, commitFiles, currentBranch };
