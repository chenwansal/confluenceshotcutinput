// ==UserScript==
// @name         ConfluenceIndentAndOutdent
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  try to take over the world!
// @author       杰克有茶
// @match        docs.sofunny.io/*
// @defaulticon   
// @grant        none
// ==/UserScript==

const SHOTCUT_INDENT_CTRL_AND_KEY = "[";
const SHOTCUT_OUTDENT_CTRL_AND_KEY = "]";

const TIME_GAP = 300;
let iframe;
let iframeDocu;
let toolbar;
let indentBtn;
let outdentBtn;

let hasBind = false;

function MainTick() {

    setInterval(() => {

        // ==== FIND iframe document ====
        let m_iframe = document.getElementById("wysiwygTextarea_ifr");
        if (m_iframe && m_iframe != iframe) {
            iframe = m_iframe;
            let _docu = m_iframe.contentWindow.document;
            if (_docu && _docu != iframeDocu) {
                iframeDocu = _docu;
                hasBind = false;
            }
        }

        // ==== FIND toolbar ====
        let m_tb = document.getElementById("toolbar");
        if (m_tb && m_tb != toolbar) {
            indentBtn = document.getElementById("rte-button-indent");
            outdentBtn = document.getElementById("rte-button-outdent");
            if (!indentBtn || !outdentBtn) {
                return;
            }
            toolbar = m_tb;
            hasBind = false;
        }

        // ==== BIND keyup event Once ====
        if (hasBind) {
            return;
        }

        let ptrDocu = iframeDocu ? iframeDocu : document;
        ptrDocu.onkeyup = (e) => {
            if (e.ctrlKey && e.key == SHOTCUT_INDENT_CTRL_AND_KEY) {
                outdentBtn.click();
            }
            if (e.ctrlKey && e.key == SHOTCUT_OUTDENT_CTRL_AND_KEY) {
                indentBtn.click();
            }
        }

        hasBind = true;

    }, TIME_GAP);
}

(function main() {

    'use strict';

    MainTick();

})();