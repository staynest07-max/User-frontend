import { beforeEach, describe, expect, it, vi } from 'vitest';
const get = vi.hoisted(() => vi.fn()); const post = vi.hoisted(() => vi.fn()); const patch = vi.hoisted(() => vi.fn()); const remove = vi.hoisted(() => vi.fn());
vi.mock('@/api/client', () => ({ apiClient: { get, post, patch, delete: remove } }));
import { savedPgService } from './savedPgService'; import { enquiryService } from './enquiryService'; import { visitService } from './visitService'; import { notificationQuery, notificationService } from './notificationService';
describe('engagement API services', () => {
  beforeEach(() => { vi.clearAllMocks(); get.mockResolvedValue({ data: [], meta: {} }); post.mockResolvedValue({ data: {} }); patch.mockResolvedValue({ data: {} }); remove.mockResolvedValue({ data: {} }); });
  it('uses saved PG endpoints', async () => { await savedPgService.list(); await savedPgService.save('pg-1'); await savedPgService.remove('pg-1'); expect(get).toHaveBeenCalledWith('/users/saved-pgs'); expect(post).toHaveBeenCalledWith('/users/saved-pgs/pg-1', {}); expect(remove).toHaveBeenCalledWith('/users/saved-pgs/pg-1'); });
  it('forwards only the enquiry contract payload', async () => { const input={pgId:'pg-1',message:'Hello'}; await enquiryService.create(input); expect(post).toHaveBeenCalledWith('/users/enquiries', input); });
  it('uses visit detail and cancel endpoints', async () => { await visitService.detail('v1'); await visitService.cancel('v1'); expect(get).toHaveBeenCalledWith('/users/visits/v1'); expect(patch).toHaveBeenCalledWith('/users/visits/v1/cancel', {}); });
  it('serializes notification filters and metadata', async () => { expect(notificationQuery({page:2,limit:10,unread:false})).toBe('?page=2&limit=10&unread=false'); get.mockResolvedValue({data:[],meta:{page:2,limit:10,total:21,totalPages:3}}); await expect(notificationService.list({page:2,limit:10})).resolves.toMatchObject({page:2,totalPages:3}); });
});
