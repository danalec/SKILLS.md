const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(ROOT, 'skills');

const SECURITY_DISCLAIMER = `> [!WARNING]
> **AUTHORIZED USE ONLY**: This skill is for authorized security testing and research purposes only. Use of this skill for unauthorized activities is strictly prohibited.`;

function guessRisk(skillId, description, body) {
    const content = (skillId + ' ' + description + ' ' + body).toLowerCase();

    const offensiveKeywords = ['attack', 'exploit', 'malware', 'pentest', 'vulnerability', 'payload', 'enumeration', 'privilege escalation', 'injection', 'brute force', 'burp', 'metasploit', 'nmap', 'sqlmap'];
    const criticalKeywords = ['auth', 'encryption', 'password', 'token', 'secret', 'key', 'database', 'access', 'deploy', 'production'];

    if (offensiveKeywords.some(k => content.includes(k))) return 'offensive';
    if (criticalKeywords.some(k => content.includes(k))) return 'critical';
    return 'safe';
}

function enrichSkill(skillPath) {
    let content = fs.readFileSync(skillPath, 'utf8');
    const skillId = path.basename(path.dirname(skillPath));

    // Parse frontmatter
    const lines = content.split('\n');
    if (lines[0].trim() !== '---') return false;

    let endIndex = -1;
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '---') {
            endIndex = i;
            break;
        }
    }

    if (endIndex === -1) return false;

    const fmText = lines.slice(1, endIndex).join('\n');
    const body = lines.slice(endIndex + 1).join('\n');
    let metadata = {};

    try {
        metadata = yaml.parse(fmText) || {};
    } catch (err) {
        console.error(`⚠️ Error parsing YAML in ${skillId}: ${err.message}`);
        return false;
    }

    let modified = false;
    const description = metadata.description || '';

    // 1. Risk Enrichment
    if (!metadata.risk || metadata.risk === 'unknown' || metadata.risk === 'none') {
        metadata.risk = guessRisk(skillId, description, body);
        modified = true;
    }

    // 2. Source Enrichment
    if (!metadata.source || metadata.source === 'unknown' || metadata.source === 'none') {
        metadata.source = (skillId.includes('official') || body.toLowerCase().includes('google official')) ? 'official' : 'community';
        modified = true;
    }

    // 3. When to Use Enrichment
    if (!body.includes('## When to Use')) {
        const whenToUse = `\n## When to Use\n\n- Activate this when the user requires ${description || skillId.replace(/-/g, ' ')} features.\n- Use this skill when the task involves ${skillId.replace(/-/g, ' ')} specific workflows.\n`;
        // Insert after H1 or at top of body
        const h1Match = body.match(/^#\s+.+$/m);
        let newBody = '';
        if (h1Match) {
            const idx = h1Match.index + h1Match[0].length;
            newBody = body.slice(0, idx) + '\n' + whenToUse + body.slice(idx);
        } else {
            newBody = whenToUse + body;
        }
        // We update body but also need to save it. For simplicity in this port, we re-concatenate
        content = `---\n${yaml.stringify(metadata)}---\n${newBody}`;
        modified = true;
    }

    // 4. Security Disclaimer
    if (metadata.risk === 'offensive' && !body.includes('AUTHORIZED USE ONLY')) {
        const h1Match = body.match(/^#\s+.+$/m);
        let newBody = '';
        if (h1Match) {
            const idx = h1Match.index + h1Match[0].length;
            newBody = body.slice(0, idx) + '\n\n' + SECURITY_DISCLAIMER + body.slice(idx);
        } else {
            newBody = SECURITY_DISCLAIMER + '\n\n' + body;
        }
        content = `---\n${yaml.stringify(metadata)}---\n${newBody}`;
        modified = true;
    }

    if (modified) {
        // If we only modified metadata (like risk/source) but not body via injection above,
        // we still need to update content here.
        if (!content.includes('## When to Use') && !content.includes('AUTHORIZED USE ONLY')) {
            content = `---\n${yaml.stringify(metadata)}---\n${body}`;
        }
        fs.writeFileSync(skillPath, content, 'utf8');
        return true;
    }

    return false;
}

function runEnrichment() {
    let updated = 0;
    const listSkills = (dir) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                if (entry.name !== '.disabled' && !entry.name.startsWith('.')) {
                    listSkills(fullPath);
                }
            } else if (entry.name === 'SKILL.md') {
                if (enrichSkill(fullPath)) {
                    updated++;
                }
            }
        }
    };

    console.log(`✨ Enriching metadata and sections in: ${SKILLS_DIR}`);
    listSkills(SKILLS_DIR);
    console.log(`Successfully enriched ${updated} skills.`);
}

if (require.main === module) {
    runEnrichment();
}
