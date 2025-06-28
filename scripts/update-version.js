#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '..', 'package.json');

function updateVersion(newVersion) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.version = newVersion;
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    
    console.log(`✅ Versão atualizada para ${newVersion}`);
    console.log('📝 Lembre-se de fazer commit das alterações:');
    console.log(`   git add package.json`);
    console.log(`   git commit -m "chore: bump version to ${newVersion}"`);
  } catch (error) {
    console.error('❌ Erro ao atualizar a versão:', error.message);
    process.exit(1);
  }
}

const newVersion = process.argv[2];

if (!newVersion) {
  console.error('❌ Por favor, forneça uma versão válida (ex: 1.0.1)');
  console.log('📖 Uso: node scripts/update-version.js <versão>');
  process.exit(1);
}

// Validar formato da versão (semantic versioning)
const versionRegex = /^\d+\.\d+\.\d+$/;
if (!versionRegex.test(newVersion)) {
  console.error('❌ Formato de versão inválido. Use o formato: X.Y.Z (ex: 1.0.1)');
  process.exit(1);
}

updateVersion(newVersion); 