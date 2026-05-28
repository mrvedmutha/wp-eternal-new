<?php
/**
 * Homepage Hero Latest block — frontend render template.
 *
 * @package wp_rig
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$attributes     = is_array( $attributes ?? null ) ? $attributes : array();
$slides         = is_array( $attributes['slides'] ?? null ) ? $attributes['slides'] : array();
$slide_interval = (int) ( $attributes['slideInterval'] ?? 5000 );

if ( empty( $slides ) ) {
	return;
}

// Sanitise and resolve attachment URLs.
$clean = array();
foreach ( $slides as $slide ) {
	$desk_id  = (int) ( $slide['desktopImageId'] ?? 0 );
	$desk_url = $slide['desktopImageUrl'] ?? '';
	$mob_id   = (int) ( $slide['mobileImageId'] ?? 0 );
	$mob_url  = $slide['mobileImageUrl'] ?? '';

	if ( $desk_id ) {
		$resolved = wp_get_attachment_image_url( $desk_id, 'full' );
		if ( $resolved ) {
			$desk_url = $resolved;
		}
	}
	if ( $mob_id ) {
		$resolved = wp_get_attachment_image_url( $mob_id, 'full' );
		if ( $resolved ) {
			$mob_url = $resolved;
		}
	}

	$fallback = $desk_url ? $desk_url : $mob_url;
	if ( ! $fallback ) {
		// Skip slides with no image at all.
		continue;
	}

	$clean[] = array(
		'desktopUrl' => $desk_url,
		'mobileUrl'  => $mob_url,
		'fallback'   => $fallback,
		'heading'    => $slide['heading'] ?? '',
		'subtext'    => $slide['subtext'] ?? '',
		'ctaLabel'   => $slide['ctaLabel'] ?? 'SHOP NOW',
		'ctaUrl'     => $slide['ctaUrl'] ?? '/shop',
	);
}

if ( empty( $clean ) ) {
	return;
}

?>
<section class="hhl" data-interval="<?php echo esc_attr( $slide_interval ); ?>">

	<?php /* Background images — absolutely stacked, GSAP crossfades between them */ ?>
	<div class="hhl__slides" aria-hidden="true">
		<?php foreach ( $clean as $i => $slide ) : ?>
		<div class="hhl__slide<?php echo 0 === $i ? ' hhl__slide--first' : ''; ?>" data-index="<?php echo esc_attr( $i ); ?>">
			<picture class="hhl__bg">
				<?php if ( $slide['mobileUrl'] ) : ?>
				<source
					media="(max-width: 1024px)"
					srcset="<?php echo esc_url( $slide['mobileUrl'] ); ?>"
				>
				<?php endif; ?>
				<img
					src="<?php echo esc_url( $slide['fallback'] ); ?>"
					alt=""
					decoding="async"
					loading="<?php echo 0 === $i ? 'eager' : 'lazy'; ?>"
				>
			</picture>
		</div>
		<?php endforeach; ?>
	</div>

	<?php /* Content — direct child of section so position:sticky works */ ?>
	<div class="hhl__content">
		<?php foreach ( $clean as $i => $slide ) : ?>
		<div class="hhl__panel<?php echo 0 === $i ? ' hhl__panel--first' : ''; ?>" data-index="<?php echo esc_attr( $i ); ?>">
			<div class="hhl__text">
				<?php if ( $slide['heading'] ) : ?>
				<h1 class="hhl__heading"><?php echo esc_html( $slide['heading'] ); ?></h1>
				<?php endif; ?>
				<?php if ( $slide['subtext'] ) : ?>
				<p class="hhl__subtext"><?php echo esc_html( $slide['subtext'] ); ?></p>
				<?php endif; ?>
			</div>
			<?php if ( $slide['ctaUrl'] && $slide['ctaLabel'] ) : ?>
			<a class="hhl__cta" href="<?php echo esc_url( $slide['ctaUrl'] ); ?>">
				<span class="hhl__cta-label"><?php echo esc_html( $slide['ctaLabel'] ); ?></span>
			</a>
			<?php endif; ?>
		</div>
		<?php endforeach; ?>
	</div>

</section>
