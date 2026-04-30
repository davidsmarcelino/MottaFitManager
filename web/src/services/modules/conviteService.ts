import api from '../api';
import { ConviteRequest, AceitarConviteRequest } from '../../types';

export const conviteService = {
  criar: (data: ConviteRequest): Promise<any> =>
    api.post('/api/convite/criar', data).then(res => res.data),
  
  listar: (): Promise<any[]> =>
    api.get('/api/convite/listar').then(res => res.data),
  
  aceitar: (data: AceitarConviteRequest): Promise<any> =>
    api.post('/api/convite/aceitar', data).then(res => res.data),
};