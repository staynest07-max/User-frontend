import { describe,expect,it } from 'vitest'; import { nextNotificationPage } from './useNotifications';
describe('engagement pagination',()=>{it('stops at the final notification page',()=>{expect(nextNotificationPage({items:[],page:1,limit:20,total:21,totalPages:2})).toBe(2);expect(nextNotificationPage({items:[],page:2,limit:20,total:21,totalPages:2})).toBeUndefined();});});
