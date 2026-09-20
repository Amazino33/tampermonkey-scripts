// ==UserScript==
// @name         Auto Click Sequence & OpenRouter AI Replies
// @namespace    http://tampermonkey.net/
// @version      5.9
// @description  Strict Zero-Default AI Messages (100% Genuine OpenRouter Generation, Automatic AI-Inactive User Alert & Campaign Pause), 5-Message Context Window, Smart 3-Message Photo Request Trigger, Instant Like & Wink Auto-Responder (Column 4 Live Notifications), Image/Photo Chat Detection, Real-time Review Regeneration, 100% Dynamic Multi-Profile Persona Auto-Detection, and Standalone Floating AI Writeup Studio
// @match        *://*.alpha.date/*
// @match        *://alpha.date/*
// @updateURL    https://raw.githubusercontent.com/Amazino33/tampermonkey-scripts/main/userscript.user.js
// @downloadURL  https://raw.githubusercontent.com/Amazino33/tampermonkey-scripts/main/userscript.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    if (window.top !== window.self) return;

    try {
        Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
        Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
        Object.defineProperty(document, 'webkitVisibilityState', { get: () => 'visible', configurable: true });

        window.addEventListener('visibilitychange', (e) => e.stopImmediatePropagation(), true);
        window.addEventListener('blur', (e) => e.stopImmediatePropagation(), true);
    } catch (err) {}

    // ==========================================
    // 0. DIAGNOSTIC LOGGING & EVENT ENGINE
    // ==========================================
    const debugLogs = (() => {
        try {
            const saved = sessionStorage.getItem('alpha_debug_logs');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    })();

    function logDebug(level, message, data = null) {
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
        const entry = { time: timeStr, level: level.toUpperCase(), message: String(message), data: data ? JSON.stringify(data) : null };
        debugLogs.push(entry);
        if (debugLogs.length > 250) debugLogs.shift();

        try {
            sessionStorage.setItem('alpha_debug_logs', JSON.stringify(debugLogs.slice(-100)));
        } catch (e) {}

        const colorMap = {
            'INFO': 'color: #38bdf8;',
            'STEP': 'color: #c084fc; font-weight: bold;',
            'SUCCESS': 'color: #34d399; font-weight: bold;',
            'WARN': 'color: #fbbf24; font-weight: bold;',
            'ERROR': 'color: #f87171; font-weight: bold;'
        };
        const style = colorMap[entry.level] || 'color: #e5e7eb;';
        console.log(`%c[Alpha ${entry.time}] [${entry.level}] ${entry.message}`, style, data || '');

        renderDebugLogsIfOpen();
    }

    // High-visibility user alert banner & chime when AI is inactive or fails
    function showAiInactiveAlert(title, message, isSticky = false) {
        // 1. Subtle Web Audio notification chime
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                const ctx = new AudioCtx();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(587.33, ctx.currentTime);
                osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
                gain.gain.setValueAtTime(0.25, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.36);
            }
        } catch (e) {}

        // 2. Native browser notification if permission granted
        try {
            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                new Notification(`🚨 [AI Inactive] ${title}`, {
                    body: message,
                    icon: 'https://alpha.date/favicon.ico'
                });
            }
        } catch (e) {}

        // 3. High-visibility top-of-screen alert banner
        try {
            let alertBox = document.getElementById('alpha-ai-alert-banner');
            if (!alertBox) {
                alertBox = document.createElement('div');
                alertBox.id = 'alpha-ai-alert-banner';
                alertBox.style.cssText = `
                    position: fixed;
                    top: 16px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 999999999;
                    background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
                    border: 2px solid #ef4444;
                    border-radius: 12px;
                    padding: 14px 20px;
                    color: #ffffff;
                    box-shadow: 0 12px 36px rgba(0,0,0,0.7), 0 0 24px rgba(239,68,68,0.6);
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    font-size: 13px;
                    line-height: 1.5;
                    max-width: 580px;
                    width: calc(100vw - 40px);
                    display: flex;
                    align-items: flex-start;
                    gap: 14px;
                    box-sizing: border-box;
                    animation: alphaAlertFadeIn 0.3s ease-out;
                `;
                if (!document.getElementById('alpha-alert-style')) {
                    const styleEl = document.createElement('style');
                    styleEl.id = 'alpha-alert-style';
                    styleEl.textContent = `
                        @keyframes alphaAlertFadeIn {
                            from { opacity: 0; transform: translate(-50%, -20px); }
                            to { opacity: 1; transform: translate(-50%, 0); }
                        }
                    `;
                    document.head.appendChild(styleEl);
                }
                document.body.appendChild(alertBox);
            }

            alertBox.innerHTML = `
                <div style="font-size: 26px; line-height: 1; flex-shrink: 0;">🚨</div>
                <div style="flex: 1;">
                    <div style="font-weight: 800; font-size: 14px; margin-bottom: 4px; color: #fee2e2; letter-spacing: 0.3px;">
                        ${title}
                    </div>
                    <div style="color: #fef2f2; font-size: 12px; line-height: 1.4;">
                        ${message}
                    </div>
                    <div style="margin-top: 8px; font-size: 11px; padding: 4px 8px; background: rgba(0,0,0,0.25); border-radius: 4px; color: #fde68a; display: inline-block;">
                        🛡️ <b>Strict Policy:</b> All default/fallback messages have been removed. No message will be sent without active AI.
                    </div>
                </div>
                <button id="alpha-ai-alert-dismiss" style="
                    background: rgba(255,255,255,0.2);
                    border: 1px solid rgba(255,255,255,0.4);
                    color: white;
                    font-size: 13px;
                    font-weight: bold;
                    cursor: pointer;
                    border-radius: 6px;
                    padding: 4px 10px;
                    margin-left: 4px;
                    flex-shrink: 0;
                ">Dismiss</button>
            `;

            const dismissBtn = document.getElementById('alpha-ai-alert-dismiss');
            if (dismissBtn) {
                dismissBtn.onclick = () => {
                    if (alertBox && alertBox.parentNode) alertBox.remove();
                };
            }

            if (!isSticky) {
                setTimeout(() => {
                    if (alertBox && alertBox.parentNode) alertBox.remove();
                }, 12000);
            }
        } catch (e) {}

        // 4. Update status bar and diagnostics
        try {
            updateStatus(`🚨 [AI INACTIVE] ${title}: ${message}`, true);
        } catch (e) {}
        logDebug('ERROR', `🚨 [AI Inactive] ${title}: ${message}`);
    }

    function smartClick(el) {
        if (!el) return false;
        el.scrollIntoView({ block: 'center', inline: 'center' });
        const rect = el.getBoundingClientRect();
        const opts = {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2
        };
        try {
            el.dispatchEvent(new PointerEvent('pointerdown', opts));
            el.dispatchEvent(new MouseEvent('mousedown', opts));
            el.dispatchEvent(new PointerEvent('pointerup', opts));
            el.dispatchEvent(new MouseEvent('mouseup', opts));
            el.click();
            return true;
        } catch (e) {
            el.click();
            return true;
        }
    }

    function runDiagnosticScan() {
        logDebug('STEP', '=== RUNNING SYSTEM DIAGNOSTIC SCAN ===');
        logDebug('INFO', `Current URL: ${window.location.href}`);
        logDebug('INFO', `Viewport: ${window.innerWidth}x${window.innerHeight}`);

        const rootEl = document.querySelector('#root');
        logDebug(rootEl ? 'SUCCESS' : 'ERROR', `Root Element (#root): ${rootEl ? 'Found' : 'MISSING'}`);

        const chatWrap = document.querySelector('[class*="wchat_wrap-"], [class*="page_wrap-"]');
        logDebug(chatWrap ? 'SUCCESS' : 'WARN', `Chat Main Wrapper (wchat_wrap): ${chatWrap ? 'Found' : 'MISSING (Are you on the chat page?)'}`);

        const col1 = document.querySelector('[class*="clmn_1-"], .clmn_1');
        logDebug(col1 ? 'SUCCESS' : 'WARN', `Column 1 Navigation Container: ${col1 ? 'Found' : 'MISSING'}`);

        const drawerOpen = document.querySelector('[class*="clmn_1_mm_chat_wrap-"][class*="opened-"]');
        logDebug('INFO', `Profiles Drawer Status: ${drawerOpen ? 'OPEN (Drawer covers Column 1)' : 'Closed (Normal)'}`);

        const onlineTextEl = document.querySelector('[class*="clmn_1_mm_chat_offline_girls_text-"]');
        logDebug('INFO', `Profiles Online Status Badge: ${onlineTextEl ? (onlineTextEl.textContent || '').trim() : 'Not visible (menu closed)'}`);

        const allChatsLink = findAllChatElement();
        logDebug(allChatsLink ? 'SUCCESS' : 'ERROR', `All Chats Link: ${allChatsLink ? 'FOUND (' + (allChatsLink.className || allChatsLink.tagName) + ')' : 'MISSING'}`);

        const chanceLink = findChanceElement();
        logDebug(chanceLink ? 'SUCCESS' : 'ERROR', `Chance Link: ${chanceLink ? 'FOUND (' + (chanceLink.className || chanceLink.tagName) + ')' : 'MISSING'}`);

        const col2List = document.querySelector('[data-testid="chat-list"], [class*="clmn_2_chat_block_list-"]');
        const itemCount = col2List ? col2List.querySelectorAll('[class*="clmn_2_chat_block_item-"]').length : 0;
        logDebug(col2List ? 'SUCCESS' : 'WARN', `Column 2 Chat List: ${col2List ? 'Found with ' + itemCount + ' chats' : 'MISSING'}`);

        const col3Area = document.querySelector('[class*="clmn_3"]');
        logDebug(col3Area ? 'SUCCESS' : 'WARN', `Column 3 Active Chat Pane: ${col3Area ? 'Found' : 'MISSING'}`);

        const limitCheck = getRemainingMessageLimit();
        logDebug('INFO', `Active Chat Message Limit: ${limitCheck.hasLimit ? limitCheck.raw + ' (skip=' + limitCheck.skip + ')' : 'No limit element detected (Unlimited/Normal)'}`);

        const textarea = document.querySelector('[class*="clmn_3"] textarea, textarea');
        logDebug(textarea ? 'SUCCESS' : 'WARN', `Message Textarea: ${textarea ? 'Found (Ready)' : 'MISSING'}`);
        logDebug('STEP', '=== DIAGNOSTIC SCAN COMPLETE ===');
    }


    // ==========================================
    // 3. STEP CONFIGURATION (Auto Sequence)
    // ==========================================
    const INITIAL_STEPS = [
        {
            name: "Step 1: Open chat menu",
            selector: "#root > main > div > div.page_wrap-4WmIhG > div.wchat_wrap-rzEzhI > div.clmn_1-R8mlkB.clmn_1 > div.clmn_1_mm_chat_wrap-ir_IEt > div.clmn_1_mm_chat_btn-xANjm7",
            fallback: '[class*="clmn_1_mm_chat_btn-"]'
        },
        {
            name: "Step 2: Select offline filter",
            selector: "#root > main > div > div.page_wrap-4WmIhG > div.wchat_wrap-rzEzhI > div.clmn_1-R8mlkB.clmn_1 > div.clmn_1_mm_chat_wrap-ir_IEt.opened-DIaALO > div.clmn_1_mm_chat_list_wrap-lC4ZNx > div.clmn_1_mm_chat_offline_girls-hOXNmH > div.clmn_1_mm_chat_list_item_right-_v_Bdx > label",
            fallback: '[class*="clmn_1_mm_chat_offline_girls-"] label'
        },
        {
            name: "Step 3: Select profile",
            selector: "[data-testid='profile-name']",
            fallback: "[data-testid='profile-name']"
        },
        {
            name: "Step 4: Open profile drafts",
            selector: "#root > main > div > div.page_wrap-4WmIhG > div.wchat_wrap-rzEzhI > div.clmn_1-R8mlkB.clmn_1 > div.clmn_1_profile_wrap-zz1Xgn > div.clmn_1_profile_bottom-ejPbsp > div.clmn_1_profile_btn-gGXED2.undefined",
            fallback: '[class*="clmn_1_profile_btn-"]'
        }
    ];

    const LIST_CONTAINER_SELECTOR = '.list-LkHMM3, [class*="list-LkHMM3"]';
    const CHECKBOX_SELECTOR = '.check_img-S0k03k, [class*="check_img-S0k03k"], [class*="check_img-"]';
    const SEND_BTN_SELECTOR = 'div.drafts_table_item_bottom-kFmAuu > div, [class*="drafts_table_item_bottom-"] > div, [class*="drafts_table_item_bottom-"] button';
    const POPUP_BTN_SELECTOR = 'body > div:nth-child(8) > div > div > div > div.popup_error > div.popup_error_btn, div.popup_error > div.popup_error_btn, [class*="popup_error"] [class*="popup_error_btn"]';

    const WAIT_TIMEOUT_MS = 15000;
    const DELAY_BETWEEN_STEPS_MS = 400;
    const PROCESSED_ATTR = 'data-tm-processed';

    let isRunning = false;
    let stopRequested = false;

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function findElement(primarySelector, fallbackSelector) {
        let el = document.querySelector(primarySelector);
        if (el) return el;
        if (fallbackSelector) {
            el = document.querySelector(fallbackSelector);
            if (el) return el;
        }
        return null;
    }

    function waitForElement(primarySelector, fallbackSelector, timeout = WAIT_TIMEOUT_MS) {
        return new Promise((resolve, reject) => {
            const existing = findElement(primarySelector, fallbackSelector);
            if (existing) return resolve(existing);

            const observer = new MutationObserver(() => {
                const el = findElement(primarySelector, fallbackSelector);
                if (el) {
                    observer.disconnect();
                    clearTimeout(timer);
                    resolve(el);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true, attributes: true });

            const timer = setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Timed out waiting for: ${primarySelector}`));
            }, timeout);
        });
    }

    async function waitForPopupToClose(maxWaitMs = 3000) {
        const start = Date.now();
        while (Date.now() - start < maxWaitMs) {
            const popup = document.querySelector('div.popup_error, [class*="popup_error"]');
            if (!popup || popup.offsetParent === null) return;
            await sleep(100);
        }
    }

    async function waitForSendButton(timeoutMs = 5000) {
        const start = Date.now();
        while (Date.now() - start < timeoutMs) {
            const btns = Array.from(document.querySelectorAll(SEND_BTN_SELECTOR));
            const visibleBtn = btns.find((b) => b.offsetParent !== null);
            if (visibleBtn) return visibleBtn;
            await sleep(150);
        }
        return null;
    }

    async function ensureDraftsModalOpen() {
        let container = document.querySelector(LIST_CONTAINER_SELECTOR);
        if (!container || container.offsetParent === null) {
            updateStatus("Re-opening drafts modal (Step 4)...");
            const step4 = await waitForElement(INITIAL_STEPS[3].selector, INITIAL_STEPS[3].fallback, 8000);
            step4.scrollIntoView({ block: 'center' });
            step4.click();
            await sleep(600);
            container = await waitForElement(LIST_CONTAINER_SELECTOR, LIST_CONTAINER_SELECTOR, 8000);
            await sleep(400);
        }
        return container;
    }

    async function runAutoSenderLoop() {
        updateStatus("Locating drafts list...");
        let container = await ensureDraftsModalOpen();
        await sleep(DELAY_BETWEEN_STEPS_MS);

        const initialCheckboxes = Array.from(container.querySelectorAll(CHECKBOX_SELECTOR));
        const totalItems = initialCheckboxes.length;

        if (totalItems === 0) {
            updateStatus("No drafts found in list.", true);
            return;
        }

        updateStatus(`Found ${totalItems} drafts. Processing...`);

        for (let i = 0; i < totalItems; i++) {
            if (stopRequested) {
                updateStatus("Sequence stopped by user.");
                return;
            }

            // Check hourly rate limit quota
            const hourlyCheck = isHourlyLimitReached();
            if (hourlyCheck.reached) {
                const waitMins = Math.max(1, Math.ceil(hourlyCheck.nextAvailableMs / 60000));
                updateStatus(`⏸️ Senders paused: Hourly limit reached (${hourlyCheck.count}/${hourlyCheck.limit} msgs). Resumes in ~${waitMins}m.`, true);
                logDebug('WARN', `[Run Senders] Hourly rate limit reached (${hourlyCheck.count}/${hourlyCheck.limit}). Pausing sequence.`);
                break;
            }

            const currentNum = i + 1;
            updateStatus(`[${currentNum}/${totalItems}] Checking modal state...`);

            container = await ensureDraftsModalOpen();
            await sleep(200);

            const currentCheckboxes = Array.from(container.querySelectorAll(CHECKBOX_SELECTOR));
            let targetCheckbox = currentCheckboxes.find((el) => !el.hasAttribute(PROCESSED_ATTR));
            if (!targetCheckbox) {
                targetCheckbox = currentCheckboxes[i] || currentCheckboxes[0];
            }

            if (!targetCheckbox) break;

            targetCheckbox.setAttribute(PROCESSED_ATTR, 'true');
            targetCheckbox.scrollIntoView({ block: 'center' });
            await sleep(200);

            ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((evt) => {
                targetCheckbox.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true, view: window }));
            });
            updateStatus(`[${currentNum}/${totalItems}] Checked draft.`);
            await sleep(DELAY_BETWEEN_STEPS_MS);

            updateStatus(`[${currentNum}/${totalItems}] Waiting for Send button...`);
            const sendBtn = await waitForSendButton(6000);

            if (!sendBtn) {
                throw new Error(`Send button did not appear for draft #${currentNum}.`);
            }

            sendBtn.scrollIntoView({ block: 'center' });
            sendBtn.click();
            updateStatus(`[${currentNum}/${totalItems}] Clicked Send.`);
            await sleep(DELAY_BETWEEN_STEPS_MS);

            updateStatus(`[${currentNum}/${totalItems}] Waiting for confirmation popup...`);
            try {
                const popupBtn = await waitForElement(POPUP_BTN_SELECTOR, POPUP_BTN_SELECTOR, 6000);
                const clickTarget = popupBtn.querySelector('span') || popupBtn;
                clickTarget.click();
                updateStatus(`[${currentNum}/${totalItems}] Dismissed popup.`);
            } catch (err) {
                console.warn(`[AutoSender] No popup for item #${currentNum}`);
            }

            await waitForPopupToClose(3000);
            recordHourlySend();
            await sleep(DELAY_BETWEEN_STEPS_MS + 200);
        }

        updateStatus(`Finished! Successfully processed drafts.`);
    }

    async function runSequence() {
        if (isRunning) {
            stopRequested = true;
            updateStatus("Stopping senders...");
            return;
        }

        isRunning = true;
        stopRequested = false;
        setButtonState(true);

        try {
            logDebug('STEP', "=== RUN SENDERS INITIATED ===");
            updateStatus("Run Senders: Checking if all profiles are online...");

            // Smart Guard: Only run when ALL profiles are online
            const profileStatus = await ensureProfilesOnline().catch((e) => {
                logDebug('WARN', 'Profile check encountered an error:', e);
                return { found: false, isAllOnline: false, onlineCount: 0, totalCount: 0 };
            });

            if (stopRequested) throw new Error("Stopped by user.");

            if (profileStatus.found && !profileStatus.isAllOnline) {
                const errMsg = `Cannot run senders: Only ${profileStatus.onlineCount}/${profileStatus.totalCount} profiles online. Senders requires ALL profiles online.`;
                logDebug('ERROR', errMsg);
                throw new Error(errMsg);
            }

            if (profileStatus.found && profileStatus.isAllOnline) {
                logDebug('SUCCESS', `Verified: All profiles online (${profileStatus.onlineCount}/${profileStatus.totalCount}). Proceeding with senders.`);
                updateStatus(`Verified: All profiles online (${profileStatus.onlineCount}/${profileStatus.totalCount}). Proceeding...`);
            }

            for (let i = 0; i < INITIAL_STEPS.length; i++) {
                if (stopRequested) throw new Error("Stopped by user.");
                const step = INITIAL_STEPS[i];

                // Smart Step 2 Guard: NEVER toggle profiles offline if all profiles are already online
                if (step.name.includes("Step 2")) {
                    const check = await getProfilesOnlineStatus();
                    if (check.isAllOnline) {
                        updateStatus(`Step 2: Profiles already online (${check.onlineCount}/${check.totalCount}). Skipping toggle.`);
                        logDebug('INFO', `Step 2: Profiles already online (${check.onlineCount}/${check.totalCount}) - skipped toggle to preserve online state.`);
                        await sleep(200);
                        continue;
                    }
                }

                updateStatus(`${step.name}: waiting...`);
                const el = await waitForElement(step.selector, step.fallback);
                el.scrollIntoView({ block: 'center' });
                el.click();
                updateStatus(`${step.name}: clicked.`);
                await sleep(DELAY_BETWEEN_STEPS_MS);
            }

            await runAutoSenderLoop();

        } catch (err) {
            updateStatus(`Error: ${err.message}`, true);
            logDebug('ERROR', `Run Senders error: ${err.message}`);
            console.error('[AutoSender]', err);
        } finally {
            isRunning = false;
            stopRequested = false;
            setButtonState(false);
        }
    }

    
    // ==========================================
    // 3B. RECURRING INACTIVITY CAMPAIGNS & HOURLY RATE LIMITER
    // ==========================================
    const CAMPAIGN_INTERVAL_HOURS_KEY = 'alpha_campaign_interval_hours';
    const CAMPAIGN_DELAY_MS_KEY = 'alpha_campaign_delay_ms';
    const HOURLY_MESSAGE_LIMIT_KEY = 'alpha_hourly_msg_limit';
    const HOURLY_SENDS_LOG_KEY = 'alpha_hourly_sends_log';

    // Independent storage keys for All Chats and Chance
    const ALL_CHATS_ENABLED_KEY = 'alpha_campaign_all_chats_enabled';
    const ALL_CHATS_LAST_RUN_KEY = 'alpha_campaign_all_chats_last_run';
    const CHANCE_ENABLED_KEY = 'alpha_campaign_chance_enabled';
    const CHANCE_LAST_RUN_KEY = 'alpha_campaign_chance_last_run';

    let activeCampaignType = null; // null | 'all_chats' | 'chance'
    let queuedCampaign = null; // null | 'all_chats' | 'chance'
    let stopCampaignRequested = false;

    function getCampaignIntervalHours() {
        const stored = localStorage.getItem(CAMPAIGN_INTERVAL_HOURS_KEY);
        // Default to 1 hour; automatically migrate legacy 3-hour settings to 1 hour
        if (!stored || stored === '3' || stored === '3.0') {
            localStorage.setItem(CAMPAIGN_INTERVAL_HOURS_KEY, '1');
            return 1;
        }
        const val = parseFloat(stored);
        return isNaN(val) || val <= 0 ? 1 : val;
    }

    function setCampaignIntervalHours(hours) {
        localStorage.setItem(CAMPAIGN_INTERVAL_HOURS_KEY, hours.toString());
    }

    // ==========================================
    // HOURLY MESSAGE LIMIT & RATE TRACKING (v5.1)
    // ==========================================
    function getHourlyMessageLimit() {
        const stored = localStorage.getItem(HOURLY_MESSAGE_LIMIT_KEY);
        if (stored === null) return 30; // Default: 30 msgs/hour
        const val = parseInt(stored, 10);
        return isNaN(val) ? 30 : val; // 0 or negative = Unlimited
    }

    function setHourlyMessageLimit(limit) {
        const val = parseInt(limit, 10);
        localStorage.setItem(HOURLY_MESSAGE_LIMIT_KEY, (isNaN(val) ? 30 : val).toString());
    }

    function getRecentHourlySends() {
        try {
            const raw = localStorage.getItem(HOURLY_SENDS_LOG_KEY);
            const arr = raw ? JSON.parse(raw) : [];
            const oneHourAgo = Date.now() - 3600 * 1000;
            const filtered = Array.isArray(arr) ? arr.filter(ts => typeof ts === 'number' && ts > oneHourAgo) : [];
            return filtered;
        } catch (e) {
            return [];
        }
    }

    function recordHourlySend() {
        try {
            const sends = getRecentHourlySends();
            sends.push(Date.now());
            localStorage.setItem(HOURLY_SENDS_LOG_KEY, JSON.stringify(sends));
            updateCampaignCountdownUI();
        } catch (e) {}
    }

    function getHourlySendCount() {
        return getRecentHourlySends().length;
    }

    function isHourlyLimitReached() {
        const limit = getHourlyMessageLimit();
        const sends = getRecentHourlySends();
        const count = sends.length;
        if (limit <= 0) {
            return { reached: false, count, limit: 0, nextAvailableMs: 0 };
        }
        if (count >= limit) {
            const oldest = sends.length > 0 ? Math.min(...sends) : Date.now();
            const nextAvailableMs = Math.max(0, (oldest + 3600 * 1000) - Date.now());
            return { reached: true, count, limit, nextAvailableMs };
        }
        return { reached: false, count, limit, nextAvailableMs: 0 };
    }

    function getCampaignDelayMs() {
        const val = parseInt(localStorage.getItem(CAMPAIGN_DELAY_MS_KEY) || '2500', 10);
        return isNaN(val) || val < 1000 ? 2500 : val;
    }

    // All Chats Scheduler State
    function isAllChatsSchedulerEnabled() {
        if (localStorage.getItem(ALL_CHATS_ENABLED_KEY) === null) {
            return localStorage.getItem('alpha_campaign_enabled') === 'true';
        }
        return localStorage.getItem(ALL_CHATS_ENABLED_KEY) === 'true';
    }

    function setAllChatsSchedulerEnabled(enabled) {
        localStorage.setItem(ALL_CHATS_ENABLED_KEY, enabled ? 'true' : 'false');
        localStorage.setItem('alpha_campaign_enabled', enabled ? 'true' : 'false'); // legacy sync
    }

    // Chance Scheduler State
    function isChanceSchedulerEnabled() {
        return localStorage.getItem(CHANCE_ENABLED_KEY) === 'true';
    }

    function setChanceSchedulerEnabled(enabled) {
        localStorage.setItem(CHANCE_ENABLED_KEY, enabled ? 'true' : 'false');
    }

    // Step 3.1: Profile Online State & Verification (v4.0 Smart Guard)
    async function getProfilesOnlineStatus() {
        let statusEl = document.querySelector('[class*="clmn_1_mm_chat_offline_girls_text-"]');
        if (!statusEl) {
            // Open the chat menu drawer if closed
            const menuBtn = document.querySelector(
                '[class*="clmn_1_mm_chat_btn-"], #root > main > div > div.page_wrap-4WmIhG > div.wchat_wrap-rzEzhI > div.clmn_1-R8mlkB.clmn_1 > div.clmn_1_mm_chat_wrap-ir_IEt > div.clmn_1_mm_chat_btn-xANjm7'
            );
            if (menuBtn) {
                menuBtn.scrollIntoView({ block: 'center' });
                menuBtn.click();
                await sleep(500);
            }
            statusEl = await waitForElement('[class*="clmn_1_mm_chat_offline_girls_text-"]', '[class*="clmn_1_mm_chat_offline_girls_text-"]', 3500).catch(() => null);
        }

        if (statusEl) {
            const text = (statusEl.textContent || '').trim();
            const match = text.match(/(\d+)\s*\/\s*(\d+)\s*online/i);
            if (match) {
                const onlineCount = parseInt(match[1], 10);
                const totalCount = parseInt(match[2], 10);
                const isAllOnline = totalCount > 0 && onlineCount === totalCount;
                return { found: true, onlineCount, totalCount, isAllOnline, text };
            }
            return { found: true, onlineCount: 0, totalCount: 0, isAllOnline: false, text };
        }
        return { found: false, onlineCount: 0, totalCount: 0, isAllOnline: false, text: '' };
    }

    async function ensureProfilesOnline() {
        updateStatus("Checking if all profiles are online...");
        logDebug('INFO', "Checking profiles online status...");

        let status = await getProfilesOnlineStatus();

        if (status.found && status.isAllOnline) {
            logDebug('SUCCESS', `All profiles already online: ${status.onlineCount}/${status.totalCount}.`);
            updateStatus(`Profiles status: ${status.onlineCount}/${status.totalCount} online (All online).`);
            return status;
        }

        // If not all online (e.g. 0/13 or onlineCount < totalCount), activate toggle
        if (status.found && !status.isAllOnline) {
            logDebug('STEP', `Activating profiles to online (Current: ${status.onlineCount}/${status.totalCount})...`);
            updateStatus(`Activating profiles online (${status.onlineCount}/${status.totalCount})...`);

            const toggleLabel = document.querySelector(
                '#root > main > div > div.page_wrap-4WmIhG > div.wchat_wrap-rzEzhI > div.clmn_1-R8mlkB.clmn_1 > div.clmn_1_mm_chat_wrap-ir_IEt.opened-DIaALO > div.clmn_1_mm_chat_list_wrap-lC4ZNx > div.clmn_1_mm_chat_offline_girls-hOXNmH > div.clmn_1_mm_chat_list_item_right-_v_Bdx > label, [class*="clmn_1_mm_chat_offline_girls-"] [class*="clmn_1_mm_chat_list_item_right-"] label, [class*="clmn_1_mm_chat_offline_girls-"] label'
            );

            if (toggleLabel) {
                toggleLabel.scrollIntoView({ block: 'center' });
                toggleLabel.click();
                await sleep(800);

                // Re-verify status
                status = await getProfilesOnlineStatus();
                logDebug('INFO', `Profiles status after toggle: ${status.onlineCount}/${status.totalCount} online.`);
                updateStatus(`Profiles status after toggle: ${status.onlineCount}/${status.totalCount} online.`);
            } else {
                logDebug('WARN', 'Could not find profiles online toggle button.');
            }
        } else {
            logDebug('WARN', 'Could not locate profile online status badge element.');
        }

        return status;
    }

    function findAllChatElement() {
        // 1. Precise selector
        let el = document.querySelector('#root > main > div > div.page_wrap-4WmIhG > div.wchat_wrap-rzEzhI > div.clmn_1-R8mlkB.clmn_1 > div.clmn_1_menu_list-s4yrCR > div:nth-child(1) > div.clmn_1_menu_item-OoLICg.chat-aU3rgj');
        if (el) return el;

        // 2. Class-based fallback
        el = document.querySelector('[class*="clmn_1_menu_item-"][class*="chat-"], [class*="clmn_1_menu_list-"] [class*="chat-"], [class*="chat-aU3rgj"]');
        if (el) return el;

        // 3. General Column 1 chat item
        el = document.querySelector('[class*="clmn_1"] [class*="chat-"]');
        if (el) return el;

        // 4. Text-based search inside Column 1
        const col1 = document.querySelector('[class*="clmn_1"]');
        if (col1) {
            const items = Array.from(col1.querySelectorAll('div, a, span'));
            const match = items.find(i => {
                const t = (i.textContent || '').trim().toLowerCase();
                return (t === 'all chats' || t === 'all chat' || t === 'chats') && i.children.length <= 2;
            });
            if (match) return match.closest('[class*="clmn_1_menu_item-"]') || match;
        }
        return null;
    }

    function findChanceElement() {
        // 1. Precise selector
        let el = document.querySelector('#root > main > div > div.page_wrap-4WmIhG > div.wchat_wrap-rzEzhI > div.clmn_1-R8mlkB.clmn_1 > div.clmn_1_menu_list-s4yrCR > div.clmn_1_matches_folders-LJtPpl > div.clmn_1_menu_item-OoLICg.matches-UdzjR8');
        if (el) return el;

        // 2. Class-based fallback
        el = document.querySelector('[class*="clmn_1_matches_folders-"] [class*="matches-"], [class*="clmn_1_menu_item-"][class*="matches-"], [class*="matches-UdzjR8"]');
        if (el) return el;

        // 3. General Column 1 matches item
        el = document.querySelector('[class*="clmn_1"] [class*="matches-"]');
        if (el) return el;

        // 4. Text-based search inside Column 1
        const col1 = document.querySelector('[class*="clmn_1"]');
        if (col1) {
            const items = Array.from(col1.querySelectorAll('div, a, span'));
            const match = items.find(i => {
                const t = (i.textContent || '').trim().toLowerCase();
                return (t === 'chance' || t === 'matches') && i.children.length <= 2;
            });
            if (match) return match.closest('[class*="clmn_1_menu_item-"]') || match;
        }
        return null;
    }

    // Close profiles drawer if open so it doesn't obstruct Column 1
    async function ensureProfilesDrawerClosed() {
        const openedDrawer = document.querySelector('[class*="clmn_1_mm_chat_wrap-"][class*="opened-"]');
        if (openedDrawer) {
            logDebug('STEP', 'Profiles drawer is open; closing drawer to expose Column 1 menu...');
            const menuBtn = document.querySelector('[class*="clmn_1_mm_chat_btn-"], #root > main > div > div.page_wrap-4WmIhG > div.wchat_wrap-rzEzhI > div.clmn_1-R8mlkB.clmn_1 > div.clmn_1_mm_chat_wrap-ir_IEt > div.clmn_1_mm_chat_btn-xANjm7');
            if (menuBtn) {
                smartClick(menuBtn);
                await sleep(500);
            }
        }
    }

    // Step 3.2A: Click on the "All chat" link
    async function navigateToAllChats() {
        logDebug('STEP', 'Navigating to All Chats...');
        updateStatus("Campaign: Navigating to All Chats...");

        // Ensure drawer is closed if open
        await ensureProfilesDrawerClosed();

        let allChatLink = findAllChatElement();
        if (!allChatLink) {
            logDebug('WARN', 'All Chat link not immediately visible, waiting up to 5s...');
            const startWait = Date.now();
            while (Date.now() - startWait < 5000) {
                await sleep(300);
                allChatLink = findAllChatElement();
                if (allChatLink) break;
            }
        }

        if (allChatLink) {
            logDebug('SUCCESS', 'Found All Chat link. Dispatching smart click...', { tag: allChatLink.tagName, class: allChatLink.className });
            smartClick(allChatLink);
            updateStatus("Clicked All Chat link.");
            await sleep(900);
            logDebug('INFO', `After click: Current URL = ${window.location.href}`);
        } else {
            runDiagnosticScan();
            throw new Error("Could not find All Chat navigation link in Column 1. Check Debug Logs for details.");
        }
    }

    // Step 3.2B: Click on the "Chance" link (matches folders)
    async function navigateToChance() {
        logDebug('STEP', 'Navigating to Chance (Matches)...');
        updateStatus("Campaign: Navigating to Chance (Matches)...");

        // Ensure drawer is closed if open
        await ensureProfilesDrawerClosed();

        let chanceLink = findChanceElement();
        if (!chanceLink) {
            logDebug('WARN', 'Chance link not immediately visible, waiting up to 5s...');
            const startWait = Date.now();
            while (Date.now() - startWait < 5000) {
                await sleep(300);
                chanceLink = findChanceElement();
                if (chanceLink) break;
            }
        }

        if (chanceLink) {
            logDebug('SUCCESS', 'Found Chance link. Dispatching smart click...', { tag: chanceLink.tagName, class: chanceLink.className });
            smartClick(chanceLink);
            updateStatus("Clicked Chance (Matches) link.");
            await sleep(900);
            logDebug('INFO', `After click: Current URL = ${window.location.href}`);
        } else {
            runDiagnosticScan();
            throw new Error("Could not find Chance navigation link in Column 1. Check Debug Logs for details.");
        }
    }

    // Step 3.3: If list is empty, toggle the online/offline button
    async function checkAndToggleOnlineFilterIfEmpty() {
        updateStatus("Campaign: Checking chat list items...");
        await sleep(500);

        const listContainer = document.querySelector('[data-testid="chat-list"], [class*="clmn_2_chat_block_list-"]');
        let items = listContainer ? Array.from(listContainer.querySelectorAll('[class*="clmn_2_chat_block_item-"]')) : [];

        if (items.length === 0) {
            updateStatus("Chat list is empty. Toggling online/offline filter...");
            const toggleSelector = '#root > main > div > div.page_wrap-4WmIhG > div.wchat_wrap-rzEzhI > div.clmn_2-UZvWb3.clmn_2_chat-JMJGk8 > div.clmn_2_chat_top_filters_container-GNfN_U > div.clmn_2_chat_top_filters-T5B165 > div.clmn_2_chat_top_filters_is_online-NZj3ju > label';
            const fallback = '[class*="clmn_2_chat_top_filters_is_online-"] label, [class*="clmn_2_chat_top_filters_"] [class*="is_online"] label';

            const toggleBtn = findElement(toggleSelector, fallback);
            if (toggleBtn) {
                toggleBtn.scrollIntoView({ block: 'center' });
                toggleBtn.click();
                updateStatus("Toggled online/offline user filter.");
                await sleep(1000);
            } else {
                console.warn('[Campaign] Online/offline toggle button not found.');
            }
        }
    }

    // ==========================================
    // CAMPAIGN SEND MEMORY & ANTI-LETTER GUARDS
    // ==========================================
    const RECENT_SENDS_STORAGE_KEY = 'aht_recent_campaign_sends';

    function getRecentCampaignSends() {
        try {
            const raw = sessionStorage.getItem(RECENT_SENDS_STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    }

    function recordCampaignSend(contactKey) {
        if (!contactKey) return;
        try {
            const sends = getRecentCampaignSends();
            sends[contactKey] = Date.now();
            // Prune entries older than 24 hours
            const cutoff = Date.now() - 24 * 3600 * 1000;
            for (const k in sends) {
                if (sends[k] < cutoff) delete sends[k];
            }
            sessionStorage.setItem(RECENT_SENDS_STORAGE_KEY, JSON.stringify(sends));
            logDebug('SUCCESS', `Recorded campaign send for: ${contactKey}`);
        } catch (e) {}
    }

    function wasRecentlyMessagedByCampaign(contactKey, thresholdHours = getCampaignIntervalHours()) {
        if (!contactKey) return { recent: false, diffHours: 999 };
        try {
            const sends = getRecentCampaignSends();
            const sentAt = sends[contactKey];
            if (!sentAt) return { recent: false, diffHours: 999 };
            const diffHours = (Date.now() - sentAt) / (1000 * 3600);
            return {
                recent: diffHours < thresholdHours,
                diffHours: diffHours
            };
        } catch (e) {
            return { recent: false, diffHours: 999 };
        }
    }

    function cleanTimestampString(timeStr) {
        if (!timeStr) return '';
        // Strip credit text appended by helper extensions e.g. "| 0 credits, This chat: 0, All: 0"
        let clean = timeStr.split('|')[0].trim();
        // Strip checkmarks or delivery status e.g. "✓", "✓✓", "(delivered)"
        clean = clean.replace(/[\u2713\u2714\u2705]/g, '').replace(/\((?:delivered|read|sent)\)/gi, '').trim();
        return clean;
    }

    // ==========================================
    // ONLINE / OFFLINE FILTER CONTROLLER (v3.9)
    // ==========================================
    function findOnlineFilterToggle() {
        const toggleSelector = '#root > main > div > div.page_wrap-4WmIhG > div.wchat_wrap-rzEzhI > div.clmn_2-UZvWb3.clmn_2_chat-JMJGk8 > div.clmn_2_chat_top_filters_container-GNfN_U > div.clmn_2_chat_top_filters-T5B165 > div.clmn_2_chat_top_filters_is_online-NZj3ju > label';
        const fallback = '[class*="clmn_2_chat_top_filters_is_online-"] label, [class*="clmn_2_chat_top_filters_"] [class*="is_online"] label, [class*="is_online"] label';
        return findElement(toggleSelector, fallback);
    }

    function getOnlineFilterState() {
        const toggleBtn = findOnlineFilterToggle();
        if (!toggleBtn) return 'unknown';

        const input = toggleBtn.querySelector('input[type="checkbox"]') || toggleBtn.parentElement?.querySelector('input[type="checkbox"]');
        if (input) {
            return input.checked ? 'online' : 'offline';
        }

        const classList = (toggleBtn.className + ' ' + (toggleBtn.parentElement?.className || '')).toLowerCase();
        if (classList.includes('active') || classList.includes('checked') || classList.includes('on')) {
            return 'online';
        }
        return 'unknown';
    }

    async function toggleOnlineOfflineFilter(targetMode = null) {
        const toggleBtn = findOnlineFilterToggle();
        if (!toggleBtn) {
            logDebug('WARN', '[Campaign] Online/offline filter toggle button not found.');
            return false;
        }

        const currentState = getOnlineFilterState();
        if (targetMode && currentState !== 'unknown' && currentState === targetMode) {
            logDebug('INFO', `[Campaign] Online/offline filter is already in '${targetMode}' state.`);
            return true;
        }

        logDebug('STEP', `Toggling online/offline filter (Current: ${currentState} -> Switching to: ${targetMode || 'opposite'})...`);
        updateStatus(`Switching filter to ${targetMode || 'opposite'}...`);
        smartClick(toggleBtn);
        await sleep(1200);

        const newState = getOnlineFilterState();
        logDebug('SUCCESS', `Online/offline filter state is now: ${newState}`);
        return true;
    }

    // Step 3.4: Check for time that is eligible based on inactivity threshold (Triple-layer robust parser)
    function isTimestampEligible(timeStr, now = new Date(), minHours = getCampaignIntervalHours()) {
        timeStr = cleanTimestampString(timeStr);
        if (!timeStr) {
            // Empty timestamp: Could be new contact without message history
            return { eligible: true, diffHours: 999, reason: 'empty' };
        }

        const lower = timeStr.toLowerCase();

        // 1. Immediate / Relative times (< minHours)
        if (lower.includes('just now') || lower.includes('moment ago') || lower.includes('seconds ago') || lower === 'now') {
            return { eligible: false, diffHours: 0.01, reason: 'just_now' };
        }

        // Minutes ago: e.g. "5m", "10 mins ago", "45 minutes ago", "1 min"
        const minMatch = lower.match(/\b(\d+)\s*(?:m|min|mins|minute|minutes)\b/);
        if (minMatch) {
            const mins = parseInt(minMatch[1], 10);
            const diffHours = mins / 60.0;
            return { eligible: diffHours >= minHours, diffHours, reason: 'relative_minutes' };
        }

        // Hours ago: e.g. "1h", "2 hrs ago", "3 hours ago", "4h"
        const hrMatch = lower.match(/\b(\d+)\s*(?:h|hr|hrs|hour|hours)\b/);
        if (hrMatch) {
            const hrs = parseInt(hrMatch[1], 10);
            return { eligible: hrs >= minHours, diffHours: hrs, reason: 'relative_hours' };
        }

        // Days ago: e.g. "1d", "2 days ago", "yesterday"
        if (lower.includes('yesterday') || /\b\d+\s*(?:d|day|days)\b/.test(lower)) {
            return { eligible: true, diffHours: 24.0, reason: 'relative_days' };
        }

        // 2. Format with Date: e.g. "14/09 (11:31 pm)", "16/09 1:30 pm", "04/09 (6:17 pm)", "16.09 (1:30 pm)"
        const dateMatch = timeStr.match(/(\d{1,2})[\/\-\.](\d{1,2})/);
        if (dateMatch) {
            const d1 = parseInt(dateMatch[1], 10);
            const d2 = parseInt(dateMatch[2], 10);
            const todayDay = now.getDate();
            const todayMonth = now.getMonth() + 1;

            // Check if date matches today (handles DD/MM or MM/DD)
            const isToday = (d1 === todayDay && d2 === todayMonth) || (d1 === todayMonth && d2 === todayDay);
            if (isToday) {
                const timePart = timeStr.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
                if (timePart) {
                    let h = parseInt(timePart[1], 10);
                    const m = parseInt(timePart[2], 10);
                    const meridiem = (timePart[3] || '').toLowerCase();
                    if (meridiem === 'pm' && h < 12) h += 12;
                    if (meridiem === 'am' && h === 12) h = 0;

                    const msgDt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
                    const diffHours = (now.getTime() - msgDt.getTime()) / (1000 * 3600);
                    return { eligible: diffHours >= minHours, diffHours, reason: 'date_today' };
                }
            }
            // From a past date -> clearly >= minHours away
            return { eligible: true, diffHours: 999, reason: 'past_date' };
        }

        // 3. Format with Pure Time: e.g. "1:30 pm", "01:30 pm", "13:30", "7:21 am", "11:35 pm"
        const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
        if (timeMatch) {
            let h = parseInt(timeMatch[1], 10);
            const m = parseInt(timeMatch[2], 10);
            const meridiem = (timeMatch[3] || '').toLowerCase();
            if (meridiem === 'pm' && h < 12) h += 12;
            if (meridiem === 'am' && h === 12) h = 0;

            let msgDt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
            // If message timestamp is in the future compared to now, it occurred yesterday
            if (msgDt.getTime() > now.getTime()) {
                msgDt = new Date(msgDt.getTime() - 24 * 3600 * 1000);
            }

            const diffHours = (now.getTime() - msgDt.getTime()) / (1000 * 3600);
            return { eligible: diffHours >= minHours, diffHours, reason: 'pure_time' };
        }

        return { eligible: true, diffHours: 999, reason: 'unrecognized_fallback' };
    }

    // Actively wait for chat messages (text or image) to finish loading into Column 3 DOM
    async function waitForChatMessagesToLoad(timeoutMs = 3500) {
        const start = Date.now();
        while (Date.now() - start < timeoutMs) {
            const messageEls = document.querySelectorAll(
                '[class*="clmn_3_chat_message-"], [data-testid*="received-message-"], [data-testid*="sent-message-"], [id^="mess-"]'
            );
            if (messageEls.length > 0) {
                // Verify inner content (text or image) has finished rendering
                const hasRenderedContent = Array.from(messageEls).some((el) =>
                    el.querySelector('[data-testid="message-text"], [data-testid="message-image"], [class*="message_img-"], [class*="message_text-"], img')
                );
                if (hasRenderedContent) {
                    await sleep(350);
                    return true;
                }
            }
            await sleep(150);
        }
        return false;
    }

    // Step 3.5: Read last 5 chats from Column 3 with rich timestamp details & smart 3-message trigger
    function readLast3MessagesFromChat(cardEl = null) {
        const chatData = parseChatHistory(cardEl);
        if (!chatData || !chatData.messages || chatData.messages.length === 0) {
            return { messages: [], last5: [], last3: [], last3FromMe: false, lastUserMsg: null, lastOurMsg: null, lastMsg: null, isEmpty: true, partnerName: 'Honey' };
        }

        // Filter real conversational messages if possible, or take raw messages
        const real = chatData.realMessages && chatData.realMessages.length > 0 ? chatData.realMessages : chatData.messages;
        const last5 = real.slice(-5);
        const last3Msgs = real.slice(-3);

        // Smart check: Are the last 3 consecutive messages ALL sent by "me"?
        const last3FromMe = last3Msgs.length >= 3 && last3Msgs.every((m) => m.role === 'me');

        return {
            messages: chatData.messages,
            realMessages: chatData.realMessages,
            last5: last5,
            last3: last5, // Upgraded context window to last 5 messages while preserving backwards-compatibility!
            last3FromMe: last3FromMe,
            lastUserMsg: chatData.lastUserMsg,
            lastOurMsg: chatData.lastOurMsg,
            lastMsg: chatData.lastMsg,
            isEmpty: false,
            partnerName: chatData.partnerName,
            profileName: chatData.profileName
        };
    }

    // Alias for explicit 5-message callers
    const readLast5MessagesFromChat = readLast3MessagesFromChat;

    function getDynamicProfileName() {
        return (typeof currentSelectedProfile !== 'undefined' && currentSelectedProfile) || (typeof detectActiveProfileName === 'function' ? detectActiveProfileName() : '');
    }

    const SEMI_MANUAL_STORAGE_KEY = 'alpha_semi_manual_mode_v45';

    function isSemiManualModeEnabled() {
        return localStorage.getItem(SEMI_MANUAL_STORAGE_KEY) === 'true';
    }

    function setSemiManualModeEnabled(val) {
        localStorage.setItem(SEMI_MANUAL_STORAGE_KEY, val ? 'true' : 'false');
        updateSemiManualButtonUI();
    }

    // Step 3.55: Wait for user to review and approve/edit message before sending
    function waitForUserReview(partnerName, initialReplyText, chatInfo, activeTextarea) {
        return new Promise((resolve) => {
            let currentReplyText = initialReplyText;
            let isResolved = false;

            let reviewBar = document.getElementById('alpha-review-bar');
            if (reviewBar) reviewBar.remove();

            reviewBar = document.createElement('div');
            reviewBar.id = 'alpha-review-bar';
            Object.assign(reviewBar.style, {
                background: 'rgba(15, 23, 42, 0.98)',
                border: '1px solid #8b5cf6',
                borderRadius: '8px',
                padding: '8px 12px',
                margin: '6px 0',
                boxShadow: '0 6px 18px rgba(0, 0, 0, 0.5)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                color: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                zIndex: 9999
            });

            // Info Section
            const infoDiv = document.createElement('div');
            infoDiv.innerHTML = `
                <div style="font-size:11px; font-weight:bold; color:#a78bfa; display:flex; align-items:center; gap:6px;">
                    <span>👁️ Semi-Manual Review:</span>
                    <span style="color:#f8fafc;">${partnerName}</span>
                    <span id="alpha-rev-source" style="font-size:10px; color:#cbd5e1; background:#334155; padding:1px 6px; border-radius:4px;">${lastReplyMeta.source || 'AI'}</span>
                </div>
                <div style="font-size:10px; color:#94a3b8; margin-top:2px;">
                    <span id="alpha-rev-chars" style="font-weight:bold; color:#38bdf8;">${currentReplyText.length}</span> chars • Press <b style="color:#fff;">Enter</b> in chat box or click Send
                </div>
            `;

            // Action Buttons
            const actionsDiv = document.createElement('div');
            Object.assign(actionsDiv.style, { display: 'flex', gap: '6px', alignItems: 'center' });

            const regenBtn = document.createElement('button');
            regenBtn.textContent = '🔄 Regenerate';
            regenBtn.title = 'Ask AI to generate a different reply for this contact';
            Object.assign(regenBtn.style, {
                padding: '5px 10px', background: '#3b82f6', color: '#fff', border: 'none',
                borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: '600'
            });

            const skipBtn = document.createElement('button');
            skipBtn.textContent = '⏭️ Skip';
            skipBtn.title = 'Skip sending to this contact and advance to next user';
            Object.assign(skipBtn.style, {
                padding: '5px 9px', background: '#475569', color: '#fff', border: 'none',
                borderRadius: '6px', fontSize: '11px', cursor: 'pointer'
            });

            const sendBtn = document.createElement('button');
            sendBtn.innerHTML = '🚀 Send & Next <span style="opacity:0.75; font-size:10px;">(Enter)</span>';
            sendBtn.title = 'Send this message and automatically advance to next contact';
            Object.assign(sendBtn.style, {
                padding: '5px 13px', background: '#059669', color: '#fff', border: 'none',
                borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer'
            });

            actionsDiv.appendChild(regenBtn);
            actionsDiv.appendChild(skipBtn);
            actionsDiv.appendChild(sendBtn);

            reviewBar.appendChild(infoDiv);
            reviewBar.appendChild(actionsDiv);

            // Mount reviewBar directly above active textarea
            const inputContainer = activeTextarea.closest('[class*="chat_footer"], [class*="footer"], [class*="chat_input"], form') || activeTextarea.parentElement;
            if (inputContainer && inputContainer.parentElement) {
                inputContainer.parentElement.insertBefore(reviewBar, inputContainer);
            } else if (activeTextarea.parentElement) {
                activeTextarea.parentElement.insertBefore(reviewBar, activeTextarea);
            } else {
                document.body.appendChild(reviewBar);
            }

            function cleanup() {
                if (reviewBar) reviewBar.remove();
                activeTextarea.removeEventListener('keydown', onTextareaKeydown);
                window.removeEventListener('keydown', onGlobalKeydown);
            }

            // Enter keypress inside activeTextarea (without Shift) triggers Send & Next!
            const onTextareaKeydown = (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (isResolved) return;
                    isResolved = true;
                    cleanup();
                    resolve({ action: 'send', text: activeTextarea.value || currentReplyText });
                }
            };
            activeTextarea.addEventListener('keydown', onTextareaKeydown);

            // Global shortcut Ctrl+Enter or Alt+Enter to send even if focus moved
            const onGlobalKeydown = (e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.altKey)) {
                    e.preventDefault();
                    if (isResolved) return;
                    isResolved = true;
                    cleanup();
                    resolve({ action: 'send', text: activeTextarea.value || currentReplyText });
                }
            };
            window.addEventListener('keydown', onGlobalKeydown);

            sendBtn.onclick = () => {
                if (isResolved) return;
                isResolved = true;
                cleanup();
                resolve({ action: 'send', text: activeTextarea.value || currentReplyText });
            };

            skipBtn.onclick = () => {
                if (isResolved) return;
                isResolved = true;
                cleanup();
                resolve({ action: 'skip', text: null });
            };

            regenBtn.onclick = async () => {
                regenBtn.disabled = true;
                regenBtn.textContent = '⏳ Regenerating...';
                updateStatus(`[AI] Regenerating reply for ${partnerName}...`, 'ai');

                // Re-read fresh live chat history from Column 3 DOM instead of using stale snapshot
                const freshChatInfo = readLast3MessagesFromChat();
                let currentInfo = chatInfo;
                if (freshChatInfo && (!freshChatInfo.isEmpty || (freshChatInfo.messages && freshChatInfo.messages.length > 0))) {
                    if (partnerName && (!freshChatInfo.partnerName || freshChatInfo.partnerName === 'Honey')) {
                        freshChatInfo.partnerName = partnerName;
                    }
                    if (chatInfo.profileName && !freshChatInfo.profileName) {
                        freshChatInfo.profileName = chatInfo.profileName;
                    }
                    currentInfo = freshChatInfo;
                }

                const newText = await generateCampaignReply(currentInfo);
                if (newText && newText.length > 15) {
                    currentReplyText = newText;
                    insertIntoChatInput(newText);
                    const charsEl = document.getElementById('alpha-rev-chars');
                    if (charsEl) charsEl.textContent = newText.length;
                    const sourceEl = document.getElementById('alpha-rev-source');
                    if (sourceEl) sourceEl.textContent = lastReplyMeta.source || 'AI';
                }
                regenBtn.disabled = false;
                regenBtn.textContent = '🔄 Regenerate';
                activeTextarea.focus();
            };

            // Focus textarea so user can immediately read and press Enter
            activeTextarea.focus();
        });
    }

    // Step 3.6: Send message safely - STRICT ANTI-LETTER PROTECTION
    async function sendChatMessageSafely(activeTextarea, partnerName) {
        if (!activeTextarea) return false;

        // 1. Dispatch Enter keyboard event sequence to trigger native React submission
        activeTextarea.focus();
        ['keydown', 'keypress', 'keyup'].forEach((type) => {
            const evt = new KeyboardEvent(type, {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true,
                view: window
            });
            activeTextarea.dispatchEvent(evt);
        });
        logDebug('INFO', `Dispatched Enter key to send message to ${partnerName}.`);
        await sleep(500);

        // 2. If textarea still has text after Enter, check for form submission
        if (activeTextarea.value.trim().length > 0) {
            const form = activeTextarea.closest('form');
            if (form) {
                try {
                    if (typeof form.requestSubmit === 'function') {
                        form.requestSubmit();
                        logDebug('INFO', `Triggered form.requestSubmit() for ${partnerName}.`);
                    } else {
                        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                        logDebug('INFO', `Dispatched submit event for ${partnerName}.`);
                    }
                    await sleep(400);
                } catch (e) {}
            }
        }

        // 3. Fallback: Click submit button STRICTLY within the chat input container
        // DANGER AVOIDANCE: NEVER click any button related to letters, mail, draft, compose, etc.
        if (activeTextarea.value.trim().length > 0) {
            const inputContainer = activeTextarea.closest('[class*="chat_footer"], [class*="footer"], [class*="chat_input"], form') || activeTextarea.parentElement?.parentElement;
            if (inputContainer) {
                const buttons = Array.from(inputContainer.querySelectorAll('button, div[role="button"], [class*="send"]'));
                for (const btn of buttons) {
                    const sig = (
                        (btn.className || '') + ' ' +
                        (btn.getAttribute('data-testid') || '') + ' ' +
                        (btn.getAttribute('title') || '') + ' ' +
                        (btn.getAttribute('aria-label') || '') + ' ' +
                        (btn.textContent || '')
                    ).toLowerCase();

                    // STRICT BLACKLIST: ABSOLUTELY DO NOT CLICK ANY LETTER/MAIL/MEDIA BUTTONS
                    if (
                        sig.includes('letter') ||
                        sig.includes('mail') ||
                        sig.includes('email') ||
                        sig.includes('draft') ||
                        sig.includes('compose') ||
                        sig.includes('write') ||
                        sig.includes('attach') ||
                        sig.includes('photo') ||
                        sig.includes('video') ||
                        sig.includes('gift') ||
                        sig.includes('sticker') ||
                        sig.includes('emoji') ||
                        sig.includes('voice') ||
                        sig.includes('audio') ||
                        sig.includes('profile') ||
                        sig.includes('switch')
                    ) {
                        continue; // Skip dangerous buttons!
                    }

                    if (btn.type === 'submit' || sig.includes('send') || sig.includes('submit')) {
                        logDebug('INFO', `Clicking verified chat send button for ${partnerName}.`);
                        smartClick(btn);
                        await sleep(400);
                        break;
                    }
                }
            }
        }

        // 4. Final safety: If textarea is still not cleared, reset its value cleanly
        if (activeTextarea.value.trim().length > 0) {
            try {
                const proto = Object.getPrototypeOf(activeTextarea);
                const desc = Object.getOwnPropertyDescriptor(proto, 'value') || Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value');
                if (desc && desc.set) desc.set.call(activeTextarea, '');
                else activeTextarea.value = '';
                activeTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                activeTextarea.dispatchEvent(new Event('change', { bubbles: true }));
            } catch (e) {}
        }

        // 5. Anti-Letter Navigation Guard: Ensure we did NOT leave the chat page
        if (window.location.href.includes('letter') || window.location.href.includes('mail')) {
            logDebug('WARN', 'Detected unintended navigation to letter page! Returning back to chat...');
            window.history.back();
            await sleep(800);
        }

        recordHourlySend();
        return true;
    }

    // Request AI auto-reply for the campaign - v4.1 Full Dynamic Feed Engine
    // Global tracker to provide 100% transparency on whether last reply was AI or Default Template
    let lastReplyMeta = {
        isAI: false,
        source: 'Idle',
        model: '',
        chars: 0,
        partnerName: '',
        reason: ''
    };
    let lastApiError = null;

    async function generateCampaignReply(chatInfo) {
        const apiKey = getOpenRouterKey();
        const hasKey = isValidOpenRouterKey(apiKey);
        const targetChars = getTargetChars();
        const model = getOpenRouterModel();
        const minChars = Math.round(targetChars * 0.72);
        const maxWords = Math.floor(targetChars / 6);

        const partnerName = chatInfo.partnerName || 'Honey';
        const profileName = chatInfo.profileName || getDynamicProfileName() || '';

        if (hasKey) {
            try {
                let systemPrompt = '';
                let userPrompt = '';

                // Check if we have conversational message history
                if (chatInfo.last3 && chatInfo.last3.length > 0) {
                    const lastMessage = chatInfo.last3[chatInfo.last3.length - 1];
                    const isLastFromMe = lastMessage && lastMessage.role === 'me';
                    const isLastImage = lastMessage && (lastMessage.isImage || /\[(?:photo|sent a photo)\]/i.test(lastMessage.text || ''));

                    const historySnippet = chatInfo.last3
                        .map((m) => {
                            const sender = m.role === 'them' ? `${partnerName} (The Man)` : `${profileName} (You)`;
                            return `[${sender}]: "${m.text}"`;
                        })
                        .join('\n');

                    logDebug('INFO', `[Campaign AI] Feeding last ${chatInfo.last3.length} chats for ${partnerName}:\n${historySnippet}`);

                    const lastThreeFromMe = chatInfo.last3FromMe || (chatInfo.last3 && chatInfo.last3.length >= 3 && chatInfo.last3.slice(-3).every((m) => m.role === 'me'));

                    if (lastThreeFromMe) {
                        // SMART TRIGGER: The last 3 consecutive messages were all sent by US ("me")!
                        logDebug('INFO', `[Campaign AI] 📸 Smart Detection: The last 3 messages were all sent by YOU (${profileName}). Directing AI to flirtatiously ask ${partnerName} to send a photo instead!`);

                        systemPrompt = `You are an engaging, witty, and charming woman named ${profileName} chatting with a gentleman named ${partnerName} on a dating site.
IDENTITY INTEGRITY: You are ${profileName}. Never refer to yourself as anyone else or any operator name (e.g. Grace). Never say "I am [another name]".

Recent Chat History (Last 5 Messages):
${historySnippet}

CRITICAL CONVERSATION STATUS & MANDATORY INSTRUCTION:
1. SENDER AWARENESS: You (${profileName}) have sent the LAST 3 CONSECUTIVE MESSAGES in this chat, and ${partnerName} has remained quiet without replying with words.
2. MANDATORY DIRECTIVE: Instead of sending another regular text message or question, you MUST flirtatiously ask ${partnerName} to send a photo / image of himself instead!
3. PSYCHOLOGICAL HOOK:
   - Playfully tease him for being quiet or playing hard to get with words.
   - Tell him that since words seem to be failing him (or since he is being mysterious), he should send you a picture of himself or what he is doing right now instead.
   - Example angles:
     - "You're awfully quiet with words today... how about sending me a picture instead? Let me see that handsome face! 📸😏"
     - "Since you're playing hard to get with words, why don't you send me a photo? I'd love to see what you're up to right now. 😉"
     - "Don't leave me waiting on words! Send me a picture instead—what does your world look like today? 💋"
4. DO NOT answer your own previous questions.
5. MUST end with an enticing request or question asking for his photo/picture.

Strict Requirements:
1. STRICT HARD MAXIMUM: The response MUST NOT EXCEED ${targetChars} characters under any circumstances! Aim strictly between ${minChars} and ${targetChars} characters (at most ${maxWords} words).
2. The first 30 characters must be captivating and hook attention immediately.
3. DO NOT prefix with your name, sender tag, or role (do not write "${profileName}:" or "[${profileName} (You)]:").
4. MUST explicitly ask him to send a picture / photo.
5. MUST end with a question or playful photo request.
6. DO NOT wrap the output in quotation marks or apostrophes at start or end.
7. Output ONLY the reply text.`;

                        userPrompt = `I have sent the last 3 messages and ${partnerName} has not replied with words. Write a playful, charming, and flirtatious message teasing him for being quiet and specifically asking him to send me a photo/picture of himself instead. Keep reply SHORT, STRICTLY UNDER ${targetChars} characters (max ${maxWords} words), ending with a question.`;
                    } else if (isLastFromMe) {
                        // The last message in chat was sent by US ("me"). He has not replied yet!
                        logDebug('INFO', `[Campaign AI] Situation: Last message was sent by YOU (${profileName}). Generating a follow-up nudge (NOT answering yourself)...`);

                        const photoTeasePrompt = isLastImage
                            ? `\nSPECIAL PHOTO CONTEXT: You (${profileName}) were the one who sent a photo as your last message, and ${partnerName} has not responded yet! Tease him playfully about being stunned or speechless by your picture, ask if he liked it, and invite him to speak up.`
                            : '';

                        systemPrompt = `You are an engaging, witty, and charming woman named ${profileName} chatting with a gentleman named ${partnerName} on a dating site.
IDENTITY INTEGRITY: You are ${profileName}. Never refer to yourself as anyone else or any operator name (e.g. Grace). Never say "I am [another name]".

Recent Chat History (Last 5 Messages):
${historySnippet}

CRITICAL CONVERSATION STATUS & INSTRUCTIONS:
1. SENDER AWARENESS: You (${profileName}) were the LAST person who sent a message in this chat. Your previous message was: "${lastMessage.text}".
2. ${partnerName} HAS NOT REPLIED YET.
3. STRICT RULE: DO NOT answer your own previous question or message! You are NOT answering "${lastMessage.text}".
4. NEVER say "I'm doing great", "I'm doing fantastic", or answer any question that YOU asked previously.
5. YOUR GOAL: Send a playful, captivating, and flirtatious follow-up nudge / check-in to get his attention and prompt him to write back.${photoTeasePrompt}
   Examples of good follow-up angles:
   - Playfully tease him for being quiet or keeping you waiting (or for being speechless after seeing your photo).
   - Ask what he has been getting up to today or if a busy day stole him away.
   - Share a warm, lighthearted thought and ask a fun question.

Strict Requirements:
1. STRICT HARD MAXIMUM: The response MUST NOT EXCEED ${targetChars} characters under any circumstances! Aim strictly between ${minChars} and ${targetChars} characters (at most ${maxWords} words).
2. The first 30 characters must be captivating and hook attention immediately.
3. DO NOT prefix with your name, sender tag, or role (do not write "${profileName}:" or "[${profileName} (You)]:").
4. MUST end with an easy-to-answer, open question.
5. DO NOT wrap the output in quotation marks or apostrophes at start or end.
6. Output ONLY the reply text.`;

                        userPrompt = isLastImage
                            ? `${partnerName} has not replied yet to the photo I sent him. Write a playful, charming follow-up tease / nudge asking if he liked my photo or teasing him for being speechless. Keep reply SHORT, STRICTLY UNDER ${targetChars} characters (max ${maxWords} words), ending with a question.`
                            : `${partnerName} has not replied yet to my last message ("${lastMessage.text}"). Write a playful, charming follow-up nudge to get him talking to me. Keep reply SHORT, STRICTLY UNDER ${targetChars} characters (max ${maxWords} words), ending with a question.`;
                    } else {
                        // The last message was sent by the partner ("them"). We are directly answering him!
                        logDebug('INFO', `[Campaign AI] Situation: Last message was sent by HIM (${partnerName}). Generating direct reply to his message...`);

                        const photoReactionPrompt = isLastImage
                            ? `\nSPECIAL PHOTO CONTEXT: ${partnerName} sent you a photo! React flirtatiously and warmly to his picture, compliment what you see, and ask an intriguing question about it.`
                            : '';

                        systemPrompt = `You are an engaging, witty, and charming woman named ${profileName} chatting with a gentleman named ${partnerName} on a dating site.
IDENTITY INTEGRITY: You are ${profileName}. Never refer to yourself as anyone else or any operator name (e.g. Grace). Never say "I am [another name]".

Recent Chat History:
${historySnippet}

CRITICAL CONVERSATION STATUS & INSTRUCTIONS:
1. SENDER AWARENESS: ${partnerName} sent the last message: "${lastMessage.text}".
2. DIRECT RELEVANCE: You are replying directly to ${partnerName}'s message. Answer any question he asked, comment on what he shared with charm and wit, and keep the chemistry flowing.${photoReactionPrompt}
3. Do NOT ignore what he said.

Strict Requirements:
1. STRICT HARD MAXIMUM: The response MUST NOT EXCEED ${targetChars} characters under any circumstances! Aim strictly between ${minChars} and ${targetChars} characters (at most ${maxWords} words).
2. Directly acknowledge and respond to his message: "${lastMessage.text}".
3. The first 30 characters must be captivating and hook attention immediately.
4. DO NOT prefix with your name, sender tag, or role (do not write "${profileName}:" or "[${profileName} (You)]:").
5. MUST end with an easy-to-answer, open question.
6. DO NOT wrap the output in quotation marks or apostrophes at start or end.
7. Output ONLY the reply text.`;

                        userPrompt = isLastImage
                            ? `React flirtatiously and warmly to ${partnerName}'s photo! Keep reply SHORT, STRICTLY UNDER ${targetChars} characters (max ${maxWords} words), ending with a question.`
                            : `Reply directly to ${partnerName}'s message ("${lastMessage.text}"). Keep reply SHORT, STRICTLY UNDER ${targetChars} characters (max ${maxWords} words), ending with a question.`;
                    }
                } else {
                    // Chat is empty, new match, or profile like -> generate dynamic icebreaker
                    logDebug('INFO', `[Campaign AI] Chat is empty or new match with ${partnerName}. Generating dynamic icebreaker...`);

                    systemPrompt = `You are an engaging, witty, and charming female dating partner named ${profileName}.
IDENTITY INTEGRITY: You are ${profileName}. Never refer to yourself as anyone else or any operator name (e.g. Grace). Never say "I am [another name]".
A gentleman named ${partnerName} has viewed your profile or matched with you, and you are reaching out to start the conversation.
Write a captivating, warm, and flirtatious opening message / icebreaker.

Strict Requirements:
1. STRICT HARD MAXIMUM: The message MUST NOT EXCEED ${targetChars} characters under any circumstances! Aim strictly between ${minChars} and ${targetChars} characters (at most ${maxWords} words).
2. The first 30 characters must be captivating and hook attention immediately.
3. Reference him visiting your profile, your photos, or you noticing him and saying hello first.
4. DO NOT prefix with your name, sender tag, or role (do not write "${profileName}:" or "[${profileName} (You)]:").
5. MUST end with an easy-to-answer, open question.
6. DO NOT wrap the output in quotation marks or apostrophes at start or end.
7. Output ONLY the reply text.`;

                    userPrompt = `Write a captivating opening icebreaker to ${partnerName} who visited my profile. Keep it SHORT, STRICTLY UNDER ${targetChars} characters (max ${maxWords} words), ending with a question.`;
                }

                logDebug('INFO', `[Campaign AI] Sending request to OpenRouter API (Model: ${model})...`);
                updateStatus(`[AI] Requesting reply from ${model}...`);

                const origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : 'https://alpha.date';
                const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": origin,
                        "X-Title": "Alpha.date Auto-Messenger"
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: userPrompt }
                        ],
                        temperature: 0.85,
                        include_reasoning: false,
                        max_tokens: Math.max(1000, targetChars * 3)
                    })
                });

                if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    const errMsg = errData?.error?.message || `HTTP ${res.status} ${res.statusText}`;
                    lastApiError = `OpenRouter HTTP ${res.status}: ${errMsg}`;
                    logDebug('ERROR', `[Campaign AI] OpenRouter returned error (${res.status}): ${errMsg}`);
                    updateStatus(`[AI Error ${res.status}] ${errMsg}`, true);
                } else {
                    const data = await res.json();
                    const choice = data.choices && data.choices[0];
                    const msg = choice ? choice.message : null;
                    let rawContent = '';

                    if (msg) {
                        rawContent = (msg.content || '').trim();
                        // If model put output in reasoning field (e.g. DeepSeek reasoning mode)
                        if (!rawContent && msg.reasoning) {
                            rawContent = (msg.reasoning || '').trim();
                            logDebug('INFO', `[Campaign AI] Extracted message from reasoning field (${rawContent.length} chars).`);
                        }
                    }

                    // Strip any <think>...</think> tags if model emitted them
                    if (rawContent && rawContent.includes('<think>')) {
                        rawContent = rawContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
                    }

                    if (rawContent && rawContent.length > 5) {
                        let content = cleanReplyText(rawContent);
                        const origLen = content.length;
                        content = enforceCharacterLimit(content, targetChars);
                        if (content.length < origLen) {
                            logDebug('INFO', `[Character Enforcer] Trimmed reply from ${origLen} to ${content.length} chars to strictly stay under limit (${targetChars}).`);
                        }
                        if (content.length > 15) {
                            lastReplyMeta = {
                                isAI: true,
                                source: `OpenRouter AI (${model.split('/').pop()})`,
                                model: model,
                                chars: content.length,
                                partnerName: partnerName,
                                reason: 'Success'
                            };
                            logDebug('SUCCESS', `[Campaign AI] 🤖 AI GENERATED (${model}): "${content.slice(0, 65)}..." (${content.length}/${targetChars} chars)`);
                            updateStatus(`🤖 [AI: ${model.split('/').pop()}] Generated reply for ${partnerName} (${content.length} chars)`, 'ai');
                            return content;
                        }
                    }

                    // If we reached here, the model returned empty or truncated content
                    const finishReason = choice?.finish_reason || 'unknown';
                    lastApiError = `Model returned empty response (finish_reason: ${finishReason})`;
                    logDebug('ERROR', `[Campaign AI] ${lastApiError}`, data);
                    updateStatus(`[AI Empty] ${lastApiError}`, true);
                }
            } catch (err) {
                lastApiError = err.message;
                logDebug('ERROR', `[Campaign AI] OpenRouter network exception: ${err.message}`);
                console.warn('[Campaign AI] OpenRouter error:', err);
            }
        } else {
            lastApiError = 'OpenRouter API key missing in settings';
            logDebug('WARN', `[Campaign AI] No valid OpenRouter key configured in settings!`);
            updateStatus('⚠️ [Settings] OpenRouter API key missing!', 'warn');
        }

        // STRICT ZERO-DEFAULT POLICY: If AI generation failed or key is missing, NEVER use fallback templates!
        const failReason = lastApiError || (hasKey ? 'AI returned empty response' : 'OpenRouter API key missing in settings');
        logDebug('ERROR', `[Campaign AI] ❌ Message generation aborted for ${partnerName}: ${failReason}. Zero-default policy enforced.`);

        lastReplyMeta = {
            isAI: false,
            error: true,
            source: 'None (AI Inactive/Failed)',
            model: model,
            chars: 0,
            partnerName: partnerName,
            reason: failReason
        };

        // Prominently notify user that AI is inactive and generation is halted
        showAiInactiveAlert(
            'Campaign AI Inactive / Failed',
            `Cannot generate message for ${partnerName}: ${failReason}. No default message will be sent.`,
            true
        );

        return null; // ZERO default messages sent!
    }

    
    // Step 3.4B: Parse remaining message limit from Column 3 (Skip user if <= 1 messages left)
    function getRemainingMessageLimit() {
        const limitEl = document.querySelector('[data-testid="message-limit"], [class*="chat_typing_right-"], [class*="message-limit"]');
        if (!limitEl) {
            return { hasLimit: false, count: Infinity, skip: false, raw: '' };
        }

        const text = (limitEl.textContent || '').trim();
        if (!text) {
            return { hasLimit: false, count: Infinity, skip: false, raw: '' };
        }

        const match = text.match(/(\d+)\s*message/i) || 
                      text.match(/message[s]?\s*(?:left)?\s*[:\-]?\s*(\d+)/i) || 
                      text.match(/^(\d+)\s*left/i);

        if (!match) {
            return { hasLimit: false, count: Infinity, skip: false, raw: text };
        }

        const count = parseInt(match[1], 10);
        return {
            hasLimit: true,
            count: count,
            skip: count <= 1, // Rule: skip if 0 or 1 messages left
            raw: text
        };
    }

    // Generic processor for a chat section (All Chats or Chance) - v3.9 Dual-Phase (Online -> Offline)
    async function processChatSection(sectionName, navigateFn) {
        logDebug('STEP', `🚀 Campaign: Navigating to ${sectionName}...`);
        updateStatus(`🚀 Campaign: Navigating to ${sectionName}...`);
        await navigateFn();
        if (stopCampaignRequested) return { processed: 0, skipped: 0 };
        await sleep(DELAY_BETWEEN_STEPS_MS);

        const listContainer = document.querySelector('[data-testid="chat-list"], [class*="clmn_2_chat_block_list-"]');
        if (!listContainer) {
            logDebug('WARN', `[Campaign] Chat list container for ${sectionName} not found.`);
            return { processed: 0, skipped: 0 };
        }

        // Helper to extract unique key for a chat card to survive list re-renders/re-sorting
        function getCardIdentity(cardEl, fallbackIdx) {
            if (!cardEl) return { key: `unknown_${fallbackIdx}`, name: `Contact #${fallbackIdx + 1}`, id: '', womanId: '', profileName: null };
            const testId = cardEl.getAttribute('data-testid') || '';
            const nameEl = cardEl.querySelector('[data-testid="man-name"], [class*="clmn_2_chat_block_item_middle_name-"]');
            const name = nameEl ? (nameEl.textContent || '').trim().replace(/,\s*\d+/g, '') : `Contact #${fallbackIdx + 1}`;
            const womanEl = cardEl.querySelector('[data-testid="woman-external_id"], [class*="clmn_2_chat_block_item_profile_id-"]');
            const womanId = womanEl ? (womanEl.textContent || '').trim().replace(/\D/g, '') : '';
            const profileName = getCardProfileName(cardEl);
            const key = (womanId + '_' + name + '_' + testId).toLowerCase().replace(/\s+/g, '_');
            return { key, name, id: testId, womanId, profileName };
        }

        // Helper to extract card timestamp
        function getCardTimestamp(cardEl) {
            if (!cardEl) return '';
            const timeContainer = cardEl.querySelector('[data-testid="date"], [class*="chat_block_item_middle_time-"]');
            if (!timeContainer) return '';
            const spanEl = timeContainer.querySelector('span');
            return cleanTimestampString(spanEl ? spanEl.textContent : timeContainer.textContent);
        }

        // Sub-routine: Processes all eligible contacts in the currently visible list pass (Online or Offline)
        async function processListPass(phaseLabel) {
            let passProcessed = 0;
            let passSkipped = 0;
            const visitedKeys = new Set();
            let consecutiveNoTargetCount = 0;

            logDebug('STEP', `[${phaseLabel}] Beginning contact evaluation loop...`);
            updateStatus(`[${phaseLabel}] Evaluating contacts...`);

            while (!stopCampaignRequested) {
                if (stopCampaignRequested) {
                    updateStatus(`${phaseLabel} stopped by user.`);
                    logDebug('WARN', `${phaseLabel} stopped by user.`);
                    return { processed: passProcessed, skipped: passSkipped };
                }

                // Always re-query live cards from DOM to prevent stale/detached element errors
                const liveItems = Array.from(listContainer.querySelectorAll('[class*="clmn_2_chat_block_item-"]'));

                // Find next card that has not yet been visited in this pass
                let targetCard = null;
                let targetMeta = null;

                for (let idx = 0; idx < liveItems.length; idx++) {
                    const card = liveItems[idx];
                    const meta = getCardIdentity(card, idx);
                    if (!visitedKeys.has(meta.key)) {
                        targetCard = card;
                        targetMeta = meta;
                        break;
                    }
                }

                if (!targetCard) {
                    consecutiveNoTargetCount++;
                    if (consecutiveNoTargetCount >= 2) {
                        logDebug('SUCCESS', `[${phaseLabel}] Finished checking all visible contacts.`);
                        break;
                    }
                    // Try scrolling down to load more contacts if available
                    const prevScroll = listContainer.scrollTop;
                    listContainer.scrollTop += 650;
                    await sleep(600);
                    if (listContainer.scrollTop === prevScroll) {
                        logDebug('SUCCESS', `[${phaseLabel}] Reached bottom of list.`);
                        break;
                    }
                    continue;
                }

                consecutiveNoTargetCount = 0;
                visitedKeys.add(targetMeta.key);
                const partnerName = targetMeta.name;
                const cardKey = targetMeta.key;

                // Check hourly quota before proceeding with contact
                const hourlyCheck = isHourlyLimitReached();
                if (hourlyCheck.reached) {
                    const waitMins = Math.max(1, Math.ceil(hourlyCheck.nextAvailableMs / 60000));
                    const msg = `⏸️ [${phaseLabel}] Hourly limit reached (${hourlyCheck.count}/${hourlyCheck.limit} msgs sent in last 60m). Pausing campaign.`;
                    updateStatus(msg, 'warn');
                    logDebug('WARN', msg);
                    break;
                }

                logDebug('INFO', `[${phaseLabel}] Evaluating: ${partnerName} (Key: ${cardKey})`);

                // LAYER 1: Check session history cache (Did this campaign send to them within interval?)
                const recentSendCheck = wasRecentlyMessagedByCampaign(cardKey, getCampaignIntervalHours());
                if (recentSendCheck.recent) {
                    passSkipped++;
                    const minsAgo = Math.round(recentSendCheck.diffHours * 60);
                    const msg = `[${phaseLabel}] Skipped ${partnerName} (Messaged by campaign ${minsAgo}m ago < ${getCampaignIntervalHours()}h).`;
                    updateStatus(msg);
                    logDebug('WARN', msg);
                    await sleep(150);
                    continue;
                }

                // LAYER 2: Check Column 2 card timestamp
                const cardTimeText = getCardTimestamp(targetCard);
                const cardTimeCheck = isTimestampEligible(cardTimeText);
                if (!cardTimeCheck.eligible) {
                    passSkipped++;
                    const msg = `[${phaseLabel}] Skipped ${partnerName} (Card activity ${cardTimeCheck.diffHours.toFixed(1)}h ago < ${getCampaignIntervalHours()}h).`;
                    updateStatus(msg);
                    logDebug('WARN', msg, { rawTime: cardTimeText, reason: cardTimeCheck.reason });
                    await sleep(150);
                    continue;
                }

                // Open the chat
                logDebug('INFO', `[${phaseLabel}] Opening chat with ${partnerName}...`);
                updateStatus(`[${phaseLabel}] Opening chat with ${partnerName}...`);
                smartClick(targetCard);
                // Actively wait for Column 3 chat messages to load from network
                await waitForChatMessagesToLoad(2200);

                // Step 4.5: Check remaining message limit (skip if <= 1 message left)
                let limitCheck = getRemainingMessageLimit();
                if (limitCheck.skip) {
                    await sleep(300);
                    limitCheck = getRemainingMessageLimit();
                }

                if (limitCheck.skip) {
                    passSkipped++;
                    const msg = `[${phaseLabel}] Skipped ${partnerName} (${limitCheck.count} message${limitCheck.count === 1 ? '' : 's'} left <= 1).`;
                    updateStatus(msg);
                    logDebug('WARN', msg);
                    await sleep(200);
                    continue;
                }

                // Step 5: Read last 3 chats from Column 3 (passing targetCard for persona alignment)
                let chatInfo = readLast3MessagesFromChat(targetCard);
                if (chatInfo.isEmpty && !stopCampaignRequested) {
                    // Fast retry if DOM was mid-paint
                    await sleep(350);
                    chatInfo = readLast3MessagesFromChat(targetCard);
                }
                if (chatInfo.partnerName === 'Honey' && partnerName) {
                    chatInfo.partnerName = partnerName;
                }
                if (targetMeta.profileName) {
                    chatInfo.profileName = targetMeta.profileName;
                } else if (!chatInfo.profileName) {
                    chatInfo.profileName = detectActiveProfileName(targetCard);
                }

                // LAYER 3: Chat history inspection
                // Check A: Did WE ("me") send a message less than interval ago?
                if (chatInfo.lastOurMsg && chatInfo.lastOurMsg.timeText) {
                    const ourMsgCheck = isTimestampEligible(chatInfo.lastOurMsg.timeText);
                    if (!ourMsgCheck.eligible) {
                        passSkipped++;
                        recordCampaignSend(cardKey); // Record in cache
                        const msg = `[${phaseLabel}] Skipped ${partnerName} (Our last message was ${ourMsgCheck.diffHours.toFixed(1)}h ago < ${getCampaignIntervalHours()}h).`;
                        updateStatus(msg);
                        logDebug('WARN', msg, { ourTime: chatInfo.lastOurMsg.timeText });
                        await sleep(200);
                        continue;
                    }
                }

                // Check B: Was the very last message in the chat sent less than interval ago?
                if (chatInfo.lastMsg && chatInfo.lastMsg.timeText) {
                    const lastMsgCheck = isTimestampEligible(chatInfo.lastMsg.timeText);
                    if (!lastMsgCheck.eligible) {
                        passSkipped++;
                        const msg = `[${phaseLabel}] Skipped ${partnerName} (Chat activity ${lastMsgCheck.diffHours.toFixed(1)}h ago < ${getCampaignIntervalHours()}h).`;
                        updateStatus(msg);
                        logDebug('WARN', msg, { lastTime: chatInfo.lastMsg.timeText });
                        await sleep(200);
                        continue;
                    }
                }

                // Step 6: Generate corresponding message based on last 3 chats (Strict AI-Only)
                logDebug('INFO', `[${phaseLabel}] Generating AI reply for ${partnerName}...`);
                updateStatus(`[${phaseLabel}] Generating message for ${partnerName}...`);
                const replyText = await generateCampaignReply(chatInfo);
                if (!replyText || replyText.length < 15) {
                    logDebug('ERROR', `[Campaign] AI reply generation failed or inactive for ${partnerName}. Halting campaign immediately to prevent default messages.`);
                    updateStatus(`⛔ [Campaign Paused] AI is inactive or failed (${lastReplyMeta.reason || 'No AI response'}). Campaign paused.`, true);
                    showAiInactiveAlert(
                        'Campaign Paused (AI Inactive)',
                        `AI reply generation failed for ${partnerName} (${lastReplyMeta.reason || 'API error'}). Campaign has been paused to guarantee no default messages are sent.`,
                        true
                    );
                    stopCampaignRequested = true;
                    isRunning = false;
                    setButtonState(false);
                    break;
                }

                // Insert into chat textarea
                insertIntoChatInput(replyText);
                await sleep(400);

                const activeTextarea = document.querySelector('[class*="clmn_3"] textarea, textarea');
                if (!activeTextarea) {
                    logDebug('ERROR', `[${phaseLabel}] Could not find chat textarea for ${partnerName}!`);
                    continue;
                }

                let textToSend = replyText;

                // Step 6.5: SEMI-MANUAL REVIEW MODE
                // If enabled, pauses on each contact so user can inspect message before pressing Enter to send!
                if (isSemiManualModeEnabled()) {
                    logDebug('INFO', `[${phaseLabel}] Semi-Manual Mode: Pausing for user review of message to ${partnerName}...`);
                    updateStatus(`👁️ [Review] Generated for ${partnerName} (${replyText.length} chars). Press Enter to send & next ⏭️`, 'info');

                    const reviewRes = await waitForUserReview(partnerName, replyText, chatInfo, activeTextarea);
                    if (stopCampaignRequested) break;

                    if (reviewRes.action === 'skip') {
                        passSkipped++;
                        logDebug('WARN', `[${phaseLabel}] User skipped messaging ${partnerName}.`);
                        updateStatus(`Skipped ${partnerName} by user.`);
                        await sleep(300);
                        continue;
                    }

                    textToSend = reviewRes.text || activeTextarea.value || replyText;
                }

                // Step 7: Send safely - GUARANTEED ANTI-LETTER PROTECTION (100% STRICT AI ONLY)
                if (!lastReplyMeta.isAI) {
                    logDebug('ERROR', `[Send Message] Refusing to send message to ${partnerName}: Message is not AI-generated!`);
                    updateStatus(`❌ Refusing send to ${partnerName}: Non-AI message blocked!`, true);
                    break;
                }
                updateStatus(`🤖 [AI: ${lastReplyMeta.model.split('/').pop()}] Sending to ${partnerName} (${textToSend.length} chars)...`, 'ai');
                logDebug('SUCCESS', `[Send Message] 🤖 Sent AI-generated message (${lastReplyMeta.model}) to ${partnerName}: "${textToSend}"`);
                await sendChatMessageSafely(activeTextarea, partnerName);
                recordCampaignSend(cardKey);
                
                // Show confirmation tag
                updateStatus(`🤖 [AI Sent] Sent to ${partnerName} (${textToSend.length} chars) ✅`, 'ai');
                passProcessed++;
                logDebug('SUCCESS', `[${phaseLabel}] Successfully sent message to ${partnerName}!`);
                updateStatus(`[${phaseLabel}] Sent message to ${partnerName} (${textToSend.length} chars).`);

                const delay = getCampaignDelayMs();
                logDebug('INFO', `Waiting ${delay}ms before next contact...`);
                await sleep(delay);

                // Handle any pending real-time like/wink notifications before advancing to next contact
                if (notifQueue.length > 0 && isAutoRespondLikesWinksEnabled() && !stopCampaignRequested) {
                    logDebug('INFO', `[Campaign] Intercepting ${notifQueue.length} pending like/wink notification(s)...`);
                    await processNotifQueue();
                }
            }

            return { processed: passProcessed, skipped: passSkipped };
        }

        // ==========================================
        // DUAL-PHASE EXECUTION: ONLINE THEN OFFLINE
        // ==========================================

        // --- PHASE 1: ONLINE CONTACTS ---
        logDebug('STEP', `[${sectionName}] === STARTING PHASE 1: ONLINE CONTACTS ===`);
        updateStatus(`[${sectionName}] Phase 1: Checking ONLINE contacts...`);
        // Ensure filter starts on Online
        const onlineState = getOnlineFilterState();
        if (onlineState === 'offline') {
            await toggleOnlineOfflineFilter('online');
            await sleep(DELAY_BETWEEN_STEPS_MS);
        }

        const onlineResult = await processListPass(`${sectionName} (Online)`);
        if (stopCampaignRequested) return onlineResult;

        logDebug('SUCCESS', `[${sectionName}] Phase 1 (Online) finished: ${onlineResult.processed} sent, ${onlineResult.skipped} skipped.`);
        updateStatus(`[${sectionName}] Online completed (${onlineResult.processed} sent, ${onlineResult.skipped} skipped). Switching to OFFLINE...`);
        await sleep(1200);

        // --- PHASE 2: OFFLINE CONTACTS ---
        logDebug('STEP', `[${sectionName}] === STARTING PHASE 2: OFFLINE CONTACTS ===`);
        updateStatus(`[${sectionName}] Phase 2: Switching to OFFLINE contacts...`);

        // Switch filter to Offline
        await toggleOnlineOfflineFilter('offline');
        if (stopCampaignRequested) return onlineResult;
        await sleep(1500); // Give list time to refresh with offline contacts

        const offlineResult = await processListPass(`${sectionName} (Offline)`);

        // --- RESTORE: SWITCH BACK TO ONLINE ---
        logDebug('STEP', `[${sectionName}] Restoring filter back to ONLINE...`);
        updateStatus(`[${sectionName}] Restoring filter back to ONLINE...`);
        await toggleOnlineOfflineFilter('online');
        await sleep(800);

        const totalProcessed = onlineResult.processed + offlineResult.processed;
        const totalSkipped = onlineResult.skipped + offlineResult.skipped;
        const finishMsg = `[${sectionName}] Complete! Online: ${onlineResult.processed} sent (${onlineResult.skipped} skipped) | Offline: ${offlineResult.processed} sent (${offlineResult.skipped} skipped).`;
        
        updateStatus(finishMsg);
        logDebug('SUCCESS', finishMsg);

        return { processed: totalProcessed, skipped: totalSkipped };
    }

    // Master Routine A: Run All Chats Campaign Only
    async function runAllChatsCampaign() {
        if (activeCampaignType === 'all_chats') {
            stopCampaignRequested = true;
            updateStatus("Stopping All-Chats Campaign...");
            return;
        }
        if (activeCampaignType === 'chance') {
            if (queuedCampaign === 'all_chats') {
                queuedCampaign = null;
                updateCampaignButtonsUI();
                updateStatus("All-Chats unqueued.");
            } else {
                queuedCampaign = 'all_chats';
                updateCampaignButtonsUI();
                updateStatus("⏳ All-Chats queued! It will start automatically once Chance completes.");
            }
            return;
        }
        if (activeCampaignType) {
            updateStatus(`Cannot start All-Chats: Another campaign is running!`, true);
            return;
        }
        if (isRunning) {
            updateStatus("Cannot start All-Chats: Senders campaign is currently running!", true);
            return;
        }

        const hourlyCheck = isHourlyLimitReached();
        if (hourlyCheck.reached) {
            const waitMins = Math.max(1, Math.ceil(hourlyCheck.nextAvailableMs / 60000));
            const msg = `⏸️ Cannot start All-Chats: Hourly limit reached (${hourlyCheck.count}/${hourlyCheck.limit} msgs). Resumes in ~${waitMins}m.`;
            updateStatus(msg, true);
            logDebug('WARN', msg);
            return;
        }

        activeCampaignType = 'all_chats';
        stopCampaignRequested = false;
        updateCampaignButtonsUI();

        try {
            updateStatus(`🚀 Starting ${getCampaignIntervalHours()}-Hour All-Chats Campaign...`);

            // 1. Make sure profiles are online
            await ensureProfilesOnline();
            if (stopCampaignRequested) return;
            await sleep(DELAY_BETWEEN_STEPS_MS);

            // 2. Process All Chats
            const res = await processChatSection("All Chats", navigateToAllChats);

            localStorage.setItem(ALL_CHATS_LAST_RUN_KEY, Date.now().toString());
            localStorage.setItem('alpha_campaign_last_run', Date.now().toString());
            updateStatus(`✅ All-Chats complete! Sent: ${res.processed}, Skipped (<${getCampaignIntervalHours()}h): ${res.skipped}.`);
        } catch (err) {
            updateStatus(`All-Chats Error: ${err.message}`, true);
            console.error('[All-Chats Campaign]', err);
        } finally {
            activeCampaignType = null;
            stopCampaignRequested = false;
            updateCampaignButtonsUI();
            updateCampaignCountdownUI();
            updateSemiManualButtonUI();
            updateAutoRespondLikesWinksButtonUI();

            // Dual Engine Chain: Automatically trigger Chance if queued or due
            if (!stopCampaignRequested) {
                const intervalMs = getCampaignIntervalHours() * 3600 * 1000;
                const chanceLast = parseInt(localStorage.getItem(CHANCE_LAST_RUN_KEY) || '0', 10);
                const chanceDue = isChanceSchedulerEnabled() && ((Date.now() - chanceLast) >= intervalMs);
                if (queuedCampaign === 'chance' || chanceDue) {
                    queuedCampaign = null;
                    logDebug('INFO', '[Dual Engine] All-Chats complete. Automatically triggering Chance campaign next...');
                    updateStatus('All-Chats complete. Automatically triggering Chance campaign next...');
                    setTimeout(() => {
                        if (!activeCampaignType && !isRunning && !stopCampaignRequested) {
                            runChanceCampaign();
                        }
                    }, 1500);
                }
            }
        }
    }

    // Master Routine B: Run Chance (Matches) Campaign Only
    async function runChanceCampaign() {
        if (activeCampaignType === 'chance') {
            stopCampaignRequested = true;
            updateStatus("Stopping Chance Campaign...");
            return;
        }
        if (activeCampaignType === 'all_chats') {
            if (queuedCampaign === 'chance') {
                queuedCampaign = null;
                updateCampaignButtonsUI();
                updateStatus("Chance unqueued.");
            } else {
                queuedCampaign = 'chance';
                updateCampaignButtonsUI();
                updateStatus("⏳ Chance queued! It will start automatically once All-Chats completes.");
            }
            return;
        }
        if (activeCampaignType) {
            updateStatus(`Cannot start Chance: Another campaign is running!`, true);
            return;
        }
        if (isRunning) {
            updateStatus("Cannot start Chance: Senders campaign is currently running!", true);
            return;
        }

        const hourlyCheck = isHourlyLimitReached();
        if (hourlyCheck.reached) {
            const waitMins = Math.max(1, Math.ceil(hourlyCheck.nextAvailableMs / 60000));
            const msg = `⏸️ Cannot start Chance: Hourly limit reached (${hourlyCheck.count}/${hourlyCheck.limit} msgs). Resumes in ~${waitMins}m.`;
            updateStatus(msg, true);
            logDebug('WARN', msg);
            return;
        }

        activeCampaignType = 'chance';
        stopCampaignRequested = false;
        updateCampaignButtonsUI();

        try {
            updateStatus(`🚀 Starting ${getCampaignIntervalHours()}-Hour Chance (Matches) Campaign...`);

            // 1. Make sure profiles are online
            await ensureProfilesOnline();
            if (stopCampaignRequested) return;
            await sleep(DELAY_BETWEEN_STEPS_MS);

            // 2. Process Chance
            const res = await processChatSection("Chance", navigateToChance);

            localStorage.setItem(CHANCE_LAST_RUN_KEY, Date.now().toString());
            updateStatus(`✅ Chance complete! Sent: ${res.processed}, Skipped (<${getCampaignIntervalHours()}h): ${res.skipped}.`);
        } catch (err) {
            updateStatus(`Chance Error: ${err.message}`, true);
            console.error('[Chance Campaign]', err);
        } finally {
            activeCampaignType = null;
            stopCampaignRequested = false;
            updateCampaignButtonsUI();
            updateCampaignCountdownUI();
            updateSemiManualButtonUI();
            updateAutoRespondLikesWinksButtonUI();

            // Dual Engine Chain: Automatically trigger All-Chats if queued or due
            if (!stopCampaignRequested) {
                const intervalMs = getCampaignIntervalHours() * 3600 * 1000;
                const allChatsLast = parseInt(localStorage.getItem(ALL_CHATS_LAST_RUN_KEY) || localStorage.getItem('alpha_campaign_last_run') || '0', 10);
                const allChatsDue = isAllChatsSchedulerEnabled() && ((Date.now() - allChatsLast) >= intervalMs);
                if (queuedCampaign === 'all_chats' || allChatsDue) {
                    queuedCampaign = null;
                    logDebug('INFO', '[Dual Engine] Chance complete. Automatically triggering All-Chats campaign next...');
                    updateStatus('Chance complete. Automatically triggering All-Chats campaign next...');
                    setTimeout(() => {
                        if (!activeCampaignType && !isRunning && !stopCampaignRequested) {
                            runAllChatsCampaign();
                        }
                    }, 1500);
                }
            }
        }
    }

    // Master Routine C: Run Both Campaigns (All Chats first, then Chance)
    function runBothCampaigns() {
        if (activeCampaignType === 'all_chats' && queuedCampaign === 'chance') {
            updateStatus("Both campaigns are already active & queued!");
            return;
        }
        if (activeCampaignType || isRunning) {
            if (activeCampaignType === 'all_chats') {
                queuedCampaign = 'chance';
                updateCampaignButtonsUI();
                updateStatus("⏳ Chance queued to run right after All-Chats finishes!");
            } else if (activeCampaignType === 'chance') {
                queuedCampaign = 'all_chats';
                updateCampaignButtonsUI();
                updateStatus("⏳ All-Chats queued to run right after Chance finishes!");
            }
            return;
        }

        queuedCampaign = 'chance';
        updateCampaignButtonsUI();
        updateStatus("🚀 Running Both Campaigns: Starting All-Chats, Chance will follow next!");
        runAllChatsCampaign();
    }

    // Scheduler tick check (called every 30-60s)
    function checkCampaignSchedulerTick() {
        if (activeCampaignType || isRunning) return;
        updateCampaignCountdownUI();

        const intervalMs = getCampaignIntervalHours() * 3600 * 1000;
        const now = Date.now();

        // Check All Chats schedule
        if (isAllChatsSchedulerEnabled()) {
            const lastRun = parseInt(localStorage.getItem(ALL_CHATS_LAST_RUN_KEY) || localStorage.getItem('alpha_campaign_last_run') || '0', 10);
            if (now - lastRun >= intervalMs) {
                console.log('[Campaign Scheduler] All-Chats interval reached. Starting automated campaign...');
                runAllChatsCampaign();
                return;
            }
        }

        // Check Chance schedule
        if (isChanceSchedulerEnabled()) {
            const lastRun = parseInt(localStorage.getItem(CHANCE_LAST_RUN_KEY) || '0', 10);
            if (now - lastRun >= intervalMs) {
                console.log('[Campaign Scheduler] Chance interval reached. Starting automated campaign...');
                runChanceCampaign();
            }
        }
    }

