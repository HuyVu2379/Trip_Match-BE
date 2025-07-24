import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseUtil } from 'src/common';
import { Itineraries, ItinerariesDocument } from 'src/schemas/Itinerary';
import * as fs from 'fs'
import { Destinations, DestinationsDocument } from 'src/schemas/Destination';
import { Activities, ActivitiesDocument } from 'src/schemas/Activity';
import { createItineraryWithRequirement } from './dtos/create-itinerary-dto';
import { ActivityService } from '../activity/activity.service';
import { RecommendedTime } from 'src/enums/activity.enum';
@Injectable()
export class ItineraryService {
    private readonly logger = new Logger(ItineraryService.name);
    constructor(
        @InjectModel(Itineraries.name) private itineraryModel: Model<ItinerariesDocument>,
        private activityService: ActivityService,
    ) { }

    async importJsonItineraries(filePath: string) {
        try {
            if (!fs.existsSync(filePath)) {
                throw new Error(`File không tồn tại: ${filePath}`);
            }

            // Đọc file JSON
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const itineraries: any[] = JSON.parse(fileContent);

            if (!Array.isArray(itineraries)) {
                throw new Error('File JSON phải chứa một mảng các itinerary');
            }

            this.logger.log(`Bắt đầu import ${itineraries.length} destinations từ file JSON`);

            const importResults = {
                total: itineraries.length,
                success: 0,
                failed: 0,
                errors: [] as Array<{
                    index: number;
                    name: string;
                    error: string;
                }>
            };
            for (let i = 0; i < itineraries.length; i++) {
                const itinerary = itineraries[i];
                // Validate dữ liệu cơ bản
                if (!itinerary.name || !itinerary.description) {
                    throw new Error(`Destination ${i + 1}: Thiếu name hoặc description`);
                }

                const newItinerary = new this.itineraryModel(itinerary);
                const savedItinerary = await newItinerary.save();

                console.log("Saved itinerary:", JSON.stringify(savedItinerary.toObject(), null, 2));

                importResults.success++;

                this.logger.log(` Import thành công: ${itinerary.name}`);
            }
            return importResults;
        } catch (error) {
            this.logger.error(`Lỗi khi import itineraries từ file JSON: ${error.message}`);
            throw new Error("Lỗi khi import itinerary");
        }
    }
    calculateScore(activity: Activities, interestIds: string[], sessionBudget: number): number {
        // Tìm relevance cao nhất trong số interestIds của người dùng
        let maxRelevance = 0;
        for (const interest of activity.suitableInterests) {
            if (interestIds.includes(interest.interestId)) {
                maxRelevance = Math.max(maxRelevance, interest.relevance);
            }
        }
        const interestScore = maxRelevance / 5; // Chuẩn hóa về khoảng [0, 1] với giả định relevance max = 5
        const activityCost = Number(activity.cost || 0);
        const budget = Number(sessionBudget || 1);
        const budgetScore = 1 - Math.min(activityCost / budget, 1); // Càng gần ngân sách càng tốt
        const duration = Number(activity.durationMinutes || 0);
        const timeScore = duration <= 90 ? 1 : duration <= 150 ? 0.7 : 0.5;
        // Trọng số: interest quan trọng nhất, sau đó là budget, sau đó là thời gian
        const totalScore = (interestScore * 2) + (budgetScore * 1.5) + (timeScore * 1);
        return totalScore;
    }

    async generateItineraryAI(data: createItineraryWithRequirement) {
        try {
            const { numberOfDays, interestIds, cost, } = data;
            const sessionBudget = (cost / numberOfDays) / 3;
            const suitableActivities = await this.activityService.getActivitiesRelatedRequest(data);
            const itinerary: any[] = [];

            for (let day = 1; day <= numberOfDays; day++) {
                const dayPlan = { day, morning: [], afternoon: [], evening: [] };
                for (const slot of ["morning", "afternoon", "evening"]) {
                    let remainingTime = 240; // mỗi buổi 4 giờ
                    let remainingBudget = sessionBudget;

                    // Lọc hoạt động theo slot và còn phù hợp
                    let slotActivities = suitableActivities.filter(act =>
                        act.recommendedTime === slot || act.recommendedTime === RecommendedTime.ANYTIME
                    );

                    // Chấm điểm và sắp xếp
                    slotActivities = slotActivities
                        .map(act => ({
                            activity: act,
                            score: this.calculateScore(act, interestIds, sessionBudget)
                        }))
                        .sort((a, b) => b.score - a.score)
                        .map(item => item.activity);

                    const usedActivityIds = new Set();

                    for (const activity of slotActivities) {
                        if (
                            activity.durationMinutes <= remainingTime &&
                            Number(activity.cost) <= remainingBudget &&
                            !usedActivityIds.has(activity.id.toString())
                        ) {
                            dayPlan[slot].push(activity);
                            remainingTime -= activity.durationMinutes;
                            remainingBudget -= Number(activity.cost);
                            usedActivityIds.add(activity.id.toString());
                        }
                    }
                }
                itinerary.push(dayPlan);
            }
            return {
                itinerary,
                allActivities: suitableActivities,
            };
        } catch (error) {
            this.logger.error(`Lỗi khi tạo itinerary với yêu cầu: ${error.message}`);
            return ResponseUtil.error("Lỗi khi tạo itinerary", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}