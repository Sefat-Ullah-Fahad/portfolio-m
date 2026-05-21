import { NAV_SECTIONS, NAV_SCROLL_OFFSET } from './navSections';

/** No nav item highlighted (footer / contact area). */
export const NAV_ACTIVE_NONE = -1;

export function getSectionScrollTop(id) {
  const el = document.getElementById(id);
  if (!el) return 0;
  return Math.max(0, el.offsetTop - NAV_SCROLL_OFFSET);
}

/**
 * Which nav index is active from scroll position.
 * Returns NAV_ACTIVE_NONE when past Experience (contact/footer).
 */
export function getNavActiveIndexFromScroll() {
  const scrollPos = window.scrollY + NAV_SCROLL_OFFSET;
  const experienceEl = document.getElementById('experience');

  if (experienceEl) {
    const pastExperience =
      scrollPos >= experienceEl.offsetTop + experienceEl.offsetHeight - 80;
    if (pastExperience) return NAV_ACTIVE_NONE;
  }

  let active = 0;
  for (let i = 0; i < NAV_SECTIONS.length; i++) {
    const el = document.getElementById(NAV_SECTIONS[i].id);
    if (el && el.offsetTop <= scrollPos) active = i;
  }
  return active;
}

export function scrollToSectionId(id) {
  window.scrollTo({ top: getSectionScrollTop(id), behavior: 'smooth' });
}
