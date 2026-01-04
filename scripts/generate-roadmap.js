#!/usr/bin/env node
/**
 * Roadmap Generator
 * Genereert ROADMAP.md vanuit roadmap.json
 * 
 * Gebruik: node scripts/generate-roadmap.js
 */

const fs = require('fs');
const path = require('path');

const JSON_PATH = path.join(__dirname, '..', 'roadmap.json');
const MD_PATH = path.join(__dirname, '..', 'ROADMAP.md');

function getStatusEmoji(status) {
  switch (status) {
    case 'completed': return '✅';
    case 'in-progress': return '🔄';
    case 'pending': return '⏳';
    default: return '⏳';
  }
}

function generateMarkdown(data) {
  let md = '# Tala2 Roadmap\n\n';
  md += '> ⚠️ Dit bestand is auto-gegenereerd. Bewerk `roadmap.json` en run `npm run roadmap`.\n\n';

  // In Progress
  md += '## In Progress\n\n';
  
  if (data.inProgress.length === 0) {
    md += '*Geen actieve taken*\n\n';
  } else {
    for (const project of data.inProgress) {
      md += `### ${project.title} - ${project.date}\n\n`;
      md += `${project.description}\n\n`;
      
      for (const phase of project.phases) {
        const statusEmoji = getStatusEmoji(phase.status);
        const completedTasks = phase.tasks.filter(t => t.done).length;
        const totalTasks = phase.tasks.length;
        
        md += `#### ${statusEmoji} ${phase.title} (${completedTasks}/${totalTasks})\n\n`;
        
        for (const task of phase.tasks) {
          const checkbox = task.done ? '[x]' : '[ ]';
          md += `- ${checkbox} ${task.task}\n`;
        }
        md += '\n';
      }
      
      if (project.architectureChanges && project.architectureChanges.length > 0) {
        md += '**Architectuur Wijzigingen**:\n';
        for (const change of project.architectureChanges) {
          md += `- ${change}\n`;
        }
        md += '\n';
      }
    }
  }

  md += '---\n\n';

  // Completed
  md += '## Completed\n\n';
  
  for (const project of data.completed) {
    md += `### ${project.title} - ${project.date}\n`;
    for (const task of project.tasks) {
      md += `- ✅ ${task}\n`;
    }
    md += '\n';
  }

  md += '---\n\n';

  // Backlog
  md += '## Backlog\n\n';
  
  for (const item of data.backlog) {
    if (item.description) {
      md += `### ${item.task}\n`;
      md += `${item.description}\n\n`;
    } else {
      md += `- [ ] ${item.task}\n`;
    }
  }
  md += '\n';

  md += '---\n\n';

  // Bugfixes
  if (data.bugfixes && data.bugfixes.length > 0) {
    md += '## Bugfixes\n\n';
    for (const item of data.bugfixes) {
      md += `### ${item.task}\n`;
      if (item.description) {
        md += `${item.description}\n\n`;
      }
    }
    md += '---\n\n';
  }

  // Tech Debt
  if (data.techDebt && data.techDebt.length > 0) {
    md += '## Tech Debt / Cleanup\n\n';
    for (const item of data.techDebt) {
      md += `### ${item.task}\n`;
      md += `> ⚠️ ${item.description}\n\n`;
    }
    md += '---\n\n';
  }

  // App Store Checklist
  if (data.appStoreChecklist) {
    md += '## App Store Release Checklist\n\n';
    
    const sections = [
      { key: 'metadata', title: 'Metadata & Content' },
      { key: 'privacyLegal', title: 'Privacy & Legal' },
      { key: 'securityAudit', title: 'Code & Security Audit' },
      { key: 'technical', title: 'Technische Vereisten' },
      { key: 'testing', title: 'Pre-Submit Testing' }
    ];

    for (const section of sections) {
      if (data.appStoreChecklist[section.key]) {
        md += `### ${section.title}\n`;
        for (const item of data.appStoreChecklist[section.key]) {
          const checkbox = item.done ? '[x]' : '[ ]';
          md += `- ${checkbox} ${item.task}\n`;
        }
        md += '\n';
      }
    }
  }

  return md;
}

function main() {
  try {
    const jsonData = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
    const markdown = generateMarkdown(jsonData);
    fs.writeFileSync(MD_PATH, markdown);
    console.log('✅ ROADMAP.md gegenereerd vanuit roadmap.json');
  } catch (error) {
    console.error('❌ Fout bij genereren roadmap:', error.message);
    process.exit(1);
  }
}

main();
