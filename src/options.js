// Copyright 2020 StevenX911. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.
let localblocklist = [];
const TOSTRING = Function.call.bind(Object.prototype.toString);

document.addEventListener('DOMContentLoaded', function () {
  $(function () {
    if(location.hash === '#Donate'){
      $('#tabs').tabs({active: 2});
    } else if(location.hash === '#About'){
      $('#tabs').tabs({active: 1});
    } else {
      $('#tabs').tabs({active: 0});
    }
    $("button[name=button_ListSave]").button();
    chrome.storage.sync.get('blockurls', function (data) {
      if (data.blockurls != null && TOSTRING(data.blockurls) === '[object Array]') {
        localblocklist = data.blockurls;
        console.log('init local datas');
        updateBlocklistDisplay();
      }
    });
  });

  $(function () {
    $("#button_ListSave").click(function () {
      try {
        save();
        saveButtonAnimate(this.id, 'Saved Successfully!');
      } catch (err) {
        saveButtonAnimate(this.id, err.msg);
      }
    });
  });
});

function lines(s) {
  var links = (s ? s.split('\n') : []);
  for (var i in links) {
    links[i] = encodeURI(links[i]);
  }
  return links.filter(x => x.replace(/\s+/g, "") != '');
}

function save() {
  let newblocklist = lines($('#blocklist').val());
  if (newblocklist != null && TOSTRING(newblocklist) === '[object Array]') {
    chrome.storage.sync.set({
      blockurls: newblocklist
    }, function () {
      console.log('Update sync datas successfully!');
    });
    localblocklist = newblocklist;
    updateBlocklistDisplay();
  } else {
    throw new Error('Data Error! Save failed!')
  }
}

function saveButtonAnimate(buttonId, msg) {
  $('#' + buttonId).button('option', 'label', msg);
  setTimeout(function () {
    $('#' + buttonId).button('option', 'label', 'Save List Changes');
  }, 1500);
}

function updateBlocklistDisplay() {
  $('#blocklist').val(localblocklist.join('\n'));
}