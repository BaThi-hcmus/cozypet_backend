import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface PetTemplateTraits {
  earShape?: string | null;
  faceShape?: string | null;
  eyeColor?: string | null;
  size?: string | null;
  earType?: string | null;
  muzzleShape?: string | null;
  tailType?: string | null;
}

export interface PetCharacteristics {
  primaryColor: string;
  secondaryColor: string;
  coatPattern: string;
  coatLength: string;
  traits: PetTemplateTraits;
}

@Injectable()
export class PetTemplateGeminiService {
  private geminiAi: GoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('Thiếu cấu hình GEMINI_API_KEY trong file .env');
    }
    this.geminiAi = new GoogleGenerativeAI(apiKey);
  }

  async analyzePetAvatar(
    imageBuffer: Buffer,  // dữ liệu thô của ảnh
    mimeType: string, // định dạng tệp
    species: 'dog' | 'cat',
  ): Promise<PetCharacteristics> {
    const model = this.geminiAi.getGenerativeModel({
      model: 'gemini-flash-lite-latest',
      // generationConfig: {
      //   responseMimeType: 'application/json',
      // },
    });

    const prompt = `
      Bạn là chuyên gia phân loại ngoại hình thú cưng cho game ảo.
      Phân tích ảnh pet và trả về JSON thuần (không markdown, không giải thích).

      Loài đã biết: ${species} (${species === 'cat' ? 'mèo' : 'chó'}).

      Cấu trúc JSON bắt buộc:
      {
        "primaryColor": "màu lông chủ đạo (tiếng Anh ngắn gọn, ví dụ: orange, white, black, brown, gray, cream, golden, mixed)",
        "secondaryColor": "màu lông phụ hoặc 'none' nếu không có",
        "coatPattern": "họa tiết lông (ví dụ: solid, tabby, striped, spotted, bicolor, tricolor, calico...)",
        "coatLength": "độ dài lông (short, medium, long, curly)",
        "traits": {
          "earShape": "chỉ điền nếu là mèo: pointed, folded, curled hoặc null",
          "faceShape": "chỉ điền nếu là mèo: round, pointed hoặc null",
          "eyeColor": "chỉ điền nếu là mèo: blue, green, yellow, amber, heterochromia hoặc null",
          "size": "chỉ điền nếu là chó: toy, small, medium, large hoặc null",
          "earType": "chỉ điền nếu là chó: perky, floppy hoặc null",
          "muzzleShape": "chỉ điền nếu là chó: short, long, square hoặc null",
          "tailType": "chỉ điền nếu là chó: long_bushy, short, bobtail, curled_over_back hoặc null"
        }
      }

      Quy tắc:
      - Luôn trả đủ 4 trường primaryColor, secondaryColor, coatPattern, coatLength.
      - Luôn trả đủ object traits với đủ 7 key, dùng null cho trường không áp dụng theo loài.
      - Giá trị dùng snake_case hoặc từ tiếng Anh ngắn, không dấu cách.
      `.trim();

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
      const parsed = this.parseGeminiJson(rawText); // parse thành Object JS
      return this.normalizeCharacteristics(parsed, species);  // chuẩn hóa các trường dữ liệu
    } catch (error) {
      throw new BadRequestException(
        'Không thể phân tích ảnh pet bằng Gemini. Vui lòng thử lại với ảnh rõ hơn.',
      );
    }
  }

  async fetchImageBuffer(
    url: string,
  ): Promise<{ buffer: Buffer; mimeType: string }> {
    try {
      // lấy bức ảnh dựa theo url
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Fetch thất bại');
      }

      // lấy toàn bộ nội dung bức ảnh trả về dạng byte thô
      const arrayBuffer = await response.arrayBuffer();
      const mimeType = response.headers.get('content-type') || 'image/jpeg';

      return {
        buffer: Buffer.from(arrayBuffer),
        mimeType,
      };
    } catch (error) {
      throw new BadRequestException('Không thể tải ảnh avatar để phân tích lại');
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
      return JSON.parse(cleaned); // chuyển thành Object JS
    } catch (error) {
      throw new BadRequestException('Gemini trả về dữ liệu không hợp lệ');
    }
  }

  private normalizeCharacteristics(
    parsed: any,
    species: 'dog' | 'cat',
  ): PetCharacteristics {
    const traits = parsed?.traits ?? {};

    // chuẩn hóa dữ liệu do gemini trả ra
    const characteristics: PetCharacteristics = {
      // các trường bắt buộc phải có
      primaryColor: this.requireString(parsed?.primaryColor, 'primaryColor'),
      secondaryColor: this.optionalString(parsed?.secondaryColor) || 'none',
      coatPattern: this.requireString(parsed?.coatPattern, 'coatPattern'),
      coatLength: this.requireString(parsed?.coatLength, 'coatLength'),

      // các trường là optional
      traits: {
        earShape: species === 'cat' ? this.optionalString(traits.earShape) : null,
        faceShape: species === 'cat' ? this.optionalString(traits.faceShape) : null,
        eyeColor: species === 'cat' ? this.optionalString(traits.eyeColor) : null,
        size: species === 'dog' ? this.optionalString(traits.size) : null,
        earType: species === 'dog' ? this.optionalString(traits.earType) : null,
        muzzleShape: species === 'dog' ? this.optionalString(traits.muzzleShape) : null,
        tailType: species === 'dog' ? this.optionalString(traits.tailType) : null,
      },
    };

    return characteristics;
  }

  private requireString(value: unknown, field: string): string {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new BadRequestException(`Gemini thiếu trường bắt buộc: ${field}`);
    }
    return value.trim();
  }

  private optionalString(value: unknown): string | null {
    if (typeof value !== 'string' || value.trim().length === 0) {
      return null;
    }
    return value.trim();
  }
}
