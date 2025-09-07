// 裝備配置系統 - 用於擴充更多裝備
class EquipmentConfig {
    constructor() {
        this.equipmentTypes = {
            // 武器類
            weapon: {
                bow: {
                    name: '風之弓',
                    baseStats: {
                        attack: 110,
                        defense: 10,
                        health: 30,
                        mana: 60,
                        agility: 100,
                        intelligence: 50
                    },
                    image: 'bow.jpg',
                    maxScrollUses: 10
                }
            },
            
            // 防具類
            armor: {
                helmet: {
                    name: '聖騎士頭盔',
                    baseStats: {
                        attack: 20,
                        defense: 90,
                        health: 80,
                        mana: 40,
                        agility: 30,
                        intelligence: 60
                    },
                    image: 'helmet.jpg',
                    maxScrollUses: 8
                },
                shield: {
                    name: '龍鱗盾牌',
                    baseStats: {
                        attack: 10,
                        defense: 120,
                        health: 100,
                        mana: 20,
                        agility: 20,
                        intelligence: 30
                    },
                    image: 'shield.jpg',
                    maxScrollUses: 6
                }
            },
            
            // 飾品類
            accessory: {
                ring: {
                    name: '魔力戒指',
                    baseStats: {
                        attack: 30,
                        defense: 30,
                        health: 40,
                        mana: 100,
                        agility: 50,
                        intelligence: 90
                    },
                    image: 'ring.jpg',
                    maxScrollUses: 15
                },
                necklace: {
                    name: '生命項鍊',
                    baseStats: {
                        attack: 40,
                        defense: 40,
                        health: 150,
                        mana: 80,
                        agility: 40,
                        intelligence: 70
                    },
                    image: 'necklace.jpg',
                    maxScrollUses: 12
                }
            }
        };
    }

    // 獲取所有裝備類型
    getAllEquipmentTypes() {
        return this.equipmentTypes;
    }

    // 獲取特定類型的裝備
    getEquipmentByType(type) {
        return this.equipmentTypes[type] || {};
    }

    // 添加新裝備
    addEquipment(category, name, config) {
        if (!this.equipmentTypes[category]) {
            this.equipmentTypes[category] = {};
        }
        this.equipmentTypes[category][name] = config;
    }

    // 獲取隨機裝備
    getRandomEquipment() {
        const categories = Object.keys(this.equipmentTypes);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const equipmentInCategory = Object.keys(this.equipmentTypes[randomCategory]);
        const randomEquipment = equipmentInCategory[Math.floor(Math.random() * equipmentInCategory.length)];
        
        return {
            category: randomCategory,
            name: randomEquipment,
            config: this.equipmentTypes[randomCategory][randomEquipment]
        };
    }
}

// 裝備管理器 - 擴展原有的遊戲管理器
class ExtendedGameManager extends GameManager {
    constructor() {
        super();
        this.equipmentConfig = new EquipmentConfig();
        this.availableEquipment = ['blackfist-cloak', 'vl-shoes', 'bwg', 'roa', 'spectrum-goggless', 'stormcaster-gloves', 'von-leon-belt', 'red-christmas-sock']; // 當前可用的裝備
        this.currentEquipmentIndex = 0;
        this.initializeEquipmentSwitcher();
        
        // 拖拽事件由主script.js處理
    }

    // 初始化裝備選擇器
    initializeEquipmentSwitcher() {
        // 添加選擇事件到現有的select元素
        document.getElementById('equipment-select').addEventListener('change', (e) => {
            this.loadEquipment(e.target.value);
        });
    }


