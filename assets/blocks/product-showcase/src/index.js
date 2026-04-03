const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;
import Edit from './edit';

registerBlockType( 'wp-rig/product-showcase', {
	apiVersion: 2,
	title: __( 'Product Showcase', 'wp-rig' ),
	edit: Edit,
	save() {
		return null;
	},
} );
