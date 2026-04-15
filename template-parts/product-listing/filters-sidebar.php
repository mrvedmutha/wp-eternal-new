<?php
/**
 * Filter Sidebar - Plugin Integration
 *
 * Uses Eternal Product Category Filter plugin's built-in frontend functionality.
 * Plugin provides: eternalFiltersData global, REST API, complete frontend system.
 *
 * @package wp_rig
 */

use function WP_Rig\WP_Rig\wp_rig;

// Check if Eternal Product Category Filter plugin is active.
// Simple check: see if the plugin's main class or function exists.
$plugin_active = false;

// Check if plugin is active via WordPress active plugins list.
$active_plugins = get_option( 'active_plugins', array() );
foreach ( $active_plugins as $active_plugin ) {
	if ( strpos( $active_plugin, 'eternal-product-category-filter.php' ) !== false ) {
		$plugin_active = true;
		break;
	}
}

// Alternative: check if the REST API route is registered.
if ( ! $plugin_active ) {
	$rest_server = rest_get_server();
	if ( $rest_server ) {
		$routes        = $rest_server->get_routes();
		$plugin_active = isset( $routes['/eternal-filters/v1/category/(?P<id>[\d]+)/filters'] );
	}
}

// Always render filters container - plugin will populate it via JavaScript.
?>
<div class="plp-filters" data-node-id="694-1732">
	<div class="plp-filters__inner">

		<?php if ( $plugin_active ) : ?>
			<!-- Plugin Active: Use custom filter UI with REST API -->
			<div id="plp-filters-container">
				<p class="plp-filters__loading">
					<?php esc_html_e( 'Loading filters...', 'wp-rig' ); ?>
				</p>
			</div>

		<?php else : ?>
			<!-- Plugin Inactive: Show fallback -->
			<div class="plp-filters__fallback">
				<div class="plp-filters__fallback-title">
					<?php esc_html_e( 'Filter', 'wp-rig' ); ?>
				</div>
				<div class="plp-filters__fallback-message">
					<?php esc_html_e( 'Filter not found', 'wp-rig' ); ?>
				</div>
			</div>
		<?php endif; ?>

	</div><!-- .plp-filters__inner -->
</div><!-- .plp-filters -->