    // 載入裝備
    loadEquipment(equipmentName) {
        let equipmentStats;
        
        // 更新自定義屬性輸入框為當前裝備的默認值
        this.updateCustomStatsInputs(equipmentName);
        
        if (equipmentName === 'blackfist-cloak') {
            // 使用自定義屬性或默認值
            const customStats = this.getCustomStats();
            equipmentStats = Object.keys(customStats).length > 0 ? customStats : {
                hp: 120,
                weaponAttack: 10,
                weaponDefence: 43,
                magicDefence: 48
            };
            const customScrollUses = this.getCustomScrollUses();
            this.equipment = new Equipment('Blackfist Cloak', equipmentStats, customScrollUses);
        } else if (equipmentName === 'vl-shoes') {
            const customStats = this.getCustomStats();
            equipmentStats = Object.keys(customStats).length > 0 ? customStats : {
                weaponAttack: 2,
                weaponDefence: 90,
                magicDefence: 26
            };
            const customScrollUses = this.getCustomScrollUses();
            this.equipment = new Equipment('VL Shoes', equipmentStats, customScrollUses);
        } else if (equipmentName === 'bwg') {
            const customStats = this.getCustomStats();
            equipmentStats = Object.keys(customStats).length > 0 ? customStats : {
                weaponAttack: 3
            };
            const customScrollUses = this.getCustomScrollUses();
            this.equipment = new Equipment('BWG', equipmentStats, customScrollUses);
        } else if (equipmentName === 'roa') {
            const customStats = this.getCustomStats();
            equipmentStats = Object.keys(customStats).length > 0 ? customStats : {
                str: 1,
                dex: 1,
                int: 1,
                luk: 1
            };
            const customScrollUses = this.getCustomScrollUses();
            this.equipment = new Equipment('ROA', equipmentStats, customScrollUses);
        } else if (equipmentName === 'spectrum-goggles') {
            const customStats = this.getCustomStats();
            equipmentStats = Object.keys(customStats).length > 0 ? customStats : {
                str: 1,
                dex: 1,
                speed: 1
            };
            const customScrollUses = this.getCustomScrollUses();
            this.equipment = new Equipment('Spectrum Goggle', equipmentStats, customScrollUses);
        } else if (equipmentName === 'stormcaster-gloves') {
            const customStats = this.getCustomStats();
            equipmentStats = Object.keys(customStats).length > 0 ? customStats : {
                weaponAttack: 5,
                weaponDefence: 5,
                magicDefence: 5
            };
            const customScrollUses = this.getCustomScrollUses();
            this.equipment = new Equipment('Stormcaster Gloves', equipmentStats, customScrollUses);
        } else if (equipmentName === 'von-leon-belt') {
            const customStats = this.getCustomStats();
            equipmentStats = Object.keys(customStats).length > 0 ? customStats : {
                str: 2,
                dex: 2,
                int: 2,
                luk: 2,
                weaponAttack: 2,
                weaponDefence: 150,
                magicDefence: 30
            };
            const customScrollUses = this.getCustomScrollUses();
            this.equipment = new Equipment('Von Leon\'s Belt', equipmentStats, customScrollUses);
        } else if (equipmentName === 'red-christmas-sock') {
            const customStats = this.getCustomStats();
            equipmentStats = Object.keys(customStats).length > 0 ? customStats : {
                weaponAttack: 1,
                weaponDefence: 14,
                magicDefence: 6
            };
            const customScrollUses = this.getCustomScrollUses();
            this.equipment = new Equipment('Red Christmas Sock', equipmentStats, customScrollUses);
        } else {
            // 從配置中載入其他裝備
            const equipmentData = this.findEquipmentInConfig(equipmentName);
            if (equipmentData) {
                this.equipment = new Equipment(
                    equipmentData.config.name,
                    equipmentData.config.baseStats,
                    equipmentData.config.maxScrollUses
                );
            }
        }
        
        this.updateDisplay();
        this.updateEquipmentImage(equipmentName);
    }
    
    // 重新綁定拖拽事件
    rebindDragEvents() {
        const equipmentItem = document.getElementById('blackfist-cloak');
        const equipmentSlot = document.getElementById('equipment-slot');
        
        // 移除舊的事件監聽器（如果存在）
        if (this.handleDragOver) {
            equipmentItem.removeEventListener('dragover', this.handleDragOver);
            equipmentItem.removeEventListener('dragleave', this.handleDragLeave);
            equipmentItem.removeEventListener('drop', this.handleDrop);
        }
        
        // 綁定新的事件監聽器
        this.handleDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
            equipmentSlot.classList.add('drag-over');
            console.log('拖拽經過裝備區域');
        };
        
        this.handleDragLeave = (e) => {
            e.preventDefault();
            e.stopPropagation();
            equipmentSlot.classList.remove('drag-over');
            console.log('拖拽離開裝備區域');
        };
        
