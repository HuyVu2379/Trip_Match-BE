import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Destinations, DestinationsDocument } from 'src/schemas/Destination';
import * as fs from 'fs';
import { ResponseUtil } from 'src/common';

@Injectable()
export class DestinationService {
    private readonly logger = new Logger(DestinationService.name);

    constructor(
        @InjectModel(Destinations.name)
        private destinationModel: Model<DestinationsDocument>
    ) { }

    async importDestinationsFromJSON(filePath: string): Promise<ResponseUtil> {
        try {
            // Kiểm tra file có tồn tại không
            if (!fs.existsSync(filePath)) {
                throw new Error(`File không tồn tại: ${filePath}`);
            }

            // Đọc file JSON
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const destinations: any[] = JSON.parse(fileContent);

            if (!Array.isArray(destinations)) {
                throw new Error('File JSON phải chứa một mảng các destination');
            }

            this.logger.log(`Bắt đầu import ${destinations.length} destinations từ file JSON`);

            const importResults = {
                total: destinations.length,
                success: 0,
                failed: 0,
                errors: [] as Array<{
                    index: number;
                    name: string;
                    error: string;
                }>
            };

            // Xử lý từng destination
            for (let i = 0; i < destinations.length; i++) {
                try {
                    const destination = destinations[i];
                    // Validate dữ liệu cơ bản
                    if (!destination.name || !destination.description) {
                        throw new Error(`Destination ${i + 1}: Thiếu name hoặc description`);
                    }

                    // Kiểm tra destination đã tồn tại chưa (theo name và province)
                    const existingDestination = await this.destinationModel.findOne({
                        name: destination.name,
                        province: destination.province
                    });

                    if (existingDestination) {
                        this.logger.warn(`Destination đã tồn tại: ${destination.name} - ${destination.province}`);
                        importResults.failed++;
                        importResults.errors.push({
                            index: i + 1,
                            name: destination.name,
                            error: 'Destination đã tồn tại'
                        });
                        continue;
                    }

                    // Tạo destination mới
                    const newDes = {
                        name: destination.name,
                        description: destination.description,
                        addressDetail: destination.addressDetail || '',
                        country: destination.country || 'Việt Nam',
                        province: destination.province || '',
                        location: destination.location || { lat: 0, lng: 0 },
                        priceLevel: destination.priceLevel || 3,
                        bestSeason: destination.bestSeason || 'year_round',
                        tags: destination.tags || [],
                        image_url: destination.image_url || [],
                        suitableDestinations: destination.suitableDestinations || [],
                        priceRange: destination.priceRange || [0, 0],
                        travelTips: destination.travelTips || [],
                        outstandingLocations: destination.outstandingLocations || [],
                        averageRating: destination.averageRating || 0,
                        totalReviews: destination.totalReviews || 0,
                        isActive: destination.isActive !== undefined ? destination.isActive : true
                    }

                    console.log("Data to save:", JSON.stringify(newDes, null, 2));

                    const newDestination = new this.destinationModel(newDes);
                    const savedDestination = await newDestination.save();

                    console.log("Saved destination:", JSON.stringify(savedDestination.toObject(), null, 2));

                    importResults.success++;

                    this.logger.log(`✅ Import thành công: ${destination.name}`);

                } catch (error) {
                    this.logger.error(`❌ Lỗi import destination ${i + 1}:`, error.message);
                    importResults.failed++;
                    importResults.errors.push({
                        index: i + 1,
                        name: destinations[i]?.name || 'Unknown',
                        error: error.message
                    });
                }
            }

            this.logger.log(`🎉 Hoàn thành import: ${importResults.success}/${importResults.total} thành công`);

            return ResponseUtil.success(importResults, "Import destinations thành công", HttpStatus.OK);

        } catch (error) {
            this.logger.error('Lỗi khi import destinations từ JSON:', error.message);
            throw new Error(`Lỗi import: ${error.message}`);
        }
    }

    /**
     * Lấy tất cả destinations
     */
    async findAll() {
        return await this.destinationModel.find({ isActive: true }).exec();
    }

    async findWithPage(page: number, limit: number) {
        const skip = (page - 1) * limit;
        return await this.destinationModel.find({ isActive: true })
            .skip(skip)
            .limit(limit)
            .exec();
    }
    /**
     * Lấy destination theo ID
     */
    async findById(id: string) {
        return await this.destinationModel.findOne({ id, isActive: true }).exec();
    }

    /**
     * Xóa tất cả destinations (dùng cho testing)
     */
    async deleteAll() {
        const result = await this.destinationModel.deleteMany({}).exec();
        this.logger.log(`Đã xóa ${result.deletedCount} destinations`);
        return result;
    }

    /**
     * Đếm số lượng destinations
     */
    async count() {
        return await this.destinationModel.countDocuments({ isActive: true }).exec();
    }
}
