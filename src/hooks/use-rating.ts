import { useState, html, useEffect } from '@pionjs/pion';
import { svg } from 'lit-html';

import { CosmozRatingElement } from '../types';

const useRating = (host: CosmozRatingElement) => {
	const [hoveredRating, setHoveredRating] = useState<number | null>(null);

	const ratingAttr = host.getAttribute('rating');
	const rating = ratingAttr ? parseFloat(ratingAttr) : null;
	const disabled = host.hasAttribute('disabled');
	const maxRatingAttr = host.getAttribute('max-rating');
	const maxRating = maxRatingAttr ? parseInt(maxRatingAttr, 10) : 5;

	useEffect(() => {
		// Set appropriate tabIndex for accessibility
		if (!disabled && host.tabIndex === -1) {
			host.tabIndex = 0;
		} else if (disabled) {
			host.tabIndex = -1;
		}
	}, [disabled]);

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
			new CustomEvent('change', {
				detail: { rating: starRating },
				bubbles: true,
				composed: true,
			}),
		);
	};

	const handleStarHover = (starRating: number) => {
		if (disabled) return;

		setHoveredRating(starRating);
	};

	const handleComponentLeave = () => {
		if (disabled) return;

		setHoveredRating(null);
	};

	const renderStar = (index: number) => {
		const starRating = index + 1;
		const starClass = getStarClass(starRating);
		const isPartial = starClass.includes('partial');

		let fillPercentage = 0;
		if (isPartial && rating !== null) {
			fillPercentage = Math.round((rating % 1) * 100);
		}

		const starPath = [
			'M6.93894 0.263019L8.39719 3.47842C8.45207 3.59942 8.53952 3.70396',
			'8.65043 3.78114C8.76133 3.85833 8.89163 3.90534 9.02772 3.91727L12.5802',
			'4.22519C12.9821 4.28175 13.1424 4.7583 12.851 5.03271L10.175 7.20599C9.95835',
			'7.38195 9.85977 7.65845 9.91935 7.92553L10.6972 11.4457C10.7655 11.8322',
			'10.3462 12.1276 9.98652 11.9443L6.88586 10.1889C6.76893 10.1225 6.63578',
			'10.0875 6.50017 10.0875C6.36457 10.0875 6.23142 10.1225 6.11448 10.1889L3.01382',
			'11.9432C2.65522 12.1255 2.23486 11.8311 2.30311 11.4447L3.08099 7.92448C3.13949',
			'7.6574 3.04199 7.3809 2.82531 7.20494L0.14825 5.03376C-0.142099 4.7604',
			'0.0182426 4.2828 0.419097 4.22624L3.97154 3.91832C4.10763 3.90639 4.23793',
			'3.85938 4.34883 3.78219C4.45974 3.705 4.54719 3.60046 4.60207 3.47947L6.06031',
			'0.264067C6.24124 -0.0878475 6.7591 -0.0878474 6.93894 0.263019Z',
		].join(' ');

		const partialPaths = svg`<defs>
						<clipPath id="clip-${index}">
							<rect x="0" y="0" width="${fillPercentage}%" height="100%" />
						</clipPath>
					</defs>
					<!-- Background (empty) star with border -->
					<path 
						d="${starPath}" 
						fill="var(--cosmoz-rating-color-empty)"
						stroke="var(--cosmoz-rating-color-border)"
						stroke-width="var(--rating-star-border-width)"
					></path>
					<!-- Partial fill (clipped) star -->
					<path
						d="${starPath}"
						fill="var(--cosmoz-rating-color-fill)"
						stroke="var(--cosmoz-rating-color-border)"
						stroke-width="var(--rating-star-border-width)"
						clip-path="url(#clip-${index})"
					></path>`;

		const fillColor = starClass.includes('filled')
			? 'var(--cosmoz-rating-color-fill)'
			: 'var(--cosmoz-rating-color-empty)';

		const strokeColor = starClass.includes('filled')
			? 'var(--cosmoz-rating-color-border)'
			: 'var(--cosmoz-rating-color-border-empty)';

		return html`
			<svg
				class="${starClass}"
				@click="${() => handleStarClick(starRating)}"
				@mouseenter="${() => handleStarHover(starRating)}"
				viewBox="-0.5 -0.5 14 13"
				xmlns="http://www.w3.org/2000/svg"
			>
				${isPartial
					? partialPaths
					: svg`<path
					d="${starPath}"
					fill="${fillColor}"
					stroke="${strokeColor}"
					stroke-width="var(--rating-star-border-width)"
				></path>`}
			</svg>
		`;
	};

	return { rating, disabled, maxRating, handleComponentLeave, renderStar };
};

export default useRating;
