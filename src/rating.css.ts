import { css } from '@pionjs/pion';

export const styles = css`
	:host {
		display: inline-block;
		--rating-star-color: #ffd700;
		--rating-star-color-empty: #d3d3d3;
		--rating-star-color-hover: #ffed4a;
		--rating-star-size: 24px;
		--rating-star-gap: 2px;
	}

	:host([disabled]) {
		pointer-events: none;
	}

	.rating-container {
		display: flex;
		gap: var(--rating-star-gap);
		align-items: center;
	}

	.star {
		width: var(--rating-star-size);
		height: var(--rating-star-size);
		cursor: pointer;
		transition: fill 0.2s ease;
	}

	:host([disabled]) .star {
		cursor: default;
	}

	.star:hover path {
		color: var(--rating-star-color-hover) !important;
	}
`;
