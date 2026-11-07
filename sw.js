// v1.3: no offline caching of private household data.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('push',event=>{
  let data={};try{data=event.data?.json()||{}}catch(e){data={body:event.data?.text()||''}}
  const notification=data.notification||data.data||data;
  event.waitUntil(self.registration.showNotification(notification.title||'ふたりの家計簿',{
    body:notification.body||'新しい支出が登録されました',icon:'./icon-192.png',badge:'./icon-192.png',tag:'futari-expense-'+(data.data?.expenseId||''),data:{url:self.registration.scope}
  }));
});
self.addEventListener('notificationclick',event=>{event.notification.close();event.waitUntil((async()=>{const url=event.notification.data?.url||self.registration.scope;const clientsList=await clients.matchAll({type:'window',includeUncontrolled:true});for(const client of clientsList){if(client.url.startsWith(self.registration.scope)){await client.focus();return}}await clients.openWindow(url)})())});
