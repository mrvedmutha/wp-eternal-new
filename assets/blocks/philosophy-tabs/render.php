<?php
/**
 * Philosophy Tabs block — frontend render template.
 *
 * Variables provided by WordPress at include-time:
 *   $attributes (array)    Block attributes from block.json + editor input.
 *   $content    (string)   Inner blocks HTML (unused — attribute-only block).
 *   $block      (WP_Block) Block instance.
 *
 * @package wp_rig
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$attributes = is_array( $attributes ?? null ) ? $attributes : array();
$tabs_data  = $attributes['tabs'] ?? array();

if ( empty( $tabs_data ) ) {
	return;
}

// Clamp to 5 tabs.
$tabs_data = array_slice( $tabs_data, 0, 5 );

$allowed_inline = array(
	'strong' => array(),
	'em'     => array(),
	'br'     => array(),
	'a'      => array(
		'href'   => array(),
		'target' => array(),
		'rel'    => array(),
	),
);
?>
<section class="philosophy-tabs" data-pt-block>

	<?php /* ── Images ─────────────────────────────────────────────── */ ?>
	<div class="philosophy-tabs__images" aria-hidden="true">
		<?php
		foreach ( $tabs_data as $i => $tab_item ) {
			?>
			<div class="pt-image<?php echo 0 === $i ? ' is-active' : ''; ?>"
				data-pt-image="<?php echo esc_attr( $i ); ?>">
				<?php if ( ! empty( $tab_item['imageUrl'] ) ) : ?>
					<img src="<?php echo esc_url( $tab_item['imageUrl'] ); ?>"
						alt="<?php echo esc_attr( $tab_item['imageAlt'] ?? '' ); ?>"
						loading="<?php echo 0 === $i ? 'eager' : 'lazy'; ?>" />
				<?php else : ?>
					<div class="pt-image__placeholder"></div>
				<?php endif; ?>
			</div>
			<?php
		}
		?>
	</div>

	<?php /* ── Tab navigation ──────────────────────────────────────── */ ?>
	<div class="philosophy-tabs__controls">
		<nav class="pt-tab-nav" role="tablist" aria-label="<?php esc_attr_e( 'Content tabs', 'wp-rig' ); ?>">
			<?php
			foreach ( $tabs_data as $i => $tab_item ) {
				?>
				<button class="pt-tab-btn<?php echo 0 === $i ? ' is-active' : ''; ?>"
					role="tab"
					aria-selected="<?php echo 0 === $i ? 'true' : 'false'; ?>"
					aria-controls="pt-panel-<?php echo esc_attr( $i ); ?>"
					id="pt-tab-<?php echo esc_attr( $i ); ?>"
					data-pt-tab="<?php echo esc_attr( $i ); ?>">
					<?php echo esc_html( $tab_item['label'] ?? '' ); ?>
				</button>
				<?php
			}
			?>
		</nav>
		<hr class="pt-divider" />
	</div>

	<?php /* ── Content panels ──────────────────────────────────────── */ ?>
	<div class="philosophy-tabs__content">
		<?php
		foreach ( $tabs_data as $i => $tab_item ) {
			?>
			<div class="pt-panel<?php echo 0 === $i ? ' is-active' : ''; ?>"
				role="tabpanel"
				id="pt-panel-<?php echo esc_attr( $i ); ?>"
				aria-labelledby="pt-tab-<?php echo esc_attr( $i ); ?>"
				data-pt-panel="<?php echo esc_attr( $i ); ?>">
				<h3 class="pt-panel__heading">
					<?php echo esc_html( $tab_item['heading'] ?? '' ); ?>
				</h3>
				<div class="pt-panel__body">
					<p><?php echo wp_kses( $tab_item['body'] ?? '', $allowed_inline ); ?></p>
				</div>
			</div>
			<?php
		}
		?>
	</div>

</section>
