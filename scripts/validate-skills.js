/**
 * Unified Skills Validator (Node.js)
 * Ported from scripts/validate_skills.py to unify the project tooling stack.
 */
const fs = require('fs');
const path = require('path');
const { listSkillIds, parseFrontmatter } = require('../lib/skill-utils');

const ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(ROOT, 'skills');

const VALID_RISK_LEVELS = ["none", "safe", "critical", "offensive"];
const WHEN_TO_USE_PATTERNS = [
    /##\s+When\s+to\s+Use/i,
    /##\s+Use\s+this\s+skill\s+when/i,
    /##\s+When\s+to\s+Use\s+This\s+Skill/i,
    /##\s+Triggers/i
];

const SECURITY_DISCLAIMER_PATTERN = /AUTHORIZED USE ONLY/i;

function runValidation(strict = false) {
    console.log(`🔍 Validating skills in: ${SKILLS_DIR}`);
    console.log(`⚙️  Mode: ${strict ? 'STRICT (CI)' : 'Standard (Dev)'}`);

    const errors = [];
    const warnings = [];
    const skillIds = listSkillIds(SKILLS_DIR);

    for (const skillId of skillIds) {
        const skillPath = path.join(SKILLS_DIR, skillId, 'SKILL.md');

        if (!fs.existsSync(skillPath)) {
            errors.push(`❌ ${skillId}: Missing SKILL.md`);
            continue;
        }

        const content = fs.readFileSync(skillPath, 'utf8');
        const { data: metadata, errors: fmErrors, hasFrontmatter } = parseFrontmatter(content);

        if (!hasFrontmatter) {
            errors.push(`❌ ${skillId}: Missing or malformed YAML frontmatter`);
            continue;
        }

        if (fmErrors && fmErrors.length) {
            fmErrors.forEach(err => errors.push(`❌ ${skillId}: Frontmatter error - ${err}`));
        }

        // 1. Metadata Schema Checks
        if (!metadata.name) {
            errors.push(`❌ ${skillId}: Missing 'name' in frontmatter`);
        } else if (metadata.name !== skillId) {
            warnings.push(`⚠️  ${skillId}: Name '${metadata.name}' does not match folder name '${skillId}'`);
        }

        if (!metadata.description) {
            errors.push(`❌ ${skillId}: Missing 'description' in frontmatter`);
        }

        // 2. Risk Validation
        if (!metadata.risk) {
            const msg = `⚠️  ${skillId}: Missing 'risk' label (defaulting to 'unknown')`;
            if (strict) errors.push(msg.replace('⚠️', '❌'));
            else warnings.push(msg);
        } else if (!VALID_RISK_LEVELS.includes(metadata.risk)) {
            errors.push(`❌ ${skillId}: Invalid risk level '${metadata.risk}'. Must be one of ${VALID_RISK_LEVELS.join(', ')}`);
        }

        // 3. Source Validation
        if (!metadata.source) {
            const msg = `⚠️  ${skillId}: Missing 'source' attribution`;
            if (strict) errors.push(msg.replace('⚠️', '❌'));
            else warnings.push(msg);
        }

        // 4. Content Checks (Triggers)
        const hasUseSection = WHEN_TO_USE_PATTERNS.some(p => p.test(content));
        if (!hasUseSection) {
            const msg = `⚠️  ${skillId}: Missing '## When to Use' section`;
            if (strict) errors.push(msg.replace('⚠️', '❌'));
            else warnings.push(msg);
        }

        // 5. Security Guardrails
        if (metadata.risk === "offensive") {
            if (!SECURITY_DISCLAIMER_PATTERN.test(content)) {
                errors.push(`🚨 ${skillId}: OFFENSIVE SKILL MISSING SECURITY DISCLAIMER! (Must contain 'AUTHORIZED USE ONLY')`);
            }
        }
    }

    // Reporting
    console.log(`\n📊 Checked ${skillIds.length} skills.`);

    if (warnings.length) {
        console.log(`\n⚠️  Found ${warnings.length} Warnings:`);
        warnings.forEach(w => console.log(w));
    }

    if (errors.length) {
        console.log(`\n❌ Found ${errors.length} Critical Errors:`);
        errors.forEach(e => console.log(e));
        process.exit(1);
    }

    if (strict && warnings.length) {
        console.log(`\n❌ STRICT MODE: Failed due to warnings.`);
        process.exit(1);
    }

    console.log(`\n✨ All skills passed validation!`);
}

const isStrict = process.argv.includes('--strict');
runValidation(isStrict);
