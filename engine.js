export const SCHEMA_VERSION = 1;
export function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T12:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function cents(value) {
  const raw = String(value).trim();
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(raw)) throw new Error('Enter a nonnegative amount with at most two decimal places.');
  const [whole, decimal = ''] = raw.split('.');
  return Number(whole) * 100 + Number(decimal.padEnd(2, '0'));
}
export function emptyState() { return { version: SCHEMA_VERSION, budgetCents: 10000, tickets: [] }; }
export function validateTicket(ticket) {
  if (!ticket || typeof ticket !== 'object') throw new Error('Invalid ticket record.');
  const { id, game, reference, purchasedAt, costCents, prizeCents, drawDates } = ticket;
  for (const [name, value, limit] of [['id',id,100],['game',game,80],['reference',reference,120]]) {
    if (typeof value !== 'string' || !value.trim() || value.length > limit) throw new Error(`Invalid ${name}.`);
  }
  if (!validDate(purchasedAt)) throw new Error('Invalid purchase date.');
  for (const value of [costCents, prizeCents]) if (!Number.isSafeInteger(value) || value < 0 || value > 999999999) throw new Error('Invalid money amount.');
  if (!Array.isArray(drawDates) || drawDates.length > 100 || drawDates.some(d => !validDate(d)) || new Set(drawDates).size !== drawDates.length) throw new Error('Enter unique, valid draw dates.');
  return { id, game: game.trim(), reference: reference.trim(), purchasedAt, costCents, prizeCents, drawDates: [...drawDates].sort() };
}
export function validateState(input) {
  if (!input || input.version !== SCHEMA_VERSION || !Number.isSafeInteger(input.budgetCents) || input.budgetCents < 0 || input.budgetCents > 999999999 || !Array.isArray(input.tickets) || input.tickets.length > 10000) throw new Error('Unsupported or invalid backup.');
  const tickets = input.tickets.map(validateTicket);
  if (new Set(tickets.map(t=>t.id)).size !== tickets.length || new Set(tickets.map(t=>t.reference.toLowerCase())).size !== tickets.length) throw new Error('Duplicate ticket or receipt reference.');
  return {version: SCHEMA_VERSION, budgetCents: input.budgetCents, tickets};
}
export function addTicket(state, ticket) { return validateState({...state, tickets: [...state.tickets, validateTicket(ticket)]}); }
export function monthlySummary(state, month) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw new Error('Invalid month.');
  const records = state.tickets.filter(t=>t.purchasedAt.startsWith(month));
  const spentCents = records.reduce((s,t)=>s+t.costCents,0);
  const prizeCents = records.reduce((s,t)=>s+t.prizeCents,0);
  return {spentCents, prizeCents, remainingCents: state.budgetCents-spentCents, netCents: prizeCents-spentCents};
}
export function purchasedCoverage(state) {
  const entries = new Map();
  for (const t of state.tickets) for (const date of t.drawDates) {
    const key = JSON.stringify([t.game,date]);
    const existing = entries.get(key) || {game:t.game,date,tickets:0};
    existing.tickets++;
    entries.set(key,existing);
  }
  return [...entries.values()].sort((a,b)=>a.date.localeCompare(b.date)||a.game.localeCompare(b.game));
}
