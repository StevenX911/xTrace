// Copyright 2020 StevenX911. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.
const bgPage = chrome.extension.getBackgroundPage();

document.addEventListener('DOMContentLoaded', function () {

  $(function () {
    $('#tabs').tabs();
    $("button[name=button_ListSave]").button();
    updateBlocklistDisplay();
  });

  $(function () {
    $("#button_ListSave").click(function () {
      save();
      saveButtonAnimate(this.id);
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
  bgPage.saveBlocklist(lines($('#blocklist').val()));
  updateBlocklistDisplay();
}

function saveButtonAnimate(buttonId) {
  $('#' + buttonId).button('option', 'label', 'SAVED!');
  setTimeout(function () {
    $('#' + buttonId).button('option', 'label', 'Save List Changes');
  }, 1500);
}

function updateBlocklistDisplay() {
  $('#blocklist').val(bgPage.defaultblocklist.join('\n'));
}