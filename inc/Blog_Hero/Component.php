<?php
/**
 * WP_Rig\WP_Rig\Blog_Hero\Component class
 *
 * Placeholder component for the wp-rig/blog-hero block.
 * Block is registered via inc/Blocks/Component.php.
 *
 * @package wp_rig
 */

namespace WP_Rig\WP_Rig\Blog_Hero;

use WP_Rig\WP_Rig\Component_Interface;

/**
 * Class for Blog Hero component.
 */
class Component implements Component_Interface {

	/**
	 * Gets the unique identifier for the theme component.
	 *
	 * @return string Component slug.
	 */
	public function get_slug(): string {
		return 'blog-hero';
	}

	/**
	 * Adds the action and filter hooks to integrate with WordPress.
	 */
	public function initialize(): void {
		// Block registration is handled by inc/Blocks/Component.php.
	}
}
