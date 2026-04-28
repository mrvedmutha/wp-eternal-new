const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;
import Edit from './edit';

registerBlockType( 'wp-rig/blog-posts-grid', {
	apiVersion: 2,
	title: __( 'Blog Posts Grid', 'wp-rig' ),
	edit: Edit,
	save() {
		return null;
	},
} );
