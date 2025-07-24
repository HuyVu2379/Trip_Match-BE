import { HttpStatus, Injectable } from '@nestjs/common';
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

    async createInterest(interestData: CreateInterestDto) {
        const createdInterest = await this.interestModel.create(interestData);
        if (!createdInterest) {
            throw new Error('Failed to create interest');
        }
        return createdInterest;
    }

    async bulkCreateInterest(interestsData: CreateInterestDto[]) {
        const createdInterests = await this.interestModel.insertMany(interestsData);
        if (!createdInterests) {
            throw new Error('Failed to create interests');
        }
        return createdInterests;
    }

    async getAllInterests(limit: number) {
        const interests = await this.interestModel.find().limit(limit).lean();
        return interests;
    }
}
