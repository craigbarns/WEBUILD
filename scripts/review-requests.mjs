import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

// Builds a scheduled outbox. No network, no messages sent, no customer fixtures.
export function reviewRequests({ customers, sent = [], reviewUrl, now = new Date() }) {
    const url = new URL(reviewUrl);
    if (url.protocol !== 'https:' || !['g.page', 'search.google.com', 'maps.app.goo.gl', 'www.google.com'].includes(url.hostname)) throw new Error('Use the verified Google review link for WEBUILD.');
    const outbox = [];
    for (const customer of customers) {
        if (!customer.verifiedCustomer || !customer.receptionConfirmed || !customer.contactPermission || customer.optedOut || customer.reviewReceived) continue;
        if (!customer.projectId || !customer.email || !customer.receptionDate) continue;
        const age = (now - new Date(customer.receptionDate)) / 86400000;
        if (!Number.isFinite(age) || age < 2) continue;
        const base = createHash('sha256').update('webuild-review-v1:' + customer.projectId).digest('hex').slice(0,24);
        const firstSent = sent.find(item => item.id === `${base}:initial` && item.status === 'sent');
        const reminderSent = sent.some(item => item.id === `${base}:reminder` && item.status === 'sent');
        let stage = 'initial';
        if (firstSent) {
            const sinceSent = typeof firstSent.sentAt === 'string' && firstSent.sentAt ? (now - new Date(firstSent.sentAt)) / 86400000 : NaN;
            if (reminderSent || !Number.isFinite(sinceSent) || sinceSent < 7) continue;
            stage = 'reminder';
        }
        const id = `${base}:${stage}`;
        // Stable IDs let the delivery adapter reject duplicate scheduled entries.
        outbox.push({ id, stage, to: customer.email, subject: 'Votre retour sur les travaux WEBUILD', body: `Bonjour,\n\nMerci d’avoir confié vos travaux à WEBUILD. Si vous le souhaitez, vous pouvez partager votre expérience sur Google : ${reviewUrl}\n\nVotre avis libre et sincère peut aider d’autres propriétaires à préparer leur projet. Pour ne plus recevoir cette demande, répondez simplement à ce message.\n\nWEBUILD`, status: 'draft', requiresVerifiedReviewUrl: true });
    }
    return outbox;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    const [input, output] = process.argv.slice(2);
    if (!input || !output) throw new Error('Usage: node scripts/review-requests.mjs customers.local.json outbox.local.json');
    const data = JSON.parse(await readFile(input, 'utf8'));
    const outbox = reviewRequests(data);
    await writeFile(output, JSON.stringify(outbox, null, 2) + '\n', { mode: 0o600 });
    console.log(`${outbox.length} review-request drafts prepared. No messages sent.`);
}
