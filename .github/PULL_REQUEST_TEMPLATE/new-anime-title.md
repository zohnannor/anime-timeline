## Summary

Add a new timeline for: **[TITLE HERE]**

<!-- Briefly describe what this PR does and which series/continuity it covers. -->

## Checklist

- [ ] New title is wired into `TIMELINE` in [`src/constants.ts`](../../src/constants.ts)
- [ ] Timeline data is defined in [`src/timelines`](../../src/timelines) (re-using an existing file as a template, e.g. `csm.ts`, so keeping the same style and ordering)
- [ ] All wiki / external links point to stable, well-maintained sources (see [Wiki Buddy list](https://getindie.wiki/listings/))
- [ ] Images for this title are added under `public/<title>` (PNG/JPG/JPEG)
- [ ] `python ci/optimize-images.py <title>` has been run locally and the optimized PNG outputs are committed
- [ ] Timeline renders correctly in the live app (no obvious layout issues, overlapping labels, or missing assets)
- [ ] If the title is still ongoing:
    - [ ] If the maintainer is not familiar with the title, I agree to become a maintainer of this specific title (adding new chapter/volumes/arcs/seasons/episodes in the future via PRs)

## Notes

<!--
- Describe any unusual structure (multiple continuities, OVAs, movies,
  remasters, out-of-order releases etc.).
- Call out any compromises or TODOs (e.g. seasons speculation, approximate ordering, or missing artwork).
- Mention if this PR requires re-running the GitHub Pages deployment with `[force-optimize]` in the commit message.
-->
