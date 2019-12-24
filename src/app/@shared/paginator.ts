import {MatPaginatorIntl} from '@angular/material';

const getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
        return '0 条';
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return '第' + (startIndex + 1) + ' - ' + endIndex + '条，共 ' + length + '条';
};

export function Paginator() {
    const paginator = new MatPaginatorIntl();
    paginator.itemsPerPageLabel = '每页';
    paginator.nextPageLabel = '下一页';
    paginator.previousPageLabel = '上一页';
    paginator.firstPageLabel = '第一页';
    paginator.lastPageLabel = '最后一页';
    paginator.getRangeLabel = getRangeLabel;
    return paginator;
}
