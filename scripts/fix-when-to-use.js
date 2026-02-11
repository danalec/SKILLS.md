const fs = require('fs');
const path = require('path');
const { listSkillIds } = require('../lib/skill-utils');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');

function fixWhenToUse(skillId) {
    const skillPath = path.join(SKILLS_DIR, skillId, 'SKILL.md');
    const content = fs.readFileSync(skillPath, 'utf8');
    
    // Pattern to match the problematic bullet with flexible whitespace
    const pattern = /^-\s*Use this skill when you need to this skill should be used when the user asks to .*?\.\s*it provides /gim;
    
    // Check if pattern exists
    if (!pattern.test(content)) {
        return false;
    }
    
    // Reset regex
    pattern.lastIndex = 0;
    
    // Replace the duplicated phrase with more flexible regex
    let newContent = content.replace(
        /^-\s*Use this skill when you need to this skill should be used when the user asks to (.*?)\.\s*it provides (.*)$/gim,
        (match, quotesPart, rest) => {
            // Convert folder id to skill name (hyphens to spaces, capitalize words)
            const skillName = skillId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            return `- Use this skill for ${skillName} when the user asks to ${quotesPart}. It provides ${rest}`;
        }
    );
    
    // Also fix lowercase "it provides" to "It provides" (with flexible whitespace)
    newContent = newContent.replace(/\.\s*it provides /g, '. It provides ');
    
    if (newContent !== content) {
        fs.writeFileSync(skillPath, newContent, 'utf8');
        console.log(`Fixed ${skillId}`);
        return true;
    }
    return false;
}

function main() {
    const skillIds = listSkillIds(SKILLS_DIR);
    let fixedCount = 0;
    
    for (const skillId of skillIds) {
        try {
            if (fixWhenToUse(skillId)) {
                fixedCount++;
            }
        } catch (err) {
            console.error(`Error processing ${skillId}:`, err.message);
        }
    }
    
    console.log(`Fixed ${fixedCount} skills`);
}

if (require.main === module) {
    main();
}