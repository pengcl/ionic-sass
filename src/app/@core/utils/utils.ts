import {of as observableOf} from 'rxjs';

export function isCn(str) {
  if (/.*[\u4e00-\u9fa5]+.*$/.test(str)) {
    return false;
  }
  return true;
}

export function formData(body: object): FormData {
  const form: FormData = new FormData();
  for (const kn in body) {
    if (body) {
      form.append(kn, body[kn] === undefined ? '' : body[kn]);
    }
  }
  return form;
}

export function formDataToUrl(body: object, ifFist?: boolean): string {
  let str = '';
  for (const keyName in body) {
    if (!str && ifFist) {
      str = '?' + keyName + '=' + (body[keyName] === undefined ? '' : encodeURI(encodeURI(body[keyName])));
    } else {
      str = str + '&' + keyName + '=' + (body[keyName] === undefined ? '' : encodeURI(encodeURI(body[keyName])));
    }
  }
  return str;
}

export function getIndex(arr, key, value) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === value) {
      return i;
    }
  }
}

export function resultProcess(res) {
  if (res.code === '0000') {
    return observableOf(res.result);
  } else {
    return observableOf(null);
  }
}

export function listToTree(list) {
  const copyList = list.slice(0);
  const tree = [];
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < copyList.length; i++) {
    // 找出每一项的父节点，并将其作为父节点的children
    // tslint:disable-next-line:prefer-for-of
    for (let j = 0; j < copyList.length; j++) {
      if (copyList[i].parentId === copyList[j].id) {
        if (copyList[j].children === undefined) {
          copyList[j].children = [];
        }
        copyList[j].children.push(copyList[i]);
      }
    }
    // 把根节点提取出来，parentId为null的就是根节点
    if (copyList[i].parentId === 0) {
      tree.push(copyList[i]);
    }
  }
  return tree;
}

export function color() {
  const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];
  const index = Math.floor(colors.length * Math.random());
  return colors[index];
}


