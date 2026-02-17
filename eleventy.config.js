import fs from 'fs';
import path from 'path';

import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss'

import pluginWebc from '@11ty/eleventy-plugin-webc';
import { EleventyRenderPlugin } from "@11ty/eleventy";


export default async function (eleventyConfig) {
    //compile tailwind before eleventy processes the files
    eleventyConfig.on('eleventy.before', async () => {
        const tailwindInputPath = path.resolve('./src/css/style.css');
        const tailwindOutputPath = './_site/css/style.css';
        const cssContent = fs.readFileSync(tailwindInputPath, 'utf8');

        const outputDir = path.dirname(tailwindOutputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const result = await processor.process(cssContent, {
            from: tailwindInputPath,
            to: tailwindOutputPath,
        });

        fs.writeFileSync(tailwindOutputPath, result.css);
    });
    // Passthroughs
    eleventyConfig.addPassthroughCopy('src/img');
    eleventyConfig.addPassthroughCopy('src/js');
    // Plugins
    eleventyConfig.addPlugin(pluginWebc,
        {
            components: 'src/_includes/components/**/*.webc'
        }
    );
    eleventyConfig.addPlugin(EleventyRenderPlugin);
    // Global Data
    eleventyConfig.addGlobalData("date", "Last Modified");

    const processor = postcss([
        //compile tailwind
        tailwindcss(),
    ]);
}

export const config = {
    dir: {
        input: 'src'
    }
}