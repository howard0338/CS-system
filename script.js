// 裝備數據結構
class Equipment {
    constructor(name, stats, maxScrollUses = 10) {
        this.name = name;
        this.stats = { ...stats };
        this.originalStats = { ...stats }; // 保存原始數值
        this.maxScrollUses = maxScrollUses;
        this.currentScrollUses = maxScrollUses;
        this.zeroStats = {}; // 記錄哪些數值已經降到0
    }

    // 更新數值（+5到-5的隨機變化，最低為0，降到0後不會再增加）
    updateStats() {
        const statNames = Object.keys(this.stats);
        const changes = {};
        const oldStats = { ...this.stats }; // 保存更新前的數值
        
        statNames.forEach(stat => {
            // 如果這個數值已經降到0，則不再變化
            if (this.zeroStats[stat]) {
                changes[stat] = {
                    oldValue: oldStats[stat],
                    newValue: oldStats[stat],
                    change: 0
                };
                return;
            }
            
            // 只對原本有數值的屬性進行變化（原始數值大於0的屬性）
            if (this.originalStats[stat] > 0) {
                const change = Math.floor(Math.random() * 11) - 5; // -5 到 +5
                const newValue = Math.max(0, this.stats[stat] + change);
                
                // 如果新值為0，標記這個數值已經降到0
                if (newValue === 0) {
                    this.zeroStats[stat] = true;
                }
                
                changes[stat] = {
                    oldValue: oldStats[stat],
                    newValue: newValue,
                    change: newValue - oldStats[stat]
                };
                this.stats[stat] = newValue;
            } else {
                // 如果原始數值為0，則不變化
                changes[stat] = {
                    oldValue: oldStats[stat],
                    newValue: oldStats[stat],
                    change: 0
                };
            }
        });
        
        return changes;
    }

    // 更新數值（VL CS專用：+2到-2的隨機變化，最低為0，降到0後不會再增加）
    updateStatsVL() {
        const statNames = Object.keys(this.stats);
        const changes = {};
        const oldStats = { ...this.stats }; // 保存更新前的數值
        
        statNames.forEach(stat => {
            // 如果這個數值已經降到0，則不再變化
            if (this.zeroStats[stat]) {
                changes[stat] = {
                    oldValue: oldStats[stat],
                    newValue: oldStats[stat],
                    change: 0
                };
                return;
            }
            
            // 只對原本有數值的屬性進行變化（原始數值大於0的屬性）
            if (this.originalStats[stat] > 0) {
                const change = Math.floor(Math.random() * 5) - 2; // -2 到 +2
                const newValue = Math.max(0, this.stats[stat] + change);
                
                // 如果新值為0，標記這個數值已經降到0
                if (newValue === 0) {
                    this.zeroStats[stat] = true;
                }
                
                changes[stat] = {
                    oldValue: oldStats[stat],
                    newValue: newValue,
                    change: newValue - oldStats[stat]
                };
                this.stats[stat] = newValue;
            } else {
                // 如果原始數值為0，則不變化
                changes[stat] = {
                    oldValue: oldStats[stat],
                    newValue: oldStats[stat],
                    change: 0
                };
            }
        });
        
        return changes;
    }

    // 減少卷軸使用次數
    useScroll() {
        if (this.currentScrollUses > 0) {
            this.currentScrollUses--;
            return true;
        }
        return false;
    }

    // 檢查是否還有卷軸使用次數
    canUseScroll() {
        return this.currentScrollUses > 0;
    }
}

// 卷軸類別
class Scroll {
    constructor(name, successRate, type) {
        this.name = name;
        this.successRate = successRate;
        this.type = type;
    }

    // 嘗試使用卷軸
    attemptUse() {
        // 如果是100%成功率的卷軸，直接返回true
        if (this.successRate >= 1.0) {
            return true;
        }
        return Math.random() < this.successRate;
    }
}

