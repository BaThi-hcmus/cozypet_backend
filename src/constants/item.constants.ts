export const ITEM_TYPES = [
  { value: 'furniture', label: 'Nội thất' },
  { value: 'decoration', label: 'Trang trí' },
  { value: 'food', label: 'Thức ăn' },
  { value: 'toy', label: 'Đồ chơi' },
] as const;

export const ITEM_CATEGORIES: Record<
  (typeof ITEM_TYPES)[number]['value'],
  { value: string; label: string }[]
> = {
  furniture: [
    { value: 'table', label: 'Bàn' },
    { value: 'bed', label: 'Giường' },
    { value: 'chair', label: 'Ghế' },
    { value: 'sofa', label: 'Sofa' },
    { value: 'cabinet', label: 'Tủ' },
    { value: 'shelf', label: 'Kệ' },
    { value: 'desk', label: 'Bàn làm việc' },
    { value: 'lamp', label: 'Đèn' },
  ],
  decoration: [
    { value: 'picture', label: 'Tranh' },
    { value: 'plant', label: 'Cây cảnh' },
    { value: 'rug', label: 'Thảm' },
    { value: 'curtain', label: 'Rèm' },
    { value: 'vase', label: 'Bình hoa' },
    { value: 'clock', label: 'Đồng hồ' },
    { value: 'mirror', label: 'Gương' },
    { value: 'poster', label: 'Poster' },
  ],
  food: [
    { value: 'bowl', label: 'Bát thức ăn ' },
    { value: 'treat', label: 'Snack' },
    { value: 'snack', label: 'Đồ ăn vặt' },
    { value: 'water', label: 'Nước uống' },
  ],
  toy: [
    { value: 'ball', label: 'Bóng' },
    { value: 'bone', label: 'Xương' },
    { value: 'plush', label: 'Thú bông' },
    { value: 'rope', label: 'Dây kéo' },
    { value: 'frisbee', label: 'Đĩa bay' },
  ],
};

export const ITEM_SLOT_TYPES = [
  { value: 'left_floor', label: 'Sàn trái' },
  { value: 'center_floor', label: 'Sàn giữa' },
  { value: 'right_floor', label: 'Sàn phải' },
  { value: 'left_wall', label: 'Tường trái' },
  { value: 'center_wall', label: 'Tường giữa' },
  { value: 'right_wall', label: 'Tường phải' },
  { value: 'ceiling', label: 'Trần nhà' },
  { value: 'other', label: 'Vị trí khác' },
] as const;

export const ITEM_TYPE_VALUES = ITEM_TYPES.map((item) => item.value);

export const ITEM_CATEGORY_VALUES = Object.values(ITEM_CATEGORIES)
  .flat()
  .map((item) => item.value);

export const ITEM_SLOT_TYPE_VALUES = ITEM_SLOT_TYPES.map((item) => item.value);

export const ITEM_CONSTANTS_RESPONSE = {
  types: ITEM_TYPES,
  categories: ITEM_CATEGORIES,
  slotTypes: ITEM_SLOT_TYPES,
};
