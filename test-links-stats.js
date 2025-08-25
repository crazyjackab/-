// 测试链接统计功能脚本
// 在浏览器控制台中运行此脚本来添加示例链接并测试统计显示

function addTestLinksForStats() {
    // 示例链接数据
    const testLinks = [
        {
            url: "https://github.com",
            title: "GitHub",
            description: "全球最大的代码托管平台",
            tags: ["开发", "代码", "开源"]
        },
        {
            url: "https://stackoverflow.com",
            title: "Stack Overflow", 
            description: "程序员问答社区",
            tags: ["编程", "问答", "技术"]
        },
        {
            url: "https://developer.mozilla.org",
            title: "MDN Web Docs",
            description: "Web开发者文档",
            tags: ["文档", "前端", "学习"]
        },
        {
            url: "https://www.runoob.com",
            title: "菜鸟教程",
            description: "编程学习网站",
            tags: ["教程", "学习", "编程"]
        }
    ];

    // 添加示例链接到数据
    testLinks.forEach(linkData => {
        const item = {
            id: window.knowledgeBase.generateId(),
            url: linkData.url,
            title: linkData.title,
            description: linkData.description,
            tags: linkData.tags,
            folderId: 'default',
            uploadDate: new Date().toISOString(),
            category: 'links'
        };
        
        window.knowledgeBase.data.links.push(item);
    });

    // 添加额外的文件夹进行测试
    const testFolder = {
        id: window.knowledgeBase.generateId(),
        name: '学习资源',
        description: '编程学习相关的链接',
        color: '#10b981',
        icon: 'fas fa-graduation-cap',
        isEncrypted: false,
        password: null,
        isDefault: false,
        createdAt: new Date().toISOString(),
        linkCount: 0
    };
    
    window.knowledgeBase.data.linkFolders.push(testFolder);

    // 保存数据并更新界面
    window.knowledgeBase.saveData();
    window.knowledgeBase.updateStats();
    window.knowledgeBase.updateLinksPageStats();
    window.knowledgeBase.refreshCurrentSection();
    window.knowledgeBase.showRecentItems();
    
    console.log('测试链接已添加！');
    console.log('链接数量:', window.knowledgeBase.data.links.length);
    console.log('文件夹数量:', window.knowledgeBase.data.linkFolders.length);
    
    // 获取所有唯一标签
    const allTags = new Set();
    window.knowledgeBase.data.links.forEach(link => {
        if (link.tags && Array.isArray(link.tags)) {
            link.tags.forEach(tag => allTags.add(tag));
        }
    });
    console.log('标签数量:', allTags.size);
    console.log('标签列表:', Array.from(allTags));
}

// 使用说明：
// 1. 打开浏览器开发者工具
// 2. 在控制台中运行：addTestLinksForStats()
// 3. 然后切换到链接收藏页面查看统计是否正确显示
// 4. 统计应该显示：4个链接，2个文件夹，X个标签

console.log('测试脚本已加载！运行 addTestLinksForStats() 来添加测试数据。');