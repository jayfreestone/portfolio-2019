const { DateTime } = require('luxon');
const markdownIt = require('markdown-it');
const path = require('path');
const { config } = require(path.join(__dirname, './package.json'));
const genNewImageName = require('./buildScripts/genNewImageName');

module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(require('@11ty/eleventy-plugin-syntaxhighlight'));

    eleventyConfig.addFilter('md', (str) => {
        return markdownIt().render(str);
    });

    eleventyConfig.addFilter('readableDate', dateObj => (
      DateTime.fromJSDate(dateObj, {zone: 'gmt'}).toFormat('dd LLL yyyy')
    ));

    eleventyConfig.addShortcode('img', (fileName, alt, ...requestedCrops) => {
      const { image_sizes } = config;
      const crops = requestedCrops;

      if (fileName.endsWith('.svg')) {
        return `<img alt="${alt}" src="/dist/img/${fileName}" />`;
      }

      const srcSet = crops.map(cropName =>{
        const [ width, height ] = image_sizes[cropName];
        // @todo Shouldn't hard-code the dist dir
        return `/dist/img/${genNewImageName(fileName, width, height)} ${width}w`;
      });

      return `<img alt="${alt}" src="${srcSet[0]}" srcset="${srcSet.join(', ')}" />`;
    });

    eleventyConfig.setLibrary('md', markdownIt({
      html: true,
      breaks: true,
      linkify: true,
    }).use(require('markdown-it-anchor'), {
      permalink: true,
      permalinkClass: 'direct-link',
      permalinkSymbol: '#',
    }).use(require('markdown-it-citation'), {
      marker: '--',
      removeMarker: true,
    }));

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
