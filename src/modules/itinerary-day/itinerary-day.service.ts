import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseUtil } from 'src/common';
import { ItineraryDays, ItineraryDaysDocument } from 'src/schemas/ItineraryDay';
import * as fs from 'fs';
import { ItineraryDayDto } from './dtos/create-itinerary-dto';
import { Activities, ActivitiesDocument } from 'src/schemas/Activity';
import { ItinerariesDocument } from 'src/schemas/Itinerary';
@Injectable()
export class ItineraryDayService {
    private readonly logger = new Logger(ItineraryDayService.name);
    constructor(@InjectModel(ItineraryDays.name) private itineraryDayModel: Model<ItineraryDaysDocument>,
        private readonly activityModel: Model<ActivitiesDocument>,
        @InjectModel('Itineraries') private readonly itineraryModel: Model<ItinerariesDocument>  // Assuming 'Itineraries' is the name of the Itinerary schema
    ) { }

    async importJsonItineraries(filePath: string): Promise<ResponseUtil> {
        try {
            if (!fs.existsSync(filePath)) {
                throw new Error(`File không tồn tại: ${filePath}`);
            }

            // Đọc file JSON
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const itineraryDays: any[] = JSON.parse(fileContent);

            if (!Array.isArray(itineraryDays)) {
                throw new Error('File JSON phải chứa một mảng các itinerary days');
            }

            this.logger.log(`Bắt đầu import ${itineraryDays.length} itinerary days từ file JSON`);

            const importResults = {
                total: itineraryDays.length,
                success: 0,
                failed: 0,
                errors: [] as Array<{
                    index: number;
                    name: string;
                    error: string;
                }>
            };
            for (let i = 0; i < itineraryDays.length; i++) {
                const itinerary = itineraryDays[i];
                // Validate dữ liệu cơ bản
                if (!itinerary.name || !itinerary.description) {
                    throw new Error(`Destination ${i + 1}: Thiếu name hoặc description`);
                }

                const newItineraryDay = new this.itineraryDayModel(itinerary);
                const savedItinerary = await newItineraryDay.save();

                console.log("Saved itinerary day:", JSON.stringify(savedItinerary.toObject(), null, 2));

                importResults.success++;

                this.logger.log(`Import thành công: ${itinerary.name}`);
            }
            return ResponseUtil.success(importResults, "Import itinerary từ file Json thành công !", HttpStatus.OK);
        } catch (error) {
            this.logger.error(`Lỗi khi import itineraries từ file JSON: ${error.message}`);
            throw new Error("Lỗi khi import itinerary");
        }
    }
    async getItineraryDayByItineraryID(itineraryId: string): Promise<ResponseUtil> {
        try {
            const itineraryDays = await this.itineraryDayModel.find({
                itineraryId: itineraryId
            }).exec();
            return ResponseUtil.success(itineraryDays, `Lấy danh sách các ngày trong lịch trình ${itineraryId} thành công !`)
        } catch (error) {
            this.logger.error(`Lỗi khi lấy itinerary day theo itinerary ID: ${error.message}`);
            throw new Error("Lỗi khi lấy itinerary day");
        }
    }
    async createItineraryDay(itineraryId: string, ItineraryDay: ItineraryDayDto, activities: string[]): Promise<ResponseUtil> {
        try {
            const activitiesArr = await Promise.all(activities.map(activityID => this.activityModel.find({
                id: activityID
            })));
            const newItineraryDay = new this.itineraryDayModel({
                ...ItineraryDay,
                activities: activitiesArr,
                itineraryId: itineraryId
            });
            const savedItineraryDay = await newItineraryDay.save();
            return ResponseUtil.success(savedItineraryDay, "Tạo mới itinerary day thành công !", HttpStatus.CREATED);
        } catch (error) {
            this.logger.error(`Lỗi khi tạo mới itinerary day: ${error.message}`);
            throw new Error("Lỗi khi tạo mới itinerary day");
        }
    }
    async getItineraryRelatedDestination(destinationId: string): Promise<ResponseUtil> {
        try {
            const itineraryDays = await this.itineraryDayModel.find({
                "activities.destinationId": destinationId
            }).populate('activities').exec();
            // Lọc ra các itineraryId duy nhất
            const uniqueItineraryIds = Array.from(new Set(itineraryDays.map(day => day.itineraryId.toString())));
            const itineraries = await this.itineraryModel.find({
                id: { $in: uniqueItineraryIds }
            }).exec();
            return ResponseUtil.success(itineraries, `Lấy các lịch trình liên quan đến địa điểm ${destinationId} thành công !`);
        } catch (error) {
            this.logger.error(`Lỗi khi lấy các lịch trình liên quan đến địa điểm: ${error.message}`);
            throw new Error("Lỗi khi lấy lịch trình liên quan đến địa điểm");
        }
    }
}
