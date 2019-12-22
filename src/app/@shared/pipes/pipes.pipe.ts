import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {getIndex} from '../../@core/utils/utils';

@Pipe({
  name: 'repairDate',
  pure: false
})

@Injectable()
export class RepairDatePipe implements PipeTransform {
  transform(value): any {
    value = value.split('.')[0].replace(/\-/g, '/');
    return value;
  }
}

@Pipe({
  name: 'keys',
  pure: false
})

@Injectable()
export class KeysPipe implements PipeTransform {
  transform(value, args: string[]): any {
    const keys = [];
    for (const key in value) {
      if (key) {
        keys.push({key, value: value[key]});
      }
    }
    return keys;
  }
}

@Pipe({
  name: 'searchKey',
  pure: false
})

@Injectable()
export class SearchKeyPipe implements PipeTransform {
  transform(value, searchKey): any {
    if (!searchKey) {
      return value;
    }

    return value.replace(searchKey, '<em>' + searchKey + '</em>');
  }
}

@Pipe({
  name: 'getLabel',
  pure: false
})

@Injectable()
export class GetLabelPipe implements PipeTransform {
  transform(value, array: any): any {
    if (!value || !array) {
      return value;
    }
    const label = array[getIndex(array, 'value', value)].label;
    return label;
  }
}

@Pipe({
  name: 'picNumber',
  pure: false
})

@Injectable()
export class PicNumberPipe implements PipeTransform {
  transform(num): any {
    let html = '';
    num.toString().split('').forEach((n) => {
      html = html + '<em><img src="/assets/game/mouse/images/num_' + n + '.png"></em>';
    });

    return html;
  }
}

@Pipe({
  name: 'rmb',
  pure: false
})
// <em class="money"><i class="rmb">￥</i><span>{{item.price}}</span><i class="decimal">.00</i></em>
@Injectable()
export class RmbPipe implements PipeTransform {
  transform(num): any {
    if (!num && num !== 0) {
      return num;
    }
    const numStr = num.toFixed(2).toString();
    let result = '';
    if (numStr.indexOf('.') === -1) {
      result = '<i class="rmb">￥</i><span>' + num + '</span><i class="decimal">.00</i>';
    } else {
      const numArr = numStr.split('.');
      result = '<i class="rmb">￥</i><span>' + numArr[0] + '</span><i class="decimal">.' + numArr[1] + '</i>';
    }

    return result;
  }
}

@Pipe({
  name: 'formatSrc',
  pure: false
})
// <em class="money"><i class="rmb">￥</i><span>{{item.price}}</span><i class="decimal">.00</i></em>
@Injectable()
export class FormatSrcPipe implements PipeTransform {
  transform(content): any {
    if (!content) {
      return content;
    }
    content = content.replace(/src="/gi, 'src="/api');

    return content;
  }
}

@Pipe({
  name: 'distance',
  pure: false
})
// <em class="money"><i class="rmb">￥</i><span>{{item.price}}</span><i class="decimal">.00</i></em>
@Injectable()
export class DistancePipe implements PipeTransform {
  transform(meters): any {
    if (!meters) {
      return meters;
    }
    let html = '';
    if (meters < 1000) {
      html = `<em class="money"><i class="rmb">距离</i><span>${meters}</span><i class="decimal">米</i></em>`;
    } else {
      html = `<em class="money"><i class="rmb">距离</i><span>${Math.round(meters / 1000)}</span><i class="decimal">公里</i></em>`;
    }

    return html;
  }
}

@Pipe({
  name: 'detail',
  pure: false
})
// <em class="money"><i class="rmb">￥</i><span>{{item.price}}</span><i class="decimal">.00</i></em>
@Injectable()
export class DetailPipe implements PipeTransform {
  transform(html): any {
    if (!html) {
      return html;
    }
    return html.replace(/img src="/g, 'img src="/api');
  }
}

@Pipe({
  name: 'label',
  pure: false
})
// <em class="money"><i class="rmb">￥</i><span>{{item.price}}</span><i class="decimal">.00</i></em>
@Injectable()
export class LabelPipe implements PipeTransform {
  transform(value, data): any {
    if (!value) {
      return value;
    }
    const index = getIndex(data, 'value', value);
    return data[index].label;
  }
}

@Pipe({
  name: 'html',
  pure: false
})
// <em class="money"><i class="rmb">￥</i><span>{{item.price}}</span><i class="decimal">.00</i></em>
@Injectable()
export class HtmlPipe implements PipeTransform {
  transform(value): any {
    if (!value) {
      return value;
    }
    return value.replace(/\n/g, '<br/>');
  }
}

@Pipe({
  name: 'chips',
  pure: false
})
// <em class="money"><i class="rmb">￥</i><span>{{item.price}}</span><i class="decimal">.00</i></em>
@Injectable()
export class ChipsPipe implements PipeTransform {
  transform(chips): any {
    if (!chips) {
      return chips;
    }
    chips.forEach(chip => {
    });
    return chips.replace(/\n/g, '<br/>');
  }
}

@Pipe({
  name: 'userStatus',
  pure: false
})
// <em class="money"><i class="rmb">￥</i><span>{{item.price}}</span><i class="decimal">.00</i></em>
@Injectable()
export class UserStatusPipe implements PipeTransform {
  transform(status): any {
    if (!status) {
      return status;
    }
    let label = '试用中';
    let className = 'text-primary';
    if (status === 'new') {
      label = '新建档';
      className = 'text-new';
    }
    if (status === 'request') {
      label = '申请面试';
      className = 'text-new';
    }
    if (status === 'waiting') {
      label = '等待面试';
      className = 'text-waiting';
    }
    if (status === 'fail') {
      label = '面试失败';
      className = 'text-fail';
    }
    if (status === 'want') {
      label = '申请入厂';
      className = 'text-fail';
    }
    if (status === 'success') {
      label = '面试成功';
      className = 'text-success';
    }
    if (status === 'trial') {
      label = '试用中';
      className = 'text-primary';
    }
    if (status === 'in') {
      label = '入厂';
      className = 'text-success';
    }
    if (status === 'out') {
      label = '出厂';
      className = 'text-disabled';
    }
    return '<span class=' + className + '>' + label + '</span>';
  }
}

@Pipe({
  name: 'projectStatus',
  pure: false
})
// not being finished
@Injectable()
export class ProjectStatusPipe implements PipeTransform {
  transform(status): any {
    if (!status) {
      return status;
    }
    let label = '未开始';
    if (status === 'being') {
      label = '进行中';
    }
    if (status === 'finished') {
      label = '已完成';
    }
    if (status === 'fail') {
      label = '失败';
    }
    if (status === 'success') {
      label = '成功';
    }
    return '<span class=' + 'text-' + status + '>' + label + '</span>';
  }
}

const labels = [
  {
    en: 'level',
    cn: '级别'
  }
];

@Pipe({
  name: 'tableLabel',
  pure: false
})
// not being finished
@Injectable()
export class TableLabelPipe implements PipeTransform {
  transform(en): any {
    const index = getIndex(labels, 'en', en);
    return labels[index].cn;
  }
}
