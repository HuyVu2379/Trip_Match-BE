import { UUID } from 'crypto';
import { ItineraryStatus, MatchedScore, GeneratedBy } from 'src/enums/itinerary.enum';
export class Itineraries {
    userId: UUID;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    imageUrl: string[];
    totalBudget: number;
    estimatedCost: number;
    actualCost: number;
    status: ItineraryStatus;
    suggestionMetadata: {
        generatedBy: GeneratedBy;
        baseInterests: UUID[];
        matchedScore: MatchedScore;
    };
}
