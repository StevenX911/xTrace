// Copyright 2020 StevenX911. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.

'use strict';

// 内置默认阻断的URL
let defaultblocklist = [
  "://hm.baidu.com/",                              // -- 屏蔽某度追踪
  "://www.google-analytics.com/",                  // -- 屏蔽某歌追踪
  "://www.googletagmanager.com/",                  // -- 屏蔽某歌追踪
  "://my.openwrite.cn/",                           // -- 屏蔽某站'阅读更多'
  "://pagead2.googlesyndication.com/",             // -- 屏蔽某歌广告
  "://adservice.google.com",                       // -- 屏蔽某歌广告
  "://csdnimg.cn/release/blogv2/dist/pc/js/detail" // -- 屏蔽某站'阅读更多'
];

const TOSTRING = Function.call.bind(Object.prototype.toString);

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.get('blockurls', function(data) {
    if(data.blockurls != null && TOSTRING(data.blockurls) === '[object Array]'){
      data.blockurls.forEach(x => {
        if(!defaultblocklist.includes(x)){
          defaultblocklist.push(x);
        }
      });
      console.log('Sync chrome datas successfully!');
    } else {
      chrome.storage.sync.set({
        blockurls: defaultblocklist
      }, function () {
        console.log('Firstly run and init datas.');
      });
    }
  });
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (var key in changes) {
    var storageChange = changes[key];
    console.log('Storage key "%s" in namespace "%s" changed. ' +
                'Old value was "%s", new value is "%s".',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
    if(TOSTRING(storageChange.newValue) === '[object Array]'){
      defaultblocklist = storageChange.newValue;
      console.log('update defaultblocklist');
    }
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if(defaultblocklist.length > 0) {
      for(let item of defaultblocklist){
        if(details.url.indexOf(item) != -1){
          return {
            cancel: true
          };
        }
      }
    }
    // console.log(details.url);
  }, {
    urls: ["*://*/*.js*"]
  },
  ["blocking"]
);