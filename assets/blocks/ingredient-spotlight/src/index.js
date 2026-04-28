const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;
import Edit from './edit';

registerBlockType( 'wp-rig/ingredient-spotlight', {
	apiVersion: 2,
	title: __( 'Ingredient Spotlight', 'wp-rig' ),
	edit: Edit,
	save() {
		return null;
	},
} );
