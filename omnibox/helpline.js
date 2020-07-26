// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// This event is fired each time the user updates the text in the omnibox,
// as long as the extension's keyword mode is still active.

chrome.omnibox.onInputChanged.addListener(
    function(text, suggest) {
	var data = suggests.filter(function(x){
	    return x.description.match(RegExp(text,'i'))
	})
	suggest(data)
    }
)

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
    function(text) {
	console.log('inputEntered: ' + text)
	if(text.match(/^http/)){
	    window.open(text) // location.href = は動かない
	}
	else {
	    window.open('http://goquick.org/' + text)
	}
    }
)
