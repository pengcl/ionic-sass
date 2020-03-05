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

function getList(p?) {
    if (p) {
    } else {

    }
}

export function listToTree(data, options?) {
    options = options || {};
    const ID_KEY = options.idKey || 'i';
    const PARENT_KEY = options.parentKey || 'p';
    const CHILDREN_KEY = options.childrenKey || 'children';

    const tree = [];
    const childrenOf = {};
    let item;
    let id;
    let parentId;

    for (let i = 0, length = data.length; i < length; i++) {
        item = data[i];
        id = item[ID_KEY];
        parentId = item[PARENT_KEY] || 0;
        // every item may have children
        childrenOf[id] = childrenOf[id] || [];
        // init its children
        item[CHILDREN_KEY] = childrenOf[id];
        if (parentId !== 0) {
            // init its parent's children object
            childrenOf[parentId] = childrenOf[parentId] || [];
            // push it into its parent's children object
            childrenOf[parentId].push(item);
        } else {
            tree.push(item);
        }
    }

    return tree;
}

export function color() {
    const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];
    const index = Math.floor(colors.length * Math.random());
    return colors[index];
}

