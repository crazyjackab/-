// 直接修复统计显示问题的脚本
console.log('=== 开始修复统计显示问题 ===');

// 立即检查和修复函数
function fixStatsDisplay() {
    console.log('开始检查和修复...');
    
    // 1. 检查DOM元素
    const elements = {
        totalLinksCount: document.getElementById('totalLinksCount'),
        totalFoldersCount: document.getElementById('totalFoldersCount'),
        totalTagsCount: document.getElementById('totalTagsCount')
    };
    
    console.log('DOM元素检查:', elements);
    
    // 2. 检查数据源
    if (!window.knowledgeBase) {
        console.error('❌ knowledgeBase 实例不存在');
        return false;
    }
    
    const data = window.knowledgeBase.data;
    console.log('数据检查:', {
        links: data.links?.length || 0,
        linkFolders: data.linkFolders?.length || 0,
        有数据: data.links && data.linkFolders
    });
    
    // 3. 强制计算统计数据
    const linksCount = data.links ? data.links.length : 0;
    const foldersCount = data.linkFolders ? data.linkFolders.length : 0;
    
    // 计算标签数量
    const allTags = new Set();
    if (data.links && Array.isArray(data.links)) {
        data.links.forEach(link => {
            if (link.tags && Array.isArray(link.tags)) {
                link.tags.forEach(tag => allTags.add(tag));
            }
        });
    }
    const tagsCount = allTags.size;
    
    console.log('计算结果:', { linksCount, foldersCount, tagsCount });
    
    // 4. 强制更新DOM元素
    let success = true;
    
    if (elements.totalLinksCount) {
        elements.totalLinksCount.textContent = linksCount.toString();
        elements.totalLinksCount.style.color = 'inherit';
        elements.totalLinksCount.style.display = 'inline';
        console.log('✅ 更新链接数量:', linksCount);
    } else {
        console.error('❌ totalLinksCount 元素不存在');
        success = false;
    }
    
    if (elements.totalFoldersCount) {
        elements.totalFoldersCount.textContent = foldersCount.toString();
        elements.totalFoldersCount.style.color = 'inherit';
        elements.totalFoldersCount.style.display = 'inline';
        console.log('✅ 更新文件夹数量:', foldersCount);
    } else {
        console.error('❌ totalFoldersCount 元素不存在');
        success = false;
    }
    
    if (elements.totalTagsCount) {
        elements.totalTagsCount.textContent = tagsCount.toString();
        elements.totalTagsCount.style.color = 'inherit';
        elements.totalTagsCount.style.display = 'inline';
        console.log('✅ 更新标签数量:', tagsCount);
    } else {
        console.error('❌ totalTagsCount 元素不存在');
        success = false;
    }
    
    return success;
}

// 添加测试数据（如果需要）
function addTestData() {
    if (!window.knowledgeBase) {
        console.error('knowledgeBase 不存在，无法添加测试数据');
        return;
    }
    
    const data = window.knowledgeBase.data;
    
    // 检查是否已有数据
    if (data.links.length > 0) {
        console.log('已有链接数据，跳过添加测试数据');
        return;
    }
    
    console.log('添加测试数据...');
    
    // 添加测试链接
    const testLinks = [
        {
            id: Date.now() + '_1',
            url: 'https://github.com',
            title: 'GitHub',
            description: '代码托管平台',
            tags: ['开发', '代码'],
            folderId: 'default',
            uploadDate: new Date().toISOString(),
            category: 'links'
        },
        {
            id: Date.now() + '_2',
            url: 'https://developer.mozilla.org',
            title: 'MDN Web Docs',
            description: 'Web开发文档',
            tags: ['文档', '学习'],
            folderId: 'default',
            uploadDate: new Date().toISOString(),
            category: 'links'
        }
    ];
    
    testLinks.forEach(link => {
        data.links.push(link);
    });
    
    // 保存数据
    window.knowledgeBase.saveData();
    console.log('测试数据已添加');
}

// 主修复函数
function runFix() {
    console.log('运行修复...');
    
    // 等待页面完全加载
    if (document.readyState !== 'complete') {
        console.log('等待页面加载完成...');
        window.addEventListener('load', runFix);
        return;
    }
    
    // 等待 knowledgeBase 实例
    if (!window.knowledgeBase) {
        console.log('等待 knowledgeBase 实例...');
        setTimeout(runFix, 100);
        return;
    }
    
    // 添加测试数据（如果需要）
    addTestData();
    
    // 立即修复
    const success = fixStatsDisplay();
    
    if (success) {
        console.log('✅ 修复完成！统计信息应该正确显示了');
    } else {
        console.log('❌ 修复失败，请检查页面结构');
    }
    
    // 定期检查和修复
    setInterval(() => {
        if (document.getElementById('links-section')?.classList.contains('active')) {
            fixStatsDisplay();
        }
    }, 2000);
}

// 立即运行修复
runFix();

// 提供手动修复功能
window.fixStats = fixStatsDisplay;
window.addTestData = addTestData;

console.log('=== 修复脚本已加载 ===');
console.log('可以手动调用 fixStats() 来强制修复统计显示');
console.log('可以手动调用 addTestData() 来添加测试数据');