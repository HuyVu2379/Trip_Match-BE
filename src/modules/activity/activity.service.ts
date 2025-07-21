import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import { Activities, ActivitiesDocument } from 'src/schemas/Activity';
import { ResponseUtil } from 'src/common';
import { TypeActivity } from 'src/enums/activity.enum';
@Injectable()
export class ActivityService {
    private readonly logger = new Logger(ActivityService.name);
    constructor(@InjectModel(Activities.name) private activityModel: Model<ActivitiesDocument>) { }

    async importActivitiesFromJSON(filePath: string): Promise<ResponseUtil> {
        try {
            if (!fs.existsSync(filePath)) {
                throw new Error(`File does not exist: ${filePath}`);
            }
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const activities: any[] = JSON.parse(fileContent);
            if (!Array.isArray(activities)) {
                throw new Error('File JSON phải chứa một mảng các activities');
            }
            this.logger.log(`Bắt đầu import ${activities.length} activities từ file JSON`);
            const importResults = {
                total: activities.length,
                success: 0,
                failed: 0,
                errors: [] as Array<{
                    index: number;
                    name: string;
                    error: string;
                }>
            };
            for (let i = 0; i < activities.length; i++) {
                const activity = activities[i];
                try {
                    const newActivity = new this.activityModel(activity);
                    await newActivity.save();
                    importResults.success++;
                } catch (error) {
                    importResults.failed++;
                    importResults.errors.push({
                        index: i + 1,
                        name: activity.name,
                        error: error.message
                    });
                }
            }
            this.logger.log(`🎉 Hoàn thành import: ${importResults.success}/${importResults.total} thành công`);
            return ResponseUtil.success(importResults, "Import activities thành công", HttpStatus.OK);
        } catch (error) {
            this.logger.error('Lỗi khi import activities từ JSON:', error.message);
            throw new Error(`Lỗi import: ${error.message}`);
        }
    }
    async getAllActivities(): Promise<ResponseUtil> {
        try {
            const activities = await this.activityModel.find().exec();
            return ResponseUtil.success(activities, "Lấy danh sách activities thành công", HttpStatus.OK);
        } catch (error) {
            this.logger.error('Lỗi khi lấy danh sách activities:', error.message);
            throw new Error(`Lỗi lấy danh sách: ${error.message}`);
        }
    }
    async getActivityById(id: string): Promise<ResponseUtil> {
        try {
            const activity = await this.activityModel.findOne({ id: id }).exec();
            if (!activity) {
                return ResponseUtil.error("Không tìm thấy activity với ID: " + id, HttpStatus.NOT_FOUND);
            }
            return ResponseUtil.success(activity, "Lấy activity thành công", HttpStatus.OK);
        } catch (error) {
            this.logger.error('Lỗi khi lấy activity:', error.message);
            throw new Error(`Lỗi lấy activity: ${error.message}`);
        }
    }
    async getActivityRelatedToDestination(destinationId: string, limit: number = 6) {
        try {
            const activities = await this.activityModel.find({
                destinationId: destinationId
            }).limit(limit).sort({ averageRating: -1 }).exec();
            return ResponseUtil.success(activities, "Lấy activities liên quan thành công", HttpStatus.OK);
        } catch (error) {
            this.logger.error('Lỗi khi lấy activities liên quan đến điểm đến:', error.message);
            throw new Error(`Lỗi lấy activities liên quan: ${error.message}`);
        }
    }
    async getActivityRelatedWithPage(destinationId: string, limit: number = 10, page: number = 1) {
        try {
            const skip = (page - 1) * limit;
            const activities = await this.activityModel.find({
                destinationId: destinationId
            }).sort({ averageRating: -1 }).limit(limit).skip(skip).exec();
            return ResponseUtil.success(activities, "Lấy activities liên quan thành công", HttpStatus.OK);
        } catch (error) {
            this.logger.error('Lỗi khi lấy activities liên quan đến điểm đến theo trang:', error.message);
            throw new Error(`Lỗi lấy activities liên quan: ${error.message}`);
        }
    }
    async getActivityHighlightedSightSeeingWithPage(limit: number = 10, page: number = 1) {
        try {
            const skip = (page - 1) * limit;
            const activities = await this.activityModel.find({
                isHighlighted: true,
                tags: TypeActivity.SIGHTSEEING
            }).sort({ averageRating: -1 }).limit(limit).skip(skip).exec();
            return ResponseUtil.success(activities, "Lấy activities nổi bật thành công", HttpStatus.OK);
        } catch (error) {
            this.logger.error('Lỗi khi lấy activities nổi bật theo trang:', error.message);
            throw new Error(`Lỗi lấy activities nổi bật: ${error.message}`);
        }
    }
}   