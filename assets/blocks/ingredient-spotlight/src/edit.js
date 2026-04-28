import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';

export default function Edit( { name, attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const { sectionHeading, imageId, imageUrl, articleTitle, bodyText } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title="Content" initialOpen={ true }>
					<TextControl
						label="Section Heading"
						value={ sectionHeading }
						onChange={ ( val ) => setAttributes( { sectionHeading: val } ) }
					/>
					<TextControl
						label="Article Title (italic)"
						value={ articleTitle }
						onChange={ ( val ) => setAttributes( { articleTitle: val } ) }
					/>
					<TextareaControl
						label="Body Text"
						value={ bodyText }
						onChange={ ( val ) => setAttributes( { bodyText: val } ) }
					/>
				</PanelBody>

				<PanelBody title="Image" initialOpen={ true }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								setAttributes( {
									imageId:  media.id,
									imageUrl: media.url,
									imageAlt: media.alt || '',
								} )
							}
							allowedTypes={ [ 'image' ] }
							value={ imageId }
							render={ ( { open } ) => (
								<div>
									{ imageUrl && (
										<img src={ imageUrl } alt="" style={ { width: '100%', marginBottom: '8px' } } />
									) }
									<Button variant="secondary" onClick={ open }>
										{ imageId ? 'Replace Image' : 'Select Image' }
									</Button>
									{ imageId && (
										<Button
											variant="link"
											isDestructive
											onClick={ () => setAttributes( { imageId: 0, imageUrl: '', imageAlt: '' } ) }
											style={ { marginLeft: '8px' } }
										>
											Remove
										</Button>
									) }
								</div>
							) }
						/>
					</MediaUploadCheck>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<ServerSideRender block={ name } attributes={ attributes } />
			</div>
		</>
	);
}
