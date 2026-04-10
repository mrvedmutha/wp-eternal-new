<?php
/**
 * Filter Sidebar - UI Template Only
 *
 * Displays filter options for product category pages.
 * Note: This is UI-only. Actual filtering logic deferred to Phase 2.
 *
 * @package wp_rig
 */

?>
<div class="plp-filters" data-node-id="694-1732">
	<div class="plp-filters__inner">

		<!-- Clear All Link -->
		<div class="plp-filters__clear" data-node-id="694-1733">
			<a href="#"><?php esc_html_e( 'CLEAR ALL', 'wp-rig' ); ?></a>
		</div>

		<!-- Sort By Dropdown -->
		<div class="plp-filters__sort-group" data-node-id="694-1735">
			<div class="plp-filters__sort-label">
				<?php esc_html_e( 'SORT BY:', 'wp-rig' ); ?>
			</div>
			<div class="plp-filters__sort-dropdown" data-node-id="694-1738">
				<select class="plp-filters__sort-select" aria-label="<?php esc_attr_e( 'Sort products', 'wp-rig' ); ?>">
					<option value=""><?php esc_html_e( 'Highest Rated', 'wp-rig' ); ?></option>
					<option value="popularity"><?php esc_html_e( 'Popularity', 'wp-rig' ); ?></option>
					<option value="price-desc"><?php esc_html_e( 'Price: High to Low', 'wp-rig' ); ?></option>
					<option value="price-asc"><?php esc_html_e( 'Price: Low to High', 'wp-rig' ); ?></option>
					<option value="date"><?php esc_html_e( 'Newest', 'wp-rig' ); ?></option>
				</select>
				<span class="plp-filters__sort-chevron" aria-hidden="true">
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M4 6L8 10L12 6" stroke="#021f1d" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</span>
			</div>
		</div>

		<!-- Divider after Sort By -->
		<div class="plp-filters__divider" data-node-id="694-1743"></div>

		<!-- Filter Groups -->
		<div class="plp-filters__groups">

			<!-- Product Types -->
			<div class="plp-filters__group" data-node-id="694-1744">
				<div class="plp-filters__group-title">
					<?php esc_html_e( 'PRODUCT TYPES', 'wp-rig' ); ?>
				</div>
				<div class="plp-filters__group-content">
					<label class="plp-filters__checkbox">
						<input type="checkbox" name="product_type" value="face-creme">
						<span class="plp-filters__checkbox-box"></span>
						<span class="plp-filters__checkbox-label"><?php esc_html_e( 'Face Creme', 'wp-rig' ); ?></span>
					</label>
					<label class="plp-filters__checkbox plp-filters__checkbox--checked">
						<input type="checkbox" name="product_type" value="body-oil" checked>
						<span class="plp-filters__checkbox-box"></span>
						<span class="plp-filters__checkbox-label"><?php esc_html_e( 'Body Oil', 'wp-rig' ); ?></span>
					</label>
					<label class="plp-filters__checkbox">
						<input type="checkbox" name="product_type" value="hair-body-serum">
						<span class="plp-filters__checkbox-box"></span>
						<span class="plp-filters__checkbox-label"><?php esc_html_e( 'Hair & Body Serum', 'wp-rig' ); ?></span>
					</label>
					<label class="plp-filters__checkbox">
						<input type="checkbox" name="product_type" value="essential-oil">
						<span class="plp-filters__checkbox-box"></span>
						<span class="plp-filters__checkbox-label"><?php esc_html_e( 'Essential Oil', 'wp-rig' ); ?></span>
					</label>
				</div>
			</div>

			<!-- Divider after Product Types -->
			<div class="plp-filters__divider" data-node-id="694-1761"></div>

			<!-- Skin Type -->
			<div class="plp-filters__group" data-node-id="694-1762">
				<div class="plp-filters__group-title">
					<?php esc_html_e( 'SKIN TYPE', 'wp-rig' ); ?>
				</div>
				<div class="plp-filters__group-content">
					<label class="plp-filters__checkbox">
						<input type="checkbox" name="skin_type" value="all">
						<span class="plp-filters__checkbox-box"></span>
						<span class="plp-filters__checkbox-label"><?php esc_html_e( 'All Skin Types', 'wp-rig' ); ?></span>
					</label>
					<label class="plp-filters__checkbox">
						<input type="checkbox" name="skin_type" value="dry">
						<span class="plp-filters__checkbox-box"></span>
						<span class="plp-filters__checkbox-label"><?php esc_html_e( 'Dry Skin', 'wp-rig' ); ?></span>
					</label>
					<label class="plp-filters__checkbox">
						<input type="checkbox" name="skin_type" value="sensitive">
						<span class="plp-filters__checkbox-box"></span>
						<span class="plp-filters__checkbox-label"><?php esc_html_e( 'Sensitive Skin', 'wp-rig' ); ?></span>
					</label>
					<label class="plp-filters__checkbox">
						<input type="checkbox" name="skin_type" value="hair-scalp">
						<span class="plp-filters__checkbox-box"></span>
						<span class="plp-filters__checkbox-label"><?php esc_html_e( 'Hair & Scalp Care', 'wp-rig' ); ?></span>
					</label>
				</div>
			</div>

			<!-- Divider after Skin Type -->
			<div class="plp-filters__divider" data-node-id="694-1778"></div>

			<!-- Benefits -->
			<div class="plp-filters__group" data-node-id="694-1779">
				<div class="plp-filters__group-title">
					<?php esc_html_e( 'BENEFITS', 'wp-rig' ); ?>
				</div>
				<div class="plp-filters__group-content">
					<label class="plp-filters__checkbox">
						<input type="checkbox" name="benefit" value="hydration">
						<span class="plp-filters__checkbox-box"></span>
						<span class="plp-filters__checkbox-label"><?php esc_html_e( 'Hydration', 'wp-rig' ); ?></span>
					</label>
					<label class="plp-filters__checkbox">
						<input type="checkbox" name="benefit" value="nourishment">
						<span class="plp-filters__checkbox-box"></span>
						<span class="plp-filters__checkbox-label"><?php esc_html_e( 'Nourishment', 'wp-rig' ); ?></span>
					</label>
					<label class="plp-filters__checkbox">
						<input type="checkbox" name="benefit" value="radiance">
						<span class="plp-filters__checkbox-box"></span>
						<span class="plp-filters__checkbox-label"><?php esc_html_e( 'Radiance', 'wp-rig' ); ?></span>
					</label>
					<label class="plp-filters__checkbox">
						<input type="checkbox" name="benefit" value="firmness">
						<span class="plp-filters__checkbox-box"></span>
						<span class="plp-filters__checkbox-label"><?php esc_html_e( 'Firmness & Renewal', 'wp-rig' ); ?></span>
					</label>
					<label class="plp-filters__checkbox">
						<input type="checkbox" name="benefit" value="revitalising">
						<span class="plp-filters__checkbox-box"></span>
						<span class="plp-filters__checkbox-label"><?php esc_html_e( 'Revitalising Care', 'wp-rig' ); ?></span>
					</label>
				</div>
			</div>

		</div><!-- .plp-filters__groups -->

	</div><!-- .plp-filters__inner -->
</div><!-- .plp-filters -->
