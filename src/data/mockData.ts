/**
 * mockData.ts
 * Dữ liệu giả lập cho section "Khoảnh khắc đáng nhớ" của ZIM.
 * Sử dụng video public làm mock data (giới hạn 16s trong code).
 */

export interface StoryData {
  id: string;
  /** URL thumbnail ảnh (WebP). */
  thumbnailUrl: string;
  /** URL video. */
  videoUrl: string;
  title: string;
  description: string;
}

export const MEMORABLE_MOMENTS_DATA: StoryData[] = [
  {
    id: '1',
    thumbnailUrl: 'https://www.gstatic.com/webp/gallery/1.webp',
    videoUrl:
      'https://samplelib.com/mp4/sample-5s-720p.mp4',
    title: 'ZIM Academy - 12 Huỳnh Lan Khanh',
    description:
      'Có bao giờ bạn tự hỏi luyện nghe mỗi ngày nhưng khi đối mặt với bài thi IELTS vẫn không nghe được?',
  },
  {
    id: '2',
    thumbnailUrl: 'https://www.gstatic.com/webp/gallery/2.webp',
    videoUrl:
      'https://samplelib.com/mp4/sample-5s-720p.mp4',
    title: 'Đoán từ phiên bản Zimians',
    description:
      'Thử thách từ vựng cực gắt cùng các học viên xuất sắc.',
  },
  {
    id: '3',
    thumbnailUrl: 'https://www.gstatic.com/webp/gallery/3.webp',
    videoUrl:
      'https://samplelib.com/mp4/sample-5s-720p.mp4',
    title: 'ZIM Story - Hành trình chinh phục',
    description:
      'Nhìn lại những khoảnh khắc đáng nhớ trong quá trình ôn luyện.',
  },
  {
    id: '4',
    thumbnailUrl: 'https://www.gstatic.com/webp/gallery/4.webp',
    videoUrl:
      'https://samplelib.com/mp4/sample-5s-720p.mp4',
    title: 'ZIM Story - Hành trình chinh phục',
    description:
      'Nhìn lại những khoảnh khắc đáng nhớ trong quá trình ôn luyện.',
  },
  {
    id: '5',
    thumbnailUrl: 'https://www.gstatic.com/webp/gallery/5.webp',
    videoUrl:
      'https://samplelib.com/mp4/sample-5s-720p.mp4',
    title: 'ZIM Story - Hành trình chinh phục',
    description:
      'Nhìn lại những khoảnh khắc đáng nhớ trong quá trình ôn luyện.',
  },
];
