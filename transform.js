// transform.js
import AhoCorasick from "ahocorasick";

/**
 * Create a replacer function for a mapping that
 * resolves overlapping patterns by picking the longest match first.
 *
 * @param {Object<string,string>} mapping
 * @returns {(text: string) => string}
 */
export function createReplacer(mapping) {
  const patterns = Object.keys(mapping);
  const ac = new AhoCorasick(patterns);

  return function replaceAll(text) {
    // 1) collect all matches
    const raw = ac.search(text);
    if (!raw.length) return text;

    const allMatches = [];
    for (const [endIndex, pats] of raw) {
      for (const pat of pats) {
        const startIndex = endIndex - pat.length + 1;
        allMatches.push({ startIndex, endIndex, pat });
      }
    }

    // 2) sort by longest pattern first, then by start
    allMatches.sort((a, b) => {
      const d = b.pat.length - a.pat.length;
      return d !== 0 ? d : a.startIndex - b.startIndex;
    });

    // 3) pick non‑overlapping matches
    const occupied = new Uint8Array(text.length);
    const chosen = [];
    for (const m of allMatches) {
      let overlap = false;
      for (let i = m.startIndex; i <= m.endIndex; i++) {
        if (occupied[i]) {
          overlap = true;
          break;
        }
      }
      if (!overlap) {
        chosen.push(m);
        for (let i = m.startIndex; i <= m.endIndex; i++) {
          occupied[i] = 1;
        }
      }
    }

    if (!chosen.length) return text;

    // 4) sort chosen matches by start index
    chosen.sort((a, b) => a.startIndex - b.startIndex);

    // 5) build output
    let out = "";
    let last = 0;
    for (const { startIndex, endIndex, pat } of chosen) {
      if (startIndex > last) {
        out += text.slice(last, startIndex);
      }
      out += mapping[pat];
      last = endIndex + 1;
    }
    if (last < text.length) {
      out += text.slice(last);
    }

    return out;
  };
}
