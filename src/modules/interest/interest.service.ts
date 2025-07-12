import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Interests, InterestsDocument } from 'src/schemas/Interest';
import { CreateInterestDto } from './dtos/create-interest.dto';
import { ResponseUtil } from 'src/common';
@Injectable()
export class InterestService {
    constructor(
        @InjectModel(Interests.name)
        private interestModel: Model<InterestsDocument>
    ) { }

    async createInterest(interestData: CreateInterestDto): Promise<ResponseUtil> {
        const createdInterest = await this.interestModel.create(interestData);
        if (!createdInterest) {
            return ResponseUtil.error('Failed to create interest', 500);
        }
        return ResponseUtil.success(createdInterest);
    }

    async bulkCreateInterest(interestsData: CreateInterestDto[]): Promise<ResponseUtil> {
        const createdInterests = await this.interestModel.insertMany(interestsData);
        if (!createdInterests) {
            return ResponseUtil.error('Failed to create interests', 500);
        }
        return ResponseUtil.success(createdInterests);
    }
}
