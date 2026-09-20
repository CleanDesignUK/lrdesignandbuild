# L&R Design & Build LTD - Homepage

## Important before launch
1. Open `js/config.js` and replace `YOUR_WEB3FORMS_ACCESS_KEY` with the real Web3Forms access key.
2. Replace the placeholder project images using the filenames listed in `images/README.txt`.
3. Replace `images/lr-design-build-logo.jpg` with the original high-resolution logo.
4. Confirm the email address. The client questionnaire says `lrdesignandbuildltd@yahoo.com`; a separate quotation document contains a different spelling (`lrdesignandbuiltltd@yahoo.com`). This build uses the questionnaire spelling.
5. The client questionnaire lists one service area as `elderly edge`. That location is not included here because it needs confirmation rather than guessing the intended place name.

## Global navbar/footer
Edit only:
- `components/navbar.html`
- `components/footer.html`

They are loaded on each page by `js/global.js`.

Because the header/footer use JavaScript includes, preview the site through a local/server URL rather than double-clicking `index.html` as a `file://` URL.

Example local preview:
```bash
python -m http.server 8000
```
then open `http://localhost:8000/`.

## Main files
- `index.html`: homepage markup + SEO/AEO structured data
- `css/global.css`: global brand, nav, footer, forms, cookie banner, responsive utilities
- `css/index.css`: homepage-only layout and responsive styles
- `js/global.js`: global components, sticky nav, cookie consent, carousel arrows
- `js/index.js`: Web3Forms AJAX submission, SweetAlert2 response, spam/phone/email validation
- `js/config.js`: Web3Forms key and basic site config

## Cookie banner
The banner stores only the visitor's consent preference in localStorage. No analytics or marketing scripts are included in this version. If analytics is added later, load it only when `lr_cookie_consent_v1` is `optional`.