// ==========================================
    // 4. OPENROUTER AI & FLEXIBLE TARGET LENGTH
    // ==========================================
    const OPENROUTER_KEY_STORAGE = 'alpha_openrouter_api_key';
    const OPENROUTER_MODEL_STORAGE = 'alpha_openrouter_model';
    const OPENROUTER_TARGET_CHARS_STORAGE = 'alpha_target_chars_count';
    const OPENROUTER_MINIMIZED_STORAGE = 'alpha_suggestions_minimized';
    const DEFAULT_MODEL = 'google/gemini-2.0-flash-001';
    const DEFAULT_TARGET_CHARS = 300;

    let currentTone = 'smart';
    let isGeneratingAI = false;
    let cachedSuggestions = [];
    let currentChatSignature = null;
    let replyContainer = null;

    function sanitizeHeaderString(val) {
        if (!val) return '';
        let str = String(val);
        // Replace smart quotes, dashes, ellipsis, zero-width characters, non-breaking spaces
        str = str
            .replace(/[\u2018\u2019]/g, "'")
            .replace(/[\u201C\u201D]/g, '"')
            .replace(/[\u2013\u2014]/g, '-')
            .replace(/[\u2026]/g, '')
            .replace(/[\u200B-\u200D\uFEFF]/g, '')
            .replace(/[\u00A0]/g, ' ');
        // Strip any characters outside ASCII 32-126
        str = str.replace(/[^\x20-\x7E]/g, '');
        // Strip outer quotes and spaces
        str = str.replace(/^[\"'\x60\s]+|[\"'\x60\s]+$/g, '');
        return str.trim();
    }

    function sanitizeApiKey(val) {
        if (!val) return '';
        let key = sanitizeHeaderString(val);
        // Strip leading 'Bearer ' or 'Bearer:' if accidentally included
        key = key.replace(/^bearer[:\s]+/i, '').trim();
        // Strip quotes and spaces
        key = key.replace(/^[\"'\x60\s]+|[\"'\x60\s]+$/g, '').trim();
        if (key === 'undefined' || key === 'null' || key === 'none') return '';
        return key;
    }

    function isValidOpenRouterKey(key) {
        if (!key) return false;
        const clean = sanitizeApiKey(key);
        return clean.length > 15;
    }

    function getOpenRouterKey() {
        const raw = localStorage.getItem(OPENROUTER_KEY_STORAGE) || '';
        return sanitizeApiKey(raw);
    }

    function getOpenRouterModel() {
        let stored = localStorage.getItem(OPENROUTER_MODEL_STORAGE);
        if (!stored || stored.startsWith('~') || stored === 'google/gemini-flash-latest') {
            stored = DEFAULT_MODEL;
        }
        return stored.replace(/^~+/, '').trim();
    }

    function getTargetChars() {
        const val = parseInt(localStorage.getItem(OPENROUTER_TARGET_CHARS_STORAGE), 10);
        return isNaN(val) || val <= 0 ? DEFAULT_TARGET_CHARS : val;
    }

    function setTargetChars(num) {
        localStorage.setItem(OPENROUTER_TARGET_CHARS_STORAGE, num.toString());
    }

    function getAssistantMinimized() {
        return localStorage.getItem(OPENROUTER_MINIMIZED_STORAGE) === 'true';
    }

    function setAssistantMinimized(val) {
        localStorage.setItem(OPENROUTER_MINIMIZED_STORAGE, val ? 'true' : 'false');
    }

    // Strictly enforces maximum character limit with smart sentence preservation
    function enforceCharacterLimit(text, maxChars) {
        if (!text || typeof text !== 'string') return '';
        const clean = text.trim();
        if (clean.length <= maxChars) return clean;

        // 1. Try sentence-level smart trimming to keep the hook and ending question
        const rawSentences = clean.match(/[^.!?]+[.!?]+(?:\s+|$)/g);
        const sentences = rawSentences ? rawSentences.map((s) => s.trim()) : [clean];

        const lastSentence = sentences[sentences.length - 1];
        const isLastQuestion = lastSentence.endsWith('?');

        if (sentences.length > 1 && isLastQuestion) {
            // Check if Sentence 1 (hook) + Last Sentence (question) fits
            const firstPlusLast = sentences[0] + ' ' + lastSentence;
            if (firstPlusLast.length <= maxChars && firstPlusLast.length >= maxChars * 0.55) {
                return firstPlusLast;
            }

            // Check how many sentences from start can fit along with the ending question
            let accumulated = '';
            for (let i = 0; i < sentences.length - 1; i++) {
                const candidate = (accumulated ? accumulated + ' ' : '') + sentences[i];
                if ((candidate + ' ' + lastSentence).length <= maxChars) {
                    accumulated = candidate;
                } else {
                    break;
                }
            }
            if (accumulated) {
                return accumulated + ' ' + lastSentence;
            }
        }

        // 2. Fallback: Find nearest sentence boundary within maxChars
        const trimmed = clean.slice(0, maxChars);
        const lastPunct = Math.max(trimmed.lastIndexOf('.'), trimmed.lastIndexOf('!'), trimmed.lastIndexOf('?'));
        if (lastPunct > maxChars * 0.65) {
            return trimmed.slice(0, lastPunct + 1).trim();
        }

        // 3. Fallback: Find nearest word boundary within maxChars
        const lastSpace = trimmed.lastIndexOf(' ');
        if (lastSpace > maxChars * 0.6) {
            let cut = trimmed.slice(0, lastSpace).trim();
            if (!/[.!?]$/.test(cut)) {
                cut += '?';
            }
            return cut;
        }

        return trimmed.trim();
    }

    function cleanReplyText(text) {
        if (!text) return '';
        let cleaned = text.trim();
        // Remove markdown wrappers without literal triple backticks
        cleaned = cleaned.replace(/^\x60{3}[a-z]*\s*/i, '').replace(/\x60{3}$/i, '');
        // Remove leading numbering like "1. ", "2) ", "- ", "• "
        cleaned = cleaned.replace(/^\d+[\.\)]\s*|^[-*•]\s*/, '').trim();
        // Strip opening and closing quotes, curly quotes, apostrophes, backticks
        cleaned = cleaned.replace(/^[\"'\u201c\u201d\u2018\u2019\x60\s]+/, '').replace(/[\"'\u201c\u201d\u2018\u2019\x60\s]+$/, '');
        // Strip any leading speaker prefixes (e.g. "[Anna (You)]:", "Anna:", "Me:", "You:")
        cleaned = cleaned.replace(/^(?:\[[^\]]+\]|[A-Za-z0-9_\s]{2,15})\s*:\s*/i, '').trim();
        return cleaned.trim();
    }

    let currentSelectedPartner = null;
    let currentSelectedProfile = null;

    function cleanNameString(raw) {
        if (!raw) return '';
        return raw.trim()
            .replace(/[,\d\(\)]/g, '')
            .split(/[\r\n]/)[0]
            .trim();
    }

    function isValidProfileName(name) {
        if (!name || typeof name !== 'string') return false;
        const trimmed = name.trim();
        if (trimmed.length < 2 || trimmed.length > 30) return false;
        const invalidWords = /^(credits|operator|online|offline|drafts|messages|search|settings|contact|honey|matches|chance|all chats|chats|active|filter|cancel|save|send|logout|login|edit|delete|unread|read|typing|unknown)$/i;
        if (invalidWords.test(trimmed)) return false;
        if (/operator:\s*/i.test(trimmed)) return false;
        if (/^\d+$/.test(trimmed)) return false;
        return true;
    }

    function getCardPartnerName(cardEl) {
        if (!cardEl) return null;
        const nameEl = cardEl.querySelector('[data-testid="man-name"], [class*="clmn_2_chat_block_item_middle_name-"], [class*="middle_name-"], [class*="name-"]');
        if (nameEl) {
            const clean = cleanNameString(nameEl.textContent || nameEl.alt || '');
            if (isValidProfileName(clean)) {
                return clean;
            }
        }
        return null;
    }

    function getCardProfileName(cardEl) {
        if (!cardEl) return null;
        // 1. Woman / profile name elements on Column 2 contact card
        const el = cardEl.querySelector(
            '[data-testid="woman-name"], [data-testid*="woman_name"], [data-testid*="profile-name"], ' +
            '[class*="clmn_2_chat_block_item_profile_name-"], [class*="clmn_2_chat_block_item_woman_name-"], ' +
            '[class*="clmn_2_chat_block_item_woman-"], [class*="chat_block_item_profile_name-"], ' +
            '[class*="woman_name-"], [class*="profile_name-"]'
        );
        if (el) {
            const clean = cleanNameString(el.textContent);
            if (isValidProfileName(clean)) {
                return clean;
            }
        }
        // 2. Woman avatar img alt attribute on the card
        const womanAvatar = cardEl.querySelector(
            '[class*="woman"] img[alt], [class*="profile"] img[alt], img[data-testid*="woman"], [class*="female"] img[alt]'
        );
        if (womanAvatar && womanAvatar.alt && womanAvatar.alt.trim().length > 1) {
            const clean = cleanNameString(womanAvatar.alt);
            if (isValidProfileName(clean)) {
                return clean;
            }
        }
        return null;
    }

    // 100% Dynamic Multi-Source Profile Persona Detection Engine
    function detectActiveProfileName(cardEl = null) {
        // 1. Check Column 2 Contact Card (passed in or currently active in list)
        const targetCard = cardEl || document.querySelector(
            '[class*="clmn_2_chat_block_item-"][class*="active"], ' +
            '[class*="clmn_2_chat_block_item-"][class*="selected"], ' +
            '[class*="clmn_2_chat_block_item-"][class*="current"], ' +
            '[class*="clmn_2_chat_block_item-"][aria-selected="true"], ' +
            '[class*="clmn_2"] [class*="active"], ' +
            '[class*="clmn_2"] [class*="selected"], ' +
            '[class*="clmn_2"] [class*="current-"], ' +
            '[class*="item_wrap-"][class*="active"]'
        );
        if (targetCard) {
            const cardPName = getCardProfileName(targetCard);
            if (cardPName && isValidProfileName(cardPName)) return cardPName;
        }

        // 2. Check Column 3 (Active chat header and sent message avatars)
        const col3 = document.querySelector('[class*="clmn_3"]');
        if (col3) {
            // A. Woman name tag in header
            const headerWoman = col3.querySelector(
                '[data-testid="woman-name"], [data-testid*="woman_name"], [class*="woman_name-"], [class*="profile_name-"], [class*="clmn_3_profile_name-"], [class*="chat_header_woman-"]'
            );
            if (headerWoman) {
                const clean = cleanNameString(headerWoman.textContent);
                if (isValidProfileName(clean)) return clean;
            }

            // B. Sent message avatars (our own sent messages on the right carry the female model's photo/name)
            const sentAvatars = col3.querySelectorAll(
                '[class*="clmn_3_chat_message-"][class*="right-"] img[alt], ' +
                '[class*="clmn_3_chat_message-"][class*="right-"] img[title], ' +
                '[data-testid*="sent-message"] img[alt], ' +
                '[data-testid*="sent-message"] img[title]'
            );
            for (let i = sentAvatars.length - 1; i >= 0; i--) {
                const av = sentAvatars[i];
                const clean = cleanNameString(av.alt || av.title);
                if (isValidProfileName(clean) && clean !== currentSelectedPartner) {
                    return clean;
                }
            }
        }

        // 3. Check Column 1 Active Profile Container (clmn_1_profile_wrap)
        const profileWrap = document.querySelector(
            '[class*="clmn_1_profile_wrap-"], [class*="clmn_1"] [class*="profile_wrap-"]'
        );
        if (profileWrap) {
            // Name element inside active profile wrap
            const wrapNameEl = profileWrap.querySelector(
                '[class*="clmn_1_profile_name-"], [class*="profile_name-"], [data-testid="profile-name"], [class*="name-"], [class*="title-"], [class*="clmn_1_profile_top-"] span, [class*="clmn_1_profile_top-"] div'
            );
            if (wrapNameEl) {
                const clean = cleanNameString(wrapNameEl.textContent);
                if (isValidProfileName(clean)) return clean;
            }

            // Avatar img inside active profile wrap
            const wrapAvatar = profileWrap.querySelector('img[alt], img[title]');
            if (wrapAvatar) {
                const clean = cleanNameString(wrapAvatar.alt || wrapAvatar.title);
                if (isValidProfileName(clean)) return clean;
            }

            // Text content of top area inside active profile wrap
            const topEl = profileWrap.querySelector('[class*="clmn_1_profile_top-"], [class*="top-"]');
            if (topEl) {
                const lines = topEl.textContent.trim().split(/\r?\n/).map(l => cleanNameString(l)).filter(Boolean);
                for (const line of lines) {
                    if (isValidProfileName(line)) return line;
                }
            }
        }

        // 4. Check active/selected profile in the Column 1 drawer
        const activeDrawerItem = document.querySelector(
            '[class*="clmn_1_mm_chat_wrap-"] [class*="active"] [data-testid="profile-name"], ' +
            '[class*="clmn_1_mm_chat_wrap-"] [class*="selected"] [data-testid="profile-name"], ' +
            '[class*="clmn_1_mm_chat_wrap-"] [aria-selected="true"] [data-testid="profile-name"], ' +
            '[class*="clmn_1_mm_chat_list-"] [class*="active"] [data-testid="profile-name"], ' +
            '[class*="clmn_1_mm_chat_list-"] [class*="selected"] [data-testid="profile-name"], ' +
            '[class*="clmn_1_mm_chat_wrap-"] [class*="active"] [class*="name-"], ' +
            '[class*="clmn_1_mm_chat_wrap-"] [class*="selected"] [class*="name-"]'
        );
        if (activeDrawerItem) {
            const clean = cleanNameString(activeDrawerItem.textContent);
            if (isValidProfileName(clean)) return clean;
        }

        // 5. Active Profile Button at top of Column 1
        const profileBtn = document.querySelector('[class*="clmn_1_profile_btn-"]');
        if (profileBtn) {
            const btnNameChild = profileBtn.querySelector('[class*="name"], span, div');
            const clean = cleanNameString(btnNameChild ? btnNameChild.textContent : profileBtn.textContent);
            if (isValidProfileName(clean)) return clean;
        }

        // 6. Return session-cached profile name if available
        if (currentSelectedProfile && isValidProfileName(currentSelectedProfile)) {
            return currentSelectedProfile;
        }

        return '';
    }

    function updateActiveProfileUI(profileName) {
        if (!isValidProfileName(profileName)) return;
        currentSelectedProfile = profileName;

        if (typeof latestChatData !== 'undefined' && latestChatData) {
            latestChatData.profileName = profileName;
        }

        if (currentSelectedPartner) {
            updateSelectedPartnerUI(currentSelectedPartner, profileName);
        } else {
            if (typeof writeupPartnerEl !== 'undefined' && writeupPartnerEl) {
                writeupPartnerEl.innerHTML = `👤 <span style="color:#94a3b8;">No chat selected</span> <span style="color:#94a3b8; font-size:10px;">as</span> <span style="color:#a78bfa; font-weight:600;" title="Active Profile: ${profileName}">${profileName}</span>`;
            }
            const badge = document.getElementById('alpha-wg-partner-badge');
            if (badge) {
                badge.textContent = `Profile: ${profileName}`;
                badge.title = `Active Profile: ${profileName}`;
                badge.style.display = 'inline-block';
            }
        }
    }

    function updateSelectedPartnerUI(partnerName, profileName = null) {
        if (!partnerName || partnerName === 'Honey' || partnerName === 'Contact') return;
        const cleanPartner = cleanNameString(partnerName);
        if (!cleanPartner || cleanPartner.length < 2) return;

        currentSelectedPartner = cleanPartner;
        const persona = (profileName && isValidProfileName(profileName)) ? profileName : (detectActiveProfileName() || currentSelectedProfile || '');
        if (persona) currentSelectedProfile = persona;

        if (typeof latestChatData !== 'undefined' && latestChatData) {
            latestChatData.partnerName = cleanPartner;
            latestChatData.profileName = persona;
        }

        // 1. Update Writeup Studio context row
        if (typeof writeupPartnerEl !== 'undefined' && writeupPartnerEl) {
            if (persona) {
                writeupPartnerEl.innerHTML = `👤 <span style="color:#38bdf8; font-weight:bold;" title="Contact: ${cleanPartner}">${cleanPartner}</span> <span style="color:#94a3b8; font-size:10px;">as</span> <span style="color:#a78bfa; font-weight:600;" title="Active Profile: ${persona}">${persona}</span>`;
            } else {
                writeupPartnerEl.innerHTML = `👤 <span style="color:#38bdf8; font-weight:bold;" title="Contact: ${cleanPartner}">${cleanPartner}</span>`;
            }
        }

        // 2. Update Writeup Studio header badge
        const badge = document.getElementById('alpha-wg-partner-badge');
        if (badge) {
            badge.textContent = persona ? `${cleanPartner} (${persona})` : cleanPartner;
            badge.title = persona ? `Active Contact: ${cleanPartner} | Profile: ${persona}` : `Active Contact: ${cleanPartner}`;
            badge.style.display = 'inline-block';
        }

        // 3. Update Review Bar if visible
        const revBarName = document.getElementById('alpha-rev-partner-name');
        if (revBarName) {
            revBarName.textContent = persona ? `${cleanPartner} (as ${persona})` : cleanPartner;
        }
    }

    // Delegated instant click handler for profiles and contact cards
    document.addEventListener('click', (e) => {
        // A. Profile selection in Column 1 (drawer or active wrap)
        const profileEl = e.target.closest(
            '[data-testid="profile-name"], [class*="clmn_1_mm_chat_list_item-"], [class*="clmn_1_profile_wrap-"], [class*="clmn_1_profile_btn-"], [class*="profile_item-"]'
        );
        if (profileEl) {
            // Immediate check from clicked element if it was a profile name
            const pNameEl = profileEl.matches('[data-testid="profile-name"]') ? profileEl : profileEl.querySelector('[data-testid="profile-name"], [class*="profile_name-"], [class*="name-"]');
            const raw = (pNameEl ? pNameEl.textContent : profileEl.textContent || '').trim();
            const clean = cleanNameString(raw);
            if (isValidProfileName(clean)) {
                updateActiveProfileUI(clean);
            }
            // And re-verify after React DOM updates
            setTimeout(() => {
                const detected = detectActiveProfileName();
                if (detected) {
                    updateActiveProfileUI(detected);
                }
            }, 120);
        }

        // B. Chat card click in Column 2
        const card = e.target.closest(
            '[class*="clmn_2_chat_block_item-"], [class*="chat_block_item"], [data-testid*="chat-item"], [data-testid="chat-list"] > div'
        );
        if (card) {
            const cardPartnerName = getCardPartnerName(card);
            const cardProfName = getCardProfileName(card);
            if (cardPartnerName) {
                updateSelectedPartnerUI(cardPartnerName, cardProfName);
            }
        }
    }, true);

    function extractPartnerAndProfileDetails(cardEl = null) {
        let partnerName = null;
        let partnerDetails = [];
        let profileName = detectActiveProfileName(cardEl);
        let profileBio = '';

        // 1. Check Column 3 Header (top of chat) for partner details
        const clmn3 = document.querySelector('[class*="clmn_3"]');
        if (clmn3) {
            const headerEl = clmn3.querySelector('[class*="clmn_3_chat_header-"], [class*="chat_header-"], [class*="clmn_3_header-"], header, [class*="top_bar-"]');
            if (headerEl) {
                const nameEl = headerEl.querySelector('[data-testid="man-name"], [data-testid="user-name"], [class*="middle_name-"], [class*="name-"], [class*="user-"], [data-testid*="name"], h1, h2, h3, h4');
                if (nameEl && nameEl.textContent.trim().length > 1 && nameEl.textContent.trim().length < 35) {
                    const clean = cleanNameString(nameEl.textContent);
                    if (isValidProfileName(clean)) partnerName = clean;
                }
                const headerText = headerEl.textContent.trim();
                if (headerText && headerText.length < 150) {
                    partnerDetails.push(headerText);
                }
            }

            if (!partnerName) {
                const headerAvatar = clmn3.querySelector('[class*="header"] img[alt], [class*="top"] img[alt]');
                if (headerAvatar && headerAvatar.alt && headerAvatar.alt.trim().length > 1) {
                    const clean = cleanNameString(headerAvatar.alt);
                    if (isValidProfileName(clean)) partnerName = clean;
                }
            }
        }

        // 2. Check Column 2 Active Item or explicitly passed cardEl
        const activeChatItem = cardEl || document.querySelector(
            '[class*="clmn_2_chat_block_item-"][class*="active"], ' +
            '[class*="clmn_2_chat_block_item-"][class*="selected"], ' +
            '[class*="clmn_2_chat_block_item-"][class*="current"], ' +
            '[class*="clmn_2_chat_block_item-"][aria-selected="true"], ' +
            '[class*="clmn_2"] [class*="active"], ' +
            '[class*="clmn_2"] [class*="selected"], ' +
            '[class*="clmn_2"] [class*="current-"], ' +
            '[class*="item_wrap-"][class*="active"]'
        );
        if (activeChatItem) {
            const cardName = getCardPartnerName(activeChatItem);
            if (cardName && (!partnerName || partnerName === 'Honey')) {
                partnerName = cardName;
            }
            if (!profileName) {
                const cardPName = getCardProfileName(activeChatItem);
                if (cardPName) profileName = cardPName;
            }
            const preview = activeChatItem.textContent.trim();
            if (preview && preview.length < 120) {
                partnerDetails.push(preview);
            }
        }

        // 3. Fallback for partner: currentSelectedPartner if captured by click
        if ((!partnerName || partnerName === 'Honey') && currentSelectedPartner) {
            partnerName = currentSelectedPartner;
        }

        // 4. If profileName still wasn't detected, use session state
        if (!profileName && currentSelectedProfile) {
            profileName = currentSelectedProfile;
        }

        // 5. Any profile view / user info panel in the DOM for bio
        const profileViewEl = document.querySelector('[class*="profile_view"], [class*="profile_info"], [class*="user_details"], [class*="user_info_wrap-"]');
        if (profileViewEl) {
            profileBio = profileViewEl.innerText.slice(0, 250).replace(/\s+/g, ' ').trim();
        }

        return {
            partnerName: partnerName || 'Honey',
            profileName: profileName || '',
            partnerDetails: partnerDetails.join(' | '),
            profileBio: profileBio
        };
    }


    // ==========================================
    // INSTANT LIKE & WINK AUTO-RESPONDER (COLUMN 4)
    // Real-time live notification interception, anti-spam deduplication,
    // and high-conversion psychologically compelling responses
    // ==========================================
    const ALPHA_AUTO_RESPOND_WINKS_LIKES_KEY = 'alpha_auto_respond_winks_likes_v56';
    const ALPHA_RESPONDED_NOTIFS_KEY = 'alpha_responded_notifs_cache_v56';
    const ALPHA_NOTIF_COOLDOWN_MINS_KEY = 'alpha_notif_cooldown_mins_v56';
    const ALPHA_NOTIF_REPLIED_COUNT_KEY = 'alpha_notif_replied_count_v56';

    function isAutoRespondLikesWinksEnabled() {
        const val = localStorage.getItem(ALPHA_AUTO_RESPOND_WINKS_LIKES_KEY);
        return val === null ? true : val === 'true'; // Enabled by default
    }

    function setAutoRespondLikesWinksEnabled(enabled) {
        localStorage.setItem(ALPHA_AUTO_RESPOND_WINKS_LIKES_KEY, enabled ? 'true' : 'false');
        updateAutoRespondLikesWinksButtonUI();
    }

    function getNotifCooldownMins() {
        const val = parseInt(localStorage.getItem(ALPHA_NOTIF_COOLDOWN_MINS_KEY) || '30', 10);
        return isNaN(val) ? 30 : val;
    }

    function setNotifCooldownMins(mins) {
        localStorage.setItem(ALPHA_NOTIF_COOLDOWN_MINS_KEY, String(mins));
    }

    function getRespondedNotifCount() {
        return parseInt(localStorage.getItem(ALPHA_NOTIF_REPLIED_COUNT_KEY) || '0', 10);
    }

    function incrementRespondedNotifCount() {
        const count = getRespondedNotifCount() + 1;
        localStorage.setItem(ALPHA_NOTIF_REPLIED_COUNT_KEY, String(count));
        updateAutoRespondLikesWinksButtonUI();
        return count;
    }

    let respondedNotifIds = new Set();
    try {
        const saved = JSON.parse(localStorage.getItem(ALPHA_RESPONDED_NOTIFS_KEY) || '[]');
        if (Array.isArray(saved)) {
            respondedNotifIds = new Set(saved);
        }
    } catch (e) {
        respondedNotifIds = new Set();
    }

    function isNotifResponded(notifId) {
        return notifId ? respondedNotifIds.has(notifId) : false;
    }

    function markNotifResponded(notifId) {
        if (!notifId) return;
        respondedNotifIds.add(notifId);
        if (respondedNotifIds.size > 500) {
            const arr = Array.from(respondedNotifIds).slice(-400);
            respondedNotifIds = new Set(arr);
        }
        try {
            localStorage.setItem(ALPHA_RESPONDED_NOTIFS_KEY, JSON.stringify(Array.from(respondedNotifIds)));
        } catch (e) {}
    }

    const partnerLastNotifRespondedTime = new Map();

    function isPartnerInNotifCooldown(partnerName) {
        if (!partnerName) return false;
        const key = partnerName.toLowerCase().trim();
        const lastTime = partnerLastNotifRespondedTime.get(key);
        if (!lastTime) return false;
        const cooldownMs = getNotifCooldownMins() * 60 * 1000;
        return (Date.now() - lastTime) < cooldownMs;
    }

    function recordPartnerNotifResponded(partnerName) {
        if (!partnerName) return;
        partnerLastNotifRespondedTime.set(partnerName.toLowerCase().trim(), Date.now());
    }

    function extractNotificationDetails(notifEl) {
        if (!notifEl) return null;

        const notifId = notifEl.getAttribute('data-testid') || notifEl.id || '';

        const nameEl = notifEl.querySelector('[data-testid="notification-user-name"], [class*="notification_user_name-"], [class*="clmn_4_block_paid_item_name-"]');
        const rawName = nameEl ? (nameEl.textContent || '').trim() : '';
        const partnerName = cleanNameString(rawName) || 'Honey';

        const contentEl = notifEl.querySelector('[data-testid="notification-content"], [class*="notification_content-"], [class*="clmn_4_block_paid_item_content-"]');
        const content = contentEl ? (contentEl.textContent || '').trim() : '';

        let eventType = null;
        if (/wink/i.test(content)) {
            eventType = 'wink';
        } else if (/(?:liked|like)/i.test(content)) {
            eventType = 'like';
        }

        if (!eventType) return null;

        const timeEl = notifEl.querySelector('[data-testid="notification-date"], [class*="notification_date-"], [class*="clmn_4_block_paid_item_time-"]');
        const timeStr = timeEl ? (timeEl.textContent || '').trim() : '';

        const womanImg = notifEl.querySelector('[data-testid="notification-woman-photo"] img, [class*="notification_woman_photo-"]');
        const womanPhotoSrc = womanImg ? (womanImg.src || '') : '';

        return {
            el: notifEl,
            notifId,
            rawName,
            partnerName,
            content,
            eventType,
            timeStr,
            womanPhotoSrc
        };
    }

    async function generateLikeWinkCompelReply(details, chatInfo) {
        const partnerName = details.partnerName || 'Honey';
        const profileName = (chatInfo && chatInfo.profileName) || getDynamicProfileName() || '';
        const eventType = details.eventType;
        const targetChars = getTargetChars();
        const minChars = Math.round(targetChars * 0.72);
        const maxWords = Math.floor(targetChars / 6);

        const apiKey = getOpenRouterKey();
        const model = getOpenRouterModel();
        const hasKey = isValidOpenRouterKey(apiKey);

        if (hasKey) {
            try {
                let systemPrompt = '';
                let userPrompt = '';

                if (eventType === 'wink') {
                    systemPrompt = `You are ${profileName}, a witty, playfully provocative, captivating, and confident woman chatting with a gentleman named ${partnerName} on a dating site.
IDENTITY INTEGRITY: You are ${profileName}. Never refer to yourself as anyone else or any operator name (e.g. Grace). Never say "I am [another name]".

CRITICAL CONVERSATION STATUS:
${partnerName} just sent you a WINK!
Sending a wink is a subtle, low-effort move. Your goal is to transform this subtle spark into an active, high-energy conversation.

PSYCHOLOGICAL HOOK - FORCING AN IMMEDIATE REPLY:
Your reply must playfully tease and challenge him for making such a subtle move, piquing his curiosity and ego so strongly that it is practically IMPOSSIBLE for him not to reply!
Key psychological angles to use (pick one or weave naturally):
1. Playful Challenge / Tease: Tease him that a wink is a bit too subtle for a handsome man, and challenge him to show what else he has got.
   (e.g., "A wink? Bold move... but tell me, is that your subtle way of saying I caught your eye, or do you always play it that mysteriously? 😉")
2. Curiosity & Ego: Ask what made him stop and wink, or tease him about whether he was too stunned by your photos to write actual words.
   (e.g., "Don't tell me a wink is all I get from a man like you. Were you testing the waters, or did my smile leave you a little speechless? 😏")
3. Irresistible Flirtation: Make him feel noticed while challenging him to step up.
   (e.g., "A wink already? Now you've got my attention... tell me, what caught your eye first so I know what I'm dealing with? 💋")

Strict Requirements:
1. STRICT HARD MAXIMUM: The response MUST NOT EXCEED ${targetChars} characters under any circumstances! Aim strictly between ${minChars} and ${targetChars} characters (at most ${maxWords} words).
2. The first 30 characters must be captivating and hook attention immediately.
3. DO NOT prefix with your name, sender tag, or role (do not write "${profileName}:" or "[${profileName} (You)]:").
4. MUST end with an irresistible, easy-to-answer open question that compels a reply.
5. DO NOT wrap the output in quotation marks or apostrophes at start or end.
6. Output ONLY the reply text.`;

                    userPrompt = `${partnerName} just sent me a wink! Write a playful, captivating, and flirtatious message that calls out his wink with charm and forces him to reply to me. Keep reply SHORT, STRICTLY UNDER ${targetChars} characters (max ${maxWords} words), ending with an engaging question.`;
                } else {
                    systemPrompt = `You are ${profileName}, a witty, playfully provocative, captivating, and confident woman chatting with a gentleman named ${partnerName} on a dating site.
IDENTITY INTEGRITY: You are ${profileName}. Never refer to yourself as anyone else or any operator name (e.g. Grace). Never say "I am [another name]".

CRITICAL CONVERSATION STATUS:
${partnerName} just LIKED your profile / photo!
He showed clear attraction, and your goal is to turn his like into an immediate, lively conversation.

PSYCHOLOGICAL HOOK - FORCING AN IMMEDIATE REPLY:
Your reply must acknowledge his like with irresistible warmth and playful intrigue, making him feel compelled to explain himself or confess what drew him in!
Key psychological angles to use (pick one or weave naturally):
1. Playful Confession Demand: Tell him you caught him liking your profile and ask him to confess what caught his eye.
   (e.g., "I saw that like... now confess: was it the smile, the eyes, or did something else catch your attention? Don't leave a girl wondering! 😉")
2. Teasing Challenge: Tease him playfully about viewing and liking without saying hello first.
   (e.g., "Caught you checking out my profile! But you haven't said hello yet... are you shy, or were you waiting for an invitation? 💋")
3. Chemistry Hook: Compliment his good taste while asking a fun question.
   (e.g., "I see someone has great taste 😏 What made you stop and like my profile? Tell me the truth!")

Strict Requirements:
1. STRICT HARD MAXIMUM: The response MUST NOT EXCEED ${targetChars} characters under any circumstances! Aim strictly between ${minChars} and ${targetChars} characters (at most ${maxWords} words).
2. The first 30 characters must be captivating and hook attention immediately.
3. DO NOT prefix with your name, sender tag, or role (do not write "${profileName}:" or "[${profileName} (You)]:").
4. MUST end with an irresistible, easy-to-answer open question that compels a reply.
5. DO NOT wrap the output in quotation marks or apostrophes at start or end.
6. Output ONLY the reply text.`;

                    userPrompt = `${partnerName} just liked my profile! Write a flirtatious, captivating message acknowledging his like with playful charm that compels him to reply immediately. Keep reply SHORT, STRICTLY UNDER ${targetChars} characters (max ${maxWords} words), ending with an engaging question.`;
                }

                logDebug('INFO', `[Instant Responder] Sending OpenRouter request for ${eventType} from ${partnerName}...`);
                const origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : 'https://alpha.date';
                const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": origin,
                        "X-Title": "Alpha.date Auto-Messenger"
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: userPrompt }
                        ],
                        temperature: 0.88,
                        max_tokens: 150
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    let content = data.choices?.[0]?.message?.content?.trim();
                    if (content) {
                        content = enforceCharacterLimit(cleanReplyText(content), targetChars);
                        logDebug('SUCCESS', `[Instant Responder] 🤖 Generated compelling ${eventType} reply for ${partnerName}: "${content.slice(0, 60)}..."`);
                        return content;
                    } else {
                        logDebug('ERROR', `[Instant Responder] OpenRouter returned empty response for ${partnerName}.`);
                    }
                } else {
                    const errData = await res.json().catch(() => ({}));
                    const errMsg = errData.error?.message || `HTTP ${res.status} (${res.statusText})`;
                    logDebug('ERROR', `[Instant Responder] OpenRouter API error for ${partnerName}: ${errMsg}`);
                }
            } catch (err) {
                logDebug('ERROR', `[Instant Responder] OpenRouter exception for ${partnerName}: ${err.message}`);
            }
        } else {
            logDebug('WARN', `[Instant Responder] OpenRouter key missing for ${eventType} responder.`);
        }

        // STRICT ZERO-DEFAULT POLICY: If AI generation fails, NEVER send canned fallback templates!
        const failReason = hasKey ? 'OpenRouter API failed or returned empty' : 'OpenRouter API key missing in settings';
        logDebug('ERROR', `[Instant Responder] ❌ Reply aborted for ${partnerName}'s ${eventType}: ${failReason}. No default message sent.`);
        showAiInactiveAlert(
            'Instant Responder (AI Inactive)',
            `Cannot reply to ${partnerName}'s ${eventType}: ${failReason}. Default messages are disabled, response was aborted.`,
            false
        );
        return null;
    }

    let isProcessingNotification = false;
    const notifQueue = [];

    function enqueueNotification(notifEl) {
        if (!isAutoRespondLikesWinksEnabled()) return;
        const details = extractNotificationDetails(notifEl);
        if (!details) return;

        if (isNotifResponded(details.notifId)) return;
        if (isPartnerInNotifCooldown(details.partnerName)) return;
        if (notifQueue.some(item => item.notifId === details.notifId)) return;

        logDebug('INFO', `[Instant Responder] ⚡ Intercepted incoming ${details.eventType.toUpperCase()} from ${details.partnerName} (${details.timeStr})!`);
        notifQueue.push(details);

        processNotifQueue();
    }

    async function processNotifQueue() {
        if (isProcessingNotification) return;
        if (!isAutoRespondLikesWinksEnabled()) return;
        if (notifQueue.length === 0) return;

        // If a campaign is actively mid-message, wait for the card step to finish
        if (activeCampaignType && isRunning) return;

        isProcessingNotification = true;
        const details = notifQueue.shift();

        try {
            await executeInstantNotificationResponse(details);
        } catch (err) {
            logDebug('ERROR', `[Instant Responder] Error responding to ${details.partnerName}: ${err.message}`);
        } finally {
            isProcessingNotification = false;
            if (notifQueue.length > 0) {
                setTimeout(processNotifQueue, 1200);
            }
        }
    }

    async function executeInstantNotificationResponse(details) {
        const partnerName = details.partnerName;
        const eventType = details.eventType;

        const hourlyCheck = checkHourlyMessageQuota();
        if (!hourlyCheck.allowed) {
            logDebug('WARN', `[Instant Responder] Hourly limit reached (${hourlyCheck.count}/${hourlyCheck.limit}). Skipping ${partnerName}.`);
            updateStatus(`[Instant Responder] Hourly limit reached. Skipped ${partnerName}.`, 'warn');
            markNotifResponded(details.notifId);
            return;
        }

        markNotifResponded(details.notifId);
        recordPartnerNotifResponded(partnerName);

        logDebug('STEP', `⚡ [Instant Responder] Opening chat for ${partnerName} (${eventType})...`);
        updateStatus(`⚡ [Instant] Responding to ${partnerName}'s ${eventType}...`);

        smartClick(details.el);
        await waitForChatMessagesToLoad(3500);

        const limitCheck = getRemainingMessageLimit();
        if (limitCheck.skip) {
            logDebug('WARN', `[Instant Responder] Skipped ${partnerName} (${limitCheck.count} messages left <= 1).`);
            updateStatus(`Skipped ${partnerName} (Messages left <= 1).`);
            return;
        }

        const chatInfo = readLast3MessagesFromChat();
        if (partnerName && (!chatInfo.partnerName || chatInfo.partnerName === 'Honey')) {
            chatInfo.partnerName = partnerName;
        }

        if (chatInfo.lastOurMsg && chatInfo.lastOurMsg.timeText) {
            const ourTime = isTimestampEligible(chatInfo.lastOurMsg.timeText);
            if (ourTime.diffHours < 0.15) {
                logDebug('WARN', `[Instant Responder] We already sent a message to ${partnerName} ${ourTime.diffHours.toFixed(2)}h ago. Skipping.`);
                return;
            }
        }

        logDebug('INFO', `[Instant Responder] Generating AI reply to ${eventType} for ${partnerName}...`);
        const replyText = await generateLikeWinkCompelReply(details, chatInfo);
        if (!replyText || replyText.length < 15) {
            logDebug('WARN', `[Instant Responder] Reply text unavailable or AI inactive for ${partnerName} (${eventType}). Aborting.`);
            updateStatus(`⚠️ [Instant Skipped] AI inactive for ${partnerName} (${eventType}). No message sent.`, 'warn');
            return;
        }

        insertIntoChatInput(replyText);
        await sleep(400);

        const activeTextarea = document.querySelector('[class*="clmn_3"] textarea, textarea');
        if (!activeTextarea) {
            logDebug('ERROR', `[Instant Responder] Chat textarea not found for ${partnerName}!`);
            return;
        }

        let textToSend = replyText;
        if (isSemiManualModeEnabled()) {
            logDebug('INFO', `[Instant Responder] Semi-Manual: Pausing for user review of ${eventType} response to ${partnerName}...`);
            updateStatus(`👁️ [Instant Review] Reply for ${partnerName} (${eventType}, ${replyText.length} chars). Press Enter to send ⏭️`);

            const reviewRes = await waitForUserReview(partnerName, replyText, chatInfo, activeTextarea);
            if (reviewRes.action === 'skip') {
                logDebug('WARN', `[Instant Responder] User skipped replying to ${partnerName}.`);
                return;
            }

            textToSend = reviewRes.text || activeTextarea.value || replyText;
            if (activeTextarea.value !== textToSend) {
                insertIntoChatInput(textToSend);
                await sleep(200);
            }
        }

        const sent = await sendChatMessageSafely(activeTextarea, partnerName);
        if (sent) {
            recordHourlySend();
            const total = incrementRespondedNotifCount();
            logDebug('SUCCESS', `⚡ [Instant Responder] Successfully responded to ${partnerName}'s ${eventType}! (Total answered: ${total})`);
            updateStatus(`⚡ [Instant] Responded to ${partnerName} (${eventType})!`, 'success');
        }
    }

    function initColumn4NotificationWatcher() {
        logDebug('INFO', '[Instant Responder] Initializing Column 4 notification watcher...');

        function scanColumn4Notifications() {
            if (!isAutoRespondLikesWinksEnabled()) return;
            const items = document.querySelectorAll(
                '[class*="clmn_4_block_list"] [class*="clmn_4_block_paid_item"], [class*="clmn_4"] [data-testid^="notification-"], [data-testid^="notification-"]'
            );
            items.forEach((item) => {
                const notifId = item.getAttribute('data-testid') || item.id || '';
                if (notifId && !isNotifResponded(notifId)) {
                    enqueueNotification(item);
                }
            });
        }

        let debounceNotifTimer = null;
        const observer = new MutationObserver((mutations) => {
            if (!isAutoRespondLikesWinksEnabled()) return;

            let hasNew = false;
            for (const m of mutations) {
                if (m.addedNodes && m.addedNodes.length > 0) {
                    for (const node of m.addedNodes) {
                        if (node.nodeType === 1) {
                            if (
                                (typeof node.matches === 'function' && node.matches('[data-testid^="notification-"], [class*="clmn_4_block_paid_item"]')) ||
                                (typeof node.querySelector === 'function' && node.querySelector('[data-testid^="notification-"], [class*="clmn_4_block_paid_item"]'))
                            ) {
                                hasNew = true;
                                break;
                            }
                        }
                    }
                }
                if (hasNew) break;
            }

            if (hasNew) {
                clearTimeout(debounceNotifTimer);
                debounceNotifTimer = setTimeout(scanColumn4Notifications, 250);
            }
        });

        const target = document.querySelector('[class*="clmn_4_block_list"], [class*="clmn_4"]') || document.body;
        observer.observe(target, { childList: true, subtree: true });

        // Backup polling every 3 seconds
        setInterval(scanColumn4Notifications, 3000);
    }

    function parseChatHistory(cardEl = null) {
        const chatList = document.querySelector('[data-testid="chat-body"], [class*="clmn_3_chat_list-"], .clmn_3_chat_list-jqyW9V, [class*="clmn_3_chat_scroll-"], [class*="clmn_3"]');
        const inputArea = document.querySelector('[class*="clmn_3"] textarea, textarea');
        if (!chatList && !inputArea) return null;

        const messageEls = Array.from(document.querySelectorAll('[class*="clmn_3_chat_message-"], [data-testid*="received-message-"], [data-testid*="sent-message-"], [id^="mess-"]'));
        const context = extractPartnerAndProfileDetails(cardEl);
        let partnerName = context.partnerName;
        let profileName = context.profileName;
        const messages = [];

        messageEls.forEach((el) => {
            const isReceived = el.classList.contains('left-LN1dv5') || el.matches('[class*="left-"]') || el.getAttribute('data-testid')?.includes('received');
            const textEl = el.querySelector('[data-testid="message-text"], [class*="message_text-"], [class*="clmn_3_chat_message_content-"]');
            let text = '';
            if (textEl) {
                const span = textEl.querySelector('span:not([class*="time"]):not([class*="credit"]):not([class*="operator"])');
                text = (span ? span.textContent : textEl.textContent || '').trim();
                text = text.replace(/\|\s*\d+\s*credits.*$/i, '').trim();

                // Strip any operator tag or text from the message content
                const opTag = el.querySelector('[class*="operator_name-"], [class*="operator-"]');
                if (opTag && opTag.textContent) {
                    text = text.replace(opTag.textContent.trim(), '').trim();
                }
                text = text.replace(/operator:\s*[A-Za-z0-9_\s]+/i, '').trim();
            }

            // Check if this message is or contains an image / photo
            const imgEl = el.querySelector('[data-testid="message-image"], [class*="message_img-"], img[src*="chats-images"], [data-testid*=".jpg"], [data-testid*=".jpeg"], [data-testid*=".png"], [data-testid*=".webp"]');
            const isImage = !!imgEl;

            if (isImage) {
                if (text) {
                    text = `${text} [Photo]`;
                } else {
                    text = '[Sent a photo]';
                }
            }

            // Check if this is a system activity (e.g. liked profile, wink)
            const isLikeEvent = el.querySelector('[class*="like-"], img[src*="like"]') || /liked your profile/i.test(text);
            const isWinkEvent = el.querySelector('[class*="wink-"], img[src*="wink"]') || /wink/i.test(text);
            const isSystem = isLikeEvent || isWinkEvent || /viewed your profile/i.test(text);

            if (text || isImage) {
                // Extract partner's real name if embedded in "Matt liked your profile"
                const nameMatch = text.match(/^([A-Z][a-z]+)\s+(?:liked your profile|viewed your profile|winked at you|sent you a wink)/i);
                if (nameMatch && (!partnerName || partnerName === 'Honey')) {
                    partnerName = nameMatch[1];
                }

                // Extract timestamp directly from message element
                const timeEl = el.querySelector('[data-testid="message-date"], [class*="clmn_3_chat_message_time-"], [class*="chat_message_time-"], [class*="time-"]');
                const timeText = timeEl ? cleanTimestampString(timeEl.getAttribute('data-aht-base-time-text') || timeEl.querySelector('span')?.textContent || timeEl.textContent || '') : '';

                messages.push({
                    role: isReceived ? 'them' : 'me',
                    text: text,
                    id: el.id || '',
                    timeText: timeText,
                    isSystem: isSystem,
                    isImage: isImage,
                    action: isLikeEvent ? 'like' : (isWinkEvent ? 'wink' : null),
                    el: el
                });

                if (isReceived && (!partnerName || partnerName === 'Honey')) {
                    const avatar = el.querySelector('img[alt]');
                    if (avatar && avatar.alt && avatar.alt.trim()) partnerName = avatar.alt.trim();
                }
            }
        });

        const realMessages = messages.filter((m) => !m.isSystem);
        const lastMsg = realMessages.length > 0 ? realMessages[realMessages.length - 1] : (messages.length > 0 ? messages[messages.length - 1] : null);
        const lastUserMsg = realMessages.filter((m) => m.role === 'them').slice(-1)[0] || (messages.filter((m) => m.role === 'them').slice(-1)[0] || null);
        const lastOurMsg = realMessages.filter((m) => m.role === 'me').slice(-1)[0] || (messages.filter((m) => m.role === 'me').slice(-1)[0] || null);
        const hasLikedProfile = messages.some((m) => m.action === 'like' || /liked your profile/i.test(m.text));
        const isEmptyChat = messages.length === 0;

        return {
            messages,
            realMessages,
            lastMsg,
            lastUserMsg,
            lastOurMsg,
            hasLikedProfile,
            isEmptyChat,
            partnerName: partnerName || 'Honey',
            profileName: profileName || detectActiveProfileName(cardEl) || '',
            partnerDetails: context.partnerDetails,
            profileBio: context.profileBio
        };
    }

    async function requestOpenRouterReplies(chatData, tone, customInstruction = '') {
        const apiKey = getOpenRouterKey();
        if (!isValidOpenRouterKey(apiKey)) {
            console.warn('[OpenRouter] Key missing or invalid format (expected sk-or-v1-...).');
            showAiInactiveAlert(
                'AI Inactive',
                'OpenRouter API key is missing or invalid in Universal Settings. Please configure your key to generate messages.',
                false
            );
            return null;
        }

        const model = getOpenRouterModel();
        const targetChars = getTargetChars();
        const minRange = Math.round(targetChars * 0.88);
        const maxRange = Math.round(targetChars * 1.12);

        let systemPrompt = '';
        let userPrompt = '';

        const customInstructionClean = (customInstruction || '').trim();
        const customPromptSection = customInstructionClean ? `\n\nCRITICAL USER CUSTOM INSTRUCTION:\nThe user has provided a custom instruction for this message:\n"${customInstructionClean}"\nYour generated suggestions MUST specifically follow and incorporate this instruction! Ensure the message weaves this in naturally while maintaining the charming, engaging persona.` : '';

        if (chatData.isEmptyChat) {
            let toneInstruction = '';
            if (tone === 'flirty') {
                toneInstruction = 'Tone: Playfully seductive, teasing him for checking out your photos/profile, confident and flirty.';
            } else if (tone === 'question') {
                toneInstruction = 'Tone: Curious and intriguing, asking what made him view your profile or what caught his eye.';
            } else if (tone === 'reengage') {
                toneInstruction = 'Tone: Teasing him playfully for viewing your profile without saying hello first.';
            } else {
                toneInstruction = 'Tone: Charming, warm, captivating, and flirtatious.';
            }

            systemPrompt = `You are ${chatData.profileName || getDynamicProfileName()}, an attractive, charming woman on a dating site.
IDENTITY INTEGRITY: You are ${chatData.profileName || getDynamicProfileName()}. Never refer to yourself as anyone else or any operator name (e.g. Grace). Never say "I am [another name]".
A man named ${chatData.partnerName} has just viewed your profile (or this is a new empty chat where you are making the first move).
Your goal is to send him an irresistible first message / conversation starter that makes him reply immediately.
${chatData.partnerDetails ? `Context about him: ${chatData.partnerDetails}` : ''}
${chatData.profileBio ? `Profile details: ${chatData.profileBio}` : ''}
${customPromptSection}

${toneInstruction}

STRICT LENGTH & FORMATION RULES:
1. TARGET LENGTH: Each message MUST be CLOSE TO ${targetChars} characters long (aim strictly for ${minRange} to ${maxRange} characters). Do not write excessively beyond or below ${targetChars} characters.
2. PROFILE VIEW CONTEXT: The message MUST relate to him viewing/visiting your profile, checking out your photos, or you noticing him and deciding to say hello first.
3. CAPTIVATING HOOK: The first 30 characters MUST be captivating, spicy, or intriguing to grab his attention immediately in notification previews.
4. END WITH A QUESTION: Every message MUST end with a fun, simple, easy-to-answer question that compels him to respond right away.
5. NO QUOTES: Do NOT wrap replies in quotation marks or apostrophes. Never start or end with " or '.
6. COMPLETE SENTENCES: Complete every thought and sentence fully. Never truncate.

FORMAT RULE:
Output exactly 3 numbered suggestions (1, 2, and 3).
Example:
1. First icebreaker message close to ${targetChars} characters ending with a question?
2. Second icebreaker message close to ${targetChars} characters ending with a question?
3. Third icebreaker message close to ${targetChars} characters ending with a question?`;

            userPrompt = customInstructionClean
                ? `Write 3 irresistible first-contact messages to ${chatData.partnerName} following this custom instruction: "${customInstructionClean}". Target: close to ${targetChars} characters each (${minRange}-${maxRange} chars). End each with a simple question. No quotes.`
                : `The chat is empty - ${chatData.partnerName} visited my profile! Generate 3 irresistible first-contact icebreakers related to his profile view. Target: close to ${targetChars} characters each (${minRange}-${maxRange} chars). End each with a simple question. No quotes.`;
        } else {
            const recentMessages = chatData.messages.slice(-8);
            const lastMsg = chatData.lastMsg;
            const isLastFromMe = lastMsg && lastMsg.role === 'me';

            let toneInstruction = '';
            if (tone === 'flirty') {
                toneInstruction = 'Tone: Seductive, charming, playful, and flirty.';
            } else if (tone === 'question') {
                toneInstruction = 'Tone: Curious, asking an intriguing question to make him reply.';
            } else if (tone === 'reengage') {
                toneInstruction = 'Tone: He has been silent. Playfully tease him for being quiet and get him back into conversation.';
            } else {
                toneInstruction = 'Tone: Warm, captivating, emotionally intelligent, and conversational.';
            }

            const transcript = recentMessages.map((m) => {
                if (m.isSystem) return `[System Event: ${m.text}]`;
                const sender = m.role === 'them' ? `${chatData.partnerName} (The Man)` : `${chatData.profileName} (You)`;
                return `[${sender}]: "${m.text}"`;
            }).join('\n');

            const realMsgs = chatData.messages.filter((m) => !m.isSystem);
            const last3FromMeStudio = chatData.last3FromMe || (realMsgs.length >= 3 && realMsgs.slice(-3).every((m) => m.role === 'me'));

            if (last3FromMeStudio) {
                const photoRequestInstruction = '\nSPECIAL DIRECTIVE: You have sent the last 3 consecutive messages and he has not replied with words! Generate 3 playful, charming, and flirtatious suggestions specifically asking him to send a photo / picture of himself instead (e.g. teasing him for being quiet with words and challenging him to share a picture)!';
                systemPrompt = `You are ${chatData.profileName || getDynamicProfileName()}, an attractive, charming, genuine woman chatting with a man named ${chatData.partnerName} on a dating site.
IDENTITY INTEGRITY: You are ${chatData.profileName || getDynamicProfileName()}. Never refer to yourself as anyone else or any operator name (e.g. Grace). Never say "I am [another name]".

CRITICAL CONVERSATION STATUS:
You (${chatData.profileName || getDynamicProfileName()}) have sent the last 3 consecutive messages in this chat, and ${chatData.partnerName} has not replied with words.${photoRequestInstruction}
${customPromptSection}
Generate 3 playful, charming suggestions specifically asking him to send a picture / photo.`;

                userPrompt = customInstructionClean
                    ? `Conversation History:
${transcript}

I have sent the last 3 messages and ${chatData.partnerName} has not replied with words. Generate 3 playful suggestions specifically asking him to send a photo/picture of himself following this custom instruction: "${customInstructionClean}". Target: close to ${targetChars} characters each (${minRange}-${maxRange} chars). End each with a question. No quotes.`
                    : `Conversation History:
${transcript}

I have sent the last 3 messages and ${chatData.partnerName} has not replied with words. Generate 3 playful suggestions specifically asking him to send a photo/picture of himself instead. Target: close to ${targetChars} characters each (${minRange}-${maxRange} chars). End each with a simple question. No quotes.`;
            } else if (isLastFromMe) {
                const prevText = lastMsg ? lastMsg.text : '';
                const isPhoto = lastMsg && (lastMsg.isImage || /\[(?:photo|sent a photo)\]/i.test(prevText));
                const photoContext = isPhoto ? '\nNote: You recently sent him a photo and he hasn\'t replied yet! Tease him playfully about being speechless or stunned by your picture, and ask if he liked it.' : '';
                systemPrompt = `You are ${chatData.profileName || getDynamicProfileName()}, an attractive, charming, genuine woman chatting with a man named ${chatData.partnerName} on a dating site.
IDENTITY INTEGRITY: You are ${chatData.profileName || getDynamicProfileName()}. Never refer to yourself as anyone else or any operator name (e.g. Grace). Never say "I am [another name]".

CRITICAL CONVERSATION STATUS:
You (${chatData.profileName || getDynamicProfileName()}) were the LAST person to speak in the chat. Your previous message was: "${prevText}".
${chatData.partnerName} HAS NOT REPLIED YET.
DO NOT answer your own previous question or repeat yourself! You are NOT answering "${prevText}".${photoContext}
${customPromptSection}
Instead, generate 3 playful, charming follow-up nudge / check-in suggestions to re-engage him and get his attention.

${toneInstruction}

STRICT LENGTH & FORMATION RULES:
1. TARGET LENGTH: Each message MUST be CLOSE TO ${targetChars} characters long (aim strictly for ${minRange} to ${maxRange} characters).
2. CAPTIVATING HOOK: The first 30 characters MUST be captivating, warm, or intriguing to grab his attention immediately in notification previews.
3. END WITH A QUESTION: Every message MUST end with a fun, simple, easy-to-answer question that continues the conversation naturally.
4. NO QUOTES: Do NOT wrap replies in quotation marks or apostrophes. Never start or end with " or '.
5. COMPLETE SENTENCES: Complete every thought and sentence fully. Never truncate.

FORMAT RULE:
Output exactly 3 numbered suggestions (1, 2, and 3).
Example:
1. First follow-up nudge close to ${targetChars} characters ending with a question?
2. Second follow-up nudge close to ${targetChars} characters ending with a question?
3. Third follow-up nudge close to ${targetChars} characters ending with a question?`;

                userPrompt = customInstructionClean
                    ? `Conversation History:\n${transcript}\n\n${chatData.partnerName} has not replied yet to my last message ("${prevText}"). Generate 3 playful, charming follow-up suggestions following this custom instruction: "${customInstructionClean}". Target: close to ${targetChars} characters each (${minRange}-${maxRange} chars). End each with a question. No quotes.`
                    : `Conversation History:\n${transcript}\n\n${chatData.partnerName} has not replied yet to my last message ("${prevText}"). Generate 3 playful, charming follow-up nudge suggestions now. Target: close to ${targetChars} characters each (${minRange}-${maxRange} chars). End each with a simple question. No quotes.`;
            } else {
                const lastUserText = chatData.lastUserMsg ? chatData.lastUserMsg.text : (lastMsg ? lastMsg.text : '');
                const isUserPhoto = (chatData.lastUserMsg && chatData.lastUserMsg.isImage) || (lastMsg && lastMsg.isImage) || /\[(?:photo|sent a photo)\]/i.test(lastUserText);
                const userPhotoContext = isUserPhoto ? `\n- Note: ${chatData.partnerName} sent you a photo! React flirtatiously and warmly to his picture, compliment what you see, and ask an intriguing question about it.` : '';
                systemPrompt = `You are ${chatData.profileName || getDynamicProfileName()}, an attractive, charming, genuine woman chatting with a man named ${chatData.partnerName} on a dating site.
IDENTITY INTEGRITY: You are ${chatData.profileName || getDynamicProfileName()}. Never refer to yourself as anyone else or any operator name (e.g. Grace). Never say "I am [another name]".

CRITICAL INSTRUCTION - DIRECT RELEVANCE TO HIS MESSAGE:
You are directly replying to ${chatData.partnerName}'s message: "${lastUserText}".
Your response MUST directly address, acknowledge, and answer what he just said!
${chatData.hasLikedProfile ? `- Note: ${chatData.partnerName} also liked your profile! Acknowledge his like or interest playfully.` : ''}${userPhotoContext}
${customPromptSection}
- If he asked to know more about you (e.g. "${lastUserText}"), tell him charming, genuine details about who you are, what you love doing, your passions, and invite him to share about himself.
- Do NOT ignore what he said. Do NOT send random, canned greetings or pretend he was silent. Every suggestion MUST make total sense as a reply to: "${lastUserText}".

${toneInstruction}

STRICT LENGTH & FORMATION RULES:
1. TARGET LENGTH: Each message MUST be CLOSE TO ${targetChars} characters long (aim strictly for ${minRange} to ${maxRange} characters). Do not write excessively beyond or below ${targetChars} characters.
2. CAPTIVATING HOOK: The first 30 characters MUST be captivating, warm, or intriguing to grab his attention immediately in notification previews.
3. END WITH A QUESTION: Every message MUST end with a fun, simple, easy-to-answer question that continues the conversation naturally.
4. NO QUOTES: Do NOT wrap replies in quotation marks or apostrophes. Never start or end with " or '.
5. COMPLETE SENTENCES: Complete every thought and sentence fully. Never truncate.

FORMAT RULE:
Output exactly 3 numbered suggestions (1, 2, and 3).
Example:
1. First message close to ${targetChars} characters answering "${lastUserText}" and ending with a question?
2. Second message close to ${targetChars} characters answering "${lastUserText}" and ending with a question?
3. Third message close to ${targetChars} characters answering "${lastUserText}" and ending with a question?`;

                userPrompt = customInstructionClean
                    ? `Conversation History:\n${transcript}\n\n${chatData.partnerName}'s message to reply to: "${lastUserText}"\n\nGenerate 3 complete replies following this custom instruction: "${customInstructionClean}". Target: close to ${targetChars} characters each (${minRange}-${maxRange} chars). End each with a simple question. No quotes.`
                    : `Conversation History:\n${transcript}\n\n${chatData.partnerName}'s message to reply to: "${lastUserText}"\n\nGenerate 3 complete replies now that directly answer his message. Target: close to ${targetChars} characters each (${minRange}-${maxRange} chars). End each with a simple question. No quotes.`;
            }
        }

        const tokenLimit = Math.max(1500, Math.ceil(targetChars * 2.5));

        const cleanKey = sanitizeHeaderString(apiKey);
        const cleanOrigin = sanitizeHeaderString(window.location.origin) || 'https://alpha.date';

        const headers = {
            'Authorization': `Bearer ${cleanKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': cleanOrigin,
            'X-Title': 'AlphaDate Assistant'
        };
        for (const k of Object.keys(headers)) {
            headers[k] = sanitizeHeaderString(headers[k]);
        }

        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.75,
                include_reasoning: false,
                max_tokens: Math.max(1200, tokenLimit)
            })
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`OpenRouter API error (${res.status}): ${err}`);
        }

        const data = await res.json();
        const choice = data.choices?.[0];
        let replyContent = choice?.message?.content || choice?.message?.reasoning || '';
        if (replyContent.includes('<think>')) {
            replyContent = replyContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        }

        let suggestions = [];
        try {
            const cleanJson = replyContent.replace(/^\x60{3}json\s*/i, '').replace(/^\x60{3}\s*/i, '').replace(/\x60{3}$/i, '').trim();
            const parsed = JSON.parse(cleanJson);
            if (Array.isArray(parsed)) {
                suggestions = parsed.map(cleanReplyText);
            }
        } catch (e) {
            suggestions = replyContent.split('\n')
                .map(cleanReplyText)
                .filter((l) => l.length > 30);
        }

        suggestions = suggestions.map(cleanReplyText).map((s) => enforceCharacterLimit(s, targetChars)).filter((s) => s.length > 20);
        if (suggestions.length > 0) {
            return suggestions.slice(0, 3);
        }

        return null;
    }

    function getFallbackSuggestions(chatData, tone) {
        // PERMANENTLY REMOVED in v5.9: Zero default/fallback messages policy.
        return [];
    }

    function insertIntoChatInput(text) {
        const input = document.querySelector('[class*="clmn_3"] textarea, textarea, [class*="clmn_3"] [contenteditable="true"]');
        if (!input) return;

        const cleanText = cleanReplyText(text);

        if (input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') {
            const proto = Object.getPrototypeOf(input);
            const descriptor = Object.getOwnPropertyDescriptor(proto, 'value') || Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value');

            if (descriptor && descriptor.set) {
                descriptor.set.call(input, cleanText);
            } else {
                input.value = cleanText;
            }

            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.focus();
        } else if (input.isContentEditable) {
            input.focus();
            document.execCommand('selectAll', false, null);
            document.execCommand('insertText', false, cleanText);
        }
    }

    // ==========================================
    // 5. SETTINGS MODAL
    // ==========================================
    function showSettingsModal() {
        const existing = document.getElementById('tm-openrouter-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'tm-openrouter-modal';
        Object.assign(modal.style, {
            position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.65)', zIndex: 1000000, display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif'
        });

        const box = document.createElement('div');
        Object.assign(box.style, {
            background: '#1f2937', color: '#fff', padding: '24px', borderRadius: '12px',
            width: '460px', maxWidth: '92%', maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
        });

        const currentModel = getOpenRouterModel();
        const currentTargetChars = getTargetChars();

        box.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <h3 style="margin:0; font-size:16px;">⚙️ Universal Settings & AI Controls</h3>
                <span style="font-size:11px; color:#94a3b8; background:#111827; padding:2px 8px; border-radius:4px; border:1px solid #334155;">Global (Alt+S)</span>
            </div>
            
            <label style="font-size:12px; color:#9ca3af; display:block; margin-bottom:4px;">OpenRouter API Key:</label>
            <input id="tm-or-key" type="password" placeholder="sk-or-v1-..." value="${getOpenRouterKey()}" 
                style="width:100%; box-sizing:border-box; padding:8px 10px; background:#111827; border:1px solid #374151; color:#fff; border-radius:6px; font-size:13px; margin-bottom:12px;">

            <label style="font-size:12px; color:#9ca3af; display:block; margin-bottom:4px;">Active Model:</label>
            <select id="tm-or-model-select" style="width:100%; box-sizing:border-box; padding:8px 10px; background:#111827; border:1px solid #374151; color:#fff; border-radius:6px; font-size:13px; margin-bottom:6px;">
                <option value="google/gemini-2.0-flash-001">Google: Gemini 2.0 Flash (Fast & Recommended)</option>
                <option value="google/gemini-flash-1.5">Google: Gemini Flash 1.5</option>
                <option value="google/gemini-2.5-flash">Google: Gemini 2.5 Flash</option>
                <option value="openrouter/free">OpenRouter: Free Models Router (100% Free)</option>
                <option value="google/gemma-4-31b-it:free">Google: Gemma 4 31B (100% Free)</option>
                <option value="deepseek/deepseek-v4.1-flash">DeepSeek: V4.1 Flash</option>
                <option value="anthropic/claude-haiku-4.5">Anthropic: Claude Haiku 4.5</option>
                <option value="openai/gpt-chat-latest">OpenAI: GPT Chat Latest</option>
                <option value="custom">Other / Custom Model ID...</option>
            </select>
            <input id="tm-or-model" type="text" value="${currentModel}" 
                style="width:100%; box-sizing:border-box; padding:6px 10px; background:#111827; border:1px solid #374151; color:#fff; border-radius:6px; font-size:12px; margin-bottom:8px;">

            <div style="margin-bottom:12px;">
                <button type="button" id="tm-test-connection-btn" style="padding:6px 12px; background:#1e293b; color:#38bdf8; border:1px solid #475569; border-radius:6px; font-size:11px; cursor:pointer; font-weight:bold; display:flex; align-items:center; gap:6px;">
                    🧪 Test OpenRouter Connection & Model
                </button>
                <div id="tm-test-result-box" style="display:none; font-size:11px; padding:6px 8px; border-radius:6px; margin-top:6px; line-height:1.35;"></div>
            </div>

            <label style="font-size:12px; color:#9ca3af; display:block; margin-bottom:4px;">Target Character Length (Close to):</label>
            <div style="display:flex; gap:8px; margin-bottom:8px;">
                <input id="tm-or-target-chars" type="number" min="50" max="4000" step="50" value="${currentTargetChars}" 
                    style="width:110px; padding:6px 10px; background:#111827; border:1px solid #374151; color:#fff; border-radius:6px; font-size:13px; font-weight:bold;">
                <button type="button" id="tm-preset-150" style="padding:6px 10px; background:#374151; color:#fff; border:none; border-radius:6px; font-size:11px; cursor:pointer;">💬 ~150 (Short)</button>
                <button type="button" id="tm-preset-300" style="padding:6px 10px; background:#2563eb; color:#fff; border:none; border-radius:6px; font-size:11px; cursor:pointer;">📝 ~300 (Normal)</button>
                <button type="button" id="tm-preset-1500" style="padding:6px 10px; background:#374151; color:#fff; border:none; border-radius:6px; font-size:11px; cursor:pointer;">💌 ~1500 (Letter)</button>
            </div>
            <div style="font-size:11px; color:#9ca3af; margin-bottom:16px;">
                The AI will aim <b>close to this number</b>, end with an easy question, and start with an attention-grabbing hook.
            </div>

            <hr style="border:0; border-top:1px solid #374151; margin:14px 0;">
            <h4 style="margin:0 0 10px 0; font-size:13px; color:#e5e7eb;">⏰ Inactivity Campaign & Rate Limit Settings</h4>

            <div style="display:flex; gap:12px; margin-bottom:10px;">
                <div style="flex:1;">
                    <label style="font-size:11px; color:#9ca3af; display:block; margin-bottom:4px;">Inactivity Threshold (Hours):</label>
                    <input id="tm-camp-hours" type="number" min="0.5" max="48" step="0.5" value="${getCampaignIntervalHours()}" 
                        style="width:100%; box-sizing:border-box; padding:6px 8px; background:#111827; border:1px solid #374151; color:#fff; border-radius:6px; font-size:12px;">
                </div>
                <div style="flex:1;">
                    <label style="font-size:11px; color:#9ca3af; display:block; margin-bottom:4px;">Delay Between Chats (ms):</label>
                    <input id="tm-camp-delay" type="number" min="1000" max="15000" step="500" value="${getCampaignDelayMs()}" 
                        style="width:100%; box-sizing:border-box; padding:6px 8px; background:#111827; border:1px solid #374151; color:#fff; border-radius:6px; font-size:12px;">
                </div>
            </div>

            <!-- DYNAMIC PERSONA / PROFILE STATUS (v5.4) -->
            <div style="margin-bottom:12px; background:#111827; padding:8px 10px; border-radius:6px; border:1px solid #374151; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:11px; color:#9ca3af;">Active Persona Profile:</span>
                <span style="font-size:12px; color:#a78bfa; font-weight:bold;">${detectActiveProfileName() || currentSelectedProfile || 'Auto-detecting...'}</span>
            </div>

            <!-- HOURLY MESSAGE LIMIT SETTING (v5.1) -->
            <label style="font-size:11px; color:#9ca3af; display:block; margin-bottom:4px;">Hourly Message Limit (Max sends per 60m):</label>
            <div style="display:flex; gap:6px; margin-bottom:6px; align-items:center;">
                <input id="tm-hourly-limit" type="number" min="0" max="500" step="5" value="${getHourlyMessageLimit()}" 
                    style="width:90px; padding:6px 8px; background:#111827; border:1px solid #374151; color:#fff; border-radius:6px; font-size:12px; font-weight:bold;">
                <button type="button" id="tm-limit-20" style="padding:5px 8px; background:#374151; color:#fff; border:none; border-radius:6px; font-size:11px; cursor:pointer;">20/h</button>
                <button type="button" id="tm-limit-30" style="padding:5px 8px; background:#374151; color:#fff; border:none; border-radius:6px; font-size:11px; cursor:pointer;">30/h</button>
                <button type="button" id="tm-limit-50" style="padding:5px 8px; background:#374151; color:#fff; border:none; border-radius:6px; font-size:11px; cursor:pointer;">50/h</button>
                <button type="button" id="tm-limit-0" style="padding:5px 8px; background:#374151; color:#fff; border:none; border-radius:6px; font-size:11px; cursor:pointer;">Unlimited (0)</button>
            </div>
            <div style="font-size:10.5px; color:#94a3b8; margin-bottom:12px;">
                Current sends in last 60m: <b style="color:#38bdf8;">${getHourlySendCount()}</b> / <b>${getHourlyMessageLimit() > 0 ? getHourlyMessageLimit() : 'Unlimited'}</b> msgs.
            </div>

            <div style="margin-bottom:14px; background:#111827; padding:10px; border-radius:6px; border:1px solid #374151;">
                <label style="display:flex; align-items:center; gap:8px; font-size:12px; color:#d1d5db; margin-bottom:6px; cursor:pointer;">
                    <input id="tm-camp-all-chats-sched" type="checkbox" ${isAllChatsSchedulerEnabled() ? 'checked' : ''}>
                    <span>Auto-Schedule <b>All Chats</b> every interval</span>
                </label>
                <label style="display:flex; align-items:center; gap:8px; font-size:12px; color:#d1d5db; cursor:pointer;">
                    <input id="tm-camp-chance-sched" type="checkbox" ${isChanceSchedulerEnabled() ? 'checked' : ''}>
                    <span>Auto-Schedule <b>Chance (Matches)</b> every interval</span>
                </label>
                <hr style="border:0; border-top:1px solid #374151; margin:8px 0;">
                <label style="display:flex; align-items:center; gap:8px; font-size:12px; color:#6ee7b7; cursor:pointer;">
                    <input id="tm-camp-auto-likewink" type="checkbox" ${isAutoRespondLikesWinksEnabled() ? 'checked' : ''}>
                    <span><b>⚡ Instant Auto-Responder</b>: Respond to Likes & Winks immediately</span>
                </label>
                <div style="display:flex; align-items:center; gap:8px; margin-left:24px; font-size:11px; color:#94a3b8;">
                    <span>Cooldown between winks/likes to same user:</span>
                    <input id="tm-camp-notif-cooldown" type="number" min="5" max="720" value="${getNotifCooldownMins()}" style="width:55px; padding:2px 5px; background:#1e293b; border:1px solid #475569; border-radius:4px; color:#fff; font-size:11px;">
                    <span>mins</span>
                </div>
                <hr style="border:0; border-top:1px solid #374151; margin:8px 0;">
                <label style="display:flex; align-items:center; gap:8px; font-size:12px; color:#c4b5fd; cursor:pointer;">
                    <input id="tm-camp-semi-manual" type="checkbox" ${isSemiManualModeEnabled() ? 'checked' : ''}>
                    <span><b>👁️ Semi-Manual Mode</b> (Inspect messages first & press Enter to send)</span>
                </label>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:8px;">
                <button id="tm-or-cancel" style="padding:6px 12px; background:#374151; color:#fff; border:none; border-radius:6px; cursor:pointer;">Cancel</button>
                <button id="tm-or-save" style="padding:6px 14px; background:#2563eb; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">Save & Apply</button>
            </div>
        `;

        modal.appendChild(box);
        document.body.appendChild(modal);

        const select = document.getElementById('tm-or-model-select');
        const input = document.getElementById('tm-or-model');
        const charInput = document.getElementById('tm-or-target-chars');
        const campHoursInput = document.getElementById('tm-camp-hours');
        const campDelayInput = document.getElementById('tm-camp-delay');
        const hourlyLimitInput = document.getElementById('tm-hourly-limit');

        document.getElementById('tm-limit-20').onclick = () => { hourlyLimitInput.value = 20; };
        document.getElementById('tm-limit-30').onclick = () => { hourlyLimitInput.value = 30; };
        document.getElementById('tm-limit-50').onclick = () => { hourlyLimitInput.value = 50; };
        document.getElementById('tm-limit-0').onclick = () => { hourlyLimitInput.value = 0; };
        const allChatsCheck = document.getElementById('tm-camp-all-chats-sched');
        const chanceCheck = document.getElementById('tm-camp-chance-sched');

        let matched = false;
        for (let opt of select.options) {
            if (opt.value === currentModel) {
                select.value = currentModel;
                matched = true;
                break;
            }
        }
        if (!matched) select.value = 'custom';

        select.onchange = () => {
            if (select.value !== 'custom') input.value = select.value;
        };

        document.getElementById('tm-preset-150').onclick = () => { charInput.value = 150; };
        document.getElementById('tm-preset-300').onclick = () => { charInput.value = 300; };
        document.getElementById('tm-preset-1500').onclick = () => { charInput.value = 1500; };

        // Test OpenRouter Connection handler
        document.getElementById('tm-test-connection-btn').onclick = async () => {
            const rawKey = document.getElementById('tm-or-key').value;
            const key = sanitizeApiKey(rawKey);
            const model = sanitizeHeaderString(document.getElementById('tm-or-model').value) || DEFAULT_MODEL;
            const resBox = document.getElementById('tm-test-result-box');
            resBox.style.display = 'block';
            resBox.style.background = '#1e293b';
            resBox.style.color = '#94a3b8';
            resBox.style.border = '1px solid #334155';
            resBox.innerHTML = '⏳ Testing connection to OpenRouter...';

            if (!isValidOpenRouterKey(key)) {
                resBox.style.background = 'rgba(153, 27, 27, 0.4)';
                resBox.style.border = '1px solid #ef4444';
                resBox.style.color = '#fca5a5';
                resBox.innerHTML = '❌ API Key is missing or invalid! (Key must be entered above)';
                return;
            }

            const startTime = Date.now();
            try {
                const origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : 'https://alpha.date';
                const testRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${key}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": origin,
                        "X-Title": "Alpha.date Auto-Messenger"
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            { role: "user", content: "Say OK in 1 word" }
                        ],
                        include_reasoning: false,
                        max_tokens: 50
                    })
                });

                const latency = Date.now() - startTime;
                if (testRes.ok) {
                    resBox.style.background = 'rgba(6, 78, 59, 0.4)';
                    resBox.style.border = '1px solid #10b981';
                    resBox.style.color = '#6ee7b7';
                    resBox.innerHTML = `✅ <b>Success!</b> Model <code>${model}</code> responded in ${latency}ms. AI auto-messaging is active and working!`;
                    logDebug('SUCCESS', `[Settings Test] OpenRouter connection test passed for ${model} (${latency}ms).`);
                } else {
                    const errData = await testRes.json().catch(() => ({}));
                    const errMsg = errData?.error?.message || `HTTP ${testRes.status} ${testRes.statusText}`;
                    resBox.style.background = 'rgba(153, 27, 27, 0.4)';
                    resBox.style.border = '1px solid #ef4444';
                    resBox.style.color = '#fca5a5';
                    resBox.innerHTML = `❌ <b>Connection Failed (${testRes.status}):</b> ${errMsg}`;
                    logDebug('ERROR', `[Settings Test] OpenRouter test failed (${testRes.status}): ${errMsg}`);
                }
            } catch (netErr) {
                resBox.style.background = 'rgba(153, 27, 27, 0.4)';
                resBox.style.border = '1px solid #ef4444';
                resBox.style.color = '#fca5a5';
                resBox.innerHTML = `❌ <b>Network Error:</b> ${netErr.message}`;
                logDebug('ERROR', `[Settings Test] OpenRouter network exception: ${netErr.message}`);
            }
        };

        document.getElementById('tm-or-cancel').onclick = () => modal.remove();
        document.getElementById('tm-or-save').onclick = () => {
            const rawKey = document.getElementById('tm-or-key').value;
            const key = sanitizeApiKey(rawKey);
            const model = sanitizeHeaderString(document.getElementById('tm-or-model').value) || DEFAULT_MODEL;
            const targetChars = parseInt(charInput.value, 10) || DEFAULT_TARGET_CHARS;
            const hint = document.getElementById('tm-or-key-hint');

            if (key && (key.startsWith('sk-proj-') || (key.startsWith('sk-') && !key.startsWith('sk-or-')))) {
                hint.style.display = 'block';
                hint.innerHTML = '⚠️ That appears to be an OpenAI direct key. OpenRouter requires an API key starting with <b>sk-or-v1-</b> from <a href="https://openrouter.ai/keys" target="_blank" style="color:#60a5fa;">openrouter.ai/keys</a>.';
                return;
            }

            localStorage.setItem(OPENROUTER_KEY_STORAGE, key);
            localStorage.setItem(OPENROUTER_MODEL_STORAGE, model);
            setTargetChars(targetChars);

            const hoursVal = parseFloat(campHoursInput.value);
            if (!isNaN(hoursVal) && hoursVal > 0) {
                setCampaignIntervalHours(hoursVal);
            }

            const delayVal = parseInt(campDelayInput.value, 10);
            if (!isNaN(delayVal) && delayVal >= 1000) {
                localStorage.setItem(CAMPAIGN_DELAY_MS_KEY, delayVal.toString());
            }

            const hourlyVal = parseInt(hourlyLimitInput.value, 10);
            setHourlyMessageLimit(isNaN(hourlyVal) ? 30 : hourlyVal);



            setAllChatsSchedulerEnabled(allChatsCheck.checked);
            setChanceSchedulerEnabled(chanceCheck.checked);
            const autoLikeWinkCheck = document.getElementById('tm-camp-auto-likewink');
            if (autoLikeWinkCheck) setAutoRespondLikesWinksEnabled(autoLikeWinkCheck.checked);
            const notifCooldownInput = document.getElementById('tm-camp-notif-cooldown');
            if (notifCooldownInput) {
                const cVal = parseInt(notifCooldownInput.value, 10);
                if (!isNaN(cVal) && cVal >= 1) setNotifCooldownMins(cVal);
            }
            const semiManualCheck = document.getElementById('tm-camp-semi-manual');
            if (semiManualCheck) setSemiManualModeEnabled(semiManualCheck.checked);
            updateCampaignCountdownUI();

            modal.remove();
            cachedSuggestions = [];
            checkAndUpdateActiveChat(true);
            updateStatus('⚙️ Universal Settings saved and applied!');
            logDebug('SUCCESS', '[Settings] Universal settings updated (Model, API Key, Timers, Schedulers).');
        };
    }

    // ==========================================
    // STANDALONE FLOATING AI WRITEUP STUDIO
    // Completely decoupled from textarea, always visible,
    // draggable, custom instructions, and one-click actions!
    // ==========================================
    const WRITEUP_POS_KEY = 'alpha_writeup_pos_v48';
    const WRITEUP_COLLAPSED_KEY = 'alpha_writeup_collapsed_v48';
    const WRITEUP_PROMPT_KEY = 'alpha_writeup_custom_prompt_v48';

    let writeupPanel = null;
    let writeupHeader = null;
    let writeupBody = null;
    let writeupPartnerEl = null;
    let writeupCustomInput = null;
    let writeupResultsWrap = null;
    let writeupMinBtn = null;
    let currentCustomInstruction = '';
    let latestChatData = null;

    function ensureWriteupStudioMounted() {
        // Remove any old in-textarea overlay so textarea is 100% unblocked!
        const oldInChatOverlay = document.getElementById('tm-suggested-replies');
        if (oldInChatOverlay && oldInChatOverlay.parentElement) {
            oldInChatOverlay.remove();
        }

        if (writeupPanel && document.body.contains(writeupPanel)) {
            return;
        }

        // Floating Studio Panel Container
        writeupPanel = document.createElement('div');
        writeupPanel.id = 'alpha-writeup-panel';
        Object.assign(writeupPanel.style, {
            position: 'fixed', zIndex: 999998,
            background: 'rgba(15, 23, 42, 0.97)',
            backdropFilter: 'blur(10px)',
            border: '1px solid #4f46e5',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.65)',
            color: '#f8fafc',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            width: '330px',
            maxWidth: 'calc(100vw - 20px)',
            boxSizing: 'border-box',
            userSelect: 'none',
            transition: 'box-shadow 0.2s, width 0.2s ease',
            overflow: 'hidden'
        });

        // Header (Draggable Handle & Controls)
        writeupHeader = document.createElement('div');
        writeupHeader.id = 'alpha-writeup-header';
        Object.assign(writeupHeader.style, {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '7px 10px', background: 'linear-gradient(135deg, #1e1b4b, #1e293b)',
            borderBottom: '1px solid #4338ca', cursor: 'grab', fontSize: '11px', userSelect: 'none'
        });

        const hdrLeft = document.createElement('div');
        Object.assign(hdrLeft.style, { display: 'flex', alignItems: 'center', gap: '6px' });
        hdrLeft.innerHTML = `
            <span style="font-size:13px; opacity:0.6; cursor:grab;" title="Drag to move Writeup Studio">⋮⋮</span>
            <span style="font-weight:700; color:#818cf8; letter-spacing:0.5px;">✨ WRITEUP STUDIO</span>
            <span id="alpha-wg-partner-badge" style="font-size:10px; font-weight:600; background:#312e81; color:#c7d2fe; padding:1px 6px; border-radius:10px; max-width:110px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; display:none;"></span>
            <span id="alpha-wg-status-dot" style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#10b981;" title="AI Studio Ready"></span>
        `;

        const hdrRight = document.createElement('div');
        Object.assign(hdrRight.style, { display: 'flex', alignItems: 'center', gap: '4px' });

        const clearBtn = document.createElement('button');
        clearBtn.textContent = '🧹';
        clearBtn.title = 'Clear Custom Instruction';
        Object.assign(clearBtn.style, { background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', padding: '0 3px' });
        clearBtn.onclick = (e) => {
            e.stopPropagation();
            if (writeupCustomInput) {
                writeupCustomInput.value = '';
                localStorage.removeItem(WRITEUP_PROMPT_KEY);
                currentCustomInstruction = '';
                updateStatus('Cleared custom writeup instruction.');
            }
        };

        const settingsBtn = document.createElement('button');
        settingsBtn.textContent = '⚙️';
        settingsBtn.title = 'Settings (Model, API Key, Character Target)';
        Object.assign(settingsBtn.style, { background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', padding: '0 3px' });
        settingsBtn.onclick = (e) => {
            e.stopPropagation();
            showSettingsModal();
        };

        writeupMinBtn = document.createElement('button');
        writeupMinBtn.textContent = '▾';
        writeupMinBtn.title = 'Minimize / Expand Studio';
        Object.assign(writeupMinBtn.style, {
            background: 'none', border: 'none', color: '#94a3b8', fontSize: '13px',
            cursor: 'pointer', padding: '0 4px', fontWeight: 'bold', lineHeight: '1'
        });
        writeupMinBtn.onclick = (e) => {
            e.stopPropagation();
            toggleWriteupCollapse();
        };

        writeupHeader.ondblclick = (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
            toggleWriteupCollapse();
        };

        hdrRight.appendChild(clearBtn);
        hdrRight.appendChild(settingsBtn);
        hdrRight.appendChild(writeupMinBtn);
        writeupHeader.appendChild(hdrLeft);
        writeupHeader.appendChild(hdrRight);

        // Body (Collapsible)
        writeupBody = document.createElement('div');
        writeupBody.id = 'alpha-writeup-body';
        Object.assign(writeupBody.style, {
            padding: '8px 10px 10px 10px', boxSizing: 'border-box',
            display: 'flex', flexDirection: 'column', gap: '7px'
        });

        // 1. Context Row (Current partner & selectors)
        const contextRow = document.createElement('div');
        Object.assign(contextRow.style, {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: '#1e293b', border: '1px solid #334155', borderRadius: '7px',
            padding: '5px 8px', fontSize: '10.5px'
        });

        writeupPartnerEl = document.createElement('div');
        Object.assign(writeupPartnerEl.style, {
            display: 'flex', alignItems: 'center', gap: '5px', overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px', fontWeight: '600'
        });
        writeupPartnerEl.innerHTML = `👤 <span style="color:#38bdf8;">Auto-linking...</span>`;

        const selectorsWrap = document.createElement('div');
        Object.assign(selectorsWrap.style, { display: 'flex', gap: '4px', alignItems: 'center' });

        // Length Select
        const lenSelect = document.createElement('select');
        Object.assign(lenSelect.style, {
            background: '#0f172a', border: '1px solid #475569', color: '#818cf8',
            borderRadius: '4px', padding: '2px 4px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer'
        });
        [
            { label: '150 (Short)', val: 150 },
            { label: '250 (Normal)', val: 250 },
            { label: '300 (Flirty)', val: 300 },
            { label: '500 (Detailed)', val: 500 },
            { label: '800 (Letter)', val: 800 }
        ].forEach((opt) => {
            const option = document.createElement('option');
            option.value = opt.val;
            option.textContent = opt.label;
            if (getTargetChars() === opt.val) option.selected = true;
            lenSelect.appendChild(option);
        });
        lenSelect.onchange = () => {
            setTargetChars(parseInt(lenSelect.value, 10));
            triggerStudioWriteup(false);
        };

        // Tone Select
        const toneSelect = document.createElement('select');
        Object.assign(toneSelect.style, {
            background: '#0f172a', border: '1px solid #475569', color: '#38bdf8',
            borderRadius: '4px', padding: '2px 4px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer'
        });
        [
            { label: 'Smart AI', val: 'smart' },
            { label: 'Flirty', val: 'flirty' },
            { label: 'Question', val: 'question' },
            { label: 'Re-engage', val: 'reengage' }
        ].forEach((opt) => {
            const option = document.createElement('option');
            option.value = opt.val;
            option.textContent = opt.label;
            if (currentTone === opt.val) option.selected = true;
            toneSelect.appendChild(option);
        });
        toneSelect.onchange = () => {
            currentTone = toneSelect.value;
            triggerStudioWriteup(false);
        };

        selectorsWrap.appendChild(lenSelect);
        selectorsWrap.appendChild(toneSelect);
        contextRow.appendChild(writeupPartnerEl);
        contextRow.appendChild(selectorsWrap);

        // 2. Custom Instruction Section
        const instructionHdr = document.createElement('div');
        Object.assign(instructionHdr.style, {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontSize: '9.5px', fontWeight: '700', textTransform: 'uppercase',
            letterSpacing: '0.5px', color: '#94a3b8', marginTop: '1px'
        });
        instructionHdr.innerHTML = `<span>✍️ Custom Instruction (Optional)</span><span style="color:#64748b; font-weight:normal;">Ctrl+Enter</span>`;

        writeupCustomInput = document.createElement('textarea');
        writeupCustomInput.id = 'alpha-wg-custom-input';
        writeupCustomInput.placeholder = "e.g. 'Say I love hiking and invite him for coffee', 'Tease him about his photo', 'Ask about his weekend'...";
        Object.assign(writeupCustomInput.style, {
            width: '100%', height: '46px', background: '#1e293b', border: '1px solid #334155',
            borderRadius: '6px', color: '#f8fafc', fontSize: '11px', padding: '6px 8px',
            resize: 'none', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', lineHeight: '1.3'
        });

        // Restore saved custom instruction if available
        const savedPrompt = localStorage.getItem(WRITEUP_PROMPT_KEY) || '';
        if (savedPrompt) {
            writeupCustomInput.value = savedPrompt;
            currentCustomInstruction = savedPrompt;
        }

        writeupCustomInput.oninput = () => {
            currentCustomInstruction = writeupCustomInput.value;
            localStorage.setItem(WRITEUP_PROMPT_KEY, currentCustomInstruction);
        };

        writeupCustomInput.onkeydown = (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                triggerStudioWriteup(true);
            }
        };

        // 3. Quick Preset Chips
        const chipsRow = document.createElement('div');
        Object.assign(chipsRow.style, { display: 'flex', gap: '4px', flexWrap: 'wrap' });

        const presets = [
            { label: '☕ Coffee', text: 'Invite him out for coffee or a drink in a playful, charming way' },
            { label: '🐕 Photos', text: 'Playfully tease and compliment him about his photos' },
            { label: '✈️ Weekend', text: 'Ask what his weekend plans are or if he loves traveling' },
            { label: '😉 Flirty', text: 'Tease him playfully and ask a flirty question' },
            { label: '❓ Deep Talk', text: 'Ask an intriguing question to spark a fun, meaningful conversation' }
        ];

        presets.forEach((p) => {
            const chip = document.createElement('button');
            chip.textContent = p.label;
            chip.title = `Fill instruction: "${p.text}"`;
            Object.assign(chip.style, {
                background: '#1e293b', border: '1px solid #334155', color: '#94a3b8',
                borderRadius: '12px', padding: '2px 7px', fontSize: '9.5px', cursor: 'pointer',
                transition: 'background 0.15s, color 0.15s, border-color 0.15s'
            });
            chip.onmouseenter = () => { chip.style.borderColor = '#818cf8'; chip.style.color = '#fff'; chip.style.background = '#312e81'; };
            chip.onmouseleave = () => { chip.style.borderColor = '#334155'; chip.style.color = '#94a3b8'; chip.style.background = '#1e293b'; };
            chip.onclick = () => {
                writeupCustomInput.value = p.text;
                currentCustomInstruction = p.text;
                localStorage.setItem(WRITEUP_PROMPT_KEY, p.text);
                writeupCustomInput.focus();
            };
            chipsRow.appendChild(chip);
        });

        // 4. Primary Action Button
        const genBtn = document.createElement('button');
        genBtn.id = 'alpha-wg-gen-btn';
        genBtn.textContent = '⚡ Generate Writeup';
        genBtn.title = 'Generate AI message using current chat context and your custom instruction (Ctrl+Enter)';
        Object.assign(genBtn.style, {
            width: '100%', padding: '7px 10px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11.5px',
            fontWeight: 'bold', cursor: 'pointer', transition: 'opacity 0.2s, transform 0.1s',
            boxShadow: '0 2px 8px rgba(79, 70, 229, 0.4)'
        });
        genBtn.onmouseenter = () => { genBtn.style.opacity = '0.92'; };
        genBtn.onmouseleave = () => { genBtn.style.opacity = '1'; };
        genBtn.onclick = () => triggerStudioWriteup(true);

        // 5. Results Section
        writeupResultsWrap = document.createElement('div');
        writeupResultsWrap.id = 'alpha-wg-results';
        Object.assign(writeupResultsWrap.style, {
            display: 'flex', flexDirection: 'column', gap: '6px',
            maxHeight: '220px', overflowY: 'auto'
        });
        writeupResultsWrap.innerHTML = `<div style="text-align:center; padding:10px 4px; color:#64748b; font-size:11px;">💡 Click <b>Generate</b> or press <b>Ctrl+Enter</b> to create custom AI writeups!</div>`;

        // Assemble Body
        writeupBody.appendChild(contextRow);
        writeupBody.appendChild(instructionHdr);
        writeupBody.appendChild(writeupCustomInput);
        writeupBody.appendChild(chipsRow);
        writeupBody.appendChild(genBtn);
        writeupBody.appendChild(writeupResultsWrap);

        // Assemble Panel
        writeupPanel.appendChild(writeupHeader);
        writeupPanel.appendChild(writeupBody);

        // Dragging mechanism
        setupWriteupDragging();
        restoreWriteupPosition();
        restoreWriteupCollapsed();

        document.body.appendChild(writeupPanel);
    }

    function toggleWriteupCollapse() {
        const isCollapsed = writeupBody.style.display === 'none';
        setWriteupCollapsed(!isCollapsed);
    }

    function setWriteupCollapsed(collapsed) {
        if (!writeupBody || !writeupPanel) return;
        if (collapsed) {
            writeupBody.style.display = 'none';
            writeupPanel.style.width = 'auto';
            if (writeupMinBtn) {
                writeupMinBtn.textContent = '▴';
                writeupMinBtn.title = 'Expand Writeup Studio';
            }
            localStorage.setItem(WRITEUP_COLLAPSED_KEY, 'true');
        } else {
            writeupBody.style.display = 'flex';
            writeupPanel.style.width = '330px';
            if (writeupMinBtn) {
                writeupMinBtn.textContent = '▾';
                writeupMinBtn.title = 'Minimize Writeup Studio';
            }
            localStorage.setItem(WRITEUP_COLLAPSED_KEY, 'false');
        }
    }

    function setupWriteupDragging() {
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let initialLeft = 0;
        let initialTop = 0;

        writeupHeader.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;

            isDragging = true;
            writeupHeader.style.cursor = 'grabbing';

            const rect = writeupPanel.getBoundingClientRect();
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            initialLeft = rect.left;
            initialTop = rect.top;

            writeupPanel.style.left = `${rect.left}px`;
            writeupPanel.style.top = `${rect.top}px`;
            writeupPanel.style.right = 'auto';
            writeupPanel.style.bottom = 'auto';

            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - dragStartX;
            const dy = e.clientY - dragStartY;

            const maxLeft = Math.max(10, window.innerWidth - writeupPanel.offsetWidth - 10);
            const maxTop = Math.max(10, window.innerHeight - writeupPanel.offsetHeight - 10);

            const newLeft = Math.min(Math.max(10, initialLeft + dx), maxLeft);
            const newTop = Math.min(Math.max(10, initialTop + dy), maxTop);

            writeupPanel.style.left = `${newLeft}px`;
            writeupPanel.style.top = `${newTop}px`;
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                writeupHeader.style.cursor = 'grab';
                const rect = writeupPanel.getBoundingClientRect();
                localStorage.setItem(WRITEUP_POS_KEY, JSON.stringify({ x: Math.round(rect.left), y: Math.round(rect.top) }));
            }
        });
    }

    function restoreWriteupPosition() {
        try {
            const saved = localStorage.getItem(WRITEUP_POS_KEY);
            if (saved) {
                const pos = JSON.parse(saved);
                const maxLeft = Math.max(10, window.innerWidth - 340);
                const maxTop = Math.max(10, window.innerHeight - 150);
                const x = Math.min(Math.max(10, pos.x), maxLeft);
                const y = Math.min(Math.max(10, pos.y), maxTop);
                writeupPanel.style.left = `${x}px`;
                writeupPanel.style.top = `${y}px`;
                writeupPanel.style.right = 'auto';
                writeupPanel.style.bottom = 'auto';
                return;
            }
        } catch (e) {}

        // Default position: floating beside the dashboard
        if (window.innerWidth > 720) {
            writeupPanel.style.right = '340px';
            writeupPanel.style.top = '70px';
        } else {
            writeupPanel.style.right = '18px';
            writeupPanel.style.top = '70px';
        }
    }

    function restoreWriteupCollapsed() {
        const saved = localStorage.getItem(WRITEUP_COLLAPSED_KEY);
        if (saved === 'true') {
            setWriteupCollapsed(true);
        } else {
            setWriteupCollapsed(false);
        }
    }

    async function triggerStudioWriteup(forceRefresh = true) {
        ensureWriteupStudioMounted();

        const chatData = parseChatHistory() || {
            partnerName: latestChatData ? latestChatData.partnerName : 'Honey',
            profileName: latestChatData ? latestChatData.profileName : (detectActiveProfileName() || ''),
            messages: [],
            realMessages: [],
            last3: [],
            isEmptyChat: true,
            lastMsg: null,
            lastUserMsg: null,
            lastOurMsg: null
        };

        latestChatData = chatData;
        const partnerName = chatData.partnerName || 'Honey';

        // Update Partner & Persona Context Label
        const personaName = chatData.profileName || detectActiveProfileName() || '';
        if (writeupPartnerEl) {
            writeupPartnerEl.innerHTML = `👤 <span style="color:#38bdf8; font-weight:bold;" title="Contact: ${partnerName}">${partnerName}</span> <span style="color:#94a3b8; font-size:10px;">as</span> <span style="color:#a78bfa; font-weight:600;" title="Active Persona Profile: ${personaName}">${personaName}</span>`;
        }

        const genBtn = document.getElementById('alpha-wg-gen-btn');
        if (genBtn) {
            genBtn.disabled = true;
            genBtn.textContent = '⏳ Generating...';
        }

        if (writeupResultsWrap) {
            writeupResultsWrap.innerHTML = `<div style="text-align:center; padding:12px; color:#818cf8; font-size:11px;">🤖 Generating AI writeup for <b>${partnerName}</b>...</div>`;
        }

        const customInstruction = (writeupCustomInput ? writeupCustomInput.value : currentCustomInstruction).trim();
        const hasKey = isValidOpenRouterKey(getOpenRouterKey());
        const targetChars = getTargetChars();

        let suggestions = [];

        let studioError = null;
        if (hasKey) {
            try {
                const aiReplies = await requestOpenRouterReplies(chatData, currentTone, customInstruction);
                if (aiReplies && aiReplies.length > 0) {
                    suggestions = aiReplies;
                } else {
                    studioError = 'OpenRouter returned empty suggestions. Check model or prompt.';
                }
            } catch (err) {
                console.error('[Writeup Studio]', err);
                studioError = err.message;
                updateStatus(`[Studio AI Error] ${err.message}`, true);
            }
        } else {
            studioError = 'OpenRouter API key missing or invalid in Universal Settings.';
            showAiInactiveAlert('AI Inactive', 'OpenRouter API key is missing. Set your key in Settings to generate writeups.', false);
        }

        if (genBtn) {
            genBtn.disabled = false;
            genBtn.textContent = '⚡ Generate Writeup';
        }

        renderStudioResults(chatData, suggestions, studioError);
    }

    function renderStudioResults(chatData, suggestions, studioError = null) {
        if (!writeupResultsWrap) return;
        writeupResultsWrap.innerHTML = '';

        const targetChars = getTargetChars();
        const partnerName = chatData.partnerName || 'Honey';

        if (!suggestions || suggestions.length === 0) {
            const errorDesc = studioError || 'AI is inactive or failed to generate suggestions.';
            writeupResultsWrap.innerHTML = `
                <div style="text-align:left; padding:12px; color:#fca5a5; background:rgba(153,27,27,0.3); border:1px solid #ef4444; border-radius:6px; font-size:11px; line-height:1.4;">
                    <div style="font-weight:bold; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                        <span>🚨</span> <span>AI Inactive / Error</span>
                    </div>
                    <div>${errorDesc}</div>
                    <div style="margin-top:6px; color:#fcd34d; font-size:10px;">
                        ℹ️ All default/fallback messages have been permanently removed. Configure your OpenRouter API key in settings to enable genuine AI generation.
                    </div>
                </div>`;
            return;
        }

        suggestions.forEach((text, idx) => {
            const cleanText = cleanReplyText(text);
            const charCount = cleanText.length;
            const diff = Math.abs(charCount - targetChars);
            const isClose = diff <= (targetChars * 0.18);
            const badgeColor = isClose ? '#10b981' : '#f59e0b';

            const card = document.createElement('div');
            Object.assign(card.style, {
                display: 'flex', flexDirection: 'column', gap: '6px', padding: '8px 9px',
                background: '#1e293b', border: '1px solid #334155', borderRadius: '7px',
                fontSize: '11px', color: '#f1f5f9', lineHeight: '1.35', transition: 'border-color 0.15s'
            });

            card.onmouseenter = () => { card.style.borderColor = '#818cf8'; };
            card.onmouseleave = () => { card.style.borderColor = '#334155'; };

            const textEl = document.createElement('div');
            textEl.textContent = cleanText;

            const bottomBar = document.createElement('div');
            Object.assign(bottomBar.style, {
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginTop: '2px', paddingTop: '4px', borderTop: '1px solid #334155'
            });

            const lenBadge = document.createElement('span');
            lenBadge.style.fontSize = '9.5px';
            lenBadge.style.fontWeight = 'bold';
            lenBadge.style.color = badgeColor;
            lenBadge.textContent = `📏 ${charCount}/${targetChars}`;

            const btnsWrap = document.createElement('div');
            Object.assign(btnsWrap.style, { display: 'flex', gap: '4px' });

            // 1. Insert Button
            const insertBtn = document.createElement('button');
            insertBtn.textContent = '✍️ Insert';
            insertBtn.title = 'Insert into chat box without sending';
            Object.assign(insertBtn.style, {
                padding: '2px 6px', background: '#3b82f6', color: '#fff',
                border: 'none', borderRadius: '4px', fontSize: '9.5px', fontWeight: 'bold', cursor: 'pointer'
            });
            insertBtn.onclick = () => {
                insertIntoChatInput(cleanText);
                updateStatus(`Inserted writeup (${charCount} chars) into chat box for ${partnerName}!`);
            };

            // 2. Send Button
            const sendBtn = document.createElement('button');
            sendBtn.textContent = '🚀 Send';
            sendBtn.title = 'Insert into chat box and send immediately';
            Object.assign(sendBtn.style, {
                padding: '2px 6px', background: '#10b981', color: '#fff',
                border: 'none', borderRadius: '4px', fontSize: '9.5px', fontWeight: 'bold', cursor: 'pointer'
            });
            sendBtn.onclick = async () => {
                insertIntoChatInput(cleanText);
                await sleep(250);
                const activeTextarea = document.querySelector('[class*="clmn_3"] textarea, textarea');
                if (activeTextarea) {
                    await sendChatMessageSafely(activeTextarea, partnerName);
                    updateStatus(`🚀 Sent writeup to ${partnerName}!`);
                } else {
                    updateStatus('⚠️ Please open a chat first to send directly.', 'warn');
                }
            };

            // 3. Copy Button
            const copyBtn = document.createElement('button');
            copyBtn.textContent = '📋 Copy';
            copyBtn.title = 'Copy message to clipboard';
            Object.assign(copyBtn.style, {
                padding: '2px 5px', background: '#475569', color: '#f1f5f9',
                border: 'none', borderRadius: '4px', fontSize: '9.5px', cursor: 'pointer'
            });
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(cleanText).then(() => {
                    copyBtn.textContent = 'Copied! ✔';
                    setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 1500);
                });
            };

            btnsWrap.appendChild(insertBtn);
            btnsWrap.appendChild(sendBtn);
            btnsWrap.appendChild(copyBtn);

            bottomBar.appendChild(lenBadge);
            bottomBar.appendChild(btnsWrap);

            card.appendChild(textEl);
            card.appendChild(bottomBar);
            writeupResultsWrap.appendChild(card);
        });
    }

    async function checkAndUpdateActiveChat(forceRefresh = false) {
        ensureWriteupStudioMounted();

        // 1. Dynamically detect active profile persona
        let detectedProfile = detectActiveProfileName();
        if (detectedProfile) {
            currentSelectedProfile = detectedProfile;
        }

        // 2. Check if Column 2 has an active selected card
        const col2Active = document.querySelector(
            '[class*="clmn_2_chat_block_item-"][class*="active"], ' +
            '[class*="clmn_2_chat_block_item-"][class*="selected"], ' +
            '[class*="clmn_2_chat_block_item-"][class*="current"], ' +
            '[class*="clmn_2_chat_block_item-"][aria-selected="true"], ' +
            '[class*="clmn_2"] [class*="active"], ' +
            '[class*="clmn_2"] [class*="selected"], ' +
            '[class*="clmn_2"] [class*="current-"]'
        );
        if (col2Active) {
            const col2Name = getCardPartnerName(col2Active);
            const col2Prof = getCardProfileName(col2Active);
            if (col2Prof) detectedProfile = col2Prof;
            if (col2Name) {
                updateSelectedPartnerUI(col2Name, detectedProfile);
            }
        }

        const chatData = parseChatHistory(col2Active);
        if (chatData) {
            latestChatData = chatData;
            if (chatData.profileName) detectedProfile = chatData.profileName;
            updateSelectedPartnerUI(chatData.partnerName, detectedProfile);
        } else if (currentSelectedPartner) {
            updateSelectedPartnerUI(currentSelectedPartner, detectedProfile);
        } else if (detectedProfile) {
            updateActiveProfileUI(detectedProfile);
        } else {
            if (writeupPartnerEl && !latestChatData) {
                writeupPartnerEl.innerHTML = `👤 <span style="color:#94a3b8;">No active chat</span>`;
            }
        }

        // If user has not typed custom instructions, auto-refresh suggestions when switching chats
        if (!currentCustomInstruction && chatData && forceRefresh) {
            triggerStudioWriteup(false);
        }
    }

    function renderSuggestedRepliesUI(chatData, suggestions, isLoading = false) {
        ensureWriteupStudioMounted();
        if (isLoading) {
            if (writeupResultsWrap) {
                writeupResultsWrap.innerHTML = `<div style="text-align:center; padding:12px; color:#818cf8; font-size:11px;">🤖 Generating AI writeup...</div>`;
            }
            return;
        }
        renderStudioResults(chatData, suggestions);
    }

    function startGlobalChatObserver() {
        let debounceTimer = null;

        const observer = new MutationObserver((mutations) => {
            const onlyOurUI = mutations.every((m) => {
                const el = m.target;
                return el && el.closest && el.closest('#tm-suggested-replies, #tm-openrouter-modal, #alpha-writeup-panel, #alpha-movable-dashboard');
            });
            if (onlyOurUI) return;

            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                checkAndUpdateActiveChat();
            }, 400);
        });

        const target = document.querySelector('#root > main') || document.body;
        observer.observe(target, { childList: true, subtree: true });
    }

    // ==========================================
    // 6. 3-MINUTE KEEP-ALIVE SYSTEM
    // ==========================================
    const KEEP_ALIVE_INTERVAL_MS = 3 * 60 * 1000;
    const KEEP_ALIVE_STORAGE_KEY = 'alpha_keep_alive_state';
    let keepAliveWorker = null;
    let fallbackInterval = null;
    let keepAliveIframe = null;
    let audioContext = null;
    let lastActiveApiEndpoint = null;

    const origFetch = window.fetch;
    window.fetch = function (...args) {
        try {
            const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url);
            const options = args[1] || {};
            const method = (options.method || (args[0] && args[0].method) || 'GET').toUpperCase();

            if (url && method === 'GET' && !url.includes('_tm_keepalive') && !url.includes('openrouter.ai')) {
                if (url.includes('/api/') || url.includes('/v1/') || url.includes('/chat') || url.startsWith('/')) {
                    lastActiveApiEndpoint = {
                        url: url,
                        headers: options.headers ? JSON.parse(JSON.stringify(options.headers)) : {},
                        credentials: options.credentials || 'include'
                    };
                }
            }
        } catch (e) {}
        return origFetch.apply(this, args);
    };

    function refreshHiddenIframe() {
        if (!keepAliveIframe) {
            keepAliveIframe = document.createElement('iframe');
            Object.assign(keepAliveIframe.style, {
                position: 'fixed', left: '-9999px', top: '-9999px',
                width: '1px', height: '1px', opacity: '0.01', pointerEvents: 'none'
            });
            document.body.appendChild(keepAliveIframe);
        }
        keepAliveIframe.src = `${window.location.origin}/?_tm_keepalive=${Date.now()}`;
    }

    function refreshStorageTimestamps() {
        const now = Date.now();
        [localStorage, sessionStorage].forEach((storage) => {
            try {
                for (let i = 0; i < storage.length; i++) {
                    const key = storage.key(i);
                    if (!key || key === KEEP_ALIVE_STORAGE_KEY) continue;
                    const val = storage.getItem(key);
                    if (/^\d{10,13}$/.test(val) && Math.abs(now - Number(val)) < 2 * 60 * 60 * 1000) {
                        storage.setItem(key, now.toString());
                    }
                }
            } catch (e) {}
        });
    }

    function dispatchUserActivity() {
        const targets = [window, document, document.body, document.querySelector('#root')].filter(Boolean);
        const x = Math.floor(Math.random() * (window.innerWidth || 800));
        const y = Math.floor(Math.random() * (window.innerHeight || 600));

        targets.forEach((target) => {
            ['mousemove', 'mousedown', 'mouseup', 'click'].forEach((type) => {
                target.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y }));
            });
            ['keydown', 'keyup'].forEach((type) => {
                target.dispatchEvent(new KeyboardEvent(type, { bubbles: true, cancelable: true, key: 'Shift', code: 'ShiftLeft' }));
            });
            target.dispatchEvent(new Event('scroll', { bubbles: true }));
        });
    }

    function performKeepAlivePing() {
        checkCampaignSchedulerTick();
        refreshHiddenIframe();
        dispatchUserActivity();
        refreshStorageTimestamps();

        if (lastActiveApiEndpoint) {
            origFetch(lastActiveApiEndpoint.url, {
                method: 'GET',
                headers: lastActiveApiEndpoint.headers,
                credentials: lastActiveApiEndpoint.credentials,
                cache: 'no-store'
            }).catch(() => {});
        } else {
            origFetch(`${window.location.href}`, { method: 'GET', credentials: 'include', cache: 'no-store' }).catch(() => {});
        }
        console.log(`[KeepActive] 3-min Keep-Alive executed at ${new Date().toLocaleTimeString()}`);
    }

    function startAntiThrottleTimer() {
        try {
            const blob = new Blob([`
                let timer = null;
                self.onmessage = function(e) {
                    if (e.data === 'start') {
                        timer = setInterval(function() { postMessage('tick'); }, ${KEEP_ALIVE_INTERVAL_MS});
                    } else if (e.data === 'stop') {
                        clearInterval(timer);
                    }
                };
            `], { type: 'application/javascript' });

            keepAliveWorker = new Worker(URL.createObjectURL(blob));
            keepAliveWorker.onmessage = () => performKeepAlivePing();
            keepAliveWorker.postMessage('start');
        } catch (e) {
            fallbackInterval = setInterval(performKeepAlivePing, KEEP_ALIVE_INTERVAL_MS);
        }

        if (!audioContext) {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    audioContext = new AudioCtx();
                    const osc = audioContext.createOscillator();
                    const gain = audioContext.createGain();
                    gain.gain.value = 0.00001;
                    osc.connect(gain);
                    gain.connect(audioContext.destination);
                    osc.start();
                }
            } catch (e) {}
        }
    }

    function stopAntiThrottleTimer() {
        if (keepAliveWorker) {
            keepAliveWorker.postMessage('stop');
            keepAliveWorker.terminate();
            keepAliveWorker = null;
        }
        if (fallbackInterval) {
            clearInterval(fallbackInterval);
            fallbackInterval = null;
        }
        if (keepAliveIframe) {
            keepAliveIframe.remove();
            keepAliveIframe = null;
        }
        if (audioContext) {
            audioContext.suspend().catch(() => {});
        }
    }

    function toggleKeepAlive(forceState) {
        const isCurrentlyOn = keepAliveWorker !== null || fallbackInterval !== null;
        const turnOn = typeof forceState === 'boolean' ? forceState : !isCurrentlyOn;

        if (!turnOn) {
            stopAntiThrottleTimer();
            keepBtn.textContent = 'Keep Active: OFF';
            keepBtn.style.background = '#4b5563';
            localStorage.setItem(KEEP_ALIVE_STORAGE_KEY, 'false');
        } else {
            if (!keepAliveWorker && !fallbackInterval) {
                performKeepAlivePing();
                startAntiThrottleTimer();
                keepBtn.textContent = 'Keep Active: ON';
                keepBtn.style.background = '#10b981';
                localStorage.setItem(KEEP_ALIVE_STORAGE_KEY, 'true');
            }
        }
    }

    // ==========================================
    // ==========================================
    // 7. COMPACT MOVABLE DASHBOARD (Draggable & Collapsible)
    // ==========================================
    const DASHBOARD_POS_KEY = 'alpha_dashboard_pos_v43';
    const DASHBOARD_COLLAPSED_KEY = 'alpha_dashboard_collapsed_v43';

    // Dashboard Container
    const uiContainer = document.createElement('div');
    uiContainer.id = 'alpha-movable-dashboard';
    Object.assign(uiContainer.style, {
        position: 'fixed', zIndex: 999999,
        background: 'rgba(15, 23, 42, 0.96)',
        backdropFilter: 'blur(10px)',
        border: '1px solid #334155',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.55)',
        color: '#f8fafc',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        width: '310px',
        maxWidth: 'calc(100vw - 24px)',
        boxSizing: 'border-box',
        userSelect: 'none',
        transition: 'box-shadow 0.2s, width 0.2s ease',
        overflow: 'hidden'
    });

    // Dashboard Header (Draggable Handle & Control Icons)
    const dashHeader = document.createElement('div');
    dashHeader.id = 'alpha-dash-header';
    Object.assign(dashHeader.style, {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '7px 10px', background: '#1e293b', borderBottom: '1px solid #334155',
        cursor: 'grab', fontSize: '11px', userSelect: 'none'
    });

    const dashHdrLeft = document.createElement('div');
    Object.assign(dashHdrLeft.style, { display: 'flex', alignItems: 'center', gap: '6px' });
    dashHdrLeft.innerHTML = `
        <span style="font-size:13px; opacity:0.6; cursor:grab;" title="Drag to move dashboard">⋮⋮</span>
        <span style="font-weight:700; color:#38bdf8; letter-spacing:0.5px;">⚡ ALPHA BOT</span>
        <span id="alpha-dash-status-dot" style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#10b981;" title="Bot Ready"></span>
    `;

    const dashHdrRight = document.createElement('div');
    Object.assign(dashHdrRight.style, { display: 'flex', alignItems: 'center', gap: '4px' });

    // Minimize / Expand Toggle
    const dashMinBtn = document.createElement('button');
    dashMinBtn.textContent = '▾';
    dashMinBtn.title = 'Minimize / Expand Dashboard (Double-click header also works)';
    Object.assign(dashMinBtn.style, {
        background: 'none', border: 'none', color: '#94a3b8', fontSize: '13px',
        cursor: 'pointer', padding: '0 4px', fontWeight: 'bold', lineHeight: '1'
    });

    // Dashboard Body (Collapsible)
    const dashBody = document.createElement('div');
    dashBody.id = 'alpha-dash-body';
    Object.assign(dashBody.style, {
        padding: '8px 10px 10px 10px', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', gap: '7px'
    });

    function toggleDashboardCollapse() {
        const isCollapsed = dashBody.style.display === 'none';
        setDashboardCollapsed(!isCollapsed);
    }

    function setDashboardCollapsed(collapsed) {
        if (collapsed) {
            dashBody.style.display = 'none';
            uiContainer.style.width = 'auto';
            dashMinBtn.textContent = '▴';
            dashMinBtn.title = 'Expand Dashboard';
            localStorage.setItem(DASHBOARD_COLLAPSED_KEY, 'true');
        } else {
            dashBody.style.display = 'flex';
            uiContainer.style.width = '310px';
            dashMinBtn.textContent = '▾';
            dashMinBtn.title = 'Minimize Dashboard';
            localStorage.setItem(DASHBOARD_COLLAPSED_KEY, 'false');
        }
    }

    dashMinBtn.onclick = (e) => {
        e.stopPropagation();
        toggleDashboardCollapse();
    };

    dashHeader.ondblclick = (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
        toggleDashboardCollapse();
    };

    // Dragging mechanism
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    dashHeader.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;

        isDragging = true;
        dashHeader.style.cursor = 'grabbing';

        const rect = uiContainer.getBoundingClientRect();
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        initialLeft = rect.left;
        initialTop = rect.top;

        uiContainer.style.left = `${rect.left}px`;
        uiContainer.style.top = `${rect.top}px`;
        uiContainer.style.right = 'auto';
        uiContainer.style.bottom = 'auto';

        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;

        const maxLeft = Math.max(10, window.innerWidth - uiContainer.offsetWidth - 10);
        const maxTop = Math.max(10, window.innerHeight - uiContainer.offsetHeight - 10);

        const newLeft = Math.min(Math.max(10, initialLeft + dx), maxLeft);
        const newTop = Math.min(Math.max(10, initialTop + dy), maxTop);

        uiContainer.style.left = `${newLeft}px`;
        uiContainer.style.top = `${newTop}px`;
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            dashHeader.style.cursor = 'grab';
            const rect = uiContainer.getBoundingClientRect();
            localStorage.setItem(DASHBOARD_POS_KEY, JSON.stringify({ x: Math.round(rect.left), y: Math.round(rect.top) }));
        }
    });

    function restoreDashboardPosition() {
        try {
            const saved = localStorage.getItem(DASHBOARD_POS_KEY);
            if (saved) {
                const pos = JSON.parse(saved);
                const maxLeft = Math.max(10, window.innerWidth - 330);
                const maxTop = Math.max(10, window.innerHeight - 150);
                const x = Math.min(Math.max(10, pos.x), maxLeft);
                const y = Math.min(Math.max(10, pos.y), maxTop);
                uiContainer.style.left = `${x}px`;
                uiContainer.style.top = `${y}px`;
                uiContainer.style.right = 'auto';
                uiContainer.style.bottom = 'auto';
                return;
            }
        } catch (e) {}
        // Default position: bottom-right
        uiContainer.style.right = '18px';
        uiContainer.style.bottom = '18px';
        uiContainer.style.left = 'auto';
        uiContainer.style.top = 'auto';
    }

    function restoreDashboardCollapsed() {
        const saved = localStorage.getItem(DASHBOARD_COLLAPSED_KEY);
        if (saved === 'true') {
            setDashboardCollapsed(true);
        } else {
            setDashboardCollapsed(false);
        }
    }

    // Instant Responder Button for Winks & Likes (Column 4)
    const autoLikeWinkBtn = document.createElement('button');
    autoLikeWinkBtn.id = 'alpha-instant-likewink-btn';
    Object.assign(autoLikeWinkBtn.style, {
        padding: '5px 8px', background: '#1e293b', color: '#cbd5e1',
        border: '1px solid #334155', borderRadius: '6px', fontSize: '11px',
        fontFamily: 'sans-serif', cursor: 'pointer', fontWeight: '600',
        width: '100%', transition: 'background 0.2s, border-color 0.2s',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxSizing: 'border-box'
    });

    function updateAutoRespondLikesWinksButtonUI() {
        const isEnabled = isAutoRespondLikesWinksEnabled();
        const count = getRespondedNotifCount();
        if (isEnabled) {
            autoLikeWinkBtn.style.background = 'rgba(16, 185, 129, 0.2)';
            autoLikeWinkBtn.style.borderColor = '#10b981';
            autoLikeWinkBtn.style.color = '#6ee7b7';
            autoLikeWinkBtn.innerHTML = `<span>⚡ Instant: <b>Winks & Likes</b></span> <span style="font-size:9px; background:#059669; color:#fff; padding:1px 5px; border-radius:3px;">ON (${count})</span>`;
            autoLikeWinkBtn.title = `Instant Responder ON: Automatically intercepts and replies to likes & winks immediately they arrive (${count} answered)`;
        } else {
            autoLikeWinkBtn.style.background = '#1e293b';
            autoLikeWinkBtn.style.borderColor = '#334155';
            autoLikeWinkBtn.style.color = '#94a3b8';
            autoLikeWinkBtn.innerHTML = `<span>⚡ Instant: <b>Winks & Likes</b></span> <span style="font-size:9px; background:#334155; color:#cbd5e1; padding:1px 5px; border-radius:3px;">OFF</span>`;
            autoLikeWinkBtn.title = 'Instant Responder OFF: Click to automatically respond to likes and winks as they arrive';
        }
    }

    autoLikeWinkBtn.addEventListener('click', () => {
        const current = isAutoRespondLikesWinksEnabled();
        setAutoRespondLikesWinksEnabled(!current);
        updateStatus(`Instant Responder for Winks & Likes: ${!current ? 'ACTIVATED' : 'PAUSED'}.`);
    });

    // Mode Toggle Button: Full Auto vs Semi-Manual Review
    const semiManualBtn = document.createElement('button');
    semiManualBtn.id = 'alpha-mode-btn';
    Object.assign(semiManualBtn.style, {
        padding: '5px 8px', background: '#1e293b', color: '#cbd5e1',
        border: '1px solid #334155', borderRadius: '6px', fontSize: '11px',
        fontFamily: 'sans-serif', cursor: 'pointer', fontWeight: '600',
        width: '100%', transition: 'background 0.2s, border-color 0.2s',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxSizing: 'border-box'
    });

    function updateSemiManualButtonUI() {
        const isSemi = isSemiManualModeEnabled();
        if (isSemi) {
            semiManualBtn.style.background = 'rgba(124, 58, 237, 0.25)';
            semiManualBtn.style.borderColor = '#8b5cf6';
            semiManualBtn.style.color = '#c4b5fd';
            semiManualBtn.innerHTML = '<span>Mode: <b>👁️ Semi-Manual</b></span> <span style="font-size:9px; background:#7c3aed; color:#fff; padding:1px 5px; border-radius:3px;">Review On</span>';
            semiManualBtn.title = 'Semi-Manual Mode ON: Pauses on each message so you can review before pressing Enter to send';
        } else {
            semiManualBtn.style.background = '#1e293b';
            semiManualBtn.style.borderColor = '#334155';
            semiManualBtn.style.color = '#94a3b8';
            semiManualBtn.innerHTML = '<span>Mode: <b>🤖 Full Auto</b></span> <span style="font-size:9px; background:#334155; color:#cbd5e1; padding:1px 5px; border-radius:3px;">Auto Send</span>';
            semiManualBtn.title = 'Full Auto Mode: Automatically generates and sends messages without pausing for review';
        }
    }

    semiManualBtn.addEventListener('click', () => {
        const current = isSemiManualModeEnabled();
        setSemiManualModeEnabled(!current);
        updateStatus(`Switched mode to ${!current ? '👁️ Semi-Manual (Review before send)' : '🤖 Full Auto'}.`);
    });

    // 1. Keep Active Button
    const keepBtn = document.createElement('button');
    keepBtn.textContent = 'Keep Active: OFF';
    Object.assign(keepBtn.style, {
        padding: '6px 10px', background: '#4b5563', color: '#fff',
        border: 'none', borderRadius: '6px', fontSize: '11px',
        fontFamily: 'sans-serif', cursor: 'pointer', fontWeight: '600',
        flex: '1', transition: 'background 0.2s', textAlign: 'center'
    });

    // 2. Run Senders Button
    const btn = document.createElement('button');
    btn.textContent = 'Run Senders';
    Object.assign(btn.style, {
        padding: '6px 10px', background: '#2563eb', color: '#fff',
        border: 'none', borderRadius: '6px', fontSize: '11px',
        fontFamily: 'sans-serif', cursor: 'pointer', fontWeight: 'bold',
        flex: '1', transition: 'background 0.2s', textAlign: 'center'
    });

    // 3. All Chats Controls
    const autoAllChatsBtn = document.createElement('button');
    autoAllChatsBtn.textContent = 'Auto: OFF';
    autoAllChatsBtn.title = `Toggle automatic ${getCampaignIntervalHours()}-hour recurring campaign for All Chats`;
    Object.assign(autoAllChatsBtn.style, {
        padding: '5px 8px', background: '#4b5563', color: '#fff',
        border: 'none', borderRadius: '6px', fontSize: '11px',
        fontFamily: 'sans-serif', cursor: 'pointer', fontWeight: '600',
        flex: '1', transition: 'background 0.2s', textAlign: 'center'
    });

    const runAllChatsBtn = document.createElement('button');
    runAllChatsBtn.textContent = 'Run All Chats';
    runAllChatsBtn.title = `Instantly run ${getCampaignIntervalHours()}-hour inactivity messenger for All Chats`;
    Object.assign(runAllChatsBtn.style, {
        padding: '5px 8px', background: '#4f46e5', color: '#fff',
        border: 'none', borderRadius: '6px', fontSize: '11px',
        fontFamily: 'sans-serif', cursor: 'pointer', fontWeight: 'bold',
        flex: '1.2', transition: 'background 0.2s', textAlign: 'center'
    });

    // 4. Chance Controls
    const autoChanceBtn = document.createElement('button');
    autoChanceBtn.textContent = 'Auto: OFF';
    autoChanceBtn.title = `Toggle automatic ${getCampaignIntervalHours()}-hour recurring campaign for Chance (Matches)`;
    Object.assign(autoChanceBtn.style, {
        padding: '5px 8px', background: '#4b5563', color: '#fff',
        border: 'none', borderRadius: '6px', fontSize: '11px',
        fontFamily: 'sans-serif', cursor: 'pointer', fontWeight: '600',
        flex: '1', transition: 'background 0.2s', textAlign: 'center'
    });

    const runChanceBtn = document.createElement('button');
    runChanceBtn.textContent = 'Run Chance';
    runChanceBtn.title = `Instantly run ${getCampaignIntervalHours()}-hour inactivity messenger for Chance (Matches)`;
    Object.assign(runChanceBtn.style, {
        padding: '5px 8px', background: '#7c3aed', color: '#fff',
        border: 'none', borderRadius: '6px', fontSize: '11px',
        fontFamily: 'sans-serif', cursor: 'pointer', fontWeight: 'bold',
        flex: '1.2', transition: 'background 0.2s', textAlign: 'center'
    });

    function updateCampaignButtonsUI() {
        // Auto schedulers are NEVER disabled: user can turn on both All Chats & Chance simultaneously!
        autoAllChatsBtn.disabled = false;
        autoAllChatsBtn.style.opacity = '1';
        autoChanceBtn.disabled = false;
        autoChanceBtn.style.opacity = '1';

        if (activeCampaignType === 'all_chats') {
            runAllChatsBtn.textContent = 'Stop All Chats';
            runAllChatsBtn.style.background = '#dc2626';
            runAllChatsBtn.title = 'Click to stop running All-Chats campaign';
            runAllChatsBtn.disabled = false;
            runAllChatsBtn.style.opacity = '1';

            if (queuedCampaign === 'chance') {
                runChanceBtn.textContent = 'Chance: Queued ⏳';
                runChanceBtn.style.background = '#d97706';
                runChanceBtn.title = 'Chance is queued to run right after All-Chats. Click to cancel queue.';
            } else {
                runChanceBtn.textContent = 'Queue Chance';
                runChanceBtn.style.background = '#7c3aed';
                runChanceBtn.title = 'Click to queue Chance to run right after All-Chats finishes';
            }
            runChanceBtn.disabled = false;
            runChanceBtn.style.opacity = '1';

        } else if (activeCampaignType === 'chance') {
            runChanceBtn.textContent = 'Stop Chance';
            runChanceBtn.style.background = '#dc2626';
            runChanceBtn.title = 'Click to stop running Chance campaign';
            runChanceBtn.disabled = false;
            runChanceBtn.style.opacity = '1';

            if (queuedCampaign === 'all_chats') {
                runAllChatsBtn.textContent = 'All Chats: Queued ⏳';
                runAllChatsBtn.style.background = '#d97706';
                runAllChatsBtn.title = 'All-Chats is queued to run right after Chance. Click to cancel queue.';
            } else {
                runAllChatsBtn.textContent = 'Queue All Chats';
                runAllChatsBtn.style.background = '#4f46e5';
                runAllChatsBtn.title = 'Click to queue All-Chats to run right after Chance finishes';
            }
            runAllChatsBtn.disabled = false;
            runAllChatsBtn.style.opacity = '1';

        } else {
            runAllChatsBtn.textContent = 'Run All Chats';
            runAllChatsBtn.style.background = '#4f46e5';
            runAllChatsBtn.title = `Instantly run ${getCampaignIntervalHours()}-hour inactivity messenger for All Chats`;
            runAllChatsBtn.disabled = false;
            runAllChatsBtn.style.opacity = '1';

            runChanceBtn.textContent = 'Run Chance';
            runChanceBtn.style.background = '#7c3aed';
            runChanceBtn.title = `Instantly run ${getCampaignIntervalHours()}-hour inactivity messenger for Chance (Matches)`;
            runChanceBtn.disabled = false;
            runChanceBtn.style.opacity = '1';
        }
    }

    function updateCampaignCountdownUI() {
        const intervalHours = getCampaignIntervalHours();
        const intervalMs = intervalHours * 3600 * 1000;
        const now = Date.now();

        // 1. Update All Chats button
        const allChatsOn = isAllChatsSchedulerEnabled();
        if (!allChatsOn) {
            autoAllChatsBtn.textContent = `Auto [${intervalHours}h]: OFF`;
            autoAllChatsBtn.style.background = '#4b5563';
        } else if (activeCampaignType === 'all_chats') {
            autoAllChatsBtn.textContent = `Auto: Active ⚡`;
            autoAllChatsBtn.style.background = '#2563eb';
        } else if (queuedCampaign === 'all_chats') {
            autoAllChatsBtn.textContent = `Auto: Queued ⏳`;
            autoAllChatsBtn.style.background = '#d97706';
        } else {
            const lastRunAll = parseInt(localStorage.getItem(ALL_CHATS_LAST_RUN_KEY) || localStorage.getItem('alpha_campaign_last_run') || '0', 10);
            const nextRunAll = lastRunAll + intervalMs;
            const diffAll = nextRunAll - now;

            if (diffAll <= 0 || lastRunAll === 0) {
                autoAllChatsBtn.textContent = `Auto: Due`;
                autoAllChatsBtn.style.background = '#d97706';
            } else {
                const diffMin = Math.ceil(diffAll / (60 * 1000));
                const hrs = Math.floor(diffMin / 60);
                const mins = diffMin % 60;
                const timeStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
                autoAllChatsBtn.textContent = `Auto: ${timeStr}`;
                autoAllChatsBtn.style.background = '#059669';
            }
        }

        // 2. Update Chance button
        const chanceOn = isChanceSchedulerEnabled();
        if (!chanceOn) {
            autoChanceBtn.textContent = `Auto [${intervalHours}h]: OFF`;
            autoChanceBtn.style.background = '#4b5563';
        } else if (activeCampaignType === 'chance') {
            autoChanceBtn.textContent = `Auto: Active ⚡`;
            autoChanceBtn.style.background = '#7c3aed';
        } else if (queuedCampaign === 'chance') {
            autoChanceBtn.textContent = `Auto: Queued ⏳`;
            autoChanceBtn.style.background = '#d97706';
        } else {
            const lastRunChance = parseInt(localStorage.getItem(CHANCE_LAST_RUN_KEY) || '0', 10);
            const nextRunChance = lastRunChance + intervalMs;
            const diffChance = nextRunChance - now;

            if (diffChance <= 0 || lastRunChance === 0) {
                autoChanceBtn.textContent = `Auto: Due`;
                autoChanceBtn.style.background = '#d97706';
            } else {
                const diffMin = Math.ceil(diffChance / (60 * 1000));
                const hrs = Math.floor(diffMin / 60);
                const mins = diffMin % 60;
                const timeStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
                autoChanceBtn.textContent = `Auto: ${timeStr}`;
                autoChanceBtn.style.background = '#0d9488';
            }
        }

        // 3. Update Hourly Quota Badge & Inactivity Header
        const badge = document.getElementById('tm-hourly-badge');
        if (badge) {
            const limit = getHourlyMessageLimit();
            const count = getHourlySendCount();
            badge.textContent = `Quota: ${count}/${limit > 0 ? limit : '∞'}/h`;
            badge.style.color = (limit > 0 && count >= limit) ? '#ef4444' : '#38bdf8';
        }
        const campTitle = document.getElementById('tm-camp-label-title');
        if (campTitle) {
            campTitle.textContent = `Inactivity Messenger (${intervalHours}h)`;
        }
    }

    function toggleAllChatsScheduler() {
        const currentlyOn = isAllChatsSchedulerEnabled();
        setAllChatsSchedulerEnabled(!currentlyOn);
        updateCampaignCountdownUI();
        if (!currentlyOn) {
            updateStatus(`All-Chats scheduler activated (runs every ${getCampaignIntervalHours()} hours).`);
            checkCampaignSchedulerTick();
        } else {
            updateStatus("All-Chats scheduler paused.");
        }
    }

    function toggleChanceScheduler() {
        const currentlyOn = isChanceSchedulerEnabled();
        setChanceSchedulerEnabled(!currentlyOn);
        updateCampaignCountdownUI();
        if (!currentlyOn) {
            updateStatus(`Chance (Matches) scheduler activated (runs every ${getCampaignIntervalHours()} hours).`);
            checkCampaignSchedulerTick();
        } else {
            updateStatus("Chance (Matches) scheduler paused.");
        }
    }

    autoAllChatsBtn.addEventListener('click', toggleAllChatsScheduler);
    runAllChatsBtn.addEventListener('click', runAllChatsCampaign);

    autoChanceBtn.addEventListener('click', toggleChanceScheduler);
    runChanceBtn.addEventListener('click', runChanceCampaign);

    // Status Bar - Integrated cleanly at the bottom of the dashboard card (Never overlaps buttons!)
    const status = document.createElement('div');
    status.id = 'alpha-dash-status-bar';
    Object.assign(status.style, {
        padding: '6px 8px', background: 'rgba(11, 17, 32, 0.95)', color: '#94a3b8',
        borderRadius: '6px', fontSize: '10.5px', fontFamily: 'sans-serif',
        border: '1px solid #334155', lineHeight: '1.35', wordBreak: 'break-word',
        display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px',
        minHeight: '26px', boxSizing: 'border-box'
    });
    status.innerHTML = '<span style="color:#10b981; font-weight:bold;">●</span> <span style="flex:1;">Ready. Bot idle.</span>';

    function updateStatus(text, typeOrIsError) {
        const isErr = typeOrIsError === true || typeOrIsError === 'error';
        const isAi = typeOrIsError === 'ai' || (typeof text === 'string' && (text.includes('[AI]') || text.includes('🤖')));
        const isWarn = typeOrIsError === 'warn' || (typeof text === 'string' && (text.includes('⚠️') || text.includes('Default') || text.includes('Fallback')));

        let icon = '⚡';
        let color = '#94a3b8';
        let bg = 'rgba(11, 17, 32, 0.95)';
        let border = '#334155';

        if (isErr) {
            icon = '❌';
            color = '#fca5a5';
            bg = 'rgba(153, 27, 27, 0.35)';
            border = '#ef4444';
        } else if (isAi) {
            icon = '🤖';
            color = '#93c5fd';
            bg = 'rgba(30, 58, 138, 0.35)';
            border = '#3b82f6';
        } else if (isWarn) {
            icon = '⚠️';
            color = '#fcd34d';
            bg = 'rgba(180, 83, 9, 0.35)';
            border = '#f59e0b';
        }

        status.style.display = 'flex';
        status.style.background = bg;
        status.style.borderColor = border;
        status.style.color = color;
        status.innerHTML = `<span style="flex-shrink:0;">${icon}</span> <span style="flex:1;">${text}</span>`;

        // Update active header dot title
        const dot = document.getElementById('alpha-dash-status-dot');
        if (dot) {
            dot.title = text;
            if (isErr) dot.style.background = '#ef4444';
            else if (isAi) dot.style.background = '#38bdf8';
            else if (isWarn) dot.style.background = '#f59e0b';
            else dot.style.background = '#10b981';
        }

        logDebug(isErr ? 'ERROR' : (isWarn ? 'WARN' : 'INFO'), text);
    }

    function setButtonState(running) {
        const dot = document.getElementById('alpha-dash-status-dot');
        if (running) {
            btn.textContent = 'Stop Senders';
            btn.style.background = '#dc2626';
            if (dot) dot.style.background = '#38bdf8';
        } else {
            btn.textContent = 'Run Senders';
            btn.style.background = '#2563eb';
            if (dot) dot.style.background = '#10b981';
        }
    }

    btn.addEventListener('click', runSequence);
    keepBtn.addEventListener('click', () => toggleKeepAlive());

    // ==========================================
    // 8. ON-SCREEN LIVE DEBUGGER HUD
    // ==========================================
    let debugModalEl = null;

    function renderDebugLogsIfOpen() {
        if (!debugModalEl || debugModalEl.style.display === 'none') return;
        const logContent = document.getElementById('alpha-debug-log-content');
        if (!logContent) return;

        logContent.innerHTML = debugLogs.map(l => {
            const colorMap = {
                'INFO': '#38bdf8',
                'STEP': '#c084fc',
                'SUCCESS': '#34d399',
                'WARN': '#fbbf24',
                'ERROR': '#f87171'
            };
            const col = colorMap[l.level] || '#9ca3af';
            return `<div style="margin-bottom:3px; word-break:break-all;"><span style="color:#64748b;">[${l.time}]</span> <span style="color:${col}; font-weight:bold;">[${l.level}]</span> ${l.message} ${l.data ? `<span style="color:#6b7280;">${l.data}</span>` : ''}</div>`;
        }).join('');

        logContent.scrollTop = logContent.scrollHeight;
    }

    function toggleDebugModal() {
        if (!debugModalEl) {
            debugModalEl = document.createElement('div');
            debugModalEl.id = 'alpha-debug-modal';
            Object.assign(debugModalEl.style, {
                position: 'fixed', bottom: '80px', right: '18px', zIndex: 1000002,
                width: '540px', maxWidth: '94vw', height: '420px', maxHeight: '80vh',
                background: '#0f172a', color: '#e2e8f0', borderRadius: '10px',
                border: '1px solid #334155', boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
                display: 'flex', flexDirection: 'column', fontFamily: 'Consolas, monospace',
                fontSize: '11px', overflow: 'hidden'
            });

            // Header
            const hdr = document.createElement('div');
            Object.assign(hdr.style, {
                padding: '10px 14px', background: '#1e293b', borderBottom: '1px solid #334155',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            });

            const title = document.createElement('div');
            title.innerHTML = '🐞 <b>Alpha Live Debugger</b> <span style="font-size:10px; color:#94a3b8;">(Real-Time Logs)</span>';

            const btnBar = document.createElement('div');
            Object.assign(btnBar.style, { display: 'flex', gap: '6px', alignItems: 'center' });

            const hudSettingsBtn = document.createElement('button');
            hudSettingsBtn.textContent = '⚙️ Settings';
            hudSettingsBtn.title = 'Open Universal Settings';
            Object.assign(hudSettingsBtn.style, {
                padding: '4px 8px', background: '#334155', color: '#f8fafc', border: '1px solid #475569',
                borderRadius: '4px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold'
            });
            hudSettingsBtn.onclick = () => showSettingsModal();

            btnBar.appendChild(hudSettingsBtn);

            const copyBtn = document.createElement('button');
            copyBtn.textContent = '📋 Copy Logs';
            Object.assign(copyBtn.style, {
                padding: '4px 8px', background: '#2563eb', color: '#fff', border: 'none',
                borderRadius: '4px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold'
            });
            copyBtn.onclick = () => {
                const fullText = debugLogs.map(l => `[${l.time}] [${l.level}] ${l.message} ${l.data || ''}`).join('\n');
                navigator.clipboard.writeText(fullText).then(() => {
                    copyBtn.textContent = '✅ Copied!';
                    setTimeout(() => { copyBtn.textContent = '📋 Copy Logs'; }, 1800);
                });
            };

            const diagBtn = document.createElement('button');
            diagBtn.textContent = '🩺 Diagnostics';
            diagBtn.title = 'Scan all page elements and selectors';
            Object.assign(diagBtn.style, {
                padding: '4px 8px', background: '#059669', color: '#fff', border: 'none',
                borderRadius: '4px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold'
            });
            diagBtn.onclick = runDiagnosticScan;

            const clearBtn = document.createElement('button');
            clearBtn.textContent = '🧹 Clear';
            Object.assign(clearBtn.style, {
                padding: '4px 8px', background: '#374151', color: '#fff', border: 'none',
                borderRadius: '4px', cursor: 'pointer', fontSize: '10px'
            });
            clearBtn.onclick = () => {
                debugLogs.length = 0;
                sessionStorage.removeItem('alpha_debug_logs');
                renderDebugLogsIfOpen();
            };

            const closeBtn = document.createElement('button');
            closeBtn.textContent = '✕';
            Object.assign(closeBtn.style, {
                background: 'none', border: 'none', color: '#94a3b8', fontSize: '14px',
                cursor: 'pointer', padding: '0 4px', fontWeight: 'bold'
            });
            closeBtn.onclick = () => { debugModalEl.style.display = 'none'; };

            btnBar.appendChild(copyBtn);
            btnBar.appendChild(diagBtn);
            btnBar.appendChild(clearBtn);
            btnBar.appendChild(closeBtn);

            hdr.appendChild(title);
            hdr.appendChild(btnBar);
            debugModalEl.appendChild(hdr);

            // Log Body
            const body = document.createElement('div');
            body.id = 'alpha-debug-log-content';
            Object.assign(body.style, {
                flex: '1', padding: '12px', overflowY: 'auto', background: '#090d16',
                lineHeight: '1.45', userSelect: 'text'
            });
            debugModalEl.appendChild(body);

            document.body.appendChild(debugModalEl);
        }

        const isVisible = debugModalEl.style.display !== 'none';
        debugModalEl.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible) {
            renderDebugLogsIfOpen();
        }
    }

    // Expose Global Debug API on window
    window.AlphaDebug = {
        log: logDebug,
        getLogs: () => debugLogs,
        diagnose: runDiagnosticScan,
        openLogs: () => { toggleDebugModal(); },
        openSettings: () => { showSettingsModal(); },
        testAllChats: navigateToAllChats,
        testChance: navigateToChance,
        testLimit: getRemainingMessageLimit
    };

    // Compact Header Logs button
    const debugBtn = document.createElement('button');
    debugBtn.textContent = '🐞';
    debugBtn.title = 'Open Live Debugger Logs';
    Object.assign(debugBtn.style, {
        background: '#334155', color: '#38bdf8', border: '1px solid #475569',
        borderRadius: '5px', fontSize: '11px', cursor: 'pointer', padding: '3px 6px',
        lineHeight: '1', transition: 'background 0.2s'
    });
    debugBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDebugModal();
    });

    // Compact Header Settings button
    const settingsGlobalBtn = document.createElement('button');
    settingsGlobalBtn.textContent = '⚙️';
    settingsGlobalBtn.title = 'Universal Settings (Shortcut: Alt+S)';
    Object.assign(settingsGlobalBtn.style, {
        background: '#334155', color: '#f1f5f9', border: '1px solid #475569',
        borderRadius: '5px', fontSize: '11px', cursor: 'pointer', padding: '3px 6px',
        lineHeight: '1', transition: 'background 0.2s'
    });
    settingsGlobalBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showSettingsModal();
    });

    // Alt + S Universal keyboard shortcut to open settings anytime
    window.addEventListener('keydown', (e) => {
        if (e.altKey && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            showSettingsModal();
        }
    });

    function injectUI() {
        if (document.body) {
            // Header buttons
            dashHdrRight.appendChild(settingsGlobalBtn);
            dashHdrRight.appendChild(debugBtn);
            dashHdrRight.appendChild(dashMinBtn);

            dashHeader.appendChild(dashHdrLeft);
            dashHeader.appendChild(dashHdrRight);

            // Section 1: Quick Actions (Keep Active + Run Senders + Writeup Studio)
            const quickActionsRow = document.createElement('div');
            Object.assign(quickActionsRow.style, {
                display: 'flex', gap: '5px'
            });
            quickActionsRow.appendChild(keepBtn);
            quickActionsRow.appendChild(btn);

            const aiStudioBtn = document.createElement('button');
            aiStudioBtn.textContent = '✨ Studio';
            aiStudioBtn.title = 'Open Standalone Floating AI Writeup Studio';
            Object.assign(aiStudioBtn.style, {
                padding: '6px 8px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px',
                fontFamily: 'sans-serif', cursor: 'pointer', fontWeight: 'bold',
                transition: 'opacity 0.2s', textAlign: 'center'
            });
            aiStudioBtn.onclick = () => {
                ensureWriteupStudioMounted();
                setWriteupCollapsed(false);
                if (writeupCustomInput) writeupCustomInput.focus();
                updateStatus('✨ AI Writeup Studio opened.');
            };
            quickActionsRow.appendChild(aiStudioBtn);

            // Section 2: Inactivity Campaigns
            const campLabel = document.createElement('div');
            campLabel.innerHTML = `<div style="display:flex; justify-content:space-between; align-items:center; gap:4px;">
                <span id="tm-camp-label-title">Inactivity Messenger (${getCampaignIntervalHours()}h)</span>
                <div style="display:flex; align-items:center; gap:5px;">
                    <button id="tm-run-both-btn" type="button" title="Run All Chats and Chance sequentially in one click" style="padding:1px 6px; background:linear-gradient(135deg, #4f46e5, #7c3aed); color:#fff; border:none; border-radius:4px; font-size:9px; font-weight:bold; cursor:pointer; text-transform:none;">🚀 Both</button>
                    <span id="tm-hourly-badge" style="font-size:9.5px; color:#38bdf8; font-weight:normal; text-transform:none;">Quota: ${getHourlySendCount()}/${getHourlyMessageLimit() > 0 ? getHourlyMessageLimit() : '∞'}/h</span>
                </div>
            </div>`;
            Object.assign(campLabel.style, {
                fontSize: '10px', fontWeight: '700', textTransform: 'uppercase',
                letterSpacing: '0.6px', color: '#64748b', marginTop: '2px', marginBottom: '-1px'
            });

            // All Chats Card
            const allChatsCard = document.createElement('div');
            Object.assign(allChatsCard.style, {
                background: '#1e293b', border: '1px solid #334155', borderRadius: '8px',
                padding: '5px 7px', display: 'flex', flexDirection: 'column', gap: '4px'
            });
            const allChatsHdr = document.createElement('div');
            allChatsHdr.innerHTML = '<span style="font-size:11px; font-weight:600; color:#e2e8f0;">💬 All Chats</span><span style="font-size:9px; color:#94a3b8;">Online → Offline</span>';
            Object.assign(allChatsHdr.style, {
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            });
            const allChatsBtns = document.createElement('div');
            Object.assign(allChatsBtns.style, { display: 'flex', gap: '5px' });
            allChatsBtns.appendChild(runAllChatsBtn);
            allChatsBtns.appendChild(autoAllChatsBtn);
            allChatsCard.appendChild(allChatsHdr);
            allChatsCard.appendChild(allChatsBtns);

            // Chance Card
            const chanceCard = document.createElement('div');
            Object.assign(chanceCard.style, {
                background: '#1e293b', border: '1px solid #334155', borderRadius: '8px',
                padding: '5px 7px', display: 'flex', flexDirection: 'column', gap: '4px'
            });
            const chanceHdr = document.createElement('div');
            chanceHdr.innerHTML = '<span style="font-size:11px; font-weight:600; color:#e2e8f0;">🎲 Chance</span><span style="font-size:9px; color:#94a3b8;">Matches</span>';
            Object.assign(chanceHdr.style, {
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            });
            const chanceBtns = document.createElement('div');
            Object.assign(chanceBtns.style, { display: 'flex', gap: '5px' });
            chanceBtns.appendChild(runChanceBtn);
            chanceBtns.appendChild(autoChanceBtn);
            chanceCard.appendChild(chanceHdr);
            chanceCard.appendChild(chanceBtns);

            // Assemble Dashboard Body
            dashBody.appendChild(quickActionsRow);
            dashBody.appendChild(autoLikeWinkBtn);
            dashBody.appendChild(semiManualBtn);
            dashBody.appendChild(campLabel);
            dashBody.appendChild(allChatsCard);
            dashBody.appendChild(chanceCard);
            dashBody.appendChild(status); // Integrated inside card: never overlaps!

            const runBothBtn = campLabel.querySelector('#tm-run-both-btn');
            if (runBothBtn) {
                runBothBtn.onclick = runBothCampaigns;
            }

            // Assemble Dashboard Container
            uiContainer.appendChild(dashHeader);
            uiContainer.appendChild(dashBody);

            updateCampaignButtonsUI();
            updateCampaignCountdownUI();
            updateSemiManualButtonUI();
            updateAutoRespondLikesWinksButtonUI();
            restoreDashboardPosition();
            restoreDashboardCollapsed();

            document.body.appendChild(uiContainer);
            ensureWriteupStudioMounted();

            if (localStorage.getItem(KEEP_ALIVE_STORAGE_KEY) === 'true') {
                toggleKeepAlive(true);
            }

            if (isAllChatsSchedulerEnabled() || isChanceSchedulerEnabled()) {
                checkCampaignSchedulerTick();
            }

            // Periodically refresh countdown and scheduler
            setInterval(checkCampaignSchedulerTick, 30000);

            // Start Column 4 live notification watcher (Likes & Winks instant responder)
            initColumn4NotificationWatcher();

            // Start global chat switch listener
            startGlobalChatObserver();
        } else {
            document.addEventListener('DOMContentLoaded', injectUI, { once: true });
        }
    }

    injectUI();
})();