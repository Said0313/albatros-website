"use strict";
const path = require("path");
const simpleGit = require("simple-git");
const { SITE_ROOT, AUTO_PUSH, DEPLOY_BRANCH } = require("./config");

const git = simpleGit({ baseDir: SITE_ROOT });

// Rebases the working copy onto origin/DEPLOY_BRANCH (picking up commits made
// from elsewhere) and, if that succeeds, pushes local commits. --autostash
// covers uncommitted files that can legitimately be sitting in the working
// copy (e.g. an image just uploaded but not yet attached to a saved record).
//
// If the pull/rebase fails for any reason (conflict, network, auth), we MUST
// leave the repo out of "rebase in progress" state — otherwise every save by
// every user starts failing until someone fixes it by hand over SSH. So on
// any pull failure we unconditionally run `rebase --abort` (harmless if there
// was nothing to abort) before returning. The push is skipped in that case:
// the working copy's relationship to origin is unknown, so pushing would be
// as likely to make things worse as better.
async function pullThenPush() {
  const result = { pushed: false };
  try {
    await git.pull(["--rebase", "--autostash", "origin", DEPLOY_BRANCH]);
  } catch (err) {
    result.pullError = err.message || String(err);
    try {
      await git.rebase(["--abort"]);
    } catch (abortErr) {
      // Nothing to abort (pull failed before rebase started) is expected and
      // fine; anything else is logged for ops but still must not throw here.
      console.error("[git] rebase --abort after failed pull:", abortErr.message || abortErr);
    }
    return result;
  }

  // A rebase replays commits onto a new base, which changes their hash. Any
  // hash reported before this point (e.g. from the commit just made) may no
  // longer exist, so refresh it to what HEAD actually is now.
  try {
    result.commit = (await git.revparse(["HEAD"])).trim();
  } catch {
    /* best effort; not fatal if this one call fails */
  }

  try {
    await git.push("origin", DEPLOY_BRANCH);
    result.pushed = true;
  } catch (err) {
    result.pushError = err.message || String(err);
  }
  return result;
}

// Commits the given files (absolute or repo-relative paths) attributed to the
// logged-in admin. Commit is always local. When AUTO_PUSH=true it also pulls
// (rebase+autostash) and pushes to origin/DEPLOY_BRANCH; failures are reported
// back via `pullError`/`pushError` but never undo or throw past the commit,
// which has already succeeded locally.
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
  const result = await git
    .env({ GIT_COMMITTER_NAME: author.name, GIT_COMMITTER_EMAIL: author.email })
    .commit(message, rel, { "--author": authorStr });
  const commitResult = { committed: true, commit: result.commit, summary: result.summary };

  if (AUTO_PUSH) {
    Object.assign(commitResult, await pullThenPush());
  }

  return commitResult;
}

async function currentBranch() {
  const s = await git.status();
  return s.current;
}

// Verifies git can identify the committer in SITE_ROOT (local or global
// user.name/user.email). Without it, commits fail with "empty ident name"
// and, worse, a mid-rebase failure (which itself needs to create a commit)
// can leave the repo stuck in "rebase in progress" for every subsequent save.
async function checkGitIdentity() {
  const [name, email] = await Promise.all([
    git.getConfig("user.name"),
    git.getConfig("user.email"),
  ]);
  if (!name.value || !email.value) {
    console.error(
      "\n" +
        "!!! [git] user.name / user.email НЕ настроены в " + SITE_ROOT + "\n" +
        "!!! Коммиты и rebase будут падать с \"empty ident name\".\n" +
        "!!! Исправьте немедленно:\n" +
        `!!!   git -C "${SITE_ROOT}" config user.name "Albatros Admin"\n` +
        `!!!   git -C "${SITE_ROOT}" config user.email "admin@albatros.uz"\n`
    );
    return false;
  }
  return true;
}

// Manually pull+push any commits that piled up locally without being
// published (e.g. AUTO_PUSH was off, or a previous auto-push failed). Makes
// no new commit.
async function publish() {
  return pullThenPush();
}

// Compares local HEAD against origin/DEPLOY_BRANCH so the UI can decide
// whether there is anything worth publishing.
async function publishStatus() {
  try {
    await git.fetch(["origin", DEPLOY_BRANCH]);
  } catch (err) {
    return { ahead: 0, behind: 0, hasUnpublished: false, checkError: err.message || String(err) };
  }
  const raw = await git.raw(["rev-list", "--left-right", "--count", `HEAD...origin/${DEPLOY_BRANCH}`]);
  const [ahead, behind] = raw
    .trim()
    .split(/\s+/)
    .map((n) => parseInt(n, 10) || 0);
  return { ahead, behind, hasUnpublished: ahead > 0 };
}

module.exports = {
  git,
  commitFiles,
  currentBranch,
  checkGitIdentity,
  publish,
  publishStatus,
};
