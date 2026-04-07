const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;
import Edit from './edit';

registerBlockType( 'wp-rig/pdp-feature-advance', {
	apiVersion: 2,
	title: __( 'PDP Feature Advance', 'wp-rig' ),
	edit: Edit,
	// Server-side rendered — no client-side save needed.
	save: () => null,
} );
