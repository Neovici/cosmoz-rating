import { html } from '@pionjs/pion';
import '../src/index.js';
import '../demo/interactive-rating.js';

interface CosmozRatingProps {
	rating: number | null;
	disabled: boolean;
	maxRating: number;
}

export default {
	title: 'Components/CosmozRating',
	tags: ['autodocs'],
	component: 'cosmoz-rating',
	argTypes: {
		rating: {
			control: { type: 'number', min: 0, max: 5 },
			description: 'The current rating value (null for unrated)',
		},
		disabled: {
			control: 'boolean',
			description: 'Disable the rating component',
		},
		maxRating: {
			control: { type: 'number', min: 1, max: 10 },
			description: 'Maximum number of stars',
		},
	},
	parameters: {
		controls: {
			disable: true,
		},
	},
};

const Template = ({ rating, disabled, maxRating }: CosmozRatingProps) => {
	return html`
		<div>
			<cosmoz-rating
				rating="${rating || ''}"
				?disabled="${disabled}"
				max-rating="${maxRating || 5}"
				@rating="${(e: CustomEvent) => {
					// eslint-disable-next-line no-console
					console.log('Rating changed:', e.detail.rating);
				}}"
			>
			</cosmoz-rating>

			<h2>${rating}</h2>
		</div>
	`;
};

export const Interactive = () => html`<interactive-demo></interactive-demo>`;

export const Disabled = () =>
	Template({
		rating: 2.8,
		disabled: true,
		maxRating: 5,
	});

export const CustomMaxRating = () =>
	Template({
		rating: 7.5,
		disabled: false,
		maxRating: 10,
	});

export const FractionalRating = () =>
	Template({
		rating: 3.4,
		disabled: true,
		maxRating: 5,
	});
