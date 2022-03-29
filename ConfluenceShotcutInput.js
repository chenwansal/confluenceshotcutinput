// ==UserScript==
// @name         ConfluenceIndentAndOutdent
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  try to take over the world!
// @author       杰克有茶
// @match        docs.sofunny.io/*
// @defaulticon   
// @grant        none
// ==/UserScript==

const SHOTCUT_INDENT_CTRL_AND_KEY = "[";
const SHOTCUT_OUTDENT_CTRL_AND_KEY = "]";

const TIME_GAP = 300;
let ifr;
let ifrDocu;
let indentBtn;
let outdentBtn;
let saveBtn;
let cancelBtn;

let findMaintainTime;
let isFinding = false;

let isIndDown = false;
let isOudDown = false;

function ResetState() {
    ifr = undefined;
    ifrDocu = undefined;
    indentBtn = undefined;
    outdentBtn = undefined;
}

function TickFindIFrame() {
    setInterval(() => {
        if (ifr) {
            return;
        }
        ifr = document.getElementById("wysiwygTextarea_ifr");
        FindElement();
    }, TIME_GAP);
}

function FindElement() {

    if (ifr && ifrDocu && indentBtn && outdentBtn) {
        return;
    }

    if (isFinding) {
        return;
    }

    isFinding = true;

    findMaintainTime = 5 * 10000;

    let findInterval = setInterval(() => {

        if (findMaintainTime <= 0) {
            clearInterval(findInterval);
            console.warn("检索失败, 不再检索");
            isFinding = false;
            return;
        }

        findMaintainTime -= TIME_GAP;

        if (!ifr) {
            return;
        }

        ifrDocu = ifr.contentWindow.document

        indentBtn = document.getElementById("rte-button-indent");
        outdentBtn = document.getElementById("rte-button-outdent");

        if (ifr && ifrDocu && indentBtn && outdentBtn) {
            BindShotcutKey();
            TriggerCachedInput();
            clearInterval(findInterval);
            console.log("检索完成: 找到ind/oud");
            isFinding = false;
        }

    }, TIME_GAP);
}

function BindShotcutKey() {
    ifrDocu.onkeyup = function (e) {
        if (e.ctrlKey && e.key == SHOTCUT_INDENT_CTRL_AND_KEY) {
            outdentBtn.click();
        }
        if (e.ctrlKey && e.key == SHOTCUT_OUTDENT_CTRL_AND_KEY) {
            indentBtn.click();
        }
    }
    saveBtn = document.getElementById("rte-button-publish");
    saveBtn.addEventListener("click", (e) => {
        ResetState();
    });

    cancelBtn = document.getElementById("rte-button-cancel");
    cancelBtn.addEventListener("click", (e) => {
        ResetState();
    });
}

function CacheInput(indDown) {
    if (indDown) {
        isIndDown = true;
        setTimeout(() => {
            isIndDown = false;
        }, 300);
    } else {
        isOudDown = true;
        setTimeout(() => {
            isOudDown = false;
        }, 300);
    }
}

function TriggerCachedInput() {
    if (isIndDown) {
        indentBtn.click();
    } else if (isOudDown) {
        outdentBtn.click();
    }
}

(function () {

    'use strict';

    TickFindIFrame();

    FindElement();
    BindRestart();

})();