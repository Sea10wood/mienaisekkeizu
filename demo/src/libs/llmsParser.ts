export function parseLLMs(content: string): Record<string, string[]> {
    const result: Record<string, string[]> = {};
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      // 例: "home -> about"
      const parts = trimmed.split('->').map(part => part.trim());
      if (parts.length === 2) {
        const [from, to] = parts;
        if (result[from]) {
          result[from].push(to);
        } else {
          result[from] = [to];
        }
      }
    }
    return result;
  }
  