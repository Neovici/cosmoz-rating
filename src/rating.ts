import { component, html } from '@pionjs/pion';
import useRating from './hooks/use-rating';
import { styles } from './rating.css';
import { CosmozRatingProps } from './types';

const Rating = (props: CosmozRatingProps) => {
	const { maxRating, renderStar, handleComponentLeave } = useRating(props);

	return html`
		<div class="rating-container" @mouseleave=${handleComponentLeave}>
			${Array.from({ length: maxRating }, (_, index) => renderStar(index))}
		</div>
	`;
};

const CosmozRating = component(Rating, {
	observedAttributes: ['rating', 'disabled', 'max-rating'],
	useShadowDOM: true,
	styleSheets: [styles],
});

customElements.define('cosmoz-rating', CosmozRating);

export { CosmozRating };
export default CosmozRating;
