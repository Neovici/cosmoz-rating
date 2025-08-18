import { useState, html } from '@pionjs/pion';

import { CosmozRatingElement } from '../../types/cosmoz-rating.types';

const useRating = (host: CosmozRatingElement) => {
	const [hoveredRating, setHoveredRating] = useState<number | null>(null);

	const ratingAttr = host.getAttribute('rating');
	const rating = ratingAttr ? parseFloat(ratingAttr) : null;
	const disabled = host.hasAttribute('disabled');
	const maxRatingAttr = host.getAttribute('max-rating');
	const maxRating = maxRatingAttr ? parseInt(maxRatingAttr, 10) : 5;

	const getStarClass = (starIndex: number): string => {
		const currentRating = hoveredRating ?? rating;

		if (currentRating === null || currentRating === undefined) {
			return 'star';
		}

		if (starIndex <= Math.floor(currentRating)) {
			return 'star filled';
		} else if (
			starIndex === Math.ceil(currentRating) &&
			currentRating % 1 !== 0
		) {
			return 'star partial';
		}

		return 'star';
	};

	const handleStarClick = (starRating: number) => {
		if (disabled) return;

		host.dispatchEvent(
			new CustomEvent('rating', {
				detail: { rating: starRating },
				bubbles: true,
				composed: true,
			}),
		);
	};

	const handleStarHover = (starRating: number) => {
		if (!disabled) {
			setHoveredRating(starRating);
		}
	};

	const renderStar = (index: number) => {
		const starRating = index + 1;
		const starClass = getStarClass(starRating);
		const isPartial = starClass.includes('partial');

		let fillPercentage = 0;
		if (isPartial && rating !== null) {
			fillPercentage = Math.round((rating % 1) * 100);
		}

		const starPath =
			'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

		if (isPartial) {
			return html`
				<svg
					class="${starClass}"
					@click="${() => handleStarClick(starRating)}"
					@mouseenter="${() => handleStarHover(starRating)}"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<defs>
						<clipPath id="clip-${index}">
							<rect x="0" y="0" width="${fillPercentage}%" height="100%" />
						</clipPath>
					</defs>
					<!-- Background (empty) star -->
					<path d="${starPath}" fill="var(--rating-star-color-empty)"></path>
					<!-- Partial fill (clipped) star -->
					<path
						d="${starPath}"
						fill="var(--rating-star-color)"
						clip-path="url(#clip-${index})"
					></path>
				</svg>
			`;
		}

		return html`
			<svg
				class="${starClass}"
				@click="${() => handleStarClick(starRating)}"
				@mouseenter="${() => handleStarHover(starRating)}"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="${starPath}"
					fill="${starClass.includes('filled')
						? 'var(--rating-star-color)'
						: 'var(--rating-star-color-empty)'}"
				></path>
			</svg>
		`;
	};

	return { rating, disabled, maxRating, setHoveredRating, renderStar };
};

export default useRating;
