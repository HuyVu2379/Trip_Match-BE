// Enum cho Recommended Time
export enum RecommendedTime {
    MORNING = 'morning',       // Buổi sáng
    AFTERNOON = 'afternoon',   // Buổi chiều
    EVENING = 'evening',       // Buổi tối
    ANYTIME = 'anytime'        // Bất kỳ lúc nào
}

// Utility functions
export const getRecommendedTimeDisplayName = (time: RecommendedTime): string => {
    switch (time) {
        case RecommendedTime.MORNING:
            return 'Buổi sáng (6:00 - 12:00)';
        case RecommendedTime.AFTERNOON:
            return 'Buổi chiều (12:00 - 18:00)';
        case RecommendedTime.EVENING:
            return 'Buổi tối (18:00 - 22:00)';
        case RecommendedTime.ANYTIME:
            return 'Bất kỳ lúc nào';
        default:
            return 'Không xác định';
    }
};

// Parse functions
export const parseRecommendedTime = (value: string): RecommendedTime | null => {
    return Object.values(RecommendedTime).includes(value as RecommendedTime)
        ? value as RecommendedTime
        : null;
};
