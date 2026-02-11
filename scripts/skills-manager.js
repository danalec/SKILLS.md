/**
 * Skills Manager (Node.js)
 * Ported from scripts/skills_manager.py
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(ROOT, 'skills');
const DISABLED_DIR = path.join(SKILLS_DIR, '.disabled');

function listActive() {
    console.log("🟢 Active Skills:\n");
    const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });
    const skills = entries
        .filter(e => e.isDirectory() && !e.name.startsWith('.'))
        .map(e => e.name)
        .sort();

    skills.forEach(skill => console.log(`  • ${skill}`));
    console.log(`\n✅ Total: ${skills.length} skills`);
}

function listDisabled() {
    if (!fs.existsSync(DISABLED_DIR)) {
        console.log("❌ No disabled skills directory found");
        return;
    }

    console.log("⚪ Disabled Skills:\n");
    const disabled = fs.readdirSync(DISABLED_DIR, { withFileTypes: true })
        .filter(e => e.isDirectory())
        .map(e => e.name)
        .sort();

    disabled.forEach(skill => console.log(`  • ${skill}`));
    console.log(`\n📊 Total: ${disabled.length} disabled skills`);
}

function enableSkill(skillName) {
    const source = path.join(DISABLED_DIR, skillName);
    const target = path.join(SKILLS_DIR, skillName);

    if (!fs.existsSync(source)) {
        console.log(`❌ Skill '${skillName}' not found in .disabled/`);
        return;
    }

    if (fs.existsSync(target)) {
        console.log(`⚠️  Skill '${skillName}' is already active`);
        return;
    }

    fs.renameSync(source, target);
    console.log(`✅ Enabled: ${skillName}`);
}

function disableSkill(skillName) {
    const source = path.join(SKILLS_DIR, skillName);
    const target = path.join(DISABLED_DIR, skillName);

    if (!fs.existsSync(source)) {
        console.log(`❌ Skill '${skillName}' not found`);
        return;
    }

    if (skillName.startsWith('.')) {
        console.log(`⚠️  Cannot disable system directory: ${skillName}`);
        return;
    }

    if (!fs.existsSync(DISABLED_DIR)) {
        fs.mkdirSync(DISABLED_DIR, { recursive: true });
    }

    fs.renameSync(source, target);
    console.log(`✅ Disabled: ${skillName}`);
}

const args = process.argv.slice(2);
const command = args[0] ? args[0].toLowerCase() : '';

switch (command) {
    case 'list':
        listActive();
        break;
    case 'disabled':
        listDisabled();
        break;
    case 'enable':
        if (!args[1]) {
            console.log("❌ Usage: node scripts/skills-manager.js enable SKILL_NAME");
        } else {
            enableSkill(args[1]);
        }
        break;
    case 'disable':
        if (!args[1]) {
            console.log("❌ Usage: node scripts/skills-manager.js disable SKILL_NAME");
        } else {
            disableSkill(args[1]);
        }
        break;
    default:
        console.log(`
Skills Manager - Easily enable/disable skills locally

Usage:
  node scripts/skills-manager.js list          # List active skills
  node scripts/skills-manager.js disabled      # List disabled skills
  node scripts/skills-manager.js enable SKILL  # Enable a skill
  node scripts/skills-manager.js disable SKILL # Disable a skill
    `);
}
