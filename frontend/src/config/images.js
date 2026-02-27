/**
 * SL-LMS Image Assets Registry
 *
 * Centralised image URLs with responsive sizes and proper alt text.
 * All images are royalty-free from Unsplash / Pexels.
 *
 * Using Unsplash dynamic resizing (?w=WIDTH&q=QUALITY&auto=format)
 * for automatic WebP conversion and responsive sizing.
 */

const UNSPLASH_BASE = "https://images.unsplash.com";

/**
 * Generate responsive srcSet for Unsplash images.
 * @param {string} photoId – Unsplash photo path
 * @param {number[]} widths
 */
function srcSet(photoId, widths = [400, 800, 1200]) {
  return widths
    .map((w) => `${UNSPLASH_BASE}/${photoId}?w=${w}&auto=format&q=75 ${w}w`)
    .join(", ");
}

export const IMAGES = {
  hero: {
    primary: {
      src: `${UNSPLASH_BASE}/photo-1589829545856-d10d557cf95f?w=800&auto=format&q=80`,
      srcSet: srcSet("photo-1589829545856-d10d557cf95f"),
      alt: "Scales of justice on a desk with legal books — representing Sri Lankan legal authority",
      width: 800,
      height: 533,
    },
  },

  sections: {
    whyChoose: {
      src: `${UNSPLASH_BASE}/photo-1507679799987-c73779587ccf?w=1400&auto=format&q=60`,
      alt: "Professional lawyer in formal attire representing legal authority",
      width: 1400,
      height: 800,
    },
    callToAction: {
      src: `${UNSPLASH_BASE}/photo-1505664194779-8beaceb93744?w=1200&auto=format&q=60`,
      alt: "Law library with leather-bound legal volumes",
      width: 1200,
      height: 600,
    },
    courtroom: {
      src: `${UNSPLASH_BASE}/photo-1436450412740-6b988f486c6b?w=1200&auto=format&q=70`,
      alt: "Courtroom interior with wooden benches and judicial seating",
      width: 1200,
      height: 800,
    },
    consultation: {
      src: `${UNSPLASH_BASE}/photo-1521791055366-0d553872125f?w=800&auto=format&q=75`,
      alt: "Lawyers consulting with client over legal documents",
      width: 800,
      height: 533,
    },
    gavel: {
      src: `${UNSPLASH_BASE}/photo-1589994965851-a8f479c573a9?w=800&auto=format&q=75`,
      alt: "Wooden gavel and scales of justice symbolising fair judgment",
      width: 800,
      height: 533,
    },
    documents: {
      src: `${UNSPLASH_BASE}/photo-1450101499163-c8848c66ca85?w=800&auto=format&q=75`,
      alt: "Legal professional reviewing case documents and signing papers",
      width: 800,
      height: 533,
    },
  },

  patterns: {
    grid: `${UNSPLASH_BASE}/photo-1557682250-33bd709cbe85?w=1600&auto=format&q=30`,
  },
};

export default IMAGES;
