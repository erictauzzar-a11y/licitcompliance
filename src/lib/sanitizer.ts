import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitizador seguro de HTML e Markdown contra Cross-Site Scripting (XSS)
 * Remove tags executáveis, scripts, iframes e atributos de evento (onload, onerror, etc.)
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "b", "i", "strong", "em", "strike", "code", "hr", "br",
      "ul", "ol", "li", "blockquote", "pre", "table", "thead", "tbody", "tr", "th", "td", "span", "div"
    ],
    ALLOWED_ATTR: ["class", "id"],
    ALLOW_DATA_ATTR: false,
  });
}
