export const DOC_STATUS = {
    DRAFT: 'draft',
    REVIEW: 'review',
    PUBLISHED: 'published',
    ARCHIVED: 'archived'
};

export const STATUS_LABELS = {
    [DOC_STATUS.DRAFT]: '草稿',
    [DOC_STATUS.REVIEW]: '待审核',
    [DOC_STATUS.PUBLISHED]: '已发布',
    [DOC_STATUS.ARCHIVED]: '已废止'
};

export const STATUS_COLORS = {
    [DOC_STATUS.DRAFT]: 'bg-gray-200 text-gray-700',
    [DOC_STATUS.REVIEW]: 'bg-orange-100 text-orange-800',
    [DOC_STATUS.PUBLISHED]: 'bg-green-100 text-green-800',
    [DOC_STATUS.ARCHIVED]: 'bg-red-100 text-red-800'
};

export const LIFECYCLE_STEPS = [
    { id: DOC_STATUS.DRAFT, label: '起草' },
    { id: DOC_STATUS.REVIEW, label: '审核' },
    { id: DOC_STATUS.PUBLISHED, label: '发布' },
    { id: DOC_STATUS.ARCHIVED, label: '废止' }
];
