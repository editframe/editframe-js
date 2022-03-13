import he from 'he'

export const escapeHTML = (html: string): string => he.decode(he.encode(html))
