#!/usr/bin/env bash
#
# Protect `main` so it cannot be pushed to directly.
#
# Applies the rules P0 calls for:
#   • no direct pushes — every change arrives through a pull request
#   • no force pushes, no branch deletion
#   • the CI job must pass before merge
#   • the branch must be up to date with main before merge
#   • conversations must be resolved
#   • the rules apply to administrators too, so the gate is not advisory
#
# `required_approving_review_count` is 0 deliberately. The presence of the
# `required_pull_request_reviews` object is what forbids direct pushes; asking
# for one approval as well would deadlock a single-developer repository, since
# nobody can approve their own pull request. Raise it to 1 the day a second
# developer joins.
#
# Requires the GitHub CLI, authenticated with a token carrying `repo` scope:
#   gh auth login
#
# Re-running is safe: the call replaces the whole protection object.

set -euo pipefail

REPO="${REPO:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"
BRANCH="${BRANCH:-main}"
CHECK="${CHECK:-Install, lint, build}"   # the job's `name:` in ci.yml

echo "Protecting ${BRANCH} on ${REPO}"
echo "Required status check: ${CHECK}"
echo

gh api -X PUT "repos/${REPO}/branches/${BRANCH}/protection" \
  -H "Accept: application/vnd.github+json" \
  --input - <<JSON
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["${CHECK}"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 0,
    "require_last_push_approval": false
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": true,
  "lock_branch": false,
  "allow_fork_syncing": false
}
JSON

echo
echo "Done. Verify with:"
echo "  gh api repos/${REPO}/branches/${BRANCH}/protection | python3 -m json.tool"
