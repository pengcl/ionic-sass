import {Inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable, of as observableOf, Subject, BehaviorSubject} from 'rxjs';
import {StorageService} from '../../../@core/services/storage.service';
import {mergeMap as observableMargeMap} from 'rxjs/operators';
import {resultProcess, formData} from '../../../@core/utils/utils';

const data = {
    'code': '0000',
    'result': {
        'id': 170,
        'gradeModelOperations': {
            'id': 15,
            'name': '优秀',
            'operation': '>',
            'val1': 90,
            'modelId': 2
        },
        'gradeModules': [
            {
                'id': 4,
                'name': '科研创造力'
            },
            {
                'id': 23,
                'name': '第二个测试模块'
            }
        ],
        'gradeModuleOperations': [
            {
                'id': 35,
                'name': '普通',
                'suggest': '建议增加企业知识产权比重。研发投入方面建议保持现状。',
                'moduleId': 4
            },
            {
                'id': 42,
                'name': '优秀',
                'suggest': 'baochi ',
                'moduleId': 23
            }
        ],
        'gradeTargets': [
            {
                'id': 9,
                'name': '科研成果'
            },
            {
                'id': 10,
                'name': '科研能力'
            },
            {
                'id': 11,
                'name': '企业体量'
            },
            {
                'id': 12,
                'name': '职能分布'
            },
            {
                'id': 13,
                'name': '经营信息-学历组成'
            },
            {
                'id': 14,
                'name': '科研人员学历组成'
            }
        ],
        'gradeTargetGroups': [
            {
                'id': 1104,
                'name': '正常',
                'score': 60,
                'suggest': '建议持续投入资源进行研发，产出科研成果',
                'targetId': 9,
                'isStandardeCond': 0
            },
            {
                'id': 14109,
                'name': '正常',
                'score': 5,
                'suggest': '增加投入',
                'targetId': 10,
                'isStandardeCond': 0
            },
            {
                'id': 6944,
                'name': '中型',
                'score': 15,
                'suggest': '',
                'targetId': 11,
                'isStandardeCond': 0
            },
            {
                'id': 14215,
                'name': '不合理',
                'score': 20,
                'suggest': '企业中，科研生产类岗位占比正常范围为10-40%，市场销售类岗位占比正常范围为20-50%，业务服务类岗位占比正常范围为10-25%。当前企业的职能分布结构不合理，缺少科研生产类员工，为企业健康发展着想，请尽快调整。',
                'targetId': 12,
                'isStandardeCond': 0
            },
            {
                'id': 14261,
                'name': '测试，可以删除',
                'score': 20,
                'suggest': '测试数据，正式配置时可以删除',
                'targetId': 13,
                'isStandardeCond': 0
            },
            {
                'id': 14269,
                'name': '测试数据60',
                'score': 60,
                'suggest': '测试数据，正式配置时可以删除',
                'targetId': 14,
                'isStandardeCond': 0
            },
            {
                'name': '待加强',
                'score': 50,
                'suggest': '成熟企业待加强',
                'targetId': -100,
                'isStandardeCond': 0
            },
            {
                'name': '待加强',
                'score': 50,
                'suggest': '经营广度成熟企业待加强',
                'targetId': -101,
                'isStandardeCond': 0
            }
        ],
        'gradeTargetStanderdeGroups': [],
        'gradeConds': [
            {
                'id': 7,
                'name': '成立年限',
                'unit': '年',
                'label': '经营信息'
            },
            {
                'id': 8,
                'name': '发明专利数量',
                'unit': '个',
                'label': '经营信息'
            },
            {
                'id': 21,
                'name': '职能分布-研发',
                'unit': '%',
                'label': '经营信息'
            },
            {
                'id': 0,
                'name': '行业范围',
                'unit': '无',
                'label': '1'
            },
            {
                'id': 18,
                'name': '企业人员总数（2）',
                'unit': '人',
                'label': '经营信息'
            },
            {
                'id': 19,
                'name': '营业收入（2）',
                'unit': '万元',
                'label': '经营信息'
            },
            {
                'id': 28,
                'name': '学历组成-专科',
                'unit': '%',
                'label': '经营信息'
            },
            {
                'id': 30,
                'name': '本科及以上学历科研人员占比（科研创造力）',
                'unit': '%',
                'label': '科研创造力'
            }
        ],
        'gradeCondVals': [
            {
                'id': 254,
                'name': '运营6-10年',
                'operation': 'between',
                'val1': 6,
                'val2': 10
            },
            {
                'id': 275,
                'name': '超过5个发明专利',
                'operation': '>=',
                'val1': 5,
                'val2': 0
            },
            {
                'id': 262,
                'name': '运营超过5年',
                'operation': '>',
                'val1': 5,
                'val2': 0
            },
            {
                'id': 407,
                'name': '0',
                'operation': '<',
                'val1': 12,
                'val2': 0
            },
            {
                'id': 35,
                'name': '软件和信息技术服务业',
                'operation': '=',
                'val1': 12,
                'val2': 0
            },
            {
                'id': 435,
                'name': '100-300人',
                'operation': 'between',
                'val1': 100,
                'val2': 300
            },
            {
                'id': 441,
                'name': '1000万-1亿',
                'operation': 'between',
                'val1': 1000,
                'val2': 10000
            },
            {
                'id': 470,
                'name': '20%',
                'operation': '=',
                'val1': 20,
                'val2': 0
            },
            {
                'id': 490,
                'name': '60%',
                'operation': 'between',
                'val1': 40,
                'val2': 60
            }
        ],
        'charts': [
            {
                'groupId': 1,
                'count': 2,
                'text': '助 卡趴停车',
                'count1': 5
            },
            {
                'groupId': 1,
                'count': 1,
                'text': '卡趴停车 助',
                'count1': 5
            },
            {
                'groupId': 1,
                'count': 1,
                'text': '车和家',
                'count1': 4
            },
            {
                'groupId': 2,
                'count': 3,
                'text': '2015'
            },
            {
                'groupId': 2,
                'count': 3,
                'text': '2016'
            },
            {
                'groupId': 5,
                'text': '35'
            },
            {
                'groupId': 5,
                'text': '39'
            },
            {
                'groupId': 5,
                'text': '42'
            },
            {
                'groupId': 3,
                'count': 1,
                'text': '广告销售',
                'count1': 18
            },
            {
                'groupId': 3,
                'count': 1,
                'text': '科技服务',
                'count1': 8
            },
            {
                'groupId': 6,
                'count': 4,
                'text': '运输贮藏'
            },
            {
                'groupId': 6,
                'count': 1,
                'text': '科技服务'
            },
            {
                'groupId': 6,
                'count': 1,
                'text': '广告销售'
            },
            {
                'groupId': 8,
                'count': 0,
                'text': '2015',
                'count1': 0,
                'count2': 3
            },
            {
                'groupId': 8,
                'count': 3,
                'text': '2016',
                'count1': 0,
                'count2': 0
            },
            {
                'groupId': 8,
                'count': 2,
                'text': '2017',
                'count1': 0,
                'count2': 0
            },
            {
                'groupId': 8,
                'count': 2,
                'text': '2018',
                'count1': 0,
                'count2': 0
            },
            {
                'groupId': 8,
                'count': 2,
                'text': '2019',
                'count1': 0,
                'count2': 0
            },
            {
                'groupId': 8,
                'count': 2,
                'text': '2020',
                'count1': 0,
                'count2': 0
            },
            {
                'groupId': 9,
                'count': 1,
                'text': '2015',
                'count1': 0,
                'count2': 0
            },
            {
                'groupId': 9,
                'count': 0,
                'text': '2016',
                'count1': 0,
                'count2': 3
            },
            {
                'groupId': 9,
                'count': 3,
                'text': '2017',
                'count1': 0,
                'count2': 5
            },
            {
                'groupId': 9,
                'count': 0,
                'text': '2018',
                'count1': 0,
                'count2': 4
            },
            {
                'groupId': 9,
                'count': 1,
                'text': '2019',
                'count1': 0,
                'count2': 4
            },
            {
                'groupId': 7,
                'count': 5,
                'text': '发明专利',
                'count1': 5
            },
            {
                'groupId': 7,
                'count': 16,
                'text': '软件著作权',
                'count1': 36
            },
            {
                'groupId': 4,
                'count': 20,
                'text': '科研费用占比',
                'count1': 0
            }
        ],
        'conds': [
            {
                'createTime': 1587373429000,
                'id': 7,
                'custId': 'd9c500f5263811eab1fb00163e0e6521',
                'condId': 19,
                'valId': 441,
                'val': 10000,
                'val1': '1000',
                'val2': '10000'
            },
            {
                'createTime': 1587373429000,
                'id': 8,
                'custId': 'd9c500f5263811eab1fb00163e0e6521',
                'condId': 18,
                'valId': 435,
                'val': 300,
                'val1': '100',
                'val2': '300'
            },
            {
                'createTime': 1587622615000,
                'id': 9,
                'custId': 'd9c500f5263811eab1fb00163e0e6521',
                'condId': 17,
                'valId': 446,
                'val': 8000,
                'val1': '2000',
                'val2': '8000'
            },
            {
                'createTime': 1587720605000,
                'id': 28,
                'custId': 'd9c500f5263811eab1fb00163e0e6521',
                'condId': 2,
                'valId': 292,
                'val': 15,
                'val1': '8',
                'val2': '15'
            },
            {
                'createTime': 1587720654000,
                'id': 29,
                'custId': 'd9c500f5263811eab1fb00163e0e6521',
                'condId': 15,
                'valId': 226,
                'val': 0,
                'val1': '0'
            },
            {
                'createTime': 1587720689000,
                'id': 30,
                'custId': 'd9c500f5263811eab1fb00163e0e6521',
                'condId': 21,
                'valId': 407,
                'val': 0,
                'val1': '0'
            },
            {
                'createTime': 1587720713000,
                'id': 31,
                'custId': 'd9c500f5263811eab1fb00163e0e6521',
                'condId': 23,
                'valId': 359,
                'val': 50,
                'val1': '30',
                'val2': '50'
            },
            {
                'createTime': 1587720733000,
                'id': 32,
                'custId': 'd9c500f5263811eab1fb00163e0e6521',
                'condId': 25,
                'valId': 507,
                'val': 10,
                'val1': '10'
            },
            {
                'createTime': 1587720755000,
                'id': 33,
                'custId': 'd9c500f5263811eab1fb00163e0e6521',
                'condId': 26,
                'valId': 515,
                'val': 10,
                'val1': '10'
            },
            {
                'createTime': 1587720780000,
                'id': 34,
                'custId': 'd9c500f5263811eab1fb00163e0e6521',
                'condId': 28,
                'valId': 470,
                'val': 20,
                'val1': '20'
            },
            {
                'createTime': 1587720794000,
                'id': 35,
                'custId': 'd9c500f5263811eab1fb00163e0e6521',
                'condId': 29,
                'valId': 477,
                'val': 40,
                'val1': '40'
            },
            {
                'createTime': 1587720834000,
                'id': 36,
                'custId': 'd9c500f5263811eab1fb00163e0e6521',
                'condId': 30,
                'valId': 490,
                'val': 60,
                'val1': '40',
                'val2': '60'
            },
            {
                'createTime': 1587720858000,
                'id': 37,
                'custId': 'd9c500f5263811eab1fb00163e0e6521',
                'condId': 31,
                'valId': 502,
                'val': 60,
                'val1': '40',
                'val2': '60'
            },
            {
                'createTime': 1587800583000,
                'id': 38,
                'custId': 'd9c500f5263811eab1fb00163e0e6521',
                'condId': 24,
                'valId': 525,
                'val': 200,
                'val1': '200'
            },
            {
                'createTime': 1587800686000,
                'id': 39,
                'custId': 'd9c500f5263811eab1fb00163e0e6521',
                'condId': 3,
                'valId': 54,
                'val': 1000,
                'val1': '500',
                'val2': '1000'
            },
            {
                'condId': 7,
                'val': 7
            },
            {
                'condId': 0,
                'valId': 35
            },
            {
                'condId': 11,
                'val': 16
            },
            {
                'condId': 8,
                'val': 5
            },
            {
                'condId': 9,
                'val': 0
            },
            {
                'condId': 5,
                'val': 8
            },
            {
                'condId': 6,
                'val': 3
            }
        ],
        'busindustry': {
            'createTime': 1584168757000,
            'createBy': 'cf0d55b21a6a11eab1fb00163e0e6521',
            'updateTime': 1584168757000,
            'updateBy': 'cf0d55b21a6a11eab1fb00163e0e6521',
            'createByName': 'qinzhenyu',
            'updateByName': 'qinzhenyu',
            'id': 35,
            'industryName': '互联网+',
            'explainContent': '互联网+',
            'summaryContent': '',
            'pointContent': '',
            'status': 1,
            'registedBrandCode': '9',
            'registedBrandCount': 12,
            'registedBrandCode2': '35',
            'registedBrandCount2': 18,
            'registedBrandCode3': '42',
            'registedBrandCount3': 8,
            'inventionCount': 5,
            'practicalCount': 30,
            'softwareCopyrightCount': 36,
            'relationCondValId': 35,
            'relationCondValName': '软件和信息技术服务业',
            'registedBrandName': '第九类——科学仪器',
            'registedBrandName2': '第三十五类——广告销售',
            'registedBrandName3': '第四十二类——科技服务'
        }
    }
};

