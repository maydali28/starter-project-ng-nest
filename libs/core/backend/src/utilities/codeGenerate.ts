
export function generateCode(prefix: string): string {
    const rand = Math.floor(Math.random() * (900000)) + 100000; // Generate 6 digits number
    return prefix + rand.toString();
  }
