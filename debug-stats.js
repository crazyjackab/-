// 在浏览器控制台中运行此脚本来测试统计显示
console.log('=== 链接统计显示调试 ===');

// 1. 检查元素是否存在
const elements = {
    totalLinksCount: document.getElementById('totalLinksCount'),
    totalFoldersCount: document.getElementById('totalFoldersCount'),
    totalTagsCount: document.getElementById('totalTagsCount')
};

console.log('元素检查结果:');
Object.entries(elements).forEach(([name, element]) => {
    if (element) {
        const styles = getComputedStyle(element);
        console.log(`✅ ${name}: 存在`);
        console.log(`   - 当前内容: "${element.textContent}"`);
        console.log(`   - 显示状态: ${styles.display}`);
        console.log(`   - 可见性: ${styles.visibility}`);
        console.log(`   - 透明度: ${styles.opacity}`);
    } else {
        console.log(`❌ ${name}: 不存在`);
    }
});

// 2. 检查知识库实例
if (window.knowledgeBase) {
    console.log('\n✅ knowledgeBase 实例存在');
    console.log('当前数据状态:');
    console.log('链接数量:', window.knowledgeBase.data.links.length);
    console.log('文件夹数量:', window.knowledgeBase.data.linkFolders.length);
    console.log('标签数量:', new Set(window.knowledgeBase.data.links.flatMap(link => link.tags || [])).size);
    console.log('链接数据:', window.knowledgeBase.data.links);
    console.log('文件夹数据:', window.knowledgeBase.data.linkFolders);
} else {
    console.log('\n❌ knowledgeBase 实例不存在');
}

// 3. 强制更新统计显示
function forceUpdateStats() {
    console.log('\n=== 强制更新统计 ===');
    
    const testData = {
        links: 5,
        folders: 3,
        tags: 8
    };
    
    if (elements.totalLinksCount) {
        elements.totalLinksCount.textContent = testData.links;
        elements.totalLinksCount.style.color = 'red';
        elements.totalLinksCount.style.fontWeight = 'bold';
        console.log(`✅ 链接数量已设置为: ${testData.links}`);
    }
    
    if (elements.totalFoldersCount) {
        elements.totalFoldersCount.textContent = testData.folders;
        elements.totalFoldersCount.style.color = 'green';
        elements.totalFoldersCount.style.fontWeight = 'bold';
        console.log(`✅ 文件夹数量已设置为: ${testData.folders}`);
    }
    
    if (elements.totalTagsCount) {
        elements.totalTagsCount.textContent = testData.tags;
        elements.totalTagsCount.style.color = 'blue';
        elements.totalTagsCount.style.fontWeight = 'bold';
        console.log(`✅ 标签数量已设置为: ${testData.tags}`);
    }
    
    console.log('如果数字现在可见，说明元素正常工作');
}

// 4. 自动运行强制更新
forceUpdateStats();

// 5. 检查是否在链接页面
const linksSection = document.getElementById('links-section');
if (linksSection && linksSection.classList.contains('active')) {
    console.log('\n✅ 当前在链接页面');
} else {
    console.log('\n⚠️ 当前不在链接页面，请切换到链接收藏页面');
}

// 6. 提供恢复功能
window.restoreStats = function() {
    if (elements.totalLinksCount) {
        elements.totalLinksCount.style.color = '';
        elements.totalLinksCount.style.fontWeight = '';
    }
    if (elements.totalFoldersCount) {
        elements.totalFoldersCount.style.color = '';
        elements.totalFoldersCount.style.fontWeight = '';
    }
    if (elements.totalTagsCount) {
        elements.totalTagsCount.style.color = '';
        elements.totalTagsCount.style.fontWeight = '';
    }
    console.log('样式已恢复');
};

console.log('\n=== 调试完成 ===');
console.log('如果看到彩色数字，说明元素工作正常');
console.log('运行 restoreStats() 来恢复原始样式');