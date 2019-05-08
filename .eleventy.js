module.exports = function(eleventyConfig) {
    eleventyConfig.addFilter('md', (str) => {
        return require('markdown-it')().render(str);
    });

    eleventyConfig.setBrowserSyncConfig({
        files: ['_site/dist/css/*.css', '_site/dist/scripts/*.js']
      });

    eleventyConfig.addPassthroughCopy('static');

    return {
        passthroughFileCopy: true,
        templateFormats: [
            'md',
            'njk',
        ],
        htmlTemplateEngine: 'njk',
        dataTemplateEngine: 'njk',
        dir: {
            input: '.',
            includes: '_includes',
            data: '_data',
            output: '_site',
        },
    };
};