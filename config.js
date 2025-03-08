// For Next.js
const config = {
  // ...existing code...
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [],
    // Allow HTML in markdown
    providerImportSource: '@mdx-js/react',
  },
};

// For Gatsby
// module.exports = {
//   // ...existing code...
//   plugins: [
//     {
//       resolve: `gatsby-transformer-remark`,
//       options: {
//         commonmark: true,
//         footnotes: true,
//         pedantic: true,
//         // This is the key setting:
//         html: true,
//       },
//     },
//   ],
// };

// For Hugo (this would go in config.toml)
// [markup]
//   [markup.goldmark]
//     [markup.goldmark.renderer]
//       unsafe = true
