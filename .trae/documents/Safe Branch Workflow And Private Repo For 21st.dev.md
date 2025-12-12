## Branch Workflow
- Keep all work on `feature/ui-polish-dec-2025` (or `feature/new-homepage`), never commit directly to `main`.
- Push frequently to the feature branch; open a PR to `main` only when ready to ship.
- Add branch protection on `main` (require PR + review, disallow direct pushes).

## Repo Privacy
- Ensure the GitHub repo is set to Private (Repo → Settings → General → Change repository visibility → Private).
- Invite collaborators and connect tools (like 21st.dev) explicitly; others cannot access the code.

## Netlify Deploy Strategy
- Keep production tied to `main` only.
- Use PR Deploy Previews for branch validation; disable Branch Deploys if you want fewer public preview URLs.
- If you want previews gated, enable Site password (Site settings → Visitor access) for Deploy Previews.
- Store secrets in Netlify Environment variables; never commit `.env`.

## 21st.dev Integration
- Connect 21st.dev to the Private repo.
- Select the feature branch as the working branch; 21st.dev will use latest code from that branch.
- Confirm minimal OAuth permissions and revoke access to any old public repos not in use.

## If Current Repo Is Public (Optional Migration)
- Create a new Private repo.
- In the project folder:
  - `git remote remove origin` (if pointing to public)
  - `git remote add origin <NEW_PRIVATE_REPO_URL>`
  - `git push -u origin main`
  - `git push -u origin feature/ui-polish-dec-2025`
- Point Netlify and 21st.dev to the new Private repo.

## Security & IP Checklist
- `.gitignore` includes `node_modules`, build artifacts (e.g., `dist`), and `.env*`.
- Secrets only in Netlify/21st.dev env vars; rotate any keys previously committed.
- Enable 2FA on GitHub; restrict repo access to required members/tools.
- Consider CODEOWNERS + required reviews for `main` merges.

## Next Actions
- Keep working on the feature branch and push.
- Verify repo visibility is Private.
- Open a PR for a Deploy Preview when you want review; merge to `main` to ship when approved.

Let me know your current `git remote -v` and whether the GitHub repo is already Private. I’ll tailor the exact commands and any Netlify/21st.dev switches needed.