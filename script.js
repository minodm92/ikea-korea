const body = document.body;
const header = document.querySelector('[data-header]');
const menu = document.querySelector('[data-menu-panel]');
const menuTrigger = document.querySelector('[data-menu-trigger]');
const menuClose = document.querySelector('[data-menu-close]');
const searchPanel = document.querySelector('[data-search-panel]');
const searchTrigger = document.querySelector('[data-search-trigger]');
const searchClose = document.querySelector('[data-search-close]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('load', () => {
  const loader = document.querySelector('.page-loader');
  const showHeroTitle = () => body.classList.add('is-hero-ready');

  if (reduceMotion) {
    loader?.classList.add('is-done');
    showHeroTitle();
    return;
  }

  window.setTimeout(() => {
    if (!loader) {
      showHeroTitle();
      return;
    }

    loader.addEventListener('transitionend', (event) => {
      if (event.propertyName === 'transform') showHeroTitle();
    }, { once: true });
    loader.classList.add('is-done');
    window.setTimeout(showHeroTitle, 1100);
  }, 700);
});

document.querySelectorAll('.hero__title span').forEach((letter, index) => {
  letter.style.setProperty('--letter-index', index);
});

const footerWordmark = document.querySelector('.footer-wordmark');
const footerLetters = [...document.querySelectorAll('.footer-wordmark span')];
footerLetters.forEach((letter, index) => {
  letter.style.setProperty('--letter-index', footerLetters.length - 1 - index);
});

if (footerWordmark && 'IntersectionObserver' in window && !reduceMotion) {
  const footerObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.25 });
  footerObserver.observe(footerWordmark);
} else {
  footerWordmark?.classList.add('is-visible');
}

let lastScrollY = 0;
const syncHeader = () => {
  const current = window.scrollY;
  const scrollingUp = current < lastScrollY;
  header.classList.toggle('is-scrolled', current > 40);
  header.classList.toggle('is-returning', current > 40 && scrollingUp);
  header.classList.toggle('is-hidden', current > lastScrollY && current > 320 && !body.classList.contains('is-locked'));
  lastScrollY = current;
};
window.addEventListener('scroll', syncHeader, { passive: true });
syncHeader();

const setPanel = (panel, trigger, open) => {
  panel.classList.toggle('is-open', open);
  panel.setAttribute('aria-hidden', String(!open));
  trigger?.setAttribute('aria-expanded', String(open));
  body.classList.toggle('is-locked', open);
  if (open) panel.querySelector('a, button, input')?.focus();
};

menuTrigger.addEventListener('click', () => setPanel(menu, menuTrigger, true));
menuClose.addEventListener('click', () => setPanel(menu, menuTrigger, false));
menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setPanel(menu, menuTrigger, false)));
searchTrigger?.addEventListener('click', () => setPanel(searchPanel, searchTrigger, true));
searchClose.addEventListener('click', () => setPanel(searchPanel, searchTrigger, false));

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (menu.classList.contains('is-open')) setPanel(menu, menuTrigger, false);
  if (searchPanel.classList.contains('is-open')) setPanel(searchPanel, searchTrigger, false);
});

document.querySelector('.search-panel__form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = event.currentTarget.querySelector('input');
  if (input.value.trim()) input.value = '';
  input.placeholder = '검색 데모입니다 — 메뉴에서 공간을 둘러보세요';
});

const revealItems = [...document.querySelectorAll('.reveal')];
revealItems.forEach((item, index) => item.style.setProperty('--delay', `${(index % 3) * 70}ms`));

if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const roomStory = document.querySelector('.room-hero-pin');
const roomPanels = [...document.querySelectorAll('.room-hero')];
let roomPinPositions = [];
let roomTextFramePending = false;

const measureRoomPanels = () => {
  if (!roomStory) return;
  const storyTop = roomStory.getBoundingClientRect().top + window.scrollY;
  let flowOffset = 0;

  roomPinPositions = roomPanels.map((panel, index) => {
    if (index > 0) {
      const previousPanel = roomPanels[index - 1];
      const marginTop = Number.parseFloat(getComputedStyle(panel).marginTop) || 0;
      flowOffset += previousPanel.offsetHeight + marginTop;
    }

    return storyTop + flowOffset;
  });
};

const updateRoomText = () => {
  const viewportHeight = window.innerHeight;
  const storyStart = roomPinPositions[0] ?? Number.POSITIVE_INFINITY;
  const storyEnd = storyStart + (roomStory?.offsetHeight ?? 0);
  let activePanelIndex = -1;

  if (window.scrollY >= storyStart && window.scrollY < storyEnd) {
    roomPinPositions.forEach((position, index) => {
      if (window.scrollY >= position) activePanelIndex = index;
    });
  }

  roomPanels.forEach((panel, index) => {
    panel.classList.toggle('is-current', index === activePanelIndex);

    if (reduceMotion) {
      panel.style.setProperty('--room-text-clip', '0%');
      return;
    }
    const pinProgress = (window.scrollY - roomPinPositions[index]) / viewportHeight;
    const textProgress = Math.min(1, Math.max(0, (pinProgress - 0.5) / 0.5));
    panel.style.setProperty('--room-text-clip', `${(1 - textProgress) * 100}%`);
  });
  roomTextFramePending = false;
};

const requestRoomTextUpdate = () => {
  if (roomTextFramePending) return;
  roomTextFramePending = true;
  requestAnimationFrame(updateRoomText);
};

const refreshRoomText = () => {
  roomTextFramePending = false;
  measureRoomPanels();
  updateRoomText();

  // 해시 점프·뒤로가기·레이아웃 복원은 한 프레임 뒤 위치가 확정될 수 있다.
  requestAnimationFrame(() => {
    measureRoomPanels();
    updateRoomText();
  });
};

measureRoomPanels();
updateRoomText();
window.addEventListener('load', refreshRoomText);
window.addEventListener('resize', refreshRoomText);
window.addEventListener('pageshow', refreshRoomText);
window.addEventListener('hashchange', refreshRoomText);
window.addEventListener('popstate', refreshRoomText);
window.addEventListener('scrollend', refreshRoomText, { passive: true });
window.addEventListener('scroll', requestRoomTextUpdate, { passive: true });

document.fonts?.ready.then(refreshRoomText);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) refreshRoomText();
});

document.querySelectorAll('.room-index nav a').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href')?.slice(1);
    const targetIndex = roomPanels.findIndex((panel) => panel.id === targetId);
    if (targetIndex < 0) return;

    event.preventDefault();
    measureRoomPanels();
    history.pushState(null, '', `#${targetId}`);
    window.scrollTo({
      // 핀 시작 후 0.5vh 대기 + 0.5vh 리빌이 끝난 지점으로 이동한다.
      top: roomPinPositions[targetIndex] + window.innerHeight,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  });
});

const parallaxItems = [...document.querySelectorAll('[data-parallax]')];
let framePending = false;
const updateParallax = () => {
  parallaxItems.forEach((item) => {
    const rect = item.parentElement.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    item.style.setProperty('--parallax-y', `${(progress - 0.5) * 7}%`);
  });
  framePending = false;
};

if (!reduceMotion) {
  window.addEventListener('scroll', () => {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(updateParallax);
  }, { passive: true });
  updateParallax();
}
