/** Chiều rộng của mỗi thẻ khi ở trạng thái được chọn (giữa). */
export const ITEM_WIDTH = 280;

/** Khoảng cách ngang giữa 2 thẻ liền kề. */
export const ITEM_SPACING = 12;

/** Tổng bước offset mỗi lần snap (dùng cho FlatList.snapToInterval). */
export const SNAP_INTERVAL = ITEM_WIDTH + ITEM_SPACING;

/**
 * Scale tối thiểu của item ở hai bên (không phải item đang active).
 * Item active luôn có scale = 1.0.
 */
export const SCALE_INACTIVE = 0.9;

/** Thời gian (ms) của animation overlay khi không bị giảm chuyển động. */
export const OVERLAY_ANIM_DURATION_NORMAL = 260;
