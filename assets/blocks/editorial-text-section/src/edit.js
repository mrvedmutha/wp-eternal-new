import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextareaControl } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps( {
		className: 'editorial-text-section-editor',
	} );
	const { eyebrowText, bodyParagraph1, bodyParagraph2, pullQuoteText } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title="Editorial Text Section" initialOpen={ true }>
					<TextareaControl
						label="Eyebrow Label"
						value={ eyebrowText }
						onChange={ ( val ) => setAttributes( { eyebrowText: val } ) }
						rows={ 2 }
					/>
					<TextareaControl
						label="Body — Paragraph 1"
						value={ bodyParagraph1 }
						onChange={ ( val ) => setAttributes( { bodyParagraph1: val } ) }
						rows={ 4 }
					/>
					<TextareaControl
						label="Body — Paragraph 2"
						value={ bodyParagraph2 }
						onChange={ ( val ) => setAttributes( { bodyParagraph2: val } ) }
						rows={ 4 }
					/>
					<TextareaControl
						label="Pull Quote"
						value={ pullQuoteText }
						onChange={ ( val ) => setAttributes( { pullQuoteText: val } ) }
						rows={ 3 }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<p className="editorial-text-section-editor__eyebrow">
					{ eyebrowText }
				</p>
				<div className="editorial-text-section-editor__body">
					<p className="editorial-text-section-editor__body-p">{ bodyParagraph1 }</p>
					<p className="editorial-text-section-editor__body-p">{ bodyParagraph2 }</p>
				</div>
				<p className="editorial-text-section-editor__pull-quote">
					{ pullQuoteText }
				</p>
			</div>
		</>
	);
}
