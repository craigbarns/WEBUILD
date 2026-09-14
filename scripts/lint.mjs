import { readFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { HtmlValidate } from 'html-validate';
const config = JSON.parse(await readFile('site.config.json', 'utf8'));
const validator = new HtmlValidate({ extends: ['html-validate:recommended'], rules: {
    'void-style': 'off', 'attr-quotes': 'off', 'no-inline-style': 'off',
    'long-title': 'off', 'prefer-native-element': 'off',
    'no-trailing-whitespace': 'off',
    'attribute-empty-style': 'off', 'attribute-boolean-style': 'off'
} });
let errors = 0;
for (const route of Object.keys(config.pages)) {
    const file = 'dist/' + (route.endsWith('.html') ? route.slice(1) : route.slice(1) + 'index.html');
    const report = await validator.validateFile(file);
    for (const result of report.results) for (const issue of result.messages) {
        if (issue.severity !== 2) continue;
        errors++;
        console.error(`${file}:${issue.line} ${issue.ruleId}: ${issue.message}`);
    }
}
for (const folder of ['js', 'scripts', 'tests']) {
    for (const file of await readdir(folder)) if (/\.(m?js)$/.test(file)) execFileSync(process.execPath, ['--check', `${folder}/${file}`]);
}
if (errors) process.exitCode = 1;
else console.log('HTML validation and JavaScript syntax passed.');
