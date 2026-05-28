<?php
/**
 * Perks Strip block render template.
 *
 * Four-item trust/benefit strip. Figma node 694:5346.
 *
 * @package wp_rig
 */

declare( strict_types=1 );

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$attributes = is_array( $attributes ?? null ) ? $attributes : array();

$items = array(
	array(
		'icon_url' => esc_url( $attributes['item1IconUrl'] ?? '' ),
		'title'    => $attributes['item1Title'] ?? 'FREE SHIPPING',
		'desc'     => $attributes['item1Desc'] ?? 'Free shipping on orders above 2500 INR',
	),
	array(
		'icon_url' => esc_url( $attributes['item2IconUrl'] ?? '' ),
		'title'    => $attributes['item2Title'] ?? 'GIFTS WITH PURCHASE',
		'desc'     => $attributes['item2Desc'] ?? 'Complimentary samples with qualifying purchases',
	),
	array(
		'icon_url' => esc_url( $attributes['item3IconUrl'] ?? '' ),
		'title'    => $attributes['item3Title'] ?? 'FLEXIBLE DELIVERY',
		'desc'     => $attributes['item3Desc'] ?? 'Shop confidently with flexible payment options',
	),
	array(
		'icon_url' => esc_url( $attributes['item4IconUrl'] ?? '' ),
		'title'    => $attributes['item4Title'] ?? 'ONLINE CONSULTATION',
		'desc'     => $attributes['item4Desc'] ?? 'Book a one-on-one consultation with a Beauty Advisor',
	),
);

$wrapper_attrs = get_block_wrapper_attributes( array( 'class' => 'perks-strip-wrapper' ) );

?>
<div <?php echo $wrapper_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="perks-strip">
		<?php foreach ( $items as $item ) : ?>
			<div class="perks-strip__item">
				<?php if ( $item['icon_url'] ) : ?>
					<div class="perks-strip__icon">
						<img
							src="<?php echo esc_url( $item['icon_url'] ); ?>"
							alt=""
							class="perks-strip__icon-img"
							width="80"
							height="80"
							aria-hidden="true"
						>
					</div>
				<?php else : ?>
					<div class="perks-strip__icon perks-strip__icon--empty"></div>
				<?php endif; ?>
				<p class="perks-strip__title"><?php echo esc_html( $item['title'] ); ?></p>
				<p class="perks-strip__desc"><?php echo esc_html( $item['desc'] ); ?></p>
			</div>
		<?php endforeach; ?>
	</div>
</div>
