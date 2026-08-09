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
    if (!dateObj) return "";
    let d;
    if (typeof dateObj.getDate === "function") {
      d = dateObj;
    } else {
      d = new Date(dateObj);
    }
    if (isNaN(d.getTime())) return "";
    const months = [
      "janvier", "février", "mars", "avril", "mai", "juin",
      "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ];
    return `${d.getDate().toString().padStart(2, "0")} ${months[d.getMonth()]} ${d.getFullYear()}`;
  });

  /* ── Strip markdown images ──────────────────────── */
  eleventyConfig.addFilter("stripMarkdownImages", (str) => {
    if (!str) return "";
    return str.replace(/!\[[^\]]*\]\([^)]+\)/g, "").trim();
  });

  /* ── Markdown library config: add classes to images ─ */
  eleventyConfig.amendLibrary("md", (mdLib) => {
    const defaultRender = mdLib.renderer.rules.image || function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };
    mdLib.renderer.rules.image = function (tokens, idx, options, env, self) {
      const token = tokens[idx];
      token.attrPush(["class", "max-w-full h-auto rounded-2xl shadow-lg my-6"]);
      token.attrPush(["loading", "lazy"]);
      return defaultRender(tokens, idx, options, env, self);
    };
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
