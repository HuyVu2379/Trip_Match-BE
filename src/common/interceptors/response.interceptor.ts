import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseUtil } from '../../utils/response.util';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                const response = context.switchToHttp().getResponse();
                const statusCode = response.statusCode;

                // Nếu data đã là ApiResponse format, trả về luôn
                if (data && typeof data === 'object' && 'success' in data) {
                    return data;
                }

                // Tạo success response
                let message = 'Success';

                // Custom message based on HTTP method and status
                const request = context.switchToHttp().getRequest();
                const method = request.method;

                switch (method) {
                    case 'POST':
                        if (statusCode === 201) {
                            message = 'Created successfully';
                        } else {
                            message = 'Operation completed successfully';
                        }
                        break;
                    case 'PUT':
                    case 'PATCH':
                        message = 'Updated successfully';
                        break;
                    case 'DELETE':
                        message = 'Deleted successfully';
                        break;
                    default:
                        message = 'Retrieved successfully';
                }

                return ResponseUtil.success(data, message, statusCode);
            }),
        );
    }
}
