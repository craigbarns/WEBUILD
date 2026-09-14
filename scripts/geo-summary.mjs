import { readFile } from 'node:fs/promises';
export function summarize(records) {
    const engines = [...new Set(records.map(r => r.engine))];
    return engines.map(engine => {
        const all = records.filter(r => r.engine === engine);
        const valid = all.filter(r => r.runStatus === 'completed' && r.responseEvidence && [r.webuildPresent,r.recommended,r.citedAsSource].every(v => typeof v === 'boolean'));
        const rate = key => valid.length ? valid.filter(r => r[key]).length / valid.length : null;
        return { engine, attemptedOrPlanned: all.length, validRuns: valid.length, presenceRate: rate('webuildPresent'), recommendationRate: rate('recommended'), citationRate: rate('citedAsSource'), sources: [...new Set(valid.flatMap(r => r.sourceUrls))], competitors: [...new Set(valid.flatMap(r => r.competitors))] };
    });
}
if (process.argv[2]) {
    const input = JSON.parse(await readFile(process.argv[2], 'utf8'));
    console.log(JSON.stringify(summarize(input.records), null, 2));
}
