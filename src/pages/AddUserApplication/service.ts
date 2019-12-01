import request from '@/utils/request';
import {backendLink} from "../../../config/backendLink";

export async function fakeSubmitForm(params: any) {
  return request(backendLink+'/api/applications', {
    method: 'POST',
    data: params,
  });
}
