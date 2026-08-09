const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  /* ── Passthrough assets (copied verbatim) ──────── */
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("media");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/sitemap.xml");

  /* ── Layout alias ───────────────────────────────── */
  eleventyConfig.addLayoutAlias("base", "layout.njk");

  /* ── Collections ────────────────────────────────── */
  eleventyConfig.addCollection("actus", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/actus/*.md")
      .sort((a, b) => {
        const da = a.fileSlug.split("-")[0] + a.fileSlug.split("-")[1] + a.fileSlug.split("-")[2];
        const db = b.fileSlug.split("-")[0] + b.fileSlug.split("-")[1] + b.fileSlug.split("-")[2];
        return da.localeCompare(db) * -1;
      });
  });

  /* ── Date filter ────────────────────────────────── */
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "fr" })
      .setLocale("fr")
      .toFormat("dd LLLL yyyy");
  });

  /* ── Current year ───────────────────────────────── */
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
