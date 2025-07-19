// Enum cho Price Level (1-5)
export enum PriceLevel {
    VERY_LOW = 1,      // Rất rẻ
    LOW = 2,           // Rẻ
    MEDIUM = 3,        // Trung bình
    HIGH = 4,          // Đắt
    VERY_HIGH = 5      // Rất đắt
}

// Enum cho Best Season
export enum BestSeason {
    SPRING = 'spring',         // Mùa xuân
    SUMMER = 'summer',         // Mùa hè
    AUTUMN = 'autumn',         // Mùa thu
    WINTER = 'winter',         // Mùa đông
    YEAR_ROUND = 'year_round', // Quanh năm
    DRY_SEASON = 'dry_season', // Mùa khô   
    RAINY_SEASON = 'rainy_season' // Mùa mưa
}

// Enum cho Relevance Level (1-5)
export enum RelevanceLevel {
    VERY_LOW = 1,      // Rất thấp
    LOW = 2,           // Thấp
    MEDIUM = 3,        // Trung bình
    HIGH = 4,          // Cao
    VERY_HIGH = 5      // Rất cao
}

// Utility functions để hiển thị tên tiếng Việt
export const getPriceLevelDisplayName = (level: PriceLevel): string => {
    switch (level) {
        case PriceLevel.VERY_LOW:
            return 'Rất rẻ';
        case PriceLevel.LOW:
            return 'Rẻ';
        case PriceLevel.MEDIUM:
            return 'Trung bình';
        case PriceLevel.HIGH:
            return 'Đắt';
        case PriceLevel.VERY_HIGH:
            return 'Rất đắt';
        default:
            return 'Không xác định';
    }
};

export const getBestSeasonDisplayName = (season: BestSeason): string => {
    switch (season) {
        case BestSeason.SPRING:
            return 'Mùa xuân';
        case BestSeason.SUMMER:
            return 'Mùa hè';
        case BestSeason.AUTUMN:
            return 'Mùa thu';
        case BestSeason.WINTER:
            return 'Mùa đông';
        case BestSeason.YEAR_ROUND:
            return 'Quanh năm';
        case BestSeason.DRY_SEASON:
            return 'Mùa khô';
        case BestSeason.RAINY_SEASON:
            return 'Mùa mưa';
        default:
            return 'Không xác định';
    }
};

export const getRelevanceLevelDisplayName = (level: RelevanceLevel): string => {
    switch (level) {
        case RelevanceLevel.VERY_LOW:
            return 'Rất thấp';
        case RelevanceLevel.LOW:
            return 'Thấp';
        case RelevanceLevel.MEDIUM:
            return 'Trung bình';
        case RelevanceLevel.HIGH:
            return 'Cao';
        case RelevanceLevel.VERY_HIGH:
            return 'Rất cao';
        default:
            return 'Không xác định';
    }
};

// Utility để lấy giá trị enum từ string/number
export const parsePriceLevel = (value: string | number): PriceLevel | null => {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
    return Object.values(PriceLevel).includes(numValue) ? numValue : null;
};

export const parseBestSeason = (value: string): BestSeason | null => {
    return Object.values(BestSeason).includes(value as BestSeason) ? value as BestSeason : null;
};

export const parseRelevanceLevel = (value: string | number): RelevanceLevel | null => {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
    return Object.values(RelevanceLevel).includes(numValue) ? numValue : null;
};