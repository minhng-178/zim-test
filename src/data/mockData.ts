/**
 * mockData.ts
 * Dữ liệu giả lập cho section "Khoảnh khắc đáng nhớ" của ZIM.
 * Sử dụng video public làm mock data (giới hạn 16s trong code).
 */

export interface StoryData {
  id: string;
  /** URL thumbnail ảnh (WebP). */
  thumbnailUrl: string;
  /** URL thumbnail ảnh (WebP) dung lượng nhỏ. */
  thumbnailUrlSmall: string;
  /** URL thumbnail ảnh (WebP) dung lượng lớn. */
  thumbnailUrlLarge: string;
  /** URL video. */
  videoUrl: string;
  /** URL điều hướng khi tap lần 2 hoặc CTA. */
  ctaUrl?: string;
  title: string;
  description: string;
}

const DEFAULT_CTA_URL = 'https://zim.vn/';

const buildWebpProxyUrl = (url: string, width: number) => {
  const normalized = url.replace(/^https?:\/\//, '');
  return `https://images.weserv.nl/?url=${encodeURIComponent(
    normalized,
  )}&w=${width}&output=webp`;
};

export const MEMORABLE_MOMENTS_DATA: StoryData[] = [
  {
    id: '1',
    thumbnailUrl: 'https://www.gstatic.com/webp/gallery/1.webp',
    thumbnailUrlSmall: buildWebpProxyUrl(
      'https://www.gstatic.com/webp/gallery/1.webp',
      360,
    ),
    thumbnailUrlLarge: buildWebpProxyUrl(
      'https://www.gstatic.com/webp/gallery/1.webp',
      640,
    ),
    videoUrl:
      'https://samplelib.com/mp4/sample-5s-720p.mp4',
    ctaUrl: DEFAULT_CTA_URL,
    title: 'ZIM Academy - 12 Huỳnh Lan Khanh',
    description:
      'Có bao giờ bạn tự hỏi luyện nghe mỗi ngày nhưng khi đối mặt với bài thi IELTS vẫn không nghe được?',
  },
  {
    id: '2',
    thumbnailUrl: 'https://www.gstatic.com/webp/gallery/2.webp',
    thumbnailUrlSmall: buildWebpProxyUrl(
      'https://www.gstatic.com/webp/gallery/2.webp',
      360,
    ),
    thumbnailUrlLarge: buildWebpProxyUrl(
      'https://www.gstatic.com/webp/gallery/2.webp',
      640,
    ),
    videoUrl:
      'https://samplelib.com/mp4/sample-5s-720p.mp4',
    ctaUrl: DEFAULT_CTA_URL,
    title: 'Đoán từ phiên bản Zimians',
    description:
      'Thử thách từ vựng cực gắt cùng các học viên xuất sắc.',
  },
  {
    id: '3',
    thumbnailUrl: 'https://www.gstatic.com/webp/gallery/3.webp',
    thumbnailUrlSmall: buildWebpProxyUrl(
      'https://www.gstatic.com/webp/gallery/3.webp',
      360,
    ),
    thumbnailUrlLarge: buildWebpProxyUrl(
      'https://www.gstatic.com/webp/gallery/3.webp',
      640,
    ),
    videoUrl:
      'https://samplelib.com/mp4/sample-5s-720p.mp4',
    ctaUrl: DEFAULT_CTA_URL,
    title: 'ZIM Story - Hành trình chinh phục',
    description:
      'Nhìn lại những khoảnh khắc đáng nhớ trong quá trình ôn luyện.',
  },
  {
    id: '4',
    thumbnailUrl: 'https://www.gstatic.com/webp/gallery/4.webp',
    thumbnailUrlSmall: buildWebpProxyUrl(
      'https://www.gstatic.com/webp/gallery/4.webp',
      360,
    ),
    thumbnailUrlLarge: buildWebpProxyUrl(
      'https://www.gstatic.com/webp/gallery/4.webp',
      640,
    ),
    videoUrl:
      'https://samplelib.com/mp4/sample-5s-720p.mp4',
    ctaUrl: DEFAULT_CTA_URL,
    title: 'ZIM Story - Hành trình chinh phục',
    description:
      'Nhìn lại những khoảnh khắc đáng nhớ trong quá trình ôn luyện.',
  },
  {
    id: '5',
    thumbnailUrl: 'https://www.gstatic.com/webp/gallery/5.webp',
    thumbnailUrlSmall: buildWebpProxyUrl(
      'https://www.gstatic.com/webp/gallery/5.webp',
      360,
    ),
    thumbnailUrlLarge: buildWebpProxyUrl(
      'https://www.gstatic.com/webp/gallery/5.webp',
      640,
    ),
    videoUrl:
      'https://samplelib.com/mp4/sample-5s-720p.mp4',
    ctaUrl: DEFAULT_CTA_URL,
    title: 'ZIM Story - Hành trình chinh phục',
    description:
      'Nhìn lại những khoảnh khắc đáng nhớ trong quá trình ôn luyện.',
  },
];