        this.handleDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            equipmentSlot.classList.remove('drag-over');
            console.log('拖拽放下，當前卷軸:', this.currentDragScroll);
            
            if (this.currentDragScroll === 'chaos-scroll') {
                console.log('顯示確認對話框');
                this.showConfirmModal();
            }
        };
        
        equipmentItem.addEventListener('dragover', this.handleDragOver);
        equipmentItem.addEventListener('dragleave', this.handleDragLeave);
        equipmentItem.addEventListener('drop', this.handleDrop);
    }

    // 在配置中查找裝備
    findEquipmentInConfig(name) {
        const allTypes = this.equipmentConfig.getAllEquipmentTypes();
        for (const category in allTypes) {
            for (const equipmentName in allTypes[category]) {
                if (allTypes[category][equipmentName].name === name) {
                    return {
                        category,
                        name: equipmentName,
                        config: allTypes[category][equipmentName]
                    };
                }
            }
        }
        return null;
    }

    // 添加隨機裝備
    addRandomEquipment() {
        const randomEquipment = this.equipmentConfig.getRandomEquipment();
        const equipmentName = randomEquipment.config.name;
        
        if (!this.availableEquipment.includes(equipmentName)) {
            this.availableEquipment.push(equipmentName);
            this.addLog(`新裝備 "${equipmentName}" 已添加到裝備庫！`, 'success');
        } else {
            this.addLog(`裝備 "${equipmentName}" 已經存在！`, 'info');
        }
    }

    // 更新裝備圖片
    updateEquipmentImage(equipmentName) {
        const equipmentImage = document.querySelector('.equipment-image');
        if (equipmentName === 'blackfist-cloak') {
            equipmentImage.src = 'blackfist cape.JPG';
            equipmentImage.alt = 'Blackfist Cloak';
        } else if (equipmentName === 'vl-shoes') {
            equipmentImage.src = 'vl shoes.JPG';
            equipmentImage.alt = 'VL Shoes';
        } else if (equipmentName === 'bwg') {
            equipmentImage.src = 'BWG.JPG';
            equipmentImage.alt = 'BWG';
        } else if (equipmentName === 'roa') {
            equipmentImage.src = 'ROA.JPG';
            equipmentImage.alt = 'ROA';
        } else if (equipmentName === 'spectrum-goggles') {
            equipmentImage.src = 'Spectrum Goggles.JPG';
            equipmentImage.alt = 'Spectrum Goggles';
        } else if (equipmentName === 'stormcaster-gloves') {
            equipmentImage.src = 'Stormcaster Gloves.JPG';
            equipmentImage.alt = 'Stormcaster Gloves';
        } else if (equipmentName === 'von-leon-belt') {
            equipmentImage.src = 'Von Leon\'s Belt.JPG';
            equipmentImage.alt = 'Von Leon\'s Belt';
        } else if (equipmentName === 'red-christmas-sock') {
            equipmentImage.src = 'Red Christmas Sock.JPG';
            equipmentImage.alt = 'Red Christmas Sock';
        }
    }

    // 重寫更新顯示方法以支持多裝備
    updateDisplay() {
        super.updateDisplay();
    }

    // 重寫重置裝備方法
    resetEquipment() {
        // 獲取當前選中的裝備
        const equipmentSelect = document.getElementById('equipment-select');
        const currentEquipment = equipmentSelect ? equipmentSelect.value : 'blackfist-cloak';
        
        // 重新載入當前裝備
        this.loadEquipment(currentEquipment);
        this.addLog(`${this.getEquipmentDisplayName(currentEquipment)} reset to initial state, all stats restored.`, 'info');
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
            'von-leon-belt': 'Von Leon\'s Belt',
            'red-christmas-sock': 'Red Christmas Sock'
        };
        return nameMap[equipmentValue] || 'Blackfist Cloak';
    }
}

// 當頁面載入完成時初始化擴展遊戲管理器
document.addEventListener('DOMContentLoaded', () => {
    // 如果已經有遊戲管理器，替換它
    if (window.gameManager) {
        window.gameManager = new ExtendedGameManager();
    } else {
        window.gameManager = new ExtendedGameManager();
    }
});
