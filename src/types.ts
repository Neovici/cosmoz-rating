export interface RatingEvent extends CustomEvent {
	detail: {
		rating: number;
	};
}

export interface CosmozRatingProps {
	rating?: string;
	disabled?: boolean;
	maxRating?: string;
}

export interface CosmozRatingElement extends HTMLElement, CosmozRatingProps {}