// 遊戲管理器
class GameManager {
    constructor() {
        // 獲取自定義初始值，如果沒有則使用默認值
        this.customStats = this.getCustomStats();
        this.equipment = new Equipment('Blackfist Cloak', this.customStats, 5);
        
        this.chaosScroll = new Scroll('Chaos Scroll', 0.6, 'chaos');
        this.vlChaosScroll = new Scroll('VL Chaos Scroll', 1.0, 'vl-chaos');
        this.whiteScroll = new Scroll('White Scroll', 1.0, 'white');
        
        this.currentDragScroll = null;
        this.statistics = {
            csUsed: 0,
            vlCsUsed: 0,
            wsUsed: 0
        };
        this.initializeEventListeners();
        this.updateDisplay();
    }

    // 獲取自定義屬性值
    getCustomStats() {
        const stats = {};
        
        // 獲取所有可能的屬性輸入值
        const statInputs = [
            'custom-hp', 'custom-weapon-attack', 'custom-weapon-defence', 
            'custom-magic-defence', 'custom-str', 'custom-dex', 'custom-int', 'custom-luk', 'custom-speed'
        ];
        
        statInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input && input.value !== '' && parseInt(input.value) >= 0) {
                let statName = inputId.replace('custom-', '');
                // 處理特殊的屬性名稱映射
                if (statName === 'weapon-attack') statName = 'weaponAttack';
                if (statName === 'weapon-defence') statName = 'weaponDefence';
                if (statName === 'magic-defence') statName = 'magicDefence';
                stats[statName] = parseInt(input.value);
            }
        });
        
        return stats;
    }

    // 更新自定義屬性輸入框的值
    updateCustomStatsInputs(equipmentName) {
        const defaultStats = this.getDefaultStatsForEquipment(equipmentName);
        
        // 首先清空所有輸入框
        const allStatInputs = [
            'custom-hp', 'custom-weapon-attack', 'custom-weapon-defence', 
            'custom-magic-defence', 'custom-str', 'custom-dex', 'custom-int', 'custom-luk', 'custom-speed'
        ];
        
        allStatInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.value = 0; // 先設為0
            }
        });
        
        // 然後設置該裝備的默認值
        Object.keys(defaultStats).forEach(statKey => {
            // 處理特殊的屬性名稱映射
            let inputId = statKey;
            if (statKey === 'weaponAttack') inputId = 'weapon-attack';
            if (statKey === 'weaponDefence') inputId = 'weapon-defence';
            if (statKey === 'magicDefence') inputId = 'magic-defence';
            
            const input = document.getElementById(`custom-${inputId}`);
            if (input) {
                input.value = defaultStats[statKey];
            }
        });
        
        // 更新升級次數
        const defaultScrollUses = this.getDefaultScrollUsesForEquipment(equipmentName);
        const scrollUsesInput = document.getElementById('custom-scroll-uses');
        if (scrollUsesInput) {
            scrollUsesInput.value = defaultScrollUses;
        }
    }

    // 獲取裝備的默認屬性
    getDefaultStatsForEquipment(equipmentName) {
        switch(equipmentName) {
            case 'blackfist-cloak':
                return { hp: 120, weaponAttack: 10, weaponDefence: 43, magicDefence: 48 };
            case 'vl-shoes':
                return { weaponAttack: 2, weaponDefence: 90, magicDefence: 26 };
            case 'bwg':
                return { weaponAttack: 3 };
            case 'roa':
                return { str: 1, dex: 1, int: 1, luk: 1 };
            case 'spectrum-goggles':
                return { str: 1, dex: 1, speed: 1 };
            case 'stormcaster-gloves':
                return { weaponAttack: 5, weaponDefence: 5, magicDefence: 5 };
            case 'von-leon-belt':
                return { str: 2, dex: 2, int: 2, luk: 2, weaponAttack: 2, weaponDefence: 150, magicDefence: 30 };
            default:
                return { hp: 120, weaponAttack: 10, weaponDefence: 43, magicDefence: 48 };
        }
    }

    // 獲取裝備的默認升級次數
    getDefaultScrollUsesForEquipment(equipmentName) {
        switch(equipmentName) {
            case 'blackfist-cloak':
                return 5;
            case 'vl-shoes':
                return 6;
            case 'bwg':
                return 6;
            case 'roa':
                return 1;
            case 'spectrum-goggles':
                return 5;
            case 'stormcaster-gloves':
                return 5;
            case 'von-leon-belt':
                return 4;
            default:
                return 5;
        }
    }

    // 獲取自定義升級次數
    getCustomScrollUses() {
        const input = document.getElementById('custom-scroll-uses');
        if (input && input.value) {
            const value = parseInt(input.value);
            return Math.max(0, Math.min(50, value)); // 限制在0-50之間
        }
        return 5; // 默認值
    }

    // 初始化事件監聽器
    initializeEventListeners() {
        // 卷軸拖拽事件
        const scrollItems = document.querySelectorAll('.scroll-item');
        scrollItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                this.currentDragScroll = e.target.id;
                e.target.classList.add('dragging');
            });

            item.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
                this.currentDragScroll = null;
            });
        });

        // 裝備拖拽事件 - 只支持拖拽使用
        this.setupDragEvents();

        // 移除點擊功能，只保留拖拽功能

        // 模態框事件
        document.getElementById('confirm-yes').addEventListener('click', () => {
            this.useScroll();
            this.hideModal();
        });

        document.getElementById('confirm-no').addEventListener('click', () => {
            this.hideModal();
        });

        // 點擊模態框背景關閉
        document.getElementById('confirm-modal').addEventListener('click', (e) => {
            if (e.target.id === 'confirm-modal') {
                this.hideModal();
            }
        });

        // 自定義屬性應用按鈕
        document.getElementById('apply-custom-stats').addEventListener('click', () => {
            this.applyCustomStats();
        });

        // 重置統計按鈕
        document.getElementById('reset-stats').addEventListener('click', () => {
            this.resetStatistics();
        });
    }

    // 顯示確認模態框
    showConfirmModal() {
        const modal = document.getElementById('confirm-modal');
        const message = document.getElementById('modal-message');
        const useWhiteScroll = document.getElementById('use-white-scroll');
        
        // 根據當前拖拽的卷軸顯示不同的訊息
        if (this.currentDragScroll === 'vl-chaos-scroll') {
            message.textContent = '是否要使用VL混沌卷軸？';
        } else {
            message.textContent = '是否要使用混沌卷軸？';
        }
        
        useWhiteScroll.checked = false;
        modal.style.display = 'block';
    }

    // 隱藏模態框
    hideModal() {
        document.getElementById('confirm-modal').style.display = 'none';
    }

    // 設置拖拽事件
    setupDragEvents() {
        const equipmentSlot = document.getElementById('equipment-slot');
        const equipmentItem = document.getElementById('blackfist-cloak');
        
        console.log('設置拖拽事件，裝備槽:', equipmentSlot, '裝備:', equipmentItem);
        
        // 為裝備槽和裝備本身都添加拖拽事件
        [equipmentSlot, equipmentItem].forEach(element => {
            if (element) {
                element.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    equipmentSlot.classList.add('drag-over');
                    console.log('拖拽經過裝備區域');
                });

                element.addEventListener('dragleave', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    equipmentSlot.classList.remove('drag-over');
                    console.log('拖拽離開裝備區域');
                });

                element.addEventListener('drop', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    equipmentSlot.classList.remove('drag-over');
                    console.log('拖拽放下，當前卷軸:', this.currentDragScroll);
                    
                    // 處理混沌卷軸和VL混沌卷軸的拖拽
                    if (this.currentDragScroll === 'chaos-scroll') {
                        console.log('顯示確認對話框');
                        this.showConfirmModal();
                    } else if (this.currentDragScroll === 'vl-chaos-scroll') {
                        console.log('VL混沌卷軸 - 由setupDragEvents處理');
                        // VL CS 由 setupDirectDragEvents 處理，這裡不處理
                    } else {
                        console.log('不是混沌卷軸，忽略');
                    }
                });
            }
        });
    }

    // 直接使用卷軸（VL CS專用，不詢問白捲）
    useScrollDirect() {
        if (!this.equipment.canUseScroll()) {
            this.addLog('Equipment cannot use more scrolls!', 'failure');
            return;
        }

        const isVlChaosScroll = this.currentDragScroll === 'vl-chaos-scroll';
        
        if (isVlChaosScroll) {
            // VL CS 100%成功，直接使用
            const changes = this.equipment.updateStatsVL();
            const oldScrollUses = this.equipment.currentScrollUses;
            this.equipment.useScroll();
            const newScrollUses = this.equipment.currentScrollUses;
            
            // 記錄統計數據
            this.statistics.vlCsUsed++;
            
            this.addLog('VL Chaos Scroll used successfully! Equipment stats changed:', 'success');
            this.logStatChanges(changes);
            
            // 只有升級次數減少1時才顯示成功
            if (oldScrollUses - newScrollUses === 1) {
                this.showSuccessEffect();
            } else {
                this.showFailureEffect(false);
            }
        } else {
            // 普通CS，使用原有邏輯
            const scrollToUse = this.chaosScroll;
            const isSuccess = scrollToUse.attemptUse();
            
            if (isSuccess) {
                // 成功使用卷軸
                const changes = this.equipment.updateStats();
                const oldScrollUses = this.equipment.currentScrollUses;
                this.equipment.useScroll();
                const newScrollUses = this.equipment.currentScrollUses;
                
                // 記錄統計數據
                this.statistics.csUsed++;
                
                this.addLog('Chaos Scroll used successfully! Equipment stats changed:', 'success');
                this.logStatChanges(changes);
                
                // 只有升級次數減少1時才顯示成功
                if (oldScrollUses - newScrollUses === 1) {
                    this.showSuccessEffect();
                } else {
                    this.showFailureEffect(false);
                }
            } else {
                // 失敗
                this.statistics.csUsed++;
                
                const oldScrollUses = this.equipment.currentScrollUses;
                this.equipment.useScroll();
                const newScrollUses = this.equipment.currentScrollUses;
                
                this.addLog('Chaos Scroll failed, upgrade count -1', 'failure');
                
                // 只有升級次數減少1時才顯示成功，否則顯示失敗
                if (oldScrollUses - newScrollUses === 1) {
                    this.showSuccessEffect();
                } else {
                    this.showFailureEffect(true);
                }
            }
        }

        this.updateDisplay();
        this.updateStatistics();
    }

    // 使用卷軸
    useScroll() {
        if (!this.equipment.canUseScroll()) {
            this.addLog('Equipment cannot use more scrolls!', 'failure');
            return;
        }

        const useWhiteScroll = document.getElementById('use-white-scroll').checked;
        const isVlChaosScroll = this.currentDragScroll === 'vl-chaos-scroll';
        
        // 選擇要使用的卷軸
        const scrollToUse = isVlChaosScroll ? this.vlChaosScroll : this.chaosScroll;
        const isSuccess = scrollToUse.attemptUse();
        
        if (isSuccess) {
            // 成功使用卷軸
            const changes = isVlChaosScroll ? this.equipment.updateStatsVL() : this.equipment.updateStats();
            const oldScrollUses = this.equipment.currentScrollUses;
            this.equipment.useScroll();
            const newScrollUses = this.equipment.currentScrollUses;
            
            // 記錄統計數據
            if (isVlChaosScroll) {
                this.statistics.vlCsUsed++;
            } else {
                this.statistics.csUsed++;
            }
            if (useWhiteScroll) {
                this.statistics.wsUsed++;
            }
            
            const scrollName = isVlChaosScroll ? 'VL Chaos Scroll' : 'Chaos Scroll';
            this.addLog(`${scrollName} used successfully! Equipment stats changed:`, 'success');
            this.logStatChanges(changes);
            
            // 只有升級次數減少1時才顯示成功
            if (oldScrollUses - newScrollUses === 1) {
                this.showSuccessEffect();
            } else {
                this.showFailureEffect(false);
            }
            
            if (useWhiteScroll) {
                this.addLog('White Scroll protected the upgrade count!', 'info');
            }
        } else {
            // 失敗（只有普通CS會失敗，VL CS成功率100%）
            // 記錄統計數據（失敗也要記錄CS使用）
            this.statistics.csUsed++;
            if (useWhiteScroll) {
                this.statistics.wsUsed++;
            }
            
            if (useWhiteScroll) {
                this.addLog('Chaos Scroll failed, but White Scroll protected the upgrade count!', 'info');
                // 失敗但有保護，只顯示短暫的失敗效果
                this.showFailureEffect(false);
            } else {
                const oldScrollUses = this.equipment.currentScrollUses;
                this.equipment.useScroll();
                const newScrollUses = this.equipment.currentScrollUses;
                
                this.addLog('Chaos Scroll failed, upgrade count -1', 'failure');
                
                // 只有升級次數減少1時才顯示成功，否則顯示失敗
                if (oldScrollUses - newScrollUses === 1) {
                    this.showSuccessEffect();
                } else {
                    this.showFailureEffect(true);
                }
            }
        }

        this.updateDisplay();
        this.updateStatistics();
    }

    // 更新統計顯示
    updateStatistics() {
        document.getElementById('cs-count').textContent = this.statistics.csUsed;
        document.getElementById('vl-cs-count').textContent = this.statistics.vlCsUsed;
        document.getElementById('ws-count').textContent = this.statistics.wsUsed;
        document.getElementById('total-scrolls').textContent = this.statistics.csUsed + this.statistics.vlCsUsed + this.statistics.wsUsed;
    }

    // 重置統計
    resetStatistics() {
        this.statistics = {
            csUsed: 0,
            vlCsUsed: 0,
            wsUsed: 0
        };
        this.updateStatistics();
        this.addLog('Statistics reset to zero', 'info');
    }

    // 記錄數值變化
    logStatChanges(changes) {
        const statNames = {
            hp: 'HP',
            weaponAttack: 'Weapon Attack',
            weaponDefence: 'Weapon Defence',
            magicDefence: 'Magic Defence',
            str: 'STR',
            dex: 'DEX',
            int: 'INT',
            luk: 'LUK',
            speed: 'Speed'
        };

        Object.keys(changes).forEach(stat => {
            const changeData = changes[stat];
            
            if (changeData.change === 0 && this.equipment.zeroStats[stat]) {
                // 如果數值已經降到0，顯示特殊信息
                this.addLog(`  ${statNames[stat]}: ${changeData.oldValue} (reached 0, cannot increase)`, 'info');
            } else if (changeData.newValue === 0) {
                // 如果數值降到0，顯示隱藏信息
                this.addLog(`  ${statNames[stat]}: ${changeData.oldValue} → 0 (hidden)`, 'info');
            } else {
                const changeText = changeData.change > 0 ? `+${changeData.change}` : changeData.change.toString();
                this.addLog(`  ${statNames[stat]}: ${changeData.oldValue} → ${changeData.newValue} (${changeText})`, 'info');
            }
        });
    }

    // 顯示結果閃爍
    showResultFlash(text, type) {
        const resultFlash = document.getElementById('result-flash');
        const resultText = document.getElementById('result-text');
        
        resultText.textContent = text;
        resultText.className = `result-text ${type}`;
        
        resultFlash.classList.add('show');
        
        setTimeout(() => {
            resultFlash.classList.remove('show');
        }, 500);
    }

    // 添加日誌
    addLog(message, type = 'info') {
        const logContainer = document.getElementById('log-container');
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        
        logContainer.insertBefore(logEntry, logContainer.firstChild);
        
        // 限制日誌數量
        const logs = logContainer.querySelectorAll('.log-entry');
        if (logs.length > 50) {
            logContainer.removeChild(logs[logs.length - 1]);
        }
    }

    // 顯示成功效果
    showSuccessEffect() {
        const equipmentItem = document.getElementById('blackfist-cloak');
        
        // 移除之前的狀態類
        equipmentItem.classList.remove('failure', 'burned', 'enhanced');
        
        // 添加成功效果
        equipmentItem.classList.add('success');
        
        // 動畫結束後完全恢復正常狀態
        setTimeout(() => {
            equipmentItem.classList.remove('success');
            // 不再添加持續效果，讓裝備恢復正常狀態
        }, 100);
        
        // 顯示成功閃爍
        this.showResultFlash('SUCCESS', 'success');
    }

    // 顯示失敗效果
    showFailureEffect(isBurned = false) {
        const equipmentItem = document.getElementById('blackfist-cloak');
        
        // 移除之前的狀態類
        equipmentItem.classList.remove('success', 'enhanced', 'burned');
        
        if (isBurned) {
            // 燒毀效果
            equipmentItem.classList.add('failure');
            
            // 動畫結束後恢復正常狀態
            setTimeout(() => {
                equipmentItem.classList.remove('failure');
                // 不再添加持續燒毀狀態，讓裝備恢復正常
            }, 2000);
            
            // 顯示失敗閃爍
            this.showResultFlash('FAIL', 'failure');
        } else {
            // 短暫失敗效果（有保護時）
            equipmentItem.classList.add('failure');
            
            setTimeout(() => {
                equipmentItem.classList.remove('failure');
            }, 1000);
        }
    }

    // 更新顯示
    updateDisplay() {
        // 動態生成裝備屬性顯示
        this.generateStatsDisplay();
        
        // 更新卷軸使用次數
        document.getElementById('scroll-uses').textContent = this.equipment.currentScrollUses;
        
        // 更新裝備背景顏色
        this.updateEquipmentBackground();
        
        // 更新統計顯示
        this.updateStatistics();
        
        // 添加更新動畫
        const equipmentItem = document.getElementById('blackfist-cloak');
        equipmentItem.classList.add('updated');
        setTimeout(() => {
            equipmentItem.classList.remove('updated');
        }, 600);
    }

    // 更新裝備背景顏色
    updateEquipmentBackground() {
        const equipmentItem = document.getElementById('blackfist-cloak');
        if (!equipmentItem) return;
        
        const weaponAttack = this.equipment.stats.weaponAttack || 0;
        const equipmentName = this.equipment.name;
        
        // 移除所有背景顏色類
        equipmentItem.classList.remove('equipment-blue', 'equipment-purple', 'equipment-gold');
        
        // 根據裝備類型和weapon attack數值添加對應的背景顏色
        if (equipmentName === 'Blackfist Cloak') {
            // Blackfist Cloak 的顏色規則
            if (weaponAttack >= 22) {
                equipmentItem.classList.add('equipment-gold');
            } else if (weaponAttack >= 15) {
                equipmentItem.classList.add('equipment-purple');
            } else if (weaponAttack >= 8) {
                equipmentItem.classList.add('equipment-blue');
            }
        } else if (equipmentName === 'VL Shoes') {
            // VL Shoes 的顏色規則
            if (weaponAttack >= 20) {
                equipmentItem.classList.add('equipment-gold');
            } else if (weaponAttack >= 13) {
                equipmentItem.classList.add('equipment-purple');
            } else if (weaponAttack >= 6) {
                equipmentItem.classList.add('equipment-blue');
            }
        } else if (equipmentName === 'Stormcaster Gloves') {
            // Stormcaster Gloves 的顏色規則
            if (weaponAttack >= 23) {
                equipmentItem.classList.add('equipment-gold');
            } else if (weaponAttack >= 16) {
                equipmentItem.classList.add('equipment-purple');
            } else if (weaponAttack >= 10) {
                equipmentItem.classList.add('equipment-blue');
            }
        } else if (equipmentName === 'Von Leon\'s Belt') {
            // Von Leon's Belt 的顏色規則
            if (weaponAttack >= 8) {
                equipmentItem.classList.add('equipment-gold');
            } else if (weaponAttack >= 5) {
                equipmentItem.classList.add('equipment-purple');
            } else if (weaponAttack >= 3) {
                equipmentItem.classList.add('equipment-blue');
            }
        }
    }

    // 生成屬性顯示
    generateStatsDisplay() {
        const statsContainer = document.getElementById('equipment-stats');
        const stats = this.equipment.stats;
        
        // 清空現有內容
        statsContainer.innerHTML = '';
        
        // 屬性名稱映射
        const statNames = {
            hp: 'HP',
            weaponAttack: 'Weapon Attack',
            weaponDefence: 'Weapon Defence',
            magicDefence: 'Magic Defence',
            str: 'STR',
            dex: 'DEX',
            int: 'INT',
            luk: 'LUK',
            speed: 'Speed'
        };
        
        // 根據裝備屬性動態生成顯示，只顯示非0的屬性
        Object.keys(stats).forEach(statKey => {
            if (stats[statKey] !== undefined && stats[statKey] > 0) {
                const statDiv = document.createElement('div');
                statDiv.className = 'stat';
                statDiv.innerHTML = `${statNames[statKey]}: <span id="${statKey}">${stats[statKey]}</span>`;
                statsContainer.appendChild(statDiv);
            }
        });
    }

    // 更新單個數值顯示
    updateStatDisplay(statId, value) {
        const element = document.getElementById(statId);
        if (!element) return;
        
        element.textContent = value;
        
        // 如果數值為0，隱藏該屬性
        if (value === 0) {
            const statDiv = element.parentElement;
            if (statDiv && statDiv.classList.contains('stat')) {
                statDiv.style.display = 'none';
            }
        } else {
            // 如果數值不為0，顯示該屬性
            const statDiv = element.parentElement;
            if (statDiv && statDiv.classList.contains('stat')) {
                statDiv.style.display = '';
            }
            
            // 如果數值已經降到0，添加特殊樣式
            if (this.equipment.zeroStats[statId]) {
                element.style.color = '#999';
                element.style.textDecoration = 'line-through';
                element.title = 'This stat reached 0, cannot increase';
            } else {
                element.style.color = '';
                element.style.textDecoration = '';
                element.title = '';
            }
        }
    }

    // 應用自定義屬性
    applyCustomStats() {
        const newStats = this.getCustomStats();
        const newScrollUses = this.getCustomScrollUses();
        
        // 驗證輸入值
        if (!this.validateCustomStats(newStats)) {
            return;
        }
        
        // 創建新裝備實例
        this.equipment = new Equipment('Blackfist Cloak', newStats, newScrollUses);
        this.updateDisplay();
        this.addLog(`Custom stats applied successfully! Upgrades available: ${newScrollUses}`, 'success');
        
        // 顯示成功效果
        this.showSuccessEffect();
    }

    // 驗證自定義屬性
    validateCustomStats(stats) {
        const statNames = {
            hp: 'HP',
            weaponAttack: 'Weapon Attack',
            weaponDefence: 'Weapon Defence',
            magicDefence: 'Magic Defence',
            str: 'STR',
            dex: 'DEX',
            int: 'INT',
            luk: 'LUK',
            speed: 'Speed'
        };
        
        for (const [statKey, value] of Object.entries(stats)) {
            if (value < 0 || value > 999) {
                this.addLog(`Invalid ${statNames[statKey] || statKey} value: ${value}. Must be between 0-999.`, 'failure');
                return false;
            }
        }
        
        return true;
    }

    // 重置裝備（用於測試）
    resetEquipment() {
        // 獲取當前選中的裝備
        const equipmentSelect = document.getElementById('equipment-select');
        const currentEquipment = equipmentSelect ? equipmentSelect.value : 'blackfist-cloak';
        
        // 重置為自定義屬性或默認值
        const resetStats = this.getCustomStats();
        const resetScrollUses = this.getCustomScrollUses();
        
        // 根據當前裝備創建新的裝備實例
        const equipmentName = this.getEquipmentDisplayName(currentEquipment);
        this.equipment = new Equipment(equipmentName, resetStats, resetScrollUses);
        this.updateDisplay();
        this.addLog(`${equipmentName} reset to initial state, all stats restored. Upgrades available: ${resetScrollUses}`, 'info');
    }

    // 獲取裝備顯示名稱
    getEquipmentDisplayName(equipmentValue) {
        const nameMap = {
            'blackfist-cloak': 'Blackfist Cloak',
            'vl-shoes': 'VL Shoes',
            'bwg': 'BWG',
            'roa': 'ROA',
            'spectrum-goggles': 'Spectrum Goggles',
            'stormcaster-gloves': 'Stormcaster Gloves',
            'von-leon-belt': 'Von Leon\'s Belt'
        };
        return nameMap[equipmentValue] || 'Blackfist Cloak';
    }

    // 添加新裝備（擴充功能）
    addEquipment(name, stats, maxScrollUses = 10) {
        // 這裡可以實現添加新裝備的邏輯
        this.addLog(`New equipment ${name} added!`, 'info');
    }
}

