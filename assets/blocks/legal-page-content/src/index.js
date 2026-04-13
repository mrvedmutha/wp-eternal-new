// Use WP globals
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const { registerBlockType } = (wp).blocks;
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const { __ } = (wp).i18n;
import Edit from './edit';
import { RichText, InnerBlocks } from '@wordpress/block-editor';

registerBlockType('wp-rig/legal-page-content', {
	apiVersion: 2,
	title: __('Legal Page Content', 'wp-rig'),
	edit: Edit,
	save({ attributes }) {
		const { heroLabel, heroHeading, heroLastUpdated } = attributes;

		return (
			<div className="legal-page-content">
				<section className="legal-page-content__hero">
					<RichText.Content
						tagName="p"
						className="legal-page-content__hero-label"
						value={ heroLabel }
					/>
					{heroHeading && (
						<RichText.Content
							tagName="h1"
							className="legal-page-content__hero-heading"
							value={ heroHeading }
						/>
					)}
					{heroLastUpdated && (
						<p className="legal-page-content__hero-date">
							{heroLastUpdated}
						</p>
					)}
				</section>

				<section className="legal-page-content__content">
					<div className="legal-page-content__content-inner">
						<InnerBlocks.Content />
					</div>
				</section>
			</div>
		);
	},
});
