const fs = require('fs');
const path = require('path');

console.log('🔨 Building PRODUCTION version...\n');

// Archivos y carpetas de desarrollo que NO deben estar en producción
const devFiles = [
    'src/logging/DatabaseLogger.js',       // DEV ONLY
    'analyze_logs.js',                     // Analysis script
    'verify_evolution.js',                 // Verification script
    'verify_initial_state.js'              // Verification script
];

// 1. Crear carpeta build
if (fs.existsSync('./build')) {
    console.log('📁 Cleaning existing build directory...');
    fs.rmSync('./build', { recursive: true, force: true });
}
fs.mkdirSync('./build');

// 2. Copiar archivos del proyecto
console.log('📦 Copying project files...');
copyDir('./src', './build/src');
fs.copyFileSync('./index.html', './build/index.html');
fs.copyFileSync('./style.css', './build/style.css');
if (fs.existsSync('./favicon.ico')) {
    fs.copyFileSync('./favicon.ico', './build/favicon.ico');
}

// 3. Eliminar archivos de desarrollo
console.log('\n🗑️  Removing development files...');
devFiles.forEach(file => {
    const filePath = path.join('./build', file);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`   ❌ Removed: ${file}`);
    }
});

// 4. Modificar index.html (eliminar scripts dev del array dinámico)
console.log('\n🔧 Cleaning index.html...');
let html = fs.readFileSync('./build/index.html', 'utf8');

devFiles.forEach(file => {
    // Escape special regex characters
    const escapedFile = file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Pattern: Remove 'path/to/script.js', (with or without comma)
    const arrayEntryPattern = new RegExp(`['"]${escapedFile}['"],?`, 'g');
    html = html.replace(arrayEntryPattern, '');
});

// Eliminar comas finales sobrantes en el array si las hay
html = html.replace(/,\s*\]/g, ']');

// Eliminar comentarios DEPRECATED y bloques de desarrollo
html = html.replace(/<!--.*?DEPRECATED.*?-->/g, '');

fs.writeFileSync('./build/index.html', html);
console.log('   ✅ index.html cleaned');

// 5. Modificar Constants.js (forzar modo PRODUCTION)
console.log('\n🔧 Setting PRODUCTION mode in Constants.js...');
let constants = fs.readFileSync('./build/src/utils/Constants.js', 'utf8');

// Cambiar CUALQUIER EXECUTION_MODE a PRODUCTION
constants = constants.replace(
    /EXECUTION_MODE:\s*['"][A-Z_]+['"]/g,
    "EXECUTION_MODE: 'PRODUCTION'"
);

// Deshabilitar DATABASE_LOGGING
constants = constants.replace(
    /(DATABASE_LOGGING:\s*{[^}]*enabled:\s*)true/,
    '$1false'
);

// Eliminar sección DEPRECATED
constants = constants.replace(/\/\/\s*DEPRECATED.*?(?=\n\s*\/\/\s*=====|\n\s*\};\s*$)/gs, '');

fs.writeFileSync('./build/src/utils/Constants.js', constants);
console.log('   ✅ Constants.js set to PRODUCTION mode');
console.log('   ✅ DATABASE_LOGGING disabled');

// 6. Resumen
console.log('\n✅ Production build complete!');
console.log('📦 Output directory: ./build/');
console.log('\n📊 Build summary:');
console.log(`   - Mode: PRODUCTION`);
console.log(`   - Dev files removed: ${devFiles.length}`);
console.log(`   - Database logging: DISABLED`);
console.log(`   - Debug monitor: DISABLED`);
console.log('\n🚀 Ready to deploy!');

// Función auxiliar para copiar directorios recursivamente
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}
