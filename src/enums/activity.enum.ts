// Enum cho Recommended Time
export enum RecommendedTime {
    MORNING = 'morning',       // Buổi sáng
    AFTERNOON = 'afternoon',   // Buổi chiều
    EVENING = 'evening',       // Buổi tối
    ANYTIME = 'anytime'        // Bất kỳ lúc nào
}
export enum TypeActivity {
    SIGHTSEEING = 'sightseeing',
    FOOD = 'food',
    ADVENTURE = 'adventure',
    RELAXATION = 'relaxation',
    SHOPPING = 'shopping',
    CULTURE = 'culture',
    ENTERTAINMENT = 'entertainment',
    NATURE = 'nature',
    PHOTOSPOT = 'photospot',
    NIGHTLIFE = 'nightlife',
    WORKSHOP = 'workshop',
    FESTIVAL = 'festival',
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
export const getTypeActivityDisplayName = (type: TypeActivity): string => {
    switch (type) {
        case TypeActivity.SIGHTSEEING:
            return 'Tham quan';
        case TypeActivity.FOOD:
            return 'Ẩm thực';
        case TypeActivity.ADVENTURE:
            return 'Phiêu lưu';
        case TypeActivity.RELAXATION:
            return 'Thư giãn';
        case TypeActivity.ENTERTAINMENT:
            return 'Giải trí';
        case TypeActivity.NATURE:
            return 'Thiên nhiên';
        case TypeActivity.PHOTOSPOT:
            return 'Điểm chụp ảnh';
        case TypeActivity.NIGHTLIFE:
            return 'Đời sống về đêm';
        case TypeActivity.WORKSHOP:
            return 'Hội thảo';
        case TypeActivity.FESTIVAL:
            return 'Lễ hội';
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
