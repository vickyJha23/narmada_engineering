import { site } from '../data/site'

/** Deep link that opens WhatsApp with a pre-filled enquiry. */
export function waLink(message?: string) {
  const text =
    message ?? `Hello ${site.name}, I would like to enquire about your fabrication services.`
  return `https://wa.me/${site.contacts[0].phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
}

export function telLink(phone: string) {
  return `tel:${phone.replace(/\s/g, '')}`
}

export function mailLink(subject = `Enquiry — ${site.name}`, body = '') {
  const params = new URLSearchParams({ subject })
  if (body) params.set('body', body)
  return `mailto:${site.email}?${params.toString()}`
}

export const mapsLink = site.googleMaps
