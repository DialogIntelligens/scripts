# scripts

## Inline search and bot on/off experiments

`inline-search-bar.js` requires a universal loader exposing
`DialogIntelligens.getAvailability()` and `DialogIntelligens.onAvailabilityChange()`.
Deploy that loader before publishing this inline script.

The script waits for configuration rather than a launcher, so hidden installations work.
It collapses each search wrapper while availability is disabled and creates the input only
when enabled. Both automatic and manual initialization follow availability changes.
Use an initially hidden wrapper to avoid reserved space while scripts load:

```html
<div id="chatbot-search-widget" hidden></div>
```

For a local browser regression against the loader, run
`pnpm --filter @dialogintelligens/chatbot-script test:availability` in the dialogintelligens
repository with `DI_INLINE_SCRIPT_PATH` set to this repository's `inline-search-bar.js`.
The test covers Bot on/off, hidden/inline mode, reloads, custom components, refresh failure,
and restoration on the next configuration poll. Validate the updated loader and every custom
embed on the participating storefront before launching its experiment.
