export interface RatingEvent extends CustomEvent {
	detail: {
		rating: number;
	};
}

export interface Props {
	rating?: string;
	disabled?: boolean;
	maxRating?: string;
}
