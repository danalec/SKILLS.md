const fs = require('fs');
const path = require('path');
const { listSkillIdsRecursive, parseFrontmatter } = require('../lib/skill-utils');

const ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(ROOT, 'skills');
const OUTPUT_FILE = path.join(ROOT, 'skills_index.json');

function generateIndex() {
    console.log(`🏗️  Generating index from: ${SKILLS_DIR}`);
    const skillPaths = listSkillIdsRecursive(SKILLS_DIR);
    const skills = [];

    for (const relPath of skillPaths) {
        const fullPath = path.join(SKILLS_DIR, relPath, 'SKILL.md');
        const content = fs.readFileSync(fullPath, 'utf8');
        const { data: metadata } = parseFrontmatter(content);

        const dirName = path.basename(relPath);
        const parentDir = path.basename(path.dirname(relPath));

        const skillInfo = {
            id: dirName,
            path: path.join('skills', relPath),
            category: parentDir === '.' ? 'uncategorized' : parentDir,
            name: metadata.name || dirName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: metadata.description || '',
            risk: metadata.risk || 'unknown',
            source: metadata.source || 'unknown'
        };

        // Fallback for description from body if needed (mostly handled by enrich script now)
        if (!skillInfo.description) {
            const { body } = parseFrontmatter(content);
            const lines = body.split('\n');
            let desc = '';
            for (const line of lines) {
                if (line.startsWith('#') || !line.trim()) {
                    if (desc) break;
                    continue;
                }
                desc = line.trim();
                break;
            }
            skillInfo.description = desc.slice(0, 250);
        }

        skills.push(skillInfo);
    }

    // Sort by name
    skills.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()) || a.id.localeCompare(b.id));

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(skills, null, 2), 'utf8');
    console.log(`✅ Generated rich index with ${skills.length} skills at: ${OUTPUT_FILE}`);
}

if (require.main === module) {
    generateIndex();
}
