// Enum cho Target Type
export enum ReviewTargetType {
    DESTINATION = 'destination',   // Đánh giá điểm đến
    ITINERARY = 'itinerary',       // Đánh giá lịch trình
    ACTIVITY = 'activity',         // Đánh giá hoạt động
}

// Enum cho Rating (1-5)
export enum ReviewRating {
    ONE_STAR = 1,      // 1 sao - Rất tệ
    TWO_STARS = 2,     // 2 sao - Tệ
    THREE_STARS = 3,   // 3 sao - Bình thường
    FOUR_STARS = 4,    // 4 sao - Tốt
    FIVE_STARS = 5     // 5 sao - Xuất sắc
}

// Utility functions
export const getReviewTargetTypeDisplayName = (targetType: ReviewTargetType): string => {
    switch (targetType) {
        case ReviewTargetType.DESTINATION:
            return 'Điểm đến';
        case ReviewTargetType.ITINERARY:
            return 'Lịch trình';
        default:
            return 'Không xác định';
    }
};

export const getReviewRatingDisplayName = (rating: ReviewRating): string => {
    switch (rating) {
        case ReviewRating.ONE_STAR:
            return 'Rất tệ (1 sao)';
        case ReviewRating.TWO_STARS:
            return 'Tệ (2 sao)';
        case ReviewRating.THREE_STARS:
            return 'Bình thường (3 sao)';
        case ReviewRating.FOUR_STARS:
            return 'Tốt (4 sao)';
        case ReviewRating.FIVE_STARS:
            return 'Xuất sắc (5 sao)';
        default:
            return 'Không có đánh giá';
    }
};

export const getReviewRatingIcon = (rating: ReviewRating): string => {
    switch (rating) {
        case ReviewRating.ONE_STAR:
            return '⭐';
        case ReviewRating.TWO_STARS:
            return '⭐⭐';
        case ReviewRating.THREE_STARS:
            return '⭐⭐⭐';
        case ReviewRating.FOUR_STARS:
            return '⭐⭐⭐⭐';
        case ReviewRating.FIVE_STARS:
            return '⭐⭐⭐⭐⭐';
        default:
            return '☆';
    }
};

export const getReviewRatingColor = (rating: ReviewRating): string => {
    switch (rating) {
        case ReviewRating.ONE_STAR:
            return '#F44336'; // Red
        case ReviewRating.TWO_STARS:
            return '#FF9800'; // Orange
        case ReviewRating.THREE_STARS:
            return '#FFC107'; // Amber
        case ReviewRating.FOUR_STARS:
            return '#8BC34A'; // Light Green
        case ReviewRating.FIVE_STARS:
            return '#4CAF50'; // Green
        default:
            return '#9E9E9E'; // Grey
    }
};

// Utility classes
export class ReviewUtil {
    /**
     * Kiểm tra rating có hợp lệ không
     */
    static validateRating(rating: number): boolean {
        return rating >= 1 && rating <= 5 && Number.isInteger(rating);
    }

    /**
     * Chuyển đổi rating thành text description
     */
    static getRatingDescription(rating: number): string {
        if (rating >= 4.5) return 'Xuất sắc';
        if (rating >= 3.5) return 'Rất tốt';
        if (rating >= 2.5) return 'Tốt';
        if (rating >= 1.5) return 'Khá';
        return 'Cần cải thiện';
    }

    /**
     * Tính average rating từ array ratings
     */
    static calculateAverageRating(ratings: number[]): number {
        if (ratings.length === 0) return 0;
        const sum = ratings.reduce((acc, rating) => acc + rating, 0);
        return Math.round((sum / ratings.length) * 10) / 10; // Round to 1 decimal place
    }

    /**
     * Phân loại rating distribution
     */
    static getRatingDistribution(ratings: number[]): Record<number, number> {
        const distribution: Record<number, number> = {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        };

        ratings.forEach(rating => {
            if (rating >= 1 && rating <= 5) {
                distribution[Math.floor(rating)]++;
            }
        });

        return distribution;
    }

    /**
     * Kiểm tra review có phải positive không
     */
    static isPositiveReview(rating: number): boolean {
        return rating >= 4;
    }

    /**
     * Kiểm tra review có phải negative không
     */
    static isNegativeReview(rating: number): boolean {
        return rating <= 2;
    }

    /**
     * Validate target type
     */
    static validateTargetType(targetType: string): boolean {
        return Object.values(ReviewTargetType).includes(targetType as ReviewTargetType);
    }

    /**
     * Format review date
     */
    static formatReviewDate(date: Date): string {
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    /**
     * Tính số ngày từ khi review
     */
    static getDaysFromReview(reviewDate: Date): number {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - reviewDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Kiểm tra review có recent không (trong 30 ngày)
     */
    static isRecentReview(reviewDate: Date): boolean {
        return this.getDaysFromReview(reviewDate) <= 30;
    }
}

// Parse functions
export const parseReviewTargetType = (value: string): ReviewTargetType | null => {
    return Object.values(ReviewTargetType).includes(value as ReviewTargetType)
        ? value as ReviewTargetType
        : null;
};

export const parseReviewRating = (value: string | number): ReviewRating | null => {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
    return ReviewUtil.validateRating(numValue) ? numValue as ReviewRating : null;
};

// Constants
export const REVIEW_CONSTANTS = {
    MIN_RATING: 1,
    MAX_RATING: 5,
    MIN_TITLE_LENGTH: 5,
    MAX_TITLE_LENGTH: 100,
    MIN_CONTENT_LENGTH: 10,
    MAX_CONTENT_LENGTH: 1000,
    MAX_PHOTOS: 10,
    MAX_PROS: 5,
    MAX_CONS: 5
};

export const REVIEW_TARGET_TYPE_COLORS = {
    [ReviewTargetType.DESTINATION]: '#2196F3',
    [ReviewTargetType.ITINERARY]: '#9C27B0'
};

// Review sentiment analysis keywords (simple implementation)
export const POSITIVE_KEYWORDS = [
    'tuyệt vời', 'xuất sắc', 'hoàn hảo', 'tốt', 'đẹp', 'thích', 'khuyến nghị',
    'amazing', 'excellent', 'perfect', 'good', 'beautiful', 'love', 'recommend'
];

export const NEGATIVE_KEYWORDS = [
    'tệ', 'xấu', 'không tốt', 'thất vọng', 'tồi tệ', 'không khuyến nghị',
    'bad', 'terrible', 'awful', 'disappointing', 'not recommend', 'worst'
];