/**
 * Header — scroll behaviour & currency switcher toggle.
 *
 * Responsibilities:
 *  1. Transparent → sticky state switch (adds .is-scrolled once user scrolls
 *     past the hero viewport).
 *  2. Scroll-direction hide/show on ALL page types (yPercent via GSAP).
 *  3. Currency dropdown open/close toggle.
 *
 * Dependencies: gsap, gsap/ScrollTrigger (installed via npm install gsap).
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin( ScrollTrigger );

document.addEventListener( 'DOMContentLoaded', () => {
	const header = document.getElementById( 'masthead' );
	if ( ! header ) return;

	const isTransparentPage = document.body.classList.contains(
		'has-transparent-header'
	);

	// ── 1. Transparent → sticky state switch ─────────────────────────────────
	// Only fires on pages that start with a transparent header.
	if ( isTransparentPage ) {
		ScrollTrigger.create( {
			start: 'top -80px', // trigger once user scrolls 80px past top
			onEnter() {
				header.classList.add( 'is-scrolled' );
			},
			onLeaveBack() {
				header.classList.remove( 'is-scrolled' );
			},
		} );
	}

	// ── 2. Scroll-direction hide / show ──────────────────────────────────────
	// Hides header on scroll-down, reveals on scroll-up.
	// A small threshold prevents accidental triggers on tiny scroll jitters.
	const THRESHOLD = 5; // px/s velocity threshold
	let hidden = false;

	// Always measure and expose header height so the search megamenu can
	// position itself flush with the bottom of the header on all page types.
	const headerH = header.getBoundingClientRect().height;
	document.documentElement.style.setProperty( '--header-height', `${ headerH }px` );

	ScrollTrigger.create( {
		start: 'top top',
		onUpdate( self ) {
			const velocity = self.getVelocity();

			if ( velocity > THRESHOLD && ! hidden ) {
				// Scrolling DOWN — hide header.
				gsap.to( header, {
					yPercent: -100,
					duration: 0.4,
					ease: 'power2.out',
					overwrite: true,
				} );
				hidden = true;
			} else if ( velocity < -THRESHOLD && hidden ) {
				// Scrolling UP — reveal header.
				gsap.to( header, {
					yPercent: 0,
					duration: 0.35,
					ease: 'power2.out',
					overwrite: true,
				} );
				hidden = false;
			}
		},
	} );

	// ── 3. Sidebar toggle ────────────────────────────────────────────────────
	const hamburger = document.getElementById( 'header-hamburger' );
	const sidebar = document.getElementById( 'site-sidebar' );
	const sidebarOverlay = document.getElementById( 'site-sidebar-overlay' );
	const sidebarClose = document.getElementById( 'site-sidebar-close' );

	if ( hamburger && sidebar && sidebarOverlay ) {
		function openSidebar() {
			sidebar.classList.add( 'is-open' );
			sidebarOverlay.classList.add( 'is-open' );
			sidebar.setAttribute( 'aria-hidden', 'false' );
			sidebarOverlay.setAttribute( 'aria-hidden', 'false' );
			hamburger.setAttribute( 'aria-expanded', 'true' );
			document.body.classList.add( 'sidebar-open' );
			sidebarClose && sidebarClose.focus();
		}

		function closeSidebar() {
			sidebar.classList.remove( 'is-open' );
			sidebarOverlay.classList.remove( 'is-open' );
			sidebar.setAttribute( 'aria-hidden', 'true' );
			sidebarOverlay.setAttribute( 'aria-hidden', 'true' );
			hamburger.setAttribute( 'aria-expanded', 'false' );
			document.body.classList.remove( 'sidebar-open' );
			hamburger.focus();
		}

		hamburger.addEventListener( 'click', openSidebar );
		sidebarClose && sidebarClose.addEventListener( 'click', closeSidebar );
		sidebarOverlay.addEventListener( 'click', closeSidebar );

		document.addEventListener( 'keydown', ( e ) => {
			if ( e.key === 'Escape' && sidebar.classList.contains( 'is-open' ) ) {
				closeSidebar();
			}
		} );
	}

	// ── 3b. Sidebar submenu accordion ────────────────────────────────────────
	// Parent items with children toggle their sub-menu instead of navigating —
	// the sub-menu's own injected first link (see Nav_Menus\Component) covers
	// visiting the parent's own URL.
	const sidebarMenu = document.getElementById( 'sidebar-menu' );

	if ( sidebarMenu ) {
		sidebarMenu.querySelectorAll( ':scope > li.menu-item-has-children' ).forEach( ( item ) => {
			const trigger = item.querySelector( ':scope > a' );
			const subMenu = item.querySelector( ':scope > .sub-menu' );

			if ( ! trigger || ! subMenu ) return;

			trigger.setAttribute( 'aria-expanded', 'false' );

			trigger.addEventListener( 'click', ( e ) => {
				e.preventDefault();

				const isOpen = item.classList.contains( 'is-open' );

				if ( isOpen ) {
					item.classList.remove( 'is-open' );
					subMenu.style.maxHeight = '0';
					trigger.setAttribute( 'aria-expanded', 'false' );
				} else {
					item.classList.add( 'is-open' );
					subMenu.style.maxHeight = subMenu.scrollHeight + 'px';
					trigger.setAttribute( 'aria-expanded', 'true' );
				}
			} );
		} );
	}

	// ── 3c. Sidebar currency accordion ───────────────────────────────────────
	const sidebarCurrency = document.querySelector( '.site-sidebar__currency' );

	if ( sidebarCurrency ) {
		const currencyTriggerEl = sidebarCurrency.querySelector( '.site-sidebar__currency-trigger' );
		const currencyList      = sidebarCurrency.querySelector( '.site-sidebar__currency-list' );

		if ( currencyTriggerEl && currencyList ) {
			currencyTriggerEl.addEventListener( 'click', () => {
				const isOpen = sidebarCurrency.classList.contains( 'is-open' );

				if ( isOpen ) {
					sidebarCurrency.classList.remove( 'is-open' );
					currencyList.style.maxHeight = '0';
					currencyTriggerEl.setAttribute( 'aria-expanded', 'false' );
				} else {
					sidebarCurrency.classList.add( 'is-open' );
					currencyList.style.maxHeight = currencyList.scrollHeight + 'px';
					currencyTriggerEl.setAttribute( 'aria-expanded', 'true' );
				}
			} );
		}
	}

	// ── 4. Currency dropdown toggle ──────────────────────────────────────────
	const currencyTrigger = header.querySelector( '.header-currency__trigger' );
	const currencyDropdown = header.querySelector( '.header-currency__dropdown' );

	if ( currencyTrigger && currencyDropdown ) {
		currencyTrigger.addEventListener( 'click', () => {
			const isOpen = currencyTrigger.getAttribute( 'aria-expanded' ) === 'true';

			if ( isOpen ) {
				closeDropdown();
			} else {
				openDropdown();
			}
		} );

		// Close on outside click.
		document.addEventListener( 'click', ( e ) => {
			if (
				! currencyTrigger.contains( e.target ) &&
				! currencyDropdown.contains( e.target )
			) {
				closeDropdown();
			}
		} );

		// Close on Escape.
		document.addEventListener( 'keydown', ( e ) => {
			if ( e.key === 'Escape' ) closeDropdown();
		} );
	}

	function openDropdown() {
		currencyDropdown.removeAttribute( 'hidden' );
		currencyTrigger.setAttribute( 'aria-expanded', 'true' );
		gsap.fromTo(
			currencyDropdown,
			{ opacity: 0, y: -6 },
			{ opacity: 1, y: 0, duration: 0.2, ease: 'power1.out' }
		);
	}

	function closeDropdown() {
		gsap.to( currencyDropdown, {
			opacity: 0,
			y: -6,
			duration: 0.15,
			ease: 'power1.in',
			onComplete() {
				currencyDropdown.setAttribute( 'hidden', '' );
			},
		} );
		currencyTrigger.setAttribute( 'aria-expanded', 'false' );
	}
} );
