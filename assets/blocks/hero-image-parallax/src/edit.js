import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor'; // eslint-disable-line prettier/prettier
import { PanelBody, Button } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';

export default function Edit({ name, attributes, setAttributes }) {
	const blockProps = useBlockProps();
	const { heroImageId, heroImageUrl, heroMobileImageId, heroMobileImageUrl } =
		attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title="Desktop Image" initialOpen={true}>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) =>
								setAttributes({
									heroImageId: media.id,
									heroImageUrl: media.url,
								})
							}
							allowedTypes={['image']}
							value={heroImageId}
							render={({ open }) => (
								<div>
									{heroImageUrl && (
										<img
											src={heroImageUrl}
											alt=""
											style={{
												width: '100%',
												marginBottom: '8px',
											}}
										/>
									)}
									<Button variant="secondary" onClick={open}>
										{heroImageId
											? 'Replace Image'
											: 'Select Image'}
									</Button>
									{heroImageId && (
										<Button
											variant="link"
											isDestructive
											onClick={() =>
												setAttributes({
													heroImageId: 0,
													heroImageUrl: '',
												})
											}
											style={{ marginLeft: '8px' }}
										>
											Remove
										</Button>
									)}
								</div>
							)}
						/>
					</MediaUploadCheck>
				</PanelBody>

				<PanelBody title="Mobile Image (Portrait)" initialOpen={false}>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) =>
								setAttributes({
									heroMobileImageId: media.id,
									heroMobileImageUrl: media.url,
								})
							}
							allowedTypes={['image']}
							value={heroMobileImageId}
							render={({ open }) => (
								<div>
									{heroMobileImageUrl && (
										<img
											src={heroMobileImageUrl}
											alt=""
											style={{
												width: '100%',
												marginBottom: '8px',
											}}
										/>
									)}
									<Button variant="secondary" onClick={open}>
										{heroMobileImageId
											? 'Replace Image'
											: 'Select Image'}
									</Button>
									{heroMobileImageId && (
										<Button
											variant="link"
											isDestructive
											onClick={() =>
												setAttributes({
													heroMobileImageId: 0,
													heroMobileImageUrl: '',
												})
											}
											style={{ marginLeft: '8px' }}
										>
											Remove
										</Button>
									)}
								</div>
							)}
						/>
					</MediaUploadCheck>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ServerSideRender block={name} attributes={attributes} />
			</div>
		</>
	);
}
