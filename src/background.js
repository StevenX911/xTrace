// Copyright 2020 StevenX911. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.

'use strict';

// 内置默认阻断的URL
var defaultblocklist = [
  "://hm.baidu.com/",                              // -- 屏蔽某度追踪
  "://www.google-analytics.com/",                  // -- 屏蔽某歌追踪
  "://www.googletagmanager.com/",                  // -- 屏蔽某歌追踪
  "://my.openwrite.cn/",                           // -- 屏蔽某站'阅读更多'
  "://pagead2.googlesyndication.com/",             // -- 屏蔽某歌广告
  "://adservice.google.com",                       // -- 屏蔽某歌广告
  "://csdnimg.cn/release/blogv2/dist/pc/js/detail" // -- 屏蔽某站'阅读更多'
];

var TOSTRING = Function.call.bind(Object.prototype.toString);

function saveBlocklist(newblocklist){
  if(newblocklist !=null && TOSTRING(newblocklist) === '[object Array]'){
    defaultblocklist = newblocklist;
    chrome.storage.sync.set({
      blockurls: newblocklist
    }, function () {
      console.log('更新数据');
    });
  }
}

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.get('blockurls', function(data) {
    if(data.blockurls != null && TOSTRING(data.blockurls) === '[object Array]'){
      data.blockurls.forEach(x => {
        if(!defaultblocklist.includes(x)){
          defaultblocklist.push(x);
        }
      });
      console.log('同步数据');
    } else {
      chrome.storage.sync.set({
        blockurls: defaultblocklist
      }, function () {
        console.log('初始化');
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