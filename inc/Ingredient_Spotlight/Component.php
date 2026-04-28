<?php
/**
 * WP_Rig\WP_Rig\Ingredient_Spotlight\Component class
 *
 * Placeholder component for the wp-rig/ingredient-spotlight block.
 * Block is registered via inc/Blocks/Component.php.
 *
 * @package wp_rig
 */

namespace WP_Rig\WP_Rig\Ingredient_Spotlight;

use WP_Rig\WP_Rig\Component_Interface;

/**
 * Class for Ingredient Spotlight component.
 */
class Component implements Component_Interface {

	/**
	 * Gets the unique identifier for the theme component.
	 *
	 * @return string Component slug.
	 */
	public function get_slug(): string {
		return 'ingredient-spotlight';
	}

	/**
	 * Adds the action and filter hooks to integrate with WordPress.
	 */
	public function initialize(): void {
		// Block registration is handled by inc/Blocks/Component.php.
	}
}
