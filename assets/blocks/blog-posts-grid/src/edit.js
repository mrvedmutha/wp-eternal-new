import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, RangeControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';

export default function Edit( { name, attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const { sectionHeading, postsPerPage } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title="Settings" initialOpen={ true }>
					<TextControl
						label="Section Heading"
						value={ sectionHeading }
						onChange={ ( val ) => setAttributes( { sectionHeading: val } ) }
					/>
					<RangeControl
						label="Posts Per Page"
						value={ postsPerPage }
						onChange={ ( val ) => setAttributes( { postsPerPage: val } ) }
						min={ 3 }
						max={ 24 }
						step={ 3 }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<ServerSideRender block={ name } attributes={ attributes } />
			</div>
		</>
	);
}