// 當頁面載入完成時初始化遊戲
document.addEventListener('DOMContentLoaded', () => {
    window.gameManager = new GameManager();
    
    // 直接設置拖拽事件（確保在頁面載入後立即設置）
    setTimeout(() => {
        setupDirectDragEvents();
    }, 200);
    
    // 添加鍵盤快捷鍵
    document.addEventListener('keydown', (e) => {
        if (e.key === 'r' && e.ctrlKey) {
            e.preventDefault();
            window.gameManager.resetEquipment();
        }
    });
    
    // 添加重置按鈕
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Equipment (Ctrl+R)';
    resetButton.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 15px;
        background: #ff6b6b;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;
    
    resetButton.addEventListener('click', () => {
        window.gameManager.resetEquipment();
    });
    
    resetButton.addEventListener('mouseenter', () => {
        resetButton.style.transform = 'translateY(-2px)';
        resetButton.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
    });
    
    resetButton.addEventListener('mouseleave', () => {
        resetButton.style.transform = 'translateY(0)';
        resetButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    });
    
    document.body.appendChild(resetButton);
});

// 直接設置拖拽事件函數
function setupDirectDragEvents() {
    console.log('開始設置直接拖拽事件');
    
    const equipmentSlot = document.getElementById('equipment-slot');
    const equipmentItem = document.getElementById('blackfist-cloak');
    const chaosScroll = document.getElementById('chaos-scroll');
    
    console.log('元素檢查:', {
        equipmentSlot: equipmentSlot,
        equipmentItem: equipmentItem,
        chaosScroll: chaosScroll
    });
    
    if (!equipmentSlot || !equipmentItem || !chaosScroll) {
        console.error('找不到必要的元素');
        return;
    }
    
    // 設置卷軸拖拽開始事件
    chaosScroll.addEventListener('dragstart', (e) => {
        console.log('開始拖拽混沌卷軸');
        window.currentDragScroll = 'chaos-scroll';
        if (window.gameManager) {
            window.gameManager.currentDragScroll = 'chaos-scroll';
        }
        e.target.classList.add('dragging');
    });
    
    chaosScroll.addEventListener('dragend', (e) => {
        console.log('結束拖拽混沌卷軸');
        e.target.classList.remove('dragging');
        window.currentDragScroll = null;
        if (window.gameManager) {
            window.gameManager.currentDragScroll = null;
        }
    });
    
    // 設置VL混沌卷軸拖拽事件
    const vlChaosScroll = document.getElementById('vl-chaos-scroll');
    if (vlChaosScroll) {
        vlChaosScroll.addEventListener('dragstart', (e) => {
            console.log('開始拖拽VL混沌卷軸');
            window.currentDragScroll = 'vl-chaos-scroll';
            if (window.gameManager) {
                window.gameManager.currentDragScroll = 'vl-chaos-scroll';
            }
            e.target.classList.add('dragging');
        });
        
        vlChaosScroll.addEventListener('dragend', (e) => {
            console.log('結束拖拽VL混沌卷軸');
            e.target.classList.remove('dragging');
            window.currentDragScroll = null;
            if (window.gameManager) {
                window.gameManager.currentDragScroll = null;
            }
        });
    }
    
    // 設置裝備拖拽事件
    [equipmentSlot, equipmentItem].forEach(element => {
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            equipmentSlot.classList.add('drag-over');
            console.log('拖拽經過裝備區域');
        });
        
        element.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            equipmentSlot.classList.remove('drag-over');
            console.log('拖拽離開裝備區域');
        });
        
        element.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            equipmentSlot.classList.remove('drag-over');
            console.log('拖拽放下，當前卷軸:', window.currentDragScroll);
            
            if (window.currentDragScroll === 'chaos-scroll') {
                console.log('顯示確認對話框');
                if (window.gameManager && window.gameManager.showConfirmModal) {
                    window.gameManager.showConfirmModal();
                } else {
                    console.error('gameManager 或 showConfirmModal 不存在');
                }
            } else if (window.currentDragScroll === 'vl-chaos-scroll') {
                console.log('直接使用VL混沌卷軸');
                if (window.gameManager && window.gameManager.useScrollDirect) {
                    window.gameManager.useScrollDirect();
                } else {
                    console.error('gameManager 或 useScrollDirect 不存在');
                }
            }
        });
    });
    
    console.log('直接拖拽事件設置完成');
}
