import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PetTemplate, PetTemplateDocument } from "src/modules/admin/pet-template/schemas/pet-template.schema";
import { BadRequestException } from "@nestjs/common";

@Injectable()
export class PetGeminiService {
  private geminiAi: GoogleGenerativeAI;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(PetTemplate.name) private readonly petTemplateModel: Model<PetTemplateDocument>
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('Thiếu cấu hình GEMINI_API_KEY trong file .env');
    }
    this.geminiAi = new GoogleGenerativeAI(apiKey);
  }

  async analyzeImage(
    imageBuffer: Buffer,
    mimeType: string
  ): Promise<any> {
    const model = this.geminiAi.getGenerativeModel({
      model: 'gemini-flash-lite-latest',
    });

    // lấy danh sách petTemplate để gemini chọn
    const petTemplates = await this.petTemplateModel.find({
      status: 'active',
      deleted: false
    });

    const petTemplatesJson = JSON.stringify(
      petTemplates.map((t) => ({
        _id: t._id,
        species: t.species,
        name: t.name,
        primaryColor: t.primaryColor,
        secondaryColor: t.secondaryColor,
        coatPattern: t.coatPattern,
        coatLength: t.coatLength,
        traits: t.traits,
      }))
    );

    const prompt = `Bạn là một trợ lý AI phân tích hình ảnh thú cưng. 
      Người dùng vừa upload một bức ảnh. Nhiệm vụ của bạn là:
      1. Xác định xem ảnh này có phải là một con chó hoặc mèo hay không. Nếu không, đặt isValidSpecies = false, petTemplateId = null.
      2. Nếu là chó hoặc mèo (isValidSpecies = true), hãy đối chiếu đặc điểm ngoại hình của nó với danh sách các khuôn mẫu (pet template) sau đây:
      ${petTemplatesJson}
      3. Chọn ra 1 khuôn mẫu có đặc điểm (loài, màu sắc, kiểu lông, hình dáng...) giống với bức ảnh nhất. Lấy giá trị _id của khuôn mẫu đó gán vào petTemplateId.
      4. CHỈ trả về đúng một object JSON thuần túy, không có text dư thừa, không có markdown (ví dụ không bọc trong \`\`\`json). Định dạng trả về:
      {
        "isValidSpecies": true/false,
        "petTemplateId": "string_id_cua_template"
      }`;

    try {
      const result = await model.generateContent([
        { text: prompt },
        {
          inlineData: {
            mimeType,
            data: imageBuffer.toString('base64'), // chuyển buffer thành chuỗi base64 để đính kèm vào JSON
          },
        },
      ]);

      const rawText = result.response.text();
      const parsed = this.parseGeminiJson(rawText); // parse 
      return parsed;
    } catch (error) {
      throw new BadRequestException(
        'Không thể phân tích ảnh pet bằng Gemini. Vui lòng thử lại với ảnh rõ hơn.',
      );
    }
  }

  private parseGeminiJson(rawText: string): any {
    // làm sạch đoạn JSON do gemini trả ra
    const cleaned = rawText
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '');

    try {
      return JSON.parse(cleaned);
    } catch (error) {
      throw new BadRequestException('Gemini trả về dữ liệu không hợp lệ');
    }
  }
}