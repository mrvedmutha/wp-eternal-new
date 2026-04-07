<?php
/**
 * WP_Rig\WP_Rig\Editorial_Wide_Text_Section\Component class
 *
 * Placeholder component for the wp-rig/editorial-wide-text-section block.
 * Block registration is auto-detected by inc/Blocks/Component.php via block.json.
 *
 * @package wp_rig
 */

namespace WP_Rig\WP_Rig\Editorial_Wide_Text_Section;

use WP_Rig\WP_Rig\Component_Interface;

/**
 * Class for Editorial Wide Text Section component.
 */
class Component implements Component_Interface {

	/**
	 * Gets the unique identifier for the theme component.
	 *
	 * @return string Component slug.
	 */
	public function get_slug(): string {
		return 'editorial-wide-text-section';
	}

	/**
	 * Adds the action and filter hooks to integrate with WordPress.
	 */
	public function initialize(): void {
		// Block registration is handled by inc/Blocks/Component.php.
	}
}