@Injectable({providedIn: 'root'})
export class CompanyService {
    public companyRedirectUrl: string;
    private companyStatus = new Subject<boolean>();
    company = new Subject<any>();

    constructor(@Inject('PREFIX_URL') private PREFIX_URL,
                @Inject('CLOUDS_PREFIX_URL') private CLOUDS_PREFIX_URL,
                private router: Router,
                private http: HttpClient,
                private storage: StorageService) {
        this.company.next(this.storage.get('company'));
    }

    requestCompany() {
        if (this.router.url.indexOf('admin/company/item/0') !== -1) {
            return false;
        }
        if (this.companyRedirectUrl) {
            return false;
        }

        this.companyRedirectUrl = this.router.url;
        this.router.navigate(['/admin/company/item/0']);
    }

    list(body): Observable<any> {
        body.custType = 1;
        return this.http.get(this.PREFIX_URL + 'getCompCustList', {params: body}).pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));
    }

    source(custId): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'getSaasPlan', {custId}).pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));
    }

    get(id): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getCust' + '&id=' + id).pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));
    }

    search(name): Observable<any> {
        return this.http.get('http://api-v2.wispclouds.com/getcomlist?keyword=' + name);
    }

    find(name): Observable<any> {
        return this.http.get('https://api-v1.wispclouds.com/api/v1/company/getDetailByCompanyName?companyName=' + name + '&origin=' + 'WISP');
    }

    condVal(custId, condId): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'getCondVals', {custId, condId});
    }

    getCred(custId): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'getSaasCred', {custId}).pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));
    }

    updateCond(body): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'updateCustGradeConds', body).pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));
    }

    create(body): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'saveSaaSCust', body).pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));
    }

    change(body): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'updateSaaSCust', body).pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));
    }

    update(body): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'updateCust', body).pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));
    }

    default(id): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'setCustPrimary', {custId: id, custType: 1}).pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));
    }

    delete(id): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'delAssCust', formData({id})).pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));
    }

    validatorName(company): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'findByCompName', {company}).pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));
    }

    get currentCompany() {
        const company = this.storage.get('company');
        return JSON.parse(company);
    }

    get isExist(): boolean {
        this.companyStatus.next(!!this.currentCompany);
        return !!this.currentCompany;
    }

    getCompanyStatus(): Observable<boolean> {
        return this.companyStatus.asObservable();
    }

    updateCompanyStatus(company) {
        this.storage.set('company', JSON.stringify(company));
        this.company.next(company);
        this.companyStatus.next(this.isExist);
    }
}
