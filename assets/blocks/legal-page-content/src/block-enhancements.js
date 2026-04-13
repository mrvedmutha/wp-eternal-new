/**
 * Block Enhancements for Legal Page Content
 * Adds underline toggle to heading blocks within the Legal Page Content block
 */

import { __ } from '@wordpress/i18n';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Add custom attribute to core/heading block
 */
const addHeadingUnderlineAttribute = (settings, name) => {
	// Only apply to core/heading block
	if (name !== 'core/heading') {
		return settings;
	}

	// Add the custom attribute
	return {
		...settings,
		attributes: {
			...settings.attributes,
			hasUnderline: {
				type: 'boolean',
				default: true,
			},
		},
	};
};

addFilter(
	'blocks.registerBlockType',
	'wp-rig/legal-page-content/heading-underline-attribute',
	addHeadingUnderlineAttribute
);

/**
 * Add the underline toggle control to the heading block inspector
 */
const addHeadingUnderlineControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { name, attributes, setAttributes, isSelected } = props;

		// Only apply to core/heading block and when selected
		if (name !== 'core/heading' || !isSelected) {
			return <BlockEdit {...props} />;
		}

		const { hasUnderline } = attributes;

		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody
						title={__('Heading Style', 'wp-rig')}
						initialOpen={true}
					>
						<ToggleControl
							label={__('Show Underline', 'wp-rig')}
							checked={hasUnderline !== false}
							onChange={(value) =>
								setAttributes({ hasUnderline: value })
							}
							help={hasUnderline === false
								? __('Underline is hidden', 'wp-rig')
								: __('Underline is visible', 'wp-rig')
							}
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'addHeadingUnderlineControl');

addFilter(
	'editor.BlockEdit',
	'wp-rig/legal-page-content/heading-underline-control',
	addHeadingUnderlineControl
);

/**
 * Add CSS class to the block based on hasUnderline attribute
 */
const addHeadingUnderlineClass = (extraProps, blockType, attributes) => {
	// Only apply to core/heading block
	if (blockType.name !== 'core/heading') {
		return extraProps;
	}

	const { hasUnderline } = attributes;

	// Add class based on attribute value
	if (hasUnderline === false) {
		extraProps.className = extraProps.className
			? `${extraProps.className} has-no-underline`
			: 'has-no-underline';
	} else {
		extraProps.className = extraProps.className
			? `${extraProps.className} has-underline`
			: 'has-underline';
	}

	return extraProps;
};

addFilter(
	'blocks.getSaveContent.extraProps',
	'wp-rig/legal-page-content/heading-underline-class',
	addHeadingUnderlineClass
);
