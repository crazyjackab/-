// 示例数据 - 可以通过浏览器控制台运行此代码来添加示例链接
const sampleLinks = [
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

// 在浏览器控制台中运行以下代码来添加示例链接：
/*
sampleLinks.forEach(linkData => {
    const item = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        url: linkData.url,
        title: linkData.title,
        description: linkData.description,
        tags: linkData.tags,
        uploadDate: new Date().toISOString(),
        category: 'links'
    };
    
    window.knowledgeBase.data.links.push(item);
});

window.knowledgeBase.saveData();
window.knowledgeBase.updateStats();
window.knowledgeBase.refreshCurrentSection();
window.knowledgeBase.showRecentItems();
*/