import site from "./site.json" with { type: "json" };

const coreNav = [
  {
    "title": "Home",
    "url": site.paths.home
  },
  {
    "title": "Reviews",
    "url": site.paths.reviews
  },
  {
    "title": "Gallery",
    "url": site.paths.gallery
  },
  {
    "title": "Contact",
    "url": site.paths.contact
  }
];

// Combine them into a single object for the default export
export default {
  main: [...coreNav],
  footer: [
    ...coreNav,
    {
      "title": "Accessibility",
      "url": "/accessibility/"
    },
    {
      "title": "Privacy Policy",
      "url": "/privacy-policy/"
    }
  ]
};