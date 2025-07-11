import { PreferenceLevel } from "src/enums/user.enum";

export interface UserInterest {
    interestId: string; // UUID as string
    preferenceLevel: PreferenceLevel;
    addedAt: Date;
}