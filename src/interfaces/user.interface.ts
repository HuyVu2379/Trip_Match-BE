import { PreferenceLevel } from "src/enums/user.enum";

export interface UserInterest {
    interestId: string;
    preferenceLevel: PreferenceLevel;
    addedAt: Date;
}