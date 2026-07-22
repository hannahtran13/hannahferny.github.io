import { readDispatches, validateDispatches } from "./registry.js";

const records = validateDispatches(readDispatches());
console.log(`Validated ${records.length} dispatch records.`);
