const { useBlockProps, InspectorControls } = wp.blockEditor;
const { PanelBody, RangeControl } = wp.components;
import ServerSideRender from '@wordpress/server-side-render';

export default function Edit( { name, attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const { postsCount } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title="Settings" initialOpen={ true }>
					<RangeControl
						label="Number of posts"
						value={ postsCount }
						onChange={ ( val ) => setAttributes( { postsCount: val } ) }
						min={ 1 }
						max={ 6 }
						step={ 1 }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<ServerSideRender block={ name } attributes={ attributes } />
			</div>
		</>
	);
}
