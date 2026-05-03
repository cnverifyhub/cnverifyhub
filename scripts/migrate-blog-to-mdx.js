const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '..', 'content', 'blog');

function migrateDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      migrateDir(filePath);
    } else if (file.endsWith('.json') && file !== 'manifest.json') {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Create random dates for some posts
      const date = content.publishDate === '2026-05-03' 
        ? (Math.random() > 0.5 ? '2025-' : '2026-') + 
          String(Math.floor(Math.random() * 12) + 1).padStart(2, '0') + '-' + 
          String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')
        : content.publishDate;

      const mdxContent = `---
slug: "${content.slug}"
title: "${content.title.replace(/"/g, '\\"')}"
metaDescription: "${content.metaDescription.replace(/"/g, '\\"')}"
keywords: ${JSON.stringify(content.keywords)}
category: "${content.category}"
publishDate: "${date}"
modifiedDate: "${content.modifiedDate || date}"
author: "${content.author || 'CNWePro Team'}"
featuredImage: "${content.featuredImage}"
excerpt: "${content.excerpt.replace(/"/g, '\\"')}"
---

${content.content}
`;

      const mdxPath = path.join(dir, file.replace('.json', '.mdx'));
      fs.writeFileSync(mdxPath, mdxContent);
      console.log(`Converted ${path.relative(blogDir, filePath)} to MDX with date ${date}`);
    }
  });
}

migrateDir(blogDir);

