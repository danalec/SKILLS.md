const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const README_PATH = path.join(ROOT, 'README.md');
const INDEX_PATH = path.join(ROOT, 'skills_index.json');

function updateReadme() {
    console.log(`📖 Reading skills index from: ${INDEX_PATH}`);
    const skills = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
    const totalSkills = skills.length;
    console.log(`🔢 Total skills found: ${totalSkills}`);

    console.log(`📝 Updating README at: ${README_PATH}`);
    let content = fs.readFileSync(README_PATH, 'utf8');

    // 1. Update Title Count
    content = content.replace(
        /(# 🌌 Antigravity Awesome Skills: )\d+(\+ Agentic Skills)/,
        `$1${totalSkills}$2`
    );

    // 2. Update Blockquote Count
    content = content.replace(
        /(Collection of )\d+(\+ Universal)/,
        `$1${totalSkills}$2`
    );

    // 3. Update Intro Text Count
    content = content.replace(
        /(library of \*\*)\d+( high-performance agentic skills\*\*)/,
        `$1${totalSkills}$2`
    );

    // 4. Update Browse section header
    content = content.replace(
        /## Browse \d+\+ Skills/,
        `## Browse ${totalSkills}+ Skills`
    );

    // 5. Update TOC link for Browse
    content = content.replace(
        /\[📚 Browse \d+\+ Skills\]\(#browse-\d+-skills\)/,
        `[📚 Browse ${totalSkills}+ Skills](#browse-${totalSkills}-skills)`
    );

    fs.writeFileSync(README_PATH, content, 'utf8');
    console.log("✅ README.md updated successfully.");
}

if (require.main === module) {
    updateReadme();
}
