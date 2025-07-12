export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other'
}

export enum PreferenceLevel {
    VERY_LOW = 1,
    LOW = 2,
    MEDIUM = 3,
    HIGH = 4,
    VERY_HIGH = 5
}
export enum Role {
    USER = 'user',
    ADMIN = 'admin',
}

// Utility functions
export const getGenderDisplayName = (gender: Gender): string => {
    switch (gender) {
        case Gender.MALE:
            return 'Nam';
        case Gender.FEMALE:
            return 'Nữ';
        case Gender.OTHER:
            return 'Khác';
        default:
            return 'Không xác định';
    }
};
export const getRoleDisplayName = (role: Role): string => {
    switch (role) {
        case Role.USER:
            return 'Người dùng';
        case Role.ADMIN:
            return 'Quản trị viên';
        default:
            return 'Không xác định';
    }
};

export const getPreferenceLevelDisplayName = (level: PreferenceLevel): string => {
    switch (level) {
        case PreferenceLevel.VERY_LOW:
            return 'Rất thấp';
        case PreferenceLevel.LOW:
            return 'Thấp';
        case PreferenceLevel.MEDIUM:
            return 'Trung bình';
        case PreferenceLevel.HIGH:
            return 'Cao';
        case PreferenceLevel.VERY_HIGH:
            return 'Rất cao';
        default:
            return 'Không xác định';
    }
};