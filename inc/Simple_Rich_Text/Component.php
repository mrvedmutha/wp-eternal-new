<?php
/**
 * WP_Rig\WP_Rig\Simple_Rich_Text\Component class
 *
 * Placeholder component for the wp-rig/simple-rich-text block.
 * The block's viewScript (build/view.js) is auto-enqueued by WordPress
 * when the block is present on a page — no manual enqueueing needed.
 *
 * @package wp_rig
 *
 * @js-file assets/blocks/simple-rich-text/src/view.js  GSAP one-shot word reveal
 */

namespace WP_Rig\WP_Rig\Simple_Rich_Text;

use WP_Rig\WP_Rig\Component_Interface;

/**
 * Class for Simple Rich Text component.
 */
class Component implements Component_Interface {

	/**
	 * Gets the unique identifier for the theme component.
	 *
	 * @return string Component slug.
	 */
	public function get_slug(): string {
		return 'simple-rich-text';
	}

	/**
	 * Adds the action and filter hooks to integrate with WordPress.
	 */
	public function initialize(): void {
		// Block registration is handled by inc/Blocks/Component.php.
		// JS is auto-loaded via viewScript in block.json.
	}
}
