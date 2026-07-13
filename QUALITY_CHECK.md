# Quality check

Checked before packaging:
- JavaScript syntax: OK (`node --check script.js`)
- HTML parse check: OK for `index.html`, `privacy.html`, `terms.html`, `platform-rules.html`
- CSS brace balance: OK
- Local link check: OK
- No visible server URL in the interface
- No foreign messenger brand mentions
- No emoji symbols in UI copy
- Responsive breakpoints included for desktop, tablet and mobile
- Reduced motion support included

Production notes:
- Replace `https://example.com` in `robots.txt` and `sitemap.xml` with the real domain.
- Android button points to GitHub Release APK.
- Windows button points to the GitHub Releases page until a direct desktop installer URL is published.
