const { useBlockProps, InspectorControls } = wp.blockEditor;
const { PanelBody, RangeControl, TextControl } = wp.components;
import ServerSideRender from '@wordpress/server-side-render';

export default function Edit( { name, attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const { postsCount, discoverUrl, headingText } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title="Settings" initialOpen={ true }>
					<TextControl
						label="Section Heading"
						value={ headingText }
						onChange={ ( val ) => setAttributes( { headingText: val } ) }
					/>
					<RangeControl
						label="Number of posts"
						value={ postsCount }
						onChange={ ( val ) => setAttributes( { postsCount: val } ) }
						min={ 1 }
						max={ 6 }
						step={ 1 }
					/>
					<TextControl
						label="Discover More URL"
						value={ discoverUrl }
						onChange={ ( val ) => setAttributes( { discoverUrl: val } ) }
						help="Link for the 'Discover More' button. Default: /blogs"
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<ServerSideRender block={ name } attributes={ attributes } />
			</div>
		</>
	);
}
