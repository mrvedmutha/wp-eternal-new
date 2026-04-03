import { useBlockProps } from '@wordpress/block-editor';
import { RichText } from '@wordpress/block-editor';

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps( {
		className: 'simple-rich-text-editor',
	} );

	const { heading, bodyPrimary, bodySecondary } = attributes;

	return (
		<div { ...blockProps }>
			<RichText
				tagName="h2"
				className="simple-rich-text-editor__heading"
				value={ heading }
				onChange={ ( val ) => setAttributes( { heading: val } ) }
				placeholder="Heading…"
				allowedFormats={ [] }
			/>
			<RichText
				tagName="p"
				className="simple-rich-text-editor__body"
				value={ bodyPrimary }
				onChange={ ( val ) => setAttributes( { bodyPrimary: val } ) }
				placeholder="Body paragraph…"
				allowedFormats={ [ 'core/bold', 'core/italic' ] }
			/>
			<RichText
				tagName="p"
				className="simple-rich-text-editor__body"
				value={ bodySecondary }
				onChange={ ( val ) => setAttributes( { bodySecondary: val } ) }
				placeholder="Second paragraph…"
				allowedFormats={ [ 'core/bold', 'core/italic' ] }
			/>
		</div>
	);
}
