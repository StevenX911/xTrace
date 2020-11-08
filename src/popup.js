// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

document.addEventListener('DOMContentLoaded', function () {
  $("#pop_options").click(function () {
    openTab(chrome.extension.getURL('options.html'));
  });
  $("#pop_close").click(function () {
    window.close();
  });
  $("#pop_donate").click(function () {
    openTab(chrome.extension.getURL('options.html#Donate'));
  });
  $("#pop_about").click(function () {
    openTab(chrome.extension.getURL('options.html#About'));
  });
})

function openTab(url) {
  chrome.tabs.create({
    url: url
  });
  window.close();
}