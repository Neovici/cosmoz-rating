import { component, html } from '@pionjs/pion';
import useRating from './hooks/use-rating';
import { styles } from './rating.css';
import { CosmozRatingElement } from '../types/cosmoz-rating.types';

const Rating = (host: CosmozRatingElement) => {
	const { maxRating, renderStar, handleComponentLeave } = useRating(host);

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
