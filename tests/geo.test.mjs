import test from 'node:test';
import assert from 'node:assert/strict';
import { summarize } from '../scripts/geo-summary.mjs';
test('unrun and failed GEO checks never become absence or zero-percent visibility', () => {
    assert.equal(summarize([{ engine:'test',runStatus:'not_run' }])[0].presenceRate,null);
    const rows=[{engine:'test',runStatus:'failed'},{engine:'test',runStatus:'completed',responseEvidence:'local evidence',webuildPresent:true,recommended:false,citedAsSource:true,sourceUrls:['https://example.invalid'],competitors:[]}];
    assert.equal(summarize(rows)[0].validRuns,1);
    assert.equal(summarize(rows)[0].presenceRate,1);
});
