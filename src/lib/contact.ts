/**
 * Contact details are stored XOR-encoded rather than as literals so that neither
 * the shipped bundle nor the rendered DOM ever contains a harvestable
 * "user@host" / "+46…" string. Nothing is decoded until a visitor completes the
 * hold gesture in <ContactReveal />.
 *
 * This defeats regex-based scrapers and crawlers reading the static markup. It
 * is deliberately not encryption — anyone who runs the page code can recover the
 * values, which is the point: real visitors must still be able to reach James.
 */

const KEY = 0x5b;

const decode = (codes: readonly number[]): string =>
  codes.map((code) => String.fromCharCode(code ^ KEY)).join('');

const ENCODED = {
  email: [49, 58, 54, 62, 40, 27, 62, 42, 63, 58, 54, 117, 54, 62],
  phoneText: [112, 111, 109, 123, 115, 108, 109, 105, 114, 123, 104, 111, 118, 104, 110, 104, 98],
  phoneDial: [112, 111, 109, 108, 109, 105, 104, 111, 104, 110, 104, 98],
} as const;

export type ContactChannel = 'email' | 'phone';

export interface ContactChannelConfig {
  /** Human label rendered next to the icon. */
  label: string;
  /** Placeholder shown before the reveal — never contains the full value. */
  mask: string;
  /** Builds the display string on demand. */
  getValue: () => string;
  /** Builds the mailto:/tel: target on demand. */
  getHref: () => string;
  /** Verb for the direct-action button. */
  actionLabel: string;
}

export const CONTACT_CHANNELS: Record<ContactChannel, ContactChannelConfig> = {
  email: {
    label: 'Email',
    mask: 'j•••••@•••••.me',
    getValue: () => decode(ENCODED.email),
    getHref: () => `mailto:${decode(ENCODED.email)}`,
    actionLabel: 'Send email',
  },
  phone: {
    label: 'Phone',
    mask: '+46 ••• ••• ••',
    getValue: () => decode(ENCODED.phoneText),
    getHref: () => `tel:${decode(ENCODED.phoneDial)}`,
    actionLabel: 'Call',
  },
};